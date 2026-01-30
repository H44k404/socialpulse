import express from 'express';
import {
  getNotifications,
  getNotification,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationStats,
  sendBulkNotifications,
} from '../controllers/notificationController';
import { authenticate, authorize } from '../middleware/auth';
import {
  validateNotificationCreation,
  validateObjectId,
  handleValidationErrors,
} from '../middleware/validation';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Notification CRUD routes
router.get('/', getNotifications);
router.get('/stats', getNotificationStats);
router.get('/:id', validateObjectId, handleValidationErrors, getNotification);
router.post('/', authorize('admin'), validateNotificationCreation, handleValidationErrors, createNotification);
router.put('/:id/read', validateObjectId, handleValidationErrors, markAsRead);
router.put('/read-all', markAllAsRead);
router.delete('/:id', validateObjectId, handleValidationErrors, deleteNotification);

// Admin routes
router.post('/bulk', authorize('admin'), sendBulkNotifications);

export default router;