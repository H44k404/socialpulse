import { Response } from 'express';
import { prisma } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { socketEmitter } from '../config/socket';

// @desc    Get all posts
// @route   GET /api/v1/posts
// @access  Private
export const getPosts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const {
    status,
    platform,
    startDate,
    endDate,
    teamId,
  } = req.query;

  // Build where clause
  const where: any = {
    userId: req.user.id,
  };

  if (status) where.status = status;
  if (platform) where.platforms = { has: platform };
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate as string);
    if (endDate) where.createdAt.lte = new Date(endDate as string);
  }

  // Include team posts if user is in a team
  if (req.user.teamId && !teamId) {
    where.OR = [
      { userId: req.user.id },
      { teamId: req.user.teamId },
    ];
  } else if (teamId && req.user.teamId === teamId) {
    where.teamId = teamId;
  }

  const posts = await prisma.post.findMany({
    where,
    skip,
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
      team: {
        select: {
          id: true,
          name: true,
        },
      },
      campaign: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.post.count({ where });

  res.json({
    status: 'success',
    data: {
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Get single post
// @route   GET /api/v1/posts/:id
// @access  Private
export const getPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError('Post ID is required', 400);
  }

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
      team: {
        select: {
          id: true,
          name: true,
        },
      },
      campaign: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Check permissions
  if (post.userId !== req.user.id && post.teamId !== req.user.teamId && req.user.role !== 'admin') {
    throw new AppError('Not authorized to view this post', 403);
  }

  res.json({
    status: 'success',
    data: { post },
  });
});

// @desc    Create new post
// @route   POST /api/v1/posts
// @access  Private
export const createPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    content,
    platforms,
    scheduledAt,
    mediaUrls,
    campaignId,
    tags,
    location,
  } = req.body;

  // Validate campaign if provided
  if (campaignId) {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign || (campaign.userId !== req.user.id && campaign.teamId !== req.user.teamId)) {
      throw new AppError('Invalid campaign', 400);
    }
  }

  const post = await prisma.post.create({
    data: {
      content,
      platforms,
      scheduledFor: scheduledAt ? new Date(scheduledAt) : null,
      mediaUrls: mediaUrls || [],
      campaignId,
      userId: req.user.id,
      teamId: req.user.teamId,
      status: scheduledAt ? 'SCHEDULED' : 'DRAFT',
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
      team: {
        select: {
          id: true,
          name: true,
        },
      },
      campaign: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Emit real-time update
  if (req.user.teamId) {
    socketEmitter.toTeam(req.user.teamId, 'post:created', post);
  }

  res.status(201).json({
    status: 'success',
    data: { post },
  });
});

// @desc    Update post
// @route   PUT /api/v1/posts/:id
// @access  Private
export const updatePost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError('Post ID is required', 400);
  }

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Check permissions
  if (post.userId !== req.user.id && post.teamId !== req.user.teamId && req.user.role !== 'admin') {
    throw new AppError('Not authorized to update this post', 403);
  }

  const {
    content,
    platforms,
    scheduledAt,
    mediaUrls,
    campaignId,
    tags,
    location,
  } = req.body;

  const updatedPost = await prisma.post.update({
    where: { id },
    data: {
      ...(content !== undefined && { content }),
      ...(platforms && { platforms }),
      ...(scheduledAt !== undefined && { scheduledAt: scheduledAt ? new Date(scheduledAt) : null }),
      ...(mediaUrls !== undefined && { mediaUrls }),
      ...(campaignId !== undefined && { campaignId }),
      ...(tags !== undefined && { tags }),
      ...(location !== undefined && { location }),
      status: scheduledAt ? 'SCHEDULED' : 'DRAFT',
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
      team: {
        select: {
          id: true,
          name: true,
        },
      },
      campaign: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Emit real-time update
  if (req.user.teamId) {
    socketEmitter.toTeam(req.user.teamId, 'post:updated', updatedPost);
  }

  res.json({
    status: 'success',
    data: { post: updatedPost },
  });
});

// @desc    Delete post
// @route   DELETE /api/v1/posts/:id
// @access  Private
export const deletePost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError('Post ID is required', 400);
  }

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Check permissions
  if (post.userId !== req.user.id && post.teamId !== req.user.teamId && req.user.role !== 'admin') {
    throw new AppError('Not authorized to delete this post', 403);
  }

  await prisma.post.delete({
    where: { id },
  });

  // Emit real-time update
  if (req.user.teamId) {
    socketEmitter.toTeam(req.user.teamId, 'post:deleted', { id });
  }

  res.json({
    status: 'success',
    message: 'Post deleted successfully',
  });
});

// @desc    Publish post immediately
// @route   POST /api/v1/posts/:id/publish
// @access  Private
export const publishPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError('Post ID is required', 400);
  }

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
      team: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Check permissions
  if (post.userId !== req.user.id && post.teamId !== req.user.teamId && req.user.role !== 'admin') {
    throw new AppError('Not authorized to publish this post', 403);
  }

  // Update post status
  const updatedPost = await prisma.post.update({
    where: { id },
    data: {
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
      team: {
        select: {
          id: true,
          name: true,
        },
      },
      campaign: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Emit real-time update
  if (req.user.teamId) {
    socketEmitter.toTeam(req.user.teamId, 'post:published', updatedPost);
  }

  res.json({
    status: 'success',
    data: { post: updatedPost },
  });
});

// @desc    Get post analytics
// @route   GET /api/v1/posts/:id/analytics
// @access  Private
export const getPostAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError('Post ID is required', 400);
  }

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Check permissions
  if (post.userId !== req.user.id && post.teamId !== req.user.teamId && req.user.role !== 'admin') {
    throw new AppError('Not authorized to view this post analytics', 403);
  }

  const analytics = await prisma.analytics.findMany({
    where: {
      platformPost: {
        postId: id,
      },
    },
    include: {
      platformPost: {
        select: {
          platform: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({
    status: 'success',
    data: { analytics },
  });
});
