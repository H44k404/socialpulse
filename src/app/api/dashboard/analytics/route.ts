"use server";

import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalPosts: 1247,
    totalEngagement: 45632,
    totalFollowers: 89234,
    growthRate: 12.5,
  },
  engagement: {
    likes: 23456,
    comments: 8765,
    shares: 3456,
    saves: 1955,
  },
  platformStats: [
    {
      platform: "Instagram",
      posts: 456,
      engagement: 23456,
      followers: 34567,
      growth: 8.2,
    },
    {
      platform: "Twitter",
      posts: 323,
      engagement: 12345,
      followers: 23456,
      growth: 15.7,
    },
    {
      platform: "Facebook",
      posts: 234,
      engagement: 5678,
      followers: 15678,
      growth: 5.3,
    },
    {
      platform: "LinkedIn",
      posts: 234,
      engagement: 4153,
      followers: 15533,
      growth: 22.1,
    },
  ],
  recentPosts: [
    {
      id: "1",
      platform: "Instagram",
      content: "Excited to announce our new feature! 🚀",
      engagement: 1234,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      status: "published",
    },
    {
      id: "2",
      platform: "Twitter",
      content: "Just shipped a major update to our platform. Check it out! #tech",
      engagement: 567,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      status: "published",
    },
    {
      id: "3",
      platform: "Facebook",
      content: "Team building day was amazing! Grateful for such an awesome team. 🙏",
      engagement: 234,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      status: "published",
    },
  ],
  growthChart: [
    { date: "2024-01-01", followers: 75000, engagement: 35000 },
    { date: "2024-01-08", followers: 76500, engagement: 36500 },
    { date: "2024-01-15", followers: 78200, engagement: 38200 },
    { date: "2024-01-22", followers: 79800, engagement: 39800 },
    { date: "2024-01-29", followers: 81500, engagement: 41200 },
    { date: "2024-02-05", followers: 83200, engagement: 42800 },
    { date: "2024-02-12", followers: 85000, engagement: 44500 },
    { date: "2024-02-19", followers: 86800, engagement: 46200 },
    { date: "2024-02-26", followers: 88500, engagement: 47800 },
    { date: "2024-03-05", followers: 89234, engagement: 45632 },
  ],
};

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

    // Get query parameters for filtering
    // const { searchParams } = new URL(request.url);

    // In a real app, you would filter data based on timeframe and platform
    // For now, return mock data
    return NextResponse.json({
      success: true,
      data: mockAnalytics,
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}