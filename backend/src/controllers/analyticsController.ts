import { Response } from 'express';
import { prisma } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// @desc    Get user analytics overview
// @route   GET /api/v1/analytics/overview
// @access  Private
export const getAnalyticsOverview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { startDate, endDate, platform } = req.query;

  const dateFilter: any = {};
  if (startDate) dateFilter.gte = new Date(startDate as string);
  if (endDate) dateFilter.lte = new Date(endDate as string);

  const whereClause: any = {
    userId: req.user.id,
    ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
    ...(platform && { platform }),
  };

  // Include team analytics if user is in a team
  if (req.user.teamId) {
    whereClause.OR = [
      { userId: req.user.id },
      { teamId: req.user.teamId },
    ];
  }

  const [
    totalPosts,
    totalEngagement,
    platformBreakdown,
    recentAnalytics,
  ] = await Promise.all([
    prisma.post.count({
      where: {
        userId: req.user.id,
        status: 'PUBLISHED',
        ...(Object.keys(dateFilter).length > 0 && { publishedAt: dateFilter }),
      },
    }),
    prisma.analytics.aggregate({
      where: whereClause,
      _sum: {
        likes: true,
        comments: true,
        shares: true,
        views: true,
        reach: true,
        impressions: true,
      },
    }),
    prisma.analytics.groupBy({
      by: ['platform'],
      where: whereClause,
      _sum: {
        likes: true,
        comments: true,
        shares: true,
        views: true,
      },
    }),
    prisma.analytics.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        platformPost: {
          select: {
            id: true,
            platform: true,
          },
          include: {
            post: {
              select: {
                content: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const overview = {
    totalPosts,
    totalEngagement: {
      likes: totalEngagement._sum.likes || 0,
      comments: totalEngagement._sum.comments || 0,
      shares: totalEngagement._sum.shares || 0,
      views: totalEngagement._sum.views || 0,
      reach: totalEngagement._sum.reach || 0,
      impressions: totalEngagement._sum.impressions || 0,
    },
    platformBreakdown: platformBreakdown.map((platform: any) => ({
      platform: platform.platform,
      likes: platform._sum.likes || 0,
      comments: platform._sum.comments || 0,
      shares: platform._sum.shares || 0,
      views: platform._sum.views || 0,
    })),
    recentAnalytics,
  };

  res.json({
    status: 'success',
    data: { overview },
  });
});

// @desc    Get analytics by platform
// @route   GET /api/v1/analytics/platforms/:platform
// @access  Private
export const getPlatformAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { platform } = req.params;
  const { startDate, endDate, period = 'day' } = req.query;

  const dateFilter: any = {};
  if (startDate) dateFilter.gte = new Date(startDate as string);
  if (endDate) dateFilter.lte = new Date(endDate as string);

  const whereClause: any = {
    userId: req.user.id,
    platform,
    ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
  };

  // Include team analytics if user is in a team
  if (req.user.teamId) {
    whereClause.OR = [
      { userId: req.user.id },
      { teamId: req.user.teamId },
    ];
  }

  const analytics = await prisma.analytics.findMany({
    where: whereClause,
    orderBy: { createdAt: 'asc' },
    select: {
      createdAt: true,
      likes: true,
      comments: true,
      shares: true,
      views: true,
      reach: true,
      impressions: true,
    },
  });

  // Group by period
  const groupedData = groupAnalyticsByPeriod(analytics, period as string);

  res.json({
    status: 'success',
    data: {
      platform,
      period,
      data: groupedData,
    },
  });
});

// @desc    Get post performance analytics
// @route   GET /api/v1/analytics/posts/performance
// @access  Private
export const getPostPerformance = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { startDate, endDate, limit = 10 } = req.query;

  const dateFilter: any = {};
  if (startDate) dateFilter.gte = new Date(startDate as string);
  if (endDate) dateFilter.lte = new Date(endDate as string);

  const whereClause: any = {
    userId: req.user.id,
    ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
  };

  // Include team posts if user is in a team
  if (req.user.teamId) {
    whereClause.OR = [
      { userId: req.user.id },
      { teamId: req.user.teamId },
    ];
  }

  const postPerformance = await prisma.post.findMany({
    where: {
      userId: req.user.id,
      status: 'PUBLISHED',
      ...(Object.keys(dateFilter).length > 0 && { publishedAt: dateFilter }),
    },
    take: parseInt(limit as string),
    orderBy: { publishedAt: 'desc' },
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
              reach: true,
              impressions: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 1, // Get latest analytics
          },
        },
      },
      publishedAt: true,
    },
  });

  // Calculate engagement rate for each post
  const performanceData = postPerformance.map((post: any) => {
    const latestAnalytics = post.analytics[0] || {};
    const totalEngagement = (latestAnalytics.likes || 0) +
                           (latestAnalytics.comments || 0) +
                           (latestAnalytics.shares || 0);

    const engagementRate = latestAnalytics.reach && latestAnalytics.reach > 0
      ? (totalEngagement / latestAnalytics.reach) * 100
      : 0;

    return {
      id: post.id,
      content: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
      platforms: post.platforms,
      publishedAt: post.publishedAt,
      metrics: {
        likes: latestAnalytics.likes || 0,
        comments: latestAnalytics.comments || 0,
        shares: latestAnalytics.shares || 0,
        views: latestAnalytics.views || 0,
        reach: latestAnalytics.reach || 0,
        impressions: latestAnalytics.impressions || 0,
        totalEngagement,
        engagementRate: Math.round(engagementRate * 100) / 100,
      },
    };
  });

  res.json({
    status: 'success',
    data: { postPerformance: performanceData },
  });
});

// @desc    Get audience demographics
// @route   GET /api/v1/analytics/audience
// @access  Private
export const getAudienceAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { platform, startDate, endDate } = req.query;

  const dateFilter: any = {};
  if (startDate) dateFilter.gte = new Date(startDate as string);
  if (endDate) dateFilter.lte = new Date(endDate as string);

  const whereClause: any = {
    userId: req.user.id,
    ...(platform && { platform }),
    ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
  };

  // Include team analytics if user is in a team
  if (req.user.teamId) {
    whereClause.OR = [
      { userId: req.user.id },
      { teamId: req.user.teamId },
    ];
  }

  // Get audience data from analytics
  const audienceData = await prisma.analytics.findMany({
    where: whereClause,
    select: {
      platform: true,
      metadata: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Aggregate audience demographics
  const demographics = {
    ageGroups: {} as Record<string, number>,
    genders: {} as Record<string, number>,
    locations: {} as Record<string, number>,
    interests: {} as Record<string, number>,
  };

  audienceData.forEach((data: any) => {
    if (data.metadata && data.metadata.audienceDemographics) {
      const demo = data.metadata.audienceDemographics as any;

      // Aggregate age groups
      if (demo.ageGroups) {
        Object.entries(demo.ageGroups).forEach(([age, count]) => {
          demographics.ageGroups[age] = (demographics.ageGroups[age] || 0) + (count as number);
        });
      }

      // Aggregate genders
      if (demo.genders) {
        Object.entries(demo.genders).forEach(([gender, count]) => {
          demographics.genders[gender] = (demographics.genders[gender] || 0) + (count as number);
        });
      }

      // Aggregate locations
      if (demo.locations) {
        Object.entries(demo.locations).forEach(([location, count]) => {
          demographics.locations[location] = (demographics.locations[location] || 0) + (count as number);
        });
      }

      // Aggregate interests
      if (demo.interests) {
        Object.entries(demo.interests).forEach(([interest, count]) => {
          demographics.interests[interest] = (demographics.interests[interest] || 0) + (count as number);
        });
      }
    }
  });

  res.json({
    status: 'success',
    data: { demographics },
  });
});

// @desc    Get growth metrics
// @route   GET /api/v1/analytics/growth
// @access  Private
export const getGrowthMetrics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { platform, period = 'month' } = req.query;

  const whereClause: any = {
    userId: req.user.id,
    ...(platform && { platform }),
  };

  // Include team analytics if user is in a team
  if (req.user.teamId) {
    whereClause.OR = [
      { userId: req.user.id },
      { teamId: req.user.teamId },
    ];
  }

  // Get historical data for growth calculation
  const historicalData = await prisma.analytics.findMany({
    where: whereClause,
    orderBy: { createdAt: 'asc' },
    select: {
      createdAt: true,
      followerCount: true,
      followerChange: true,
      platform: true,
    },
  });

  // Calculate growth rates
  const growthMetrics = calculateGrowthRates(historicalData, period as string);

  res.json({
    status: 'success',
    data: { growthMetrics },
  });
});

// Helper function to group analytics by period
function groupAnalyticsByPeriod(analytics: any[], period: string) {
  const grouped: Record<string, any> = {};

  analytics.forEach(item => {
    const date = new Date(item.createdAt);
    let key: string;

    switch (period) {
      case 'hour':
        key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}`;
        break;
      case 'day':
        key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = `${weekStart.getFullYear()}-${weekStart.getMonth() + 1}-${weekStart.getDate()}`;
        break;
      case 'month':
        key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        break;
      default:
        key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }

    if (!grouped[key]) {
      grouped[key] = {
        date: key,
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0,
        reach: 0,
        impressions: 0,
        count: 0,
      };
    }

    grouped[key].likes += item.likes || 0;
    grouped[key].comments += item.comments || 0;
    grouped[key].shares += item.shares || 0;
    grouped[key].views += item.views || 0;
    grouped[key].reach += item.reach || 0;
    grouped[key].impressions += item.impressions || 0;
    grouped[key].count += 1;
  });

  return Object.values(grouped);
}

// Helper function to calculate growth rates
function calculateGrowthRates(data: any[], period: string) {
  if (data.length < 2) {
    return {
      followersGrowth: 0,
      followingGrowth: 0,
      periods: [],
    };
  }

  const grouped = groupAnalyticsByPeriod(data, period);
  const periods = Object.values(grouped);

  if (periods.length < 2) {
    return {
      followersGrowth: 0,
      followingGrowth: 0,
      periods: [],
    };
  }

  const latest = periods[periods.length - 1];
  const previous = periods[periods.length - 2];

  const followersGrowth = previous.followerCount
    ? ((latest.followerCount - previous.followerCount) / previous.followerCount) * 100
    : 0;

  const followingGrowth = 0; // No following data available in schema

  return {
    followersGrowth: Math.round(followersGrowth * 100) / 100,
    followingGrowth: Math.round(followingGrowth * 100) / 100,
    periods,
  };
}