import { Response } from 'express';
import { prisma } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// @desc    Get user's platform connections
// @route   GET /api/v1/platforms/connections
// @access  Private
export const getPlatformConnections = asyncHandler(async (req: AuthRequest, res: Response) => {
  const connections = await prisma.connectedPlatform.findMany({
    where: { userId: req.user.id },
    select: {
      id: true,
      platform: true,
      platformUsername: true,
      isActive: true,
      lastSyncAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({
    status: 'success',
    data: { connections },
  });
});

// @desc    Connect to a platform
// @route   POST /api/v1/platforms/connect
// @access  Private
export const connectPlatform = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    platform,
    accessToken,
    refreshToken,
    expiresAt,
    platformUsername,
    platformUserId,
  } = req.body;

  // Check if connection already exists
  const existingConnection = await prisma.connectedPlatform.findFirst({
    where: {
      userId: req.user.id,
      platform,
    },
  });

  if (existingConnection) {
    throw new AppError('Platform already connected', 400);
  }

  const connection = await prisma.connectedPlatform.create({
    data: {
      platform,
      platformUserId,
      accessToken,
      refreshToken,
      platformUsername,
      userId: req.user.id,
    },
    select: {
      id: true,
      platform: true,
      platformUsername: true,
      isActive: true,
      createdAt: true,
    },
  });

  res.status(201).json({
    status: 'success',
    data: { connection },
  });
});

// @desc    Update platform connection
// @route   PUT /api/v1/platforms/connections/:id
// @access  Private
export const updatePlatformConnection = asyncHandler(async (req: AuthRequest, res: Response) => {
  const connection = await prisma.connectedPlatform.findUnique({
    where: { id: req.params.id },
  });

  if (!connection) {
    throw new AppError('Platform connection not found', 404);
  }

  if (connection.userId !== req.user.id) {
    throw new AppError('Not authorized to update this connection', 403);
  }

  const {
    accessToken,
    refreshToken,
    expiresAt,
    platformUsername,
    platformUserId,
    isActive,
  } = req.body;

  const updatedConnection = await prisma.connectedPlatform.update({
    where: { id: req.params.id },
    data: {
      ...(accessToken && { accessToken }),
      ...(refreshToken && { refreshToken }),
      ...(platformUsername !== undefined && { platformUsername }),
      ...(platformUserId !== undefined && { platformUserId }),
      ...(isActive !== undefined && { isActive }),
      lastSyncAt: new Date(),
    },
    select: {
      id: true,
      platform: true,
      platformUsername: true,
      isActive: true,
      lastSyncAt: true,
    },
  });

  res.json({
    status: 'success',
    data: { connection: updatedConnection },
  });
});

// @desc    Disconnect from a platform
// @route   DELETE /api/v1/platforms/connections/:id
// @access  Private
export const disconnectPlatform = asyncHandler(async (req: AuthRequest, res: Response) => {
  const connection = await prisma.connectedPlatform.findUnique({
    where: { id: req.params.id },
  });

  if (!connection) {
    throw new AppError('Platform connection not found', 404);
  }

  if (connection.userId !== req.user.id) {
    throw new AppError('Not authorized to disconnect this platform', 403);
  }

  await prisma.connectedPlatform.delete({
    where: { id: req.params.id },
  });

  res.json({
    status: 'success',
    message: 'Platform disActive successfully',
  });
});

// @desc    Sync platform data
// @route   POST /api/v1/platforms/sync/:id
// @access  Private
export const syncPlatformData = asyncHandler(async (req: AuthRequest, res: Response) => {
  const connection = await prisma.connectedPlatform.findUnique({
    where: { id: req.params.id },
    include: {
      user: true,
    },
  });

  if (!connection) {
    throw new AppError('Platform connection not found', 404);
  }

  if (connection.userId !== req.user.id) {
    throw new AppError('Not authorized to sync this platform', 403);
  }

  if (!connection.isActive) {
    throw new AppError('Platform is not connected', 400);
  }

  try {
    // This would integrate with actual platform APIs
    // For now, we'll simulate the sync process
    const syncResult = await performPlatformSync(connection);

    // Update connection with latest data
    await prisma.connectedPlatform.update({
      where: { id: req.params.id },
      data: {
        lastSyncAt: new Date(),
      },
    });

    res.json({
      status: 'success',
      data: {
        syncResult,
        lastSyncAt: new Date(),
      },
    });
  } catch (error) {
    throw new AppError('Failed to sync platform data', 500);
  }
});

// @desc    Get platform account info
// @route   GET /api/v1/platforms/:platform/account
// @access  Private
export const getPlatformAccountInfo = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { platform } = req.params;

  const connection = await prisma.connectedPlatform.findFirst({
    where: {
      userId: req.user.id,
      platform: platform as any,
      isActive: true,
    },
    select: {
      id: true,
      platform: true,
      platformUsername: true,
      lastSyncAt: true,
      createdAt: true,
    },
  });

  if (!connection) {
    throw new AppError('Platform not connected', 404);
  }

  res.json({
    status: 'success',
    data: { account: connection },
  });
});

// @desc    Get available platforms
// @route   GET /api/v1/platforms/available
// @access  Private
export const getAvailablePlatforms = asyncHandler(async (req: AuthRequest, res: Response) => {
  const platforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Connect your Facebook account to schedule posts and analyze performance',
      features: ['Posts', 'Pages', 'Groups', 'Stories'],
      icon: 'facebook',
    },
    {
      id: 'twitter',
      name: 'Twitter',
      description: 'Manage your Twitter presence with automated posting and analytics',
      features: ['Tweets', 'Threads', 'Analytics'],
      icon: 'twitter',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Professional networking with post scheduling and engagement tracking',
      features: ['Posts', 'Articles', 'Company Pages'],
      icon: 'linkedin',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Visual storytelling with posts, stories, and reels',
      features: ['Posts', 'Stories', 'Reels', 'IGTV'],
      icon: 'instagram',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      description: 'Short-form video content creation and distribution',
      features: ['Videos', 'Live Streaming', 'Analytics'],
      icon: 'tiktok',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      description: 'Video content management and channel growth',
      features: ['Videos', 'Shorts', 'Live Streaming', 'Analytics'],
      icon: 'youtube',
    },
  ];

  // Mark connected platforms
  const connectedPlatforms = await prisma.connectedPlatform.findMany({
    where: { userId: req.user.id },
    select: { platform: true, isActive: true },
  });

  const connectedPlatformIds = new Set(
    connectedPlatforms.filter((c: any) => c.isActive).map((c: any) => c.platform)
  );

  const platformsWithStatus = platforms.map(platform => ({
    ...platform,
    isActive: connectedPlatformIds.has(platform.id),
  }));

  res.json({
    status: 'success',
    data: { platforms: platformsWithStatus },
  });
});

// Helper function to simulate platform sync
async function performPlatformSync(connection: any) {
  // This would contain actual API calls to each platform
  // For now, we'll return mock data
  const mockData = {
    followers: Math.floor(Math.random() * 10000) + 1000,
    following: Math.floor(Math.random() * 1000) + 100,
    posts: Math.floor(Math.random() * 500) + 50,
    engagement: Math.floor(Math.random() * 1000) + 100,
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return mockData;
}
