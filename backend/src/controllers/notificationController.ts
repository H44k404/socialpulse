import { Response } from 'express';
import { prisma } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { socketEmitter } from '../config/socket';
import { NotificationType } from '@prisma/client';

// @desc    Get user notifications
// @route   GET /api/v1/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const { read, type } = req.query;

  const where: any = {
    userId: req.user.id,
  };

  if (read !== undefined) where.read = read === 'true';
  if (type) where.type = type;

  const notifications = await prisma.notification.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.notification.count({ where });

  // Mark notifications as read if requested
  if (req.query.markAsRead === 'true') {
    await prisma.notification.updateMany({
      where: {
        userId: req.user.id,
        read: false,
      },
      data: { read: true },
    });
  }

  res.json({
    status: 'success',
    data: {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Get single notification
// @route   GET /api/v1/notifications/:id
// @access  Private
export const getNotification = asyncHandler(async (req: AuthRequest, res: Response) => {
  const notification = await prisma.notification.findUnique({
    where: { id: req.params.id },
  });

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  if (notification.userId !== req.user.id) {
    throw new AppError('Not authorized to view this notification', 403);
  }

  res.json({
    status: 'success',
    data: { notification },
  });
});

// @desc    Create notification
// @route   POST /api/v1/notifications
// @access  Private/Admin
export const createNotification = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { userId, type, title, message, data, actionUrl } = req.body;

  // Check if user can create notifications for this user
  if (req.user.role !== 'admin' && req.user.id !== userId) {
    throw new AppError('Not authorized to create notifications for this user', 403);
  }

  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      data,
      actionUrl,
    },
  });

  // Emit real-time notification
  socketEmitter.toUser(userId, 'notification:new', notification);

  res.status(201).json({
    status: 'success',
    data: { notification },
  });
});

// @desc    Mark notification as read
// @route   PUT /api/v1/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const notification = await prisma.notification.findUnique({
    where: { id: req.params.id },
  });

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  if (notification.userId !== req.user.id) {
    throw new AppError('Not authorized to update this notification', 403);
  }

  const updatedNotification = await prisma.notification.update({
    where: { id: req.params.id },
    data: { read: true },
  });

  res.json({
    status: 'success',
    data: { notification: updatedNotification },
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/v1/notifications/read-all
// @access  Private
export const markAllAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  await prisma.notification.updateMany({
    where: {
      userId: req.user.id,
      read: false,
    },
    data: { read: true },
  });

  res.json({
    status: 'success',
    message: 'All notifications marked as read',
  });
});

// @desc    Delete notification
// @route   DELETE /api/v1/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(async (req: AuthRequest, res: Response) => {
  const notification = await prisma.notification.findUnique({
    where: { id: req.params.id },
  });

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  if (notification.userId !== req.user.id) {
    throw new AppError('Not authorized to delete this notification', 403);
  }

  await prisma.notification.delete({
    where: { id: req.params.id },
  });

  res.json({
    status: 'success',
    message: 'Notification deleted successfully',
  });
});

// @desc    Get notification statistics
// @route   GET /api/v1/notifications/stats
// @access  Private
export const getNotificationStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const [
    totalNotifications,
    unreadNotifications,
    typeBreakdown,
  ] = await Promise.all([
    prisma.notification.count({ where: { userId: req.user.id } }),
    prisma.notification.count({
      where: {
        userId: req.user.id,
        read: false,
      },
    }),
    prisma.notification.groupBy({
      by: ['type'],
      where: { userId: req.user.id },
      _count: {
        id: true,
      },
    }),
  ]);

  const stats = {
    total: totalNotifications,
    unread: unreadNotifications,
    typeBreakdown: typeBreakdown.map((type: any) => ({
      type: type.type,
      count: type._count.id,
    })),
  };

  res.json({
    status: 'success',
    data: { stats },
  });
});

// @desc    Send bulk notifications
// @route   POST /api/v1/notifications/bulk
// @access  Private/Admin
export const sendBulkNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { userIds, type, title, message, data, actionUrl } = req.body;

  if (req.user.role !== 'admin') {
    throw new AppError('Not authorized to send bulk notifications', 403);
  }

  const notifications = await Promise.all(
    userIds.map((userId: string) =>
      prisma.notification.create({
        data: {
          userId,
          type,
          title,
          message,
          data,
          actionUrl,
        },
      })
    )
  );

  // Emit real-time notifications
  userIds.forEach((userId: string) => {
    const userNotification = notifications.find(n => n.userId === userId);
    if (userNotification) {
      socketEmitter.toUser(userId, 'notification:new', userNotification);
    }
  });

  res.status(201).json({
    status: 'success',
    data: {
      notifications,
      count: notifications.length,
    },
  });
});

// Helper functions for creating notifications
export const createNotificationHelper = async (
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  data?: any,
  actionUrl?: string
) => {
  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      data,
      actionUrl: actionUrl || null,
    },
  });

  // Emit real-time notification
  socketEmitter.toUser(userId, 'notification:new', notification);

  return notification;
};

export const createTeamNotification = async (
  teamId: string,
  type: string,
  title: string,
  message: string,
  data?: any,
  actionUrl?: string
) => {
  const teamMembers = await prisma.user.findMany({
    where: { teamId },
    select: { id: true },
  });

  const notifications = await Promise.all(
    teamMembers.map((member: any) =>
      prisma.notification.create({
        data: {
          userId: member.id,
          type: type as any,
          title,
          message,
          data,
          actionUrl,
        },
      })
    )
  );

  // Emit real-time notifications to team
  socketEmitter.toTeam(teamId, 'notification:new', {
    type,
    title,
    message,
    data,
    actionUrl,
  });

  return notifications;
};