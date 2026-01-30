import { Server as SocketServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from './environment';
import { prisma } from './database';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  teamId?: string;
}

let io: SocketServer;

export function initializeSocket(socketIo: SocketServer): void {
  io = socketIo;
  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
      socket.userId = decoded.userId;

      // Get user's team if they belong to one
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { teamId: true },
      });

      if (user?.teamId) {
        socket.teamId = user.teamId;
      }

      next();
    } catch (error) {
      next(new Error('Invalid authentication token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`🔌 User connected: ${socket.userId}`);

    // Join user-specific room
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    // Join team room if user belongs to a team
    if (socket.teamId) {
      socket.join(`team:${socket.teamId}`);
    }

    // Join general notifications room
    socket.join('notifications');

    // Handle real-time events
    socket.on('join:team', (teamId: string) => {
      socket.join(`team:${teamId}`);
    });

    socket.on('leave:team', (teamId: string) => {
      socket.leave(`team:${teamId}`);
    });

    socket.on('join:campaign', (campaignId: string) => {
      socket.join(`campaign:${campaignId}`);
    });

    socket.on('leave:campaign', (campaignId: string) => {
      socket.leave(`campaign:${campaignId}`);
    });

    // Typing indicators
    socket.on('typing:start', (data: { room: string; userId: string; username: string }) => {
      socket.to(data.room).emit('typing:start', {
        userId: data.userId,
        username: data.username,
      });
    });

    socket.on('typing:stop', (data: { room: string; userId: string }) => {
      socket.to(data.room).emit('typing:stop', {
        userId: data.userId,
      });
    });

    // Real-time post updates
    socket.on('post:subscribe', (postId: string) => {
      socket.join(`post:${postId}`);
    });

    socket.on('post:unsubscribe', (postId: string) => {
      socket.leave(`post:${postId}`);
    });

    // Analytics real-time updates
    socket.on('analytics:subscribe', (platform: string) => {
      socket.join(`analytics:${platform}:${socket.userId}`);
    });

    socket.on('analytics:unsubscribe', (platform: string) => {
      socket.leave(`analytics:${platform}:${socket.userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.userId}`);
    });
  });
}

// Helper functions for emitting events
export const socketEmitter = {
  // User-specific notifications
  toUser: (userId: string, event: string, data: any) => {
    io.to(`user:${userId}`).emit(event, data);
  },

  // Team-wide notifications
  toTeam: (teamId: string, event: string, data: any) => {
    io.to(`team:${teamId}`).emit(event, data);
  },

  // Campaign-specific updates
  toCampaign: (campaignId: string, event: string, data: any) => {
    io.to(`campaign:${campaignId}`).emit(event, data);
  },

  // Post-specific updates
  toPost: (postId: string, event: string, data: any) => {
    io.to(`post:${postId}`).emit(event, data);
  },

  // Platform analytics updates
  toAnalytics: (platform: string, userId: string, event: string, data: any) => {
    io.to(`analytics:${platform}:${userId}`).emit(event, data);
  },

  // Global notifications
  broadcast: (event: string, data: any) => {
    io.emit(event, data);
  },

  // Notification broadcasts
  notify: (event: string, data: any) => {
    io.to('notifications').emit(event, data);
  },
};

export const getSocketIO = () => io;
export default getSocketIO;