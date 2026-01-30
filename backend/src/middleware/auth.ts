import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { prisma } from '../config/database';
import { AppError } from './errorHandler';
import { Role } from '@prisma/client';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
        teamId?: string;
      };
    }
  }
}

export interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role | string | any;
    teamId?: string;
  };
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check for token in header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check for token in cookies
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret) as {
        id: string;
        iat: number;
        exp: number;
      };

      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          teamId: true,
          isActive: true,
        },
      });

      if (!user) {
        return next(new AppError('User not found', 401));
      }

      if (!user.isActive) {
        return next(new AppError('User account is deactivated', 401));
      }

      req.user = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        teamId: user.teamId || undefined,
      };

      next();
    } catch (error) {
      return next(new AppError('Not authorized to access this route', 401));
    }
  } catch (error) {
    next(error);
  }
};

// Role-based authorization
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }

    next();
  };
};

// Team membership check
export const requireTeamMembership = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { teamId: true },
    });

    if (!user?.teamId) {
      return next(new AppError('User is not a member of any team', 403));
    }

    req.user.teamId = user.teamId;
    next();
  } catch (error) {
    next(error);
  }
};

// Resource ownership check
export const requireOwnership = (resourceField: string = 'userId') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        return next(new AppError('User not authenticated', 401));
      }

      const resourceId = req.params.id;
      if (!resourceId) {
        return next(new AppError('Resource ID is required', 400));
      }

      // This would need to be implemented based on the specific resource
      // For now, we'll assume the resource has a userId field
      const resource = await prisma.post.findUnique({
        where: { id: resourceId },
        select: { userId: true },
      });

      if (!resource) {
        return next(new AppError('Resource not found', 404));
      }

      if (resource.userId !== req.user.id) {
        return next(new AppError('Not authorized to access this resource', 403));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Optional authentication (for public routes that benefit from user context)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, config.jwt.secret) as {
          id: string;
        };

        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            teamId: true,
            isActive: true,
          },
        });

        if (user && user.isActive) {
          req.user = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            teamId: user.teamId || undefined,
          };
        }
      } catch (error) {
        // Silently fail for optional auth
      }
    }

    next();
  } catch (error) {
    next();
  }
};