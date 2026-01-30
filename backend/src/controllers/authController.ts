import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../config/database';
import { config } from '../config/environment';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { sendEmail } from '../utils/email';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, role = 'user' } = req.body;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError('User already exists', 400);
  }

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      role,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id);

  // TODO: Store refresh token in database or cache
  // await prisma.refreshToken.create({
  //   data: {
  //     token: refreshToken,
  //     userId: user.id,
  //     expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  //   },
  // });

  res.status(201).json({
    status: 'success',
    data: {
      user,
      tokens: {
        accessToken,
        refreshToken,
      },
    },
  });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      emailVerified: true,
      teamId: true,
    },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated', 401);
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id);

  // TODO: Store refresh token in database or cache
  // await prisma.refreshToken.create({
  //   data: {
  //     token: refreshToken,
  //     userId: user.id,
  //     expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  //   },
  // });

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    status: 'success',
    data: {
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken,
      },
    },
  });
});

// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh
// @access  Public
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    throw new AppError('Refresh token is required', 400);
  }

  // Verify refresh token
  const decoded = verifyRefreshToken(token);

  // TODO: Check if refresh token exists in database
  // const storedToken = await prisma.refreshToken.findUnique({
  //   where: { token },
  //   include: { user: true },
  // });

  // if (!storedToken || storedToken.userId !== decoded.id || storedToken.expiresAt < new Date()) {
  //   throw new AppError('Invalid or expired refresh token', 401);
  // }

  // Generate new tokens
  const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.id);

  // TODO: Update refresh token in database
  // await prisma.refreshToken.update({
  //   where: { token },
  //   data: {
  //     token: newRefreshToken,
  //     expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  //   },
  // });

  res.json({
    status: 'success',
    data: {
      accessToken,
      refreshToken: newRefreshToken,
    },
  });
});

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    // TODO: Remove refresh token from database
    // await prisma.refreshToken.deleteMany({
    //   where: { token: refreshToken, userId: req.user.id },
    // });
  }

  res.json({
    status: 'success',
    message: 'Logged out successfully',
  });
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Don't reveal if user exists or not
    return res.json({
      status: 'success',
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // TODO: Store reset token in database (need to add fields to User model)
  // await prisma.user.update({
  //   where: { id: user.id },
  //   data: {
  //     resetPasswordToken: resetToken,
  //     resetPasswordExpires: resetTokenExpiry,
  //   },
  // });

  // Send email
  const resetUrl = `${config.cors.origin[0]}/reset-password/${resetToken}`;
  const message = `
    You are receiving this email because you (or someone else) has requested the reset of a password.

    Please click on the following link, or paste this into your browser to complete the process:

    ${resetUrl}

    If you did not request this, please ignore this email and your password will remain unchanged.
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Token',
      message,
    });

    res.json({
      status: 'success',
      message: 'Password reset email sent',
    });
  } catch (error) {
    // TODO: Remove reset token on error (need to add fields to User model)
    // await prisma.user.update({
    //   where: { id: user.id },
    //   data: {
    //     resetPasswordToken: null,
    //     resetPasswordExpires: null,
    //   },
    // });

    throw new AppError('Email could not be sent', 500);
  }
});

// @desc    Reset password
// @route   PUT /api/v1/auth/reset-password/:token
// @access  Public
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  // TODO: Implement password reset functionality (need to add resetPasswordToken and resetPasswordExpires fields to User model)
  throw new AppError('Password reset functionality not implemented', 501);
});

// @desc    Update password
// @route   PUT /api/v1/auth/update-password
// @access  Private
export const updatePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { password: true },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check current password
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    throw new AppError('Current password is incorrect', 400);
  }

  // Hash new password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update password
  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashedPassword },
  });

  res.json({
    status: 'success',
    message: 'Password updated successfully',
  });
});

// @desc    Verify email
// @route   POST /api/v1/auth/verify-email
// @access  Private
export const verifyEmail = asyncHandler(async (req: AuthRequest, res: Response) => {
  await prisma.user.update({
    where: { id: req.user.id },
    data: { emailVerified: true },
  });

  res.json({
    status: 'success',
    message: 'Email verified successfully',
  });
});

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      avatar: true,
      bio: true,
      timezone: true,
      language: true,
      emailVerified: true,
      isActive: true,
      teamId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    status: 'success',
    data: { user },
  });
});