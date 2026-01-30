import express from 'express';
import {
  getPlatformConnections,
  connectPlatform,
  updatePlatformConnection,
  disconnectPlatform,
  syncPlatformData,
  getPlatformAccountInfo,
  getAvailablePlatforms,
} from '../controllers/platformController';
import { authenticate } from '../middleware/auth';
import {
  validatePlatformConnection,
  validateObjectId,
  handleValidationErrors,
} from '../middleware/validation';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Platform routes
router.get('/available', getAvailablePlatforms);
router.get('/connections', getPlatformConnections);
router.post('/connect', validatePlatformConnection, handleValidationErrors, connectPlatform);
router.put('/connections/:id', validateObjectId, handleValidationErrors, updatePlatformConnection);
router.delete('/connections/:id', validateObjectId, handleValidationErrors, disconnectPlatform);
router.post('/sync/:id', validateObjectId, handleValidationErrors, syncPlatformData);
router.get('/:platform/account', getPlatformAccountInfo);

export default router;