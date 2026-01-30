import { Response } from 'express';
import { prisma } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { sendTeamInvitationEmail } from '../utils/email';

// @desc    Get user's team
// @route   GET /api/v1/teams/my-team
// @access  Private
export const getMyTeam = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user.teamId) {
    return res.json({
      status: 'success',
      data: { team: null },
    });
  }

  const team = await prisma.team.findUnique({
    where: { id: req.user.teamId },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              avatar: true,
              isActive: true,
            }
          }
        },
        orderBy: { joinedAt: 'asc' },
      },
      _count: {
        select: {
          members: true,
          posts: true,
          campaigns: true,
        },
      },
    },
  });

  if (!team) {
    throw new AppError('Team not found', 404);
  }

  res.json({
    status: 'success',
    data: { team },
  });
});

// @desc    Create a new team
// @route   POST /api/v1/teams
// @access  Private
export const createTeam = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, description } = req.body;

  // Check if user is already in a team
  if (req.user.teamId) {
    throw new AppError('User is already a member of a team', 400);
  }

  const team = await prisma.team.create({
    data: {
      name,
      description,
      ownerId: req.user.id,
      members: {
        connect: { id: req.user.id },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              avatar: true,
            }
          }
        },
      },
    },
  });

  // Update user's teamId
  await prisma.user.update({
    where: { id: req.user.id },
    data: { teamId: team.id },
  });

  res.status(201).json({
    status: 'success',
    data: { team },
  });
});

// @desc    Update team
// @route   PUT /api/v1/teams/:id
// @access  Private
export const updateTeam = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError('Team ID is required', 400);
  }

  const team = await prisma.team.findUnique({
    where: { id },
  });

  if (!team) {
    throw new AppError('Team not found', 404);
  }

  // Check if user is team owner or admin
  if (team.ownerId !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized to update this team', 403);
  }

  const { name, description } = req.body;

  const updatedTeam = await prisma.team.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(description !== undefined && { description }),
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              avatar: true,
            }
          }
        },
      },
    },
  });

  res.json({
    status: 'success',
    data: { team: updatedTeam },
  });
});

// @desc    Invite user to team
// @route   POST /api/v1/teams/:id/invite
// @access  Private
export const inviteToTeam = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError('Team ID is required', 400);
  }

  const { email, role = 'member' } = req.body;

  const team = await prisma.team.findUnique({
    where: { id },
  });

  if (!team) {
    throw new AppError('Team not found', 404);
  }

  // Check if user can invite to this team
  if (team.ownerId !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized to invite to this team', 403);
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check if user is already in a team
  if (user.teamId) {
    throw new AppError('User is already a member of a team', 400);
  }

  // Create invitation
  const invitation = await prisma.teamInvite.create({
    data: {
      teamId: id,
      invitedById: req.user.id,
      email,
      role,
      token: Math.random().toString(36).substring(2),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  // Send invitation email
  try {
    await sendTeamInvitationEmail(
      user.email,
      team.name,
      req.user.firstName + ' ' + req.user.lastName,
      invitation.id
    );
  } catch (error) {
    console.error('Failed to send invitation email:', error);
  }

  res.json({
    status: 'success',
    message: 'Invitation sent successfully',
    data: { invitation },
  });
});

// @desc    Accept team invitation
// @route   POST /api/v1/teams/invitations/:invitationId/accept
// @access  Private
export const acceptInvitation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { invitationId } = req.params;
  if (!invitationId) {
    throw new AppError('Invitation ID is required', 400);
  }

  const invitation = await prisma.teamInvite.findUnique({
    where: { id: invitationId },
    include: {
      team: true,
      invitedBy: true,
    },
  });

  if (!invitation) {
    throw new AppError('Invitation not found', 404);
  }

  if (invitation.invitedById !== req.user.id) {
    throw new AppError('Not authorized to accept this invitation', 403);
  }

  if (invitation.status !== 'PENDING') {
    throw new AppError('Invitation has already been processed', 400);
  }

  if (invitation.expiresAt < new Date()) {
    throw new AppError('Invitation has expired', 400);
  }

  // Check if user is already in a team
  if (req.user.teamId) {
    throw new AppError('You are already a member of a team', 400);
  }

  // Add user to team
  await prisma.team.update({
    where: { id: invitation.teamId },
    data: {
      members: {
        connect: { id: req.user.id },
      },
    },
  });

  // Update user's teamId
  await prisma.user.update({
    where: { id: req.user.id },
    data: { teamId: invitation.teamId },
  });

  // Update invitation status
  await prisma.teamInvite.update({
    where: { id: invitationId },
    data: { status: 'ACCEPTED' },
  });

  res.json({
    status: 'success',
    message: 'Successfully joined the team',
    data: { team: invitation.team },
  });
});

// @desc    Decline team invitation
// @route   POST /api/v1/teams/invitations/:invitationId/decline
// @access  Private
export const declineInvitation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { invitationId } = req.params;
  if (!invitationId) {
    throw new AppError('Invitation ID is required', 400);
  }

  const invitation = await prisma.teamInvite.findUnique({
    where: { id: invitationId },
  });

  if (!invitation) {
    throw new AppError('Invitation not found', 404);
  }

  if (invitation.invitedById !== req.user.id) {
    throw new AppError('Not authorized to decline this invitation', 403);
  }

  if (invitation.status !== 'PENDING') {
    throw new AppError('Invitation has already been processed', 400);
  }

  // Update invitation status
  await prisma.teamInvite.update({
    where: { id: invitationId },
    data: { status: 'DECLINED' },
  });

  res.json({
    status: 'success',
    message: 'Invitation declined',
  });
});

// @desc    Remove member from team
// @route   DELETE /api/v1/teams/:id/members/:memberId
// @access  Private
export const removeMember = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: teamId, memberId } = req.params;

  const team = await prisma.team.findUnique({
    where: { id: teamId },
  });

  if (!team) {
    throw new AppError('Team not found', 404);
  }

  // Check if user can remove members
  if (team.ownerId !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized to remove team members', 403);
  }

  // Cannot remove team owner
  if (memberId === team.ownerId) {
    throw new AppError('Cannot remove team owner', 400);
  }

  // Remove user from team
  await prisma.team.update({
    where: { id: teamId },
    data: {
      members: {
        disconnect: { id: memberId },
      },
    },
  });

  // Update user's teamId
  await prisma.user.update({
    where: { id: memberId },
    data: { teamId: null },
  });

  res.json({
    status: 'success',
    message: 'Member removed from team',
  });
});

// @desc    Leave team
// @route   POST /api/v1/teams/:id/leave
// @access  Private
export const leaveTeam = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError('Team ID is required', 400);
  }

  const team = await prisma.team.findUnique({
    where: { id },
  });

  if (!team) {
    throw new AppError('Team not found', 404);
  }

  if (req.user.teamId !== id) {
    throw new AppError('You are not a member of this team', 400);
  }

  // Cannot leave if you are the owner
  if (team.ownerId === req.user.id) {
    throw new AppError('Team owner cannot leave the team. Transfer ownership first or delete the team.', 400);
  }

  // Remove user from team
  await prisma.team.update({
    where: { id },
    data: {
      members: {
        disconnect: { id: req.user.id },
      },
    },
  });

  // Update user's teamId
  await prisma.user.update({
    where: { id: req.user.id },
    data: { teamId: null },
  });

  res.json({
    status: 'success',
    message: 'Successfully left the team',
  });
});

// @desc    Get team invitations
// @route   GET /api/v1/teams/invitations
// @access  Private
export const getTeamInvitations = asyncHandler(async (req: AuthRequest, res: Response) => {
  const invitations = await prisma.teamInvite.findMany({
    where: {
      invitedById: req.user.id,
      status: 'PENDING',
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      team: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
      invitedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({
    status: 'success',
    data: { invitations },
  });
});

// @desc    Get team statistics
// @route   GET /api/v1/teams/:id/stats
// @access  Private
export const getTeamStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError('Team ID is required', 400);
  }

  const team = await prisma.team.findUnique({
    where: { id },
  });

  if (!team) {
    throw new AppError('Team not found', 404);
  }

  // Check if user is team member
  if (req.user.teamId !== id && req.user.role !== 'admin') {
    throw new AppError('Not authorized to view team statistics', 403);
  }

  const [
    memberCount,
    postCount,
    campaignCount,
    totalEngagement,
  ] = await Promise.all([
    prisma.user.count({ where: { teamId: id, isActive: true } }),
    prisma.post.count({ where: { teamId: id } }),
    prisma.campaign.count({ where: { teamId: id } }),
    prisma.analytics.aggregate({
      where: { teamId: id },
      _sum: {
        likes: true,
        comments: true,
        shares: true,
        views: true,
      },
    }),
  ]);

  const stats = {
    members: memberCount,
    posts: postCount,
    campaigns: campaignCount,
    engagement: {
      likes: totalEngagement._sum.likes || 0,
      comments: totalEngagement._sum.comments || 0,
      shares: totalEngagement._sum.shares || 0,
      views: totalEngagement._sum.views || 0,
    },
  };

  res.json({
    status: 'success',
    data: { stats },
  });
});
