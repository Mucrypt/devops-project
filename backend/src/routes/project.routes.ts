import express, { Router, Response, NextFunction } from 'express';
import { protect } from '../middleware/auth.middleware';
import { validate, projectSchema } from '../middleware/validator';
import { AuthRequest, ApiResponse } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import Project from '../models/Project.model';
import { AppError } from '../utils/appError';

const router: Router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const projectData = {
    ...req.body,
    userId: req.user?._id,
  };
  
  const project = await Project.create(projectData);
  
  const response: ApiResponse = {
    success: true,
    message: 'Project created successfully',
    data: { project },
  };
  
  res.status(201).json(response);
});

// @desc    Get all user projects
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, type, page = 1, limit = 10 } = req.query;
  
  const query: any = { userId: req.user?._id };
  
  if (status) query.status = status;
  if (type) query.type = type;
  
  const skip = (Number(page) - 1) * Number(limit);
  
  const projects = await Project.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('chatHistory');
    
  const total = await Project.countDocuments(query);
  
  const response: ApiResponse = {
    success: true,
    data: { projects },
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
  };
  
  res.json(response);
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user?._id,
    }).populate('chatHistory');
    
    if (!project) {
      return next(new AppError('Project not found', 404));
    }
    
    const response: ApiResponse = {
      success: true,
      data: { project },
    };
    
    res.json(response);
  }
);

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return next(new AppError('Project not found', 404));
    }
    
    const response: ApiResponse = {
      success: true,
      message: 'Project updated successfully',
      data: { project },
    };
    
    res.json(response);
  }
);

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?._id,
    });
    
    if (!project) {
      return next(new AppError('Project not found', 404));
    }
    
    const response: ApiResponse = {
      success: true,
      message: 'Project deleted successfully',
    };
    
    res.json(response);
  }
);

// @desc    Get project stats
// @route   GET /api/projects/:id/stats
// @access  Private
const getProjectStats = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user?._id,
    }).populate('chatHistory');
    
    if (!project) {
      return next(new AppError('Project not found', 404));
    }
    
    const stats = {
      totalChats: project.chatHistory.length,
      status: project.status,
      type: project.type,
      deploymentStatus: project.deployment?.url ? 'deployed' : 'not deployed',
      lastUpdated: project.updatedAt,
    };
    
    const response: ApiResponse = {
      success: true,
      data: { stats },
    };
    
    res.json(response);
  }
);

// Routes
router.post('/', validate(projectSchema), createProject);
router.get('/', getProjects);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.get('/:id/stats', getProjectStats);

export default router;
