"use server";

import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";

// Mock user database
const users = [
  {
    id: "1",
    email: "demo@socialpulse.com",
    name: "Demo User",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Demo User",
    bio: "Social media enthusiast and content creator",
    website: "https://socialpulse.com",
    location: "San Francisco, CA",
    plan: "pro",
    createdAt: new Date().toISOString(),
    socialAccounts: {
      instagram: { username: "demouser", connected: true, followers: 15420 },
      twitter: { username: "demouser", connected: true, followers: 8750 },
      facebook: { username: "demouser", connected: true, followers: 12340 },
      linkedin: { username: "demo-user", connected: true, followers: 5670 },
    },
  },
];

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  bio: z.string().max(160, "Bio must be less than 160 characters").optional(),
  website: z.string().url("Invalid website URL").optional(),
  location: z.string().max(100, "Location too long").optional(),
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

    // Get user profile
    const userProfile = users.find((u) => u.id === user.userId);
    if (!userProfile) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: userProfile,
    });
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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
    const updates = updateProfileSchema.parse(body);

    // Find and update user
    const userIndex = users.findIndex((u) => u.id === user.userId);
    if (userIndex === -1) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    users[userIndex] = { ...users[userIndex], ...updates };

    return NextResponse.json({
      success: true,
      data: users[userIndex],
      message: "Profile updated successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}