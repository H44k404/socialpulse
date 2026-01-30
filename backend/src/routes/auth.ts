import express from 'express';
import {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  verifyEmail,
  getMe,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import {
  validateUserRegistration,
  validateUserLogin,
  validatePasswordReset,
  validatePasswordUpdate,
  handleValidationErrors,
} from '../middleware/validation';

const router = express.Router();

// Public routes
router.post('/register', validateUserRegistration, handleValidationErrors, register);
router.post('/login', validateUserLogin, handleValidationErrors, login);
router.post('/refresh', refreshToken);
router.post('/forgot-password', validatePasswordReset, handleValidationErrors, forgotPassword);
router.put('/reset-password/:token', validatePasswordUpdate, handleValidationErrors, resetPassword);

// Protected routes
router.use(authenticate); // All routes below require authentication

router.post('/logout', logout);
router.put('/update-password', validatePasswordUpdate, handleValidationErrors, updatePassword);
router.post('/verify-email', verifyEmail);
router.get('/me', getMe);

export default router;