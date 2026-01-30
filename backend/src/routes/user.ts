import express from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats,
  getUserTeamMembers,
} from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';
import { validateObjectId, handleValidationErrors } from '../middleware/validation';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Admin only routes
router.get('/', authorize('admin'), getUsers);

// User-specific routes
router.get('/:id', validateObjectId, handleValidationErrors, getUser);
router.put('/:id', validateObjectId, handleValidationErrors, updateUser);
router.delete('/:id', authorize('admin'), validateObjectId, handleValidationErrors, deleteUser);

// User statistics and team routes
router.get('/:id/stats', validateObjectId, handleValidationErrors, getUserStats);
router.get('/:id/team-members', validateObjectId, handleValidationErrors, getUserTeamMembers);

export default router;