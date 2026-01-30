"use server";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Mock user database - In production, use a real database
const users = [
  {
    id: "1",
    email: "demo@socialpulse.com",
    password: "$2a$10$hashedpassword",
    name: "Demo User",
    avatar: "/avatars/demo.jpg",
    plan: "pro",
    createdAt: new Date().toISOString(),
  },
];

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    // Check if user exists (but don't reveal this for security)
    users.find((u) => u.email === email);

    // Always return success for security (don't reveal if email exists)
    return NextResponse.json({
      message: "If an account with this email exists, a password reset link has been sent.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}