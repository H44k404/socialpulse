import express from 'express';
import {
  getContent,
  uploadContent,
  updateContent,
  deleteContent,
  getContentFolders,
  createContentFolder,
  updateContentFolder,
  deleteContentFolder,
  getContentStats,
} from '../controllers/contentController';
import { authenticate } from '../middleware/auth';
import { validateObjectId, handleValidationErrors } from '../middleware/validation';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Content CRUD routes
router.get('/', getContent);
router.post('/upload', uploadContent);
router.put('/:id', validateObjectId, handleValidationErrors, updateContent);
router.delete('/:id', validateObjectId, handleValidationErrors, deleteContent);

// Content folders
router.get('/folders', getContentFolders);
router.post('/folders', createContentFolder);
router.put('/folders/:id', validateObjectId, handleValidationErrors, updateContentFolder);
router.delete('/folders/:id', validateObjectId, handleValidationErrors, deleteContentFolder);

// Content statistics
router.get('/stats', getContentStats);

export default router;