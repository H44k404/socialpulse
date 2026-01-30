import express from 'express';
import {
  getAnalyticsOverview,
  getPlatformAnalytics,
  getPostPerformance,
  getAudienceAnalytics,
  getGrowthMetrics,
} from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';
import { validateAnalyticsQuery, handleValidationErrors } from '../middleware/validation';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Analytics routes
router.get('/overview', validateAnalyticsQuery, handleValidationErrors, getAnalyticsOverview);
router.get('/platforms/:platform', validateAnalyticsQuery, handleValidationErrors, getPlatformAnalytics);
router.get('/posts/performance', getPostPerformance);
router.get('/audience', validateAnalyticsQuery, handleValidationErrors, getAudienceAnalytics);
router.get('/growth', getGrowthMetrics);

export default router;