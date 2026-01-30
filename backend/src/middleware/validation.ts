import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { AppError } from './errorHandler';

// Validation error handler
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return next(new AppError(`Validation Error: ${errorMessages.join(', ')}`, 400));
  }
  next();
};

// User validation rules
export const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('role')
    .optional()
    .isIn(['user', 'admin', 'manager'])
    .withMessage('Role must be user, admin, or manager'),
];

export const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const validatePasswordReset = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
];

export const validatePasswordUpdate = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

// Post validation rules
export const validatePostCreation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Content must be between 1 and 5000 characters'),
  body('platforms')
    .isArray({ min: 1 })
    .withMessage('At least one platform must be selected'),
  body('platforms.*')
    .isIn(['facebook', 'twitter', 'linkedin', 'instagram', 'tiktok', 'youtube'])
    .withMessage('Invalid platform selected'),
  body('scheduledAt')
    .optional()
    .isISO8601()
    .withMessage('Scheduled date must be a valid ISO 8601 date'),
  body('mediaUrls')
    .optional()
    .isArray()
    .withMessage('Media URLs must be an array'),
  body('mediaUrls.*')
    .optional()
    .isURL()
    .withMessage('Each media URL must be a valid URL'),
];

export const validatePostUpdate = [
  body('content')
    .optional()
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Content must be between 1 and 5000 characters'),
  body('platforms')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one platform must be selected'),
  body('platforms.*')
    .optional()
    .isIn(['facebook', 'twitter', 'linkedin', 'instagram', 'tiktok', 'youtube'])
    .withMessage('Invalid platform selected'),
  body('scheduledAt')
    .optional()
    .isISO8601()
    .withMessage('Scheduled date must be a valid ISO 8601 date'),
];

// Team validation rules
export const validateTeamCreation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Team name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
];

export const validateTeamInvitation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('role')
    .isIn(['member', 'admin'])
    .withMessage('Role must be member or admin'),
];

// Campaign validation rules
export const validateCampaignCreation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Campaign name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('goals')
    .optional()
    .isObject()
    .withMessage('Goals must be an object'),
  body('budget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Budget must be a positive number'),
];

// Content validation rules
export const validateContentUpload = [
  body('folderId')
    .optional()
    .isUUID()
    .withMessage('Folder ID must be a valid UUID'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Each tag must be less than 50 characters'),
];

// Analytics validation rules
export const validateAnalyticsQuery = [
  query('platform')
    .optional()
    .isIn(['facebook', 'twitter', 'linkedin', 'instagram', 'tiktok', 'youtube'])
    .withMessage('Invalid platform'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
    .custom((endDate, { req }) => {
      if (req.query && req.query.startDate && new Date(endDate) <= new Date(req.query.startDate as string)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  query('period')
    .optional()
    .isIn(['day', 'week', 'month', 'year'])
    .withMessage('Period must be day, week, month, or year'),
];

// Platform validation rules
export const validatePlatformConnection = [
  body('platform')
    .isIn(['facebook', 'twitter', 'linkedin', 'instagram', 'tiktok', 'youtube'])
    .withMessage('Invalid platform'),
  body('accessToken')
    .notEmpty()
    .withMessage('Access token is required'),
  body('refreshToken')
    .optional()
    .notEmpty()
    .withMessage('Refresh token cannot be empty if provided'),
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('Expiration date must be a valid ISO 8601 date'),
];

// Notification validation rules
export const validateNotificationCreation = [
  body('type')
    .isIn(['info', 'success', 'warning', 'error'])
    .withMessage('Type must be info, success, warning, or error'),
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('message')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Message must be between 1 and 500 characters'),
  body('actionUrl')
    .optional()
    .isURL()
    .withMessage('Action URL must be a valid URL'),
];

// General validation rules
export const validateObjectId = [
  param('id')
    .isUUID()
    .withMessage('Invalid ID format'),
];

export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .matches(/^[-+]?[a-zA-Z_]+$/)
    .withMessage('Invalid sort parameter'),
];