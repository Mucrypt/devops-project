import express, { Router, Response, NextFunction } from 'express';
import { protect } from '../middleware/auth.middleware';
import { validate, deploymentSchema } from '../middleware/validator';
import { AuthRequest, ApiResponse } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import Deployment from '../models/Deployment.model';
import Project from '../models/Project.model';
import { AppError } from '../utils/appError';

const router: Router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Create new deployment
// @route   POST /api/deployments
// @access  Private
const createDeployment = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { projectId, provider, configuration } = req.body;
    
    // Verify project
    const project = await Project.findOne({
      _id: projectId,
      userId: req.user?._id,
    });
    
    if (!project) {
      return next(new AppError('Project not found', 404));
    }
    
    // Create deployment
    const deployment = await Deployment.create({
      projectId,
      userId: req.user?._id,
      provider,
      configuration,
      status: 'pending',
    });
    
    // Update project status
    project.status = 'building';
    await project.save();
    
    // Here you would trigger actual deployment process
    // For now, simulate it
    setTimeout(async () => {
      deployment.status = 'deployed';
      deployment.url = `https://${project.name.toLowerCase()}.${provider}.app`;
      deployment.deploymentId = `dep_${Date.now()}`;
      await deployment.save();
      
      project.status = 'deployed';
      project.deployment = {
        url: deployment.url,
        provider,
        deploymentId: deployment.deploymentId,
        lastDeployedAt: new Date(),
      };
      await project.save();
    }, 5000);
    
    const response: ApiResponse = {
      success: true,
      message: 'Deployment initiated successfully',
      data: { deployment },
    };
    
    res.status(201).json(response);
  }
);

// @desc    Get all deployments
// @route   GET /api/deployments
// @access  Private
const getDeployments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { projectId, status, page = 1, limit = 10 } = req.query;
  
  const query: any = { userId: req.user?._id };
  if (projectId) query.projectId = projectId;
  if (status) query.status = status;
  
  const skip = (Number(page) - 1) * Number(limit);
  
  const deployments = await Deployment.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('projectId', 'name type');
    
  const total = await Deployment.countDocuments(query);
  
  const response: ApiResponse = {
    success: true,
    data: { deployments },
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
  };
  
  res.json(response);
});

// @desc    Get single deployment
// @route   GET /api/deployments/:id
// @access  Private
const getDeployment = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const deployment = await Deployment.findOne({
      _id: req.params.id,
      userId: req.user?._id,
    }).populate('projectId', 'name type');
    
    if (!deployment) {
      return next(new AppError('Deployment not found', 404));
    }
    
    const response: ApiResponse = {
      success: true,
      data: { deployment },
    };
    
    res.json(response);
  }
);

// @desc    Cancel deployment
// @route   POST /api/deployments/:id/cancel
// @access  Private
const cancelDeployment = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const deployment = await Deployment.findOne({
      _id: req.params.id,
      userId: req.user?._id,
    });
    
    if (!deployment) {
      return next(new AppError('Deployment not found', 404));
    }
    
    if (!['pending', 'building'].includes(deployment.status)) {
      return next(new AppError('Cannot cancel deployment in current state', 400));
    }
    
    deployment.status = 'cancelled';
    await deployment.save();
    
    const response: ApiResponse = {
      success: true,
      message: 'Deployment cancelled successfully',
      data: { deployment },
    };
    
    res.json(response);
  }
);

// @desc    Get deployment logs
// @route   GET /api/deployments/:id/logs
// @access  Private
const getDeploymentLogs = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const deployment = await Deployment.findOne({
      _id: req.params.id,
      userId: req.user?._id,
    });
    
    if (!deployment) {
      return next(new AppError('Deployment not found', 404));
    }
    
    const response: ApiResponse = {
      success: true,
      data: {
        logs: deployment.buildLogs || [],
        status: deployment.status,
      },
    };
    
    res.json(response);
  }
);

// Routes
router.post('/', validate(deploymentSchema), createDeployment);
router.get('/', getDeployments);
router.get('/:id', getDeployment);
router.post('/:id/cancel', cancelDeployment);
router.get('/:id/logs', getDeploymentLogs);

export default router;
