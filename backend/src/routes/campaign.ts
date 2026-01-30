import express from 'express';
import {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getCampaignAnalytics,
  addPostToCampaign,
  removePostFromCampaign,
} from '../controllers/campaignController';
import { authenticate } from '../middleware/auth';
import {
  validateCampaignCreation,
  validateObjectId,
  handleValidationErrors,
} from '../middleware/validation';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Campaign CRUD routes
router.get('/', getCampaigns);
router.get('/:id', validateObjectId, handleValidationErrors, getCampaign);
router.post('/', validateCampaignCreation, handleValidationErrors, createCampaign);
router.put('/:id', validateObjectId, handleValidationErrors, updateCampaign);
router.delete('/:id', validateObjectId, handleValidationErrors, deleteCampaign);

// Campaign analytics
router.get('/:id/analytics', validateObjectId, handleValidationErrors, getCampaignAnalytics);

// Campaign posts management
router.post('/:id/posts', validateObjectId, handleValidationErrors, addPostToCampaign);
router.delete('/:id/posts/:postId', validateObjectId, handleValidationErrors, removePostFromCampaign);

export default router;