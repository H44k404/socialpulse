import { Response } from 'express';
import { prisma } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all campaigns
// @route   GET /api/v1/campaigns
// @access  Private
export const getCampaigns = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const { status, startDate, endDate } = req.query;

  const where: any = {
    userId: req.user.id,
  };

  if (status) where.status = status;
  if (startDate || endDate) {
    where.startDate = {};
    if (startDate) where.startDate.gte = new Date(startDate as string);
    if (endDate) where.endDate.lte = new Date(endDate as string);
  }

  // Include team campaigns if user is in a team
  if (req.user.teamId) {
    where.OR = [
      { userId: req.user.id },
      { teamId: req.user.teamId },
    ];
  }

  const campaigns = await prisma.campaign.findMany({
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
      _count: {
        select: {
          posts: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.campaign.count({ where });

  res.json({
    status: 'success',
    data: {
      campaigns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Get single campaign
// @route   GET /api/v1/campaigns/:id
// @access  Private
export const getCampaign = asyncHandler(async (req: AuthRequest, res: Response) => {
  const campaign = await prisma.campaign.findUnique({
    where: { id: req.params.id },
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
      posts: {
        select: {
          id: true,
          content: true,
          platforms: {
            select: {
              platform: true,
              publishedAt: true,
            },
            include: {
              analytics: {
                select: {
                  likes: true,
                  comments: true,
                  shares: true,
                  views: true,
                },
                orderBy: { createdAt: 'desc' },
                take: 1, // Get latest analytics
              },
            },
          },
          status: true,
          publishedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  if (!campaign) {
    throw new AppError('Campaign not found', 404);
  }

  // Check permissions
  if (campaign.userId !== req.user.id && campaign.teamId !== req.user.teamId && req.user.role !== 'admin') {
    throw new AppError('Not authorized to view this campaign', 403);
  }

  res.json({
    status: 'success',
    data: { campaign },
  });
});

// @desc    Create new campaign
// @route   POST /api/v1/campaigns
// @access  Private
export const createCampaign = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    name,
    description,
    startDate,
    endDate,
    goals,
    budget,
  } = req.body;

  const campaign = await prisma.campaign.create({
    data: {
      name,
      description,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      goals,
      budget: budget ? parseFloat(budget) : null,
      userId: req.user.id,
      teamId: req.user.teamId,
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
    },
  });

  res.status(201).json({
    status: 'success',
    data: { campaign },
  });
});

// @desc    Update campaign
// @route   PUT /api/v1/campaigns/:id
// @access  Private
export const updateCampaign = asyncHandler(async (req: AuthRequest, res: Response) => {
  const campaign = await prisma.campaign.findUnique({
    where: { id: req.params.id },
  });

  if (!campaign) {
    throw new AppError('Campaign not found', 404);
  }

  // Check permissions
  if (campaign.userId !== req.user.id && campaign.teamId !== req.user.teamId && req.user.role !== 'admin') {
    throw new AppError('Not authorized to update this campaign', 403);
  }

  const {
    name,
    description,
    startDate,
    endDate,
    goals,
    budget,
    status,
  } = req.body;

  const updatedCampaign = await prisma.campaign.update({
    where: { id: req.params.id },
    data: {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
      ...(goals !== undefined && { goals }),
      ...(budget !== undefined && { budget: budget ? parseFloat(budget) : null }),
      ...(status && { status }),
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
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  res.json({
    status: 'success',
    data: { campaign: updatedCampaign },
  });
});

// @desc    Delete campaign
// @route   DELETE /api/v1/campaigns/:id
// @access  Private
export const deleteCampaign = asyncHandler(async (req: AuthRequest, res: Response) => {
  const campaign = await prisma.campaign.findUnique({
    where: { id: req.params.id },
  });

  if (!campaign) {
    throw new AppError('Campaign not found', 404);
  }

  // Check permissions
  if (campaign.userId !== req.user.id && campaign.teamId !== req.user.teamId && req.user.role !== 'admin') {
    throw new AppError('Not authorized to delete this campaign', 403);
  }

  await prisma.campaign.delete({
    where: { id: req.params.id },
  });

  res.json({
    status: 'success',
    message: 'Campaign deleted successfully',
  });
});

// @desc    Get campaign analytics
// @route   GET /api/v1/campaigns/:id/analytics
// @access  Private
export const getCampaignAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const campaign = await prisma.campaign.findUnique({
    where: { id: req.params.id },
  });

  if (!campaign) {
    throw new AppError('Campaign not found', 404);
  }

  // Check permissions
  if (campaign.userId !== req.user.id && campaign.teamId !== req.user.teamId && req.user.role !== 'admin') {
    throw new AppError('Not authorized to view this campaign analytics', 403);
  }

  // Get all posts in the campaign
  const posts = await prisma.post.findMany({
    where: { campaignId: req.params.id },
    include: {
      platforms: {
        include: {
          analytics: {
            orderBy: { createdAt: 'desc' },
            take: 1, // Get latest analytics for each post
          },
        },
      },
    },
  });

  // Aggregate analytics
  const totalAnalytics = posts.reduce(
    (acc: any, post: any) => {
      // Aggregate analytics across all platforms for this post
      const postAnalytics = post.platforms.reduce(
        (platformAcc: any, platformPost: any) => {
          const latestAnalytics = platformPost.analytics[0] || {};
          return {
            likes: platformAcc.likes + (latestAnalytics.likes || 0),
            comments: platformAcc.comments + (latestAnalytics.comments || 0),
            shares: platformAcc.shares + (latestAnalytics.shares || 0),
            views: platformAcc.views + (latestAnalytics.views || 0),
            reach: platformAcc.reach + (latestAnalytics.reach || 0),
            impressions: platformAcc.impressions + (latestAnalytics.impressions || 0),
          };
        },
        { likes: 0, comments: 0, shares: 0, views: 0, reach: 0, impressions: 0 }
      );

      return {
        likes: acc.likes + postAnalytics.likes,
        comments: acc.comments + postAnalytics.comments,
        shares: acc.shares + postAnalytics.shares,
        views: acc.views + postAnalytics.views,
        reach: acc.reach + postAnalytics.reach,
        impressions: acc.impressions + postAnalytics.impressions,
      };
    },
    { likes: 0, comments: 0, shares: 0, views: 0, reach: 0, impressions: 0 }
  );

  // Calculate engagement rate
  const totalEngagement = totalAnalytics.likes + totalAnalytics.comments + totalAnalytics.shares;
  const engagementRate = totalAnalytics.reach > 0 ? (totalEngagement / totalAnalytics.reach) * 100 : 0;

  const analytics = {
    totalPosts: posts.length,
    publishedPosts: posts.filter((p: any) => p.status === 'published').length,
    totalEngagement,
    engagementRate: Math.round(engagementRate * 100) / 100,
    ...totalAnalytics,
    postPerformance: posts.map((post: any) => ({
      id: post.id,
      content: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
      platforms: post.platforms,
      status: post.status,
      publishedAt: post.publishedAt,
      analytics: post.analytics[0] || {},
    })),
  };

  res.json({
    status: 'success',
    data: { analytics },
  });
});

// @desc    Add post to campaign
// @route   POST /api/v1/campaigns/:id/posts
// @access  Private
export const addPostToCampaign = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { postId } = req.body;

  const campaign = await prisma.campaign.findUnique({
    where: { id: req.params.id },
  });

  if (!campaign) {
    throw new AppError('Campaign not found', 404);
  }

  // Check permissions
  if (campaign.userId !== req.user.id && campaign.teamId !== req.user.teamId && req.user.role !== 'admin') {
    throw new AppError('Not authorized to modify this campaign', 403);
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Check post ownership
  if (post.userId !== req.user.id && post.teamId !== req.user.teamId && req.user.role !== 'admin') {
    throw new AppError('Not authorized to add this post to campaign', 403);
  }

  // Update post with campaign
  await prisma.post.update({
    where: { id: postId },
    data: { campaignId: req.params.id },
  });

  res.json({
    status: 'success',
    message: 'Post added to campaign successfully',
  });
});

// @desc    Remove post from campaign
// @route   DELETE /api/v1/campaigns/:id/posts/:postId
// @access  Private
export const removePostFromCampaign = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: campaignId, postId } = req.params;

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
  });

  if (!campaign) {
    throw new AppError('Campaign not found', 404);
  }

  // Check permissions
  if (campaign.userId !== req.user.id && campaign.teamId !== req.user.teamId && req.user.role !== 'admin') {
    throw new AppError('Not authorized to modify this campaign', 403);
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post || post.campaignId !== campaignId) {
    throw new AppError('Post not found in this campaign', 404);
  }

  // Remove post from campaign
  await prisma.post.update({
    where: { id: postId },
    data: { campaignId: null },
  });

  res.json({
    status: 'success',
    message: 'Post removed from campaign successfully',
  });
});