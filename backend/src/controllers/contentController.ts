import { Response } from 'express';
import { prisma } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { config } from '../config/environment';

// @desc    Get user's content library
// @route   GET /api/v1/content
// @access  Private
export const getContent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const {
    type,
    folderId,
    search,
    sortBy = 'uploadedAt',
    sortOrder = 'desc',
  } = req.query;

  const where: any = {
    userId: req.user.id,
  };

  if (type) where.type = type;
  if (folderId) where.folderId = folderId;
  if (search) {
    where.OR = [
      { fileName: { contains: search, mode: 'insensitive' } },
      { tags: { hasSome: [search] } },
    ];
  }

  // Include team content if user is in a team
  if (req.user.teamId) {
    where.OR = [
      { userId: req.user.id },
      { teamId: req.user.teamId },
    ];
  }

  const content = await prisma.content.findMany({
    where,
    skip,
    take: limit,
    include: {
      folder: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      [sortBy as string]: sortOrder,
    },
  });

  const total = await prisma.content.count({ where });

  res.json({
    status: 'success',
    data: {
      content,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Upload content
// @route   POST /api/v1/content/upload
// @access  Private
export const uploadContent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    fileName,
    fileSize,
    mimeType,
    url,
    thumbnailUrl,
    width,
    height,
    duration,
    tags,
    folderId,
  } = req.body;

  // Validate file size
  if (fileSize > config.upload.maxSize) {
    throw new AppError(`File size exceeds maximum limit of ${config.upload.maxSize} bytes`, 400);
  }

  // Validate file type
  if (!config.upload.allowedTypes.includes(mimeType)) {
    throw new AppError('File type not allowed', 400);
  }

  // Determine content type
  let type: string;
  if (mimeType.startsWith('image/')) {
    type = 'IMAGE';
  } else if (mimeType.startsWith('video/')) {
    type = 'VIDEO';
  } else {
    type = 'DOCUMENT';
  }

  // Validate folder if provided
  if (folderId) {
    const folder = await prisma.contentFolder.findUnique({
      where: { id: folderId },
    });

    if (!folder || (folder.userId !== req.user.id && folder.teamId !== req.user.teamId)) {
      throw new AppError('Invalid folder', 400);
    }
  }

  const content = await prisma.content.create({
    data: {
      type: type as any,
      fileName,
      fileSize,
      mimeType,
      url,
      thumbnailUrl,
      width,
      height,
      duration,
      tags: tags || [],
      folderId,
      userId: req.user.id,
      teamId: req.user.teamId,
    },
    include: {
      folder: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  res.status(201).json({
    status: 'success',
    data: { content },
  });
});

// @desc    Update content
// @route   PUT /api/v1/content/:id
// @access  Private
export const updateContent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const content = await prisma.content.findUnique({
    where: { id: req.params.id },
  });

  if (!content) {
    throw new AppError('Content not found', 404);
  }

  // Check permissions
  if (content.userId !== req.user.id && content.teamId !== req.user.teamId && req.user.role !== 'admin') {
    throw new AppError('Not authorized to update this content', 403);
  }

  const { tags, folderId } = req.body;

  // Validate folder if provided
  if (folderId) {
    const folder = await prisma.contentFolder.findUnique({
      where: { id: folderId },
    });

    if (!folder || (folder.userId !== req.user.id && folder.teamId !== req.user.teamId)) {
      throw new AppError('Invalid folder', 400);
    }
  }

  const updatedContent = await prisma.content.update({
    where: { id: req.params.id },
    data: {
      ...(tags !== undefined && { tags }),
      ...(folderId !== undefined && { folderId }),
    },
    include: {
      folder: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  res.json({
    status: 'success',
    data: { content: updatedContent },
  });
});

// @desc    Delete content
// @route   DELETE /api/v1/content/:id
// @access  Private
export const deleteContent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const content = await prisma.content.findUnique({
    where: { id: req.params.id },
  });

  if (!content) {
    throw new AppError('Content not found', 404);
  }

  // Check permissions
  if (content.userId !== req.user.id && content.teamId !== req.user.teamId && req.user.role !== 'admin') {
    throw new AppError('Not authorized to delete this content', 403);
  }

  await prisma.content.delete({
    where: { id: req.params.id },
  });

  res.json({
    status: 'success',
    message: 'Content deleted successfully',
  });
});

// @desc    Get content folders
// @route   GET /api/v1/content/folders
// @access  Private
export const getContentFolders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const folders = await prisma.contentFolder.findMany({
    where: {
      OR: [
        { userId: req.user.id },
        { teamId: req.user.teamId },
      ],
    },
    include: {
      _count: {
        select: {
          content: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  // Build folder tree structure
  const folderTree = buildFolderTree(folders);

  res.json({
    status: 'success',
    data: { folders: folderTree },
  });
});

// @desc    Create content folder
// @route   POST /api/v1/content/folders
// @access  Private
export const createContentFolder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, parentId, type = 'CUSTOM' } = req.body;

  // Validate parent folder if provided
  if (parentId) {
    const parentFolder = await prisma.contentFolder.findUnique({
      where: { id: parentId },
    });

    if (!parentFolder || (parentFolder.userId !== req.user.id && parentFolder.teamId !== req.user.teamId)) {
      throw new AppError('Invalid parent folder', 400);
    }
  }

  const folder = await prisma.contentFolder.create({
    data: {
      name,
      type,
      parentId,
      userId: req.user.id,
      teamId: req.user.teamId,
    },
    include: {
      _count: {
        select: {
          content: true,
        },
      },
    },
  });

  res.status(201).json({
    status: 'success',
    data: { folder },
  });
});

// @desc    Update content folder
// @route   PUT /api/v1/content/folders/:id
// @access  Private
export const updateContentFolder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const folder = await prisma.contentFolder.findUnique({
    where: { id: req.params.id },
  });

  if (!folder) {
    throw new AppError('Folder not found', 404);
  }

  // Check permissions
  if (folder.userId !== req.user.id && folder.teamId !== req.user.teamId && req.user.role !== 'admin') {
    throw new AppError('Not authorized to update this folder', 403);
  }

  const { name } = req.body;

  const updatedFolder = await prisma.contentFolder.update({
    where: { id: req.params.id },
    data: { name },
    include: {
      _count: {
        select: {
          content: true,
        },
      },
    },
  });

  res.json({
    status: 'success',
    data: { folder: updatedFolder },
  });
});

// @desc    Delete content folder
// @route   DELETE /api/v1/content/folders/:id
// @access  Private
export const deleteContentFolder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const folder = await prisma.contentFolder.findUnique({
    where: { id: req.params.id },
    include: {
      _count: {
        select: {
          content: true,
        },
      },
    },
  });

  if (!folder) {
    throw new AppError('Folder not found', 404);
  }

  // Check permissions
  if (folder.userId !== req.user.id && folder.teamId !== req.user.teamId && req.user.role !== 'admin') {
    throw new AppError('Not authorized to delete this folder', 403);
  }

  // Check if folder has content
  if (folder._count.content > 0) {
    throw new AppError('Cannot delete folder with content. Move or delete content first.', 400);
  }

  await prisma.contentFolder.delete({
    where: { id: req.params.id },
  });

  res.json({
    status: 'success',
    message: 'Folder deleted successfully',
  });
});

// @desc    Get content usage statistics
// @route   GET /api/v1/content/stats
// @access  Private
export const getContentStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const where: any = {
    userId: req.user.id,
  };

  // Include team content if user is in a team
  if (req.user.teamId) {
    where.OR = [
      { userId: req.user.id },
      { teamId: req.user.teamId },
    ];
  }

  const [
    totalFiles,
    totalSize,
    typeBreakdown,
    recentUploads,
  ] = await Promise.all([
    prisma.content.count({ where }),
    prisma.content.aggregate({
      where,
      _sum: {
        fileSize: true,
      },
    }),
    prisma.content.groupBy({
      by: ['type'],
      where,
      _count: {
        id: true,
      },
      _sum: {
        fileSize: true,
      },
    }),
    prisma.content.findMany({
      where,
      orderBy: { uploadedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        fileName: true,
        type: true,
        fileSize: true,
        uploadedAt: true,
      },
    }),
  ]);

  const stats = {
    totalFiles,
    totalSize: totalSize._sum.fileSize || 0,
    typeBreakdown: typeBreakdown.map((type: any) => ({
      type: type.type,
      count: type._count.id,
      size: type._sum.fileSize || 0,
    })),
    recentUploads,
  };

  res.json({
    status: 'success',
    data: { stats },
  });
});

// Helper function to build folder tree
function buildFolderTree(folders: any[]): any[] {
  const folderMap = new Map();
  const rootFolders: any[] = [];

  // Create folder map
  folders.forEach(folder => {
    folderMap.set(folder.id, { ...folder, children: [] });
  });

  // Build tree structure
  folders.forEach(folder => {
    const folderNode = folderMap.get(folder.id);

    if (folder.parentId) {
      const parent = folderMap.get(folder.parentId);
      if (parent) {
        parent.children.push(folderNode);
      }
    } else {
      rootFolders.push(folderNode);
    }
  });

  return rootFolders;
}