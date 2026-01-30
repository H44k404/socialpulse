import { Response } from 'express';
import { prisma } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all users (admin only)
// @route   GET /api/v1/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const users = await prisma.user.findMany({
    skip,
    take: limit,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      avatar: true,
      isActive: true,
      emailVerified: true,
      teamId: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.user.count();

  res.json({
    status: 'success',
    data: {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private
export const getUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError('User ID is required', 400);
  }

  const user = await prisma.user.findUnique({
    where: { id },
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
      team: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
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

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private
export const updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError('User ID is required', 400);
  }

  const { firstName, lastName, bio, timezone, language, avatar } = req.body;

  // Check if user can update this profile
  if (req.user.id !== id && req.user.role !== 'admin') {
    throw new AppError('Not authorized to update this user', 403);
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(bio !== undefined && { bio }),
      ...(timezone && { timezone }),
      ...(language && { language }),
      ...(avatar !== undefined && { avatar }),
    },
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
      updatedAt: true,
    },
  });

  res.json({
    status: 'success',
    data: { user },
  });
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError('User ID is required', 400);
  }

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Soft delete by deactivating
  await prisma.user.update({
    where: { id },
    data: { isActive: false },
  });

  res.json({
    status: 'success',
    message: 'User deactivated successfully',
  });
});

// @desc    Get user statistics
// @route   GET /api/v1/users/:id/stats
// @access  Private
export const getUserStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError('User ID is required', 400);
  }

  const userId = id;

  // Check permissions
  if (req.user.id !== userId && req.user.role !== 'admin') {
    throw new AppError('Not authorized to view these statistics', 403);
  }

  const [
    totalPosts,
    publishedPosts,
    scheduledPosts,
    totalEngagement,
    platformConnections,
  ] = await Promise.all([
    prisma.post.count({ where: { userId } }),
    prisma.post.count({ where: { userId, status: 'PUBLISHED' } }),
    prisma.post.count({ where: { userId, status: 'SCHEDULED' } }),
    prisma.analytics.aggregate({
      where: { userId },
      _sum: {
        likes: true,
        comments: true,
        shares: true,
        views: true,
      },
    }),
    prisma.connectedPlatform.count({ where: { userId } }),
  ]);

  const stats = {
    posts: {
      total: totalPosts,
      published: publishedPosts,
      scheduled: scheduledPosts,
    },
    engagement: {
      likes: totalEngagement._sum.likes || 0,
      comments: totalEngagement._sum.comments || 0,
      shares: totalEngagement._sum.shares || 0,
      views: totalEngagement._sum.views || 0,
    },
    platformConnections,
  };

  res.json({
    status: 'success',
    data: { stats },
  });
});

// @desc    Get user's team members
// @route   GET /api/v1/users/:id/team-members
// @access  Private
export const getUserTeamMembers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError('User ID is required', 400);
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: { teamId: true },
  });

  if (!user?.teamId) {
    throw new AppError('User is not part of a team', 400);
  }

  // Check if requesting user is in the same team
  if (req.user.teamId !== user.teamId && req.user.role !== 'admin') {
    throw new AppError('Not authorized to view team members', 403);
  }

  const teamMembers = await prisma.user.findMany({
    where: { teamId: user.teamId, isActive: true },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      avatar: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  res.json({
    status: 'success',
    data: { teamMembers },
  });
});