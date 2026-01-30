import express from 'express';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  publishPost,
  getPostAnalytics,
} from '../controllers/postController';
import { authenticate } from '../middleware/auth';
import {
  validatePostCreation,
  validatePostUpdate,
  validateObjectId,
  validatePagination,
  handleValidationErrors,
} from '../middleware/validation';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Post CRUD routes
router.get('/', validatePagination, handleValidationErrors, getPosts);
router.get('/:id', validateObjectId, handleValidationErrors, getPost);
router.post('/', validatePostCreation, handleValidationErrors, createPost);
router.put('/:id', validateObjectId, validatePostUpdate, handleValidationErrors, updatePost);
router.delete('/:id', validateObjectId, handleValidationErrors, deletePost);

// Post actions
router.post('/:id/publish', validateObjectId, handleValidationErrors, publishPost);
router.get('/:id/analytics', validateObjectId, handleValidationErrors, getPostAnalytics);

export default router;