import express, { Router, Response } from 'express';
import { protect } from '../middleware/auth.middleware';
import { AuthRequest, ApiResponse, AnalyticsData } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import Project from '../models/Project.model';
import Deployment from '../models/Deployment.model';
import Chat from '../models/Chat.model';
import User from '../models/User.model';

const router: Router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get analytics overview
// @route   GET /api/analytics
// @access  Private
const getAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  
  const [totalProjects, totalDeployments, totalChats, user] = await Promise.all([
    Project.countDocuments({ userId }),
    Deployment.countDocuments({ userId }),
    Chat.countDocuments({ userId }),
    User.findById(userId),
  ]);
  
  const projectsByStatus = await Project.aggregate([
    { $match: { userId } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  
  const deploymentsByProvider = await Deployment.aggregate([
    { $match: { userId } },
    { $group: { _id: '$provider', count: { $sum: 1 } } },
  ]);
  
  const recentProjects = await Project.find({ userId })
    .sort({ updatedAt: -1 })
    .limit(5)
    .select('name status updatedAt');
    
  const analytics: AnalyticsData = {
    overview: {
      totalProjects,
      totalDeployments,
      totalChats,
      apiUsage: user?.apiUsage.requestsThisMonth || 0,
    },
    projectsByStatus: projectsByStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>),
    deploymentsByProvider: deploymentsByProvider.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>),
    recentActivity: recentProjects.map((p) => ({
      type: 'project',
      description: `Updated ${p.name}`,
      timestamp: p.updatedAt,
    })),
  };
  
  const response: ApiResponse = {
    success: true,
    data: { analytics },
  };
  
  res.json(response);
});

// @desc    Get project analytics
// @route   GET /api/analytics/projects
// @access  Private
const getProjectAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  
  const projectStats = await Project.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        byType: {
          $push: { type: '$type', status: '$status' },
        },
      },
    },
  ]);
  
  const response: ApiResponse = {
    success: true,
    data: { projectStats: projectStats[0] || {} },
  };
  
  res.json(response);
});

// @desc    Get deployment analytics
// @route   GET /api/analytics/deployments
// @access  Private
const getDeploymentAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  
  const deploymentStats = await Deployment.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: '$provider',
        count: { $sum: 1 },
        avgBuildTime: { $avg: '$metrics.buildTime' },
        successRate: {
          $avg: {
            $cond: [{ $eq: ['$status', 'deployed'] }, 1, 0],
          },
        },
      },
    },
  ]);
  
  const response: ApiResponse = {
    success: true,
    data: { deploymentStats },
  };
  
  res.json(response);
});

// @desc    Get user activity
// @route   GET /api/analytics/activity
// @access  Private
const getUserActivity = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  const { days = 7 } = req.query;
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - Number(days));
  
  const [projects, deployments, chats] = await Promise.all([
    Project.find({
      userId,
      createdAt: { $gte: startDate },
    }).select('name createdAt'),
    Deployment.find({
      userId,
      createdAt: { $gte: startDate },
    }).select('status createdAt'),
    Chat.find({
      userId,
      createdAt: { $gte: startDate },
    }).select('title createdAt'),
  ]);
  
  const activity = [
    ...projects.map((p) => ({
      type: 'project',
      description: `Created project: ${p.name}`,
      timestamp: p.createdAt,
    })),
    ...deployments.map((d) => ({
      type: 'deployment',
      description: `Deployment ${d.status}`,
      timestamp: d.createdAt,
    })),
    ...chats.map((c) => ({
      type: 'chat',
      description: `Started chat: ${c.title}`,
      timestamp: c.createdAt,
    })),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  const response: ApiResponse = {
    success: true,
    data: { activity },
  };
  
  res.json(response);
});

// Routes
router.get('/', getAnalytics);
router.get('/projects', getProjectAnalytics);
router.get('/deployments', getDeploymentAnalytics);
router.get('/activity', getUserActivity);

export default router;
