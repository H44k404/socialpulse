import express from 'express';
import {
  getMyTeam,
  createTeam,
  updateTeam,
  inviteToTeam,
  acceptInvitation,
  declineInvitation,
  removeMember,
  leaveTeam,
  getTeamInvitations,
  getTeamStats,
} from '../controllers/teamController';
import { authenticate } from '../middleware/auth';
import {
  validateTeamCreation,
  validateTeamInvitation,
  validateObjectId,
  handleValidationErrors,
} from '../middleware/validation';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Team CRUD routes
router.get('/my-team', getMyTeam);
router.post('/', validateTeamCreation, handleValidationErrors, createTeam);
router.put('/:id', validateObjectId, handleValidationErrors, updateTeam);

// Team member management
router.post('/:id/invite', validateObjectId, validateTeamInvitation, handleValidationErrors, inviteToTeam);
router.delete('/:id/members/:memberId', validateObjectId, handleValidationErrors, removeMember);
router.post('/:id/leave', validateObjectId, handleValidationErrors, leaveTeam);

// Team invitations
router.get('/invitations', getTeamInvitations);
router.post('/invitations/:invitationId/accept', validateObjectId, handleValidationErrors, acceptInvitation);
router.post('/invitations/:invitationId/decline', validateObjectId, handleValidationErrors, declineInvitation);

// Team statistics
router.get('/:id/stats', validateObjectId, handleValidationErrors, getTeamStats);

export default router;