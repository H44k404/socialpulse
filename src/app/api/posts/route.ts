"use server";

import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";

// Mock posts data
const posts: Array<{
  id: string;
  userId: string;
  content: string;
  platforms: string[];
  scheduledDate: string;
  status: "draft" | "scheduled" | "published" | "failed";
  createdAt: string;
  media: string[];
}> = [
  {
    id: "1",
    userId: "1",
    content: "Excited to announce our new feature! 🚀",
    platforms: ["instagram", "twitter"],
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // Tomorrow
    status: "scheduled",
    createdAt: new Date().toISOString(),
    media: [],
  },
  {
    id: "2",
    userId: "1",
    content: "Just shipped a major update to our platform. Check it out! #tech",
    platforms: ["twitter", "linkedin"],
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(), // Day after tomorrow
    status: "scheduled",
    createdAt: new Date().toISOString(),
    media: [],
  },
  {
    id: "3",
    userId: "1",
    content: "Team building day was amazing! Grateful for such an awesome team. 🙏",
    platforms: ["facebook", "instagram"],
    scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    status: "published",
    createdAt: new Date().toISOString(),
    media: [],
  },
];

const createPostSchema = z.object({
  content: z.string().min(1, "Content is required").max(280, "Content too long"),
  platforms: z.array(z.string()).min(1, "At least one platform required"),
  scheduledDate: z.string().optional(),
  media: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Get user's posts
    const userPosts = posts.filter((post) => post.userId === user.userId);

    return NextResponse.json({
      success: true,
      data: userPosts,
    });
  } catch (error) {
    console.error("Posts API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content, platforms, scheduledDate, media } = createPostSchema.parse(body);

    // Create new post
    const newPost = {
      id: (posts.length + 1).toString(),
      userId: user.userId,
      content,
      platforms,
      scheduledDate: scheduledDate || new Date().toISOString(),
      status: (scheduledDate ? "scheduled" : "draft") as "draft" | "scheduled" | "published" | "failed",
      createdAt: new Date().toISOString(),
      media: media || [],
    };

    posts.push(newPost);

    return NextResponse.json({
      success: true,
      data: newPost,
      message: "Post created successfully",
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Create post error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}