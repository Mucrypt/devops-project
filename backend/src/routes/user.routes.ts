import express, { Router } from 'express';
import { Response, NextFunction } from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { AuthRequest, ApiResponse } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import User from '../models/User.model';
import { AppError } from '../utils/appError';

const router: Router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?._id);
  
  const response: ApiResponse = {
    success: true,
    data: { user },
  };
  
  res.json(response);
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const allowedUpdates = ['firstName', 'lastName', 'username', 'avatar'];
  const updates: any = {};
  
  Object.keys(req.body).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });
  
  const user = await User.findByIdAndUpdate(req.user?._id, updates, {
    new: true,
    runValidators: true,
  });
  
  const response: ApiResponse = {
    success: true,
    message: 'Profile updated successfully',
    data: { user },
  };
  
  res.json(response);
});

// @desc    Update password
// @route   PUT /api/users/password
// @access  Private
const updatePassword = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user?._id).select('+password');
    
    if (!user || !(await user.comparePassword(currentPassword))) {
      return next(new AppError('Current password is incorrect', 401));
    }
    
    user.password = newPassword;
    await user.save();
    
    const response: ApiResponse = {
      success: true,
      message: 'Password updated successfully',
    };
    
    res.json(response);
  }
);

// @desc    Delete account
// @route   DELETE /api/users/account
// @access  Private
const deleteAccount = asyncHandler(async (req: AuthRequest, res: Response) => {
  await User.findByIdAndDelete(req.user?._id);
  
  const response: ApiResponse = {
    success: true,
    message: 'Account deleted successfully',
  };
  
  res.json(response);
});

// @desc    Get API usage
// @route   GET /api/users/usage
// @access  Private
const getApiUsage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?._id);
  
  const response: ApiResponse = {
    success: true,
    data: {
      usage: user?.apiUsage,
      subscription: user?.subscription,
    },
  };
  
  res.json(response);
});

// @desc    Update preferences
// @route   PUT /api/users/preferences
// @access  Private
const updatePreferences = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?._id);
  
  if (user) {
    user.preferences = { ...user.preferences, ...req.body };
    await user.save();
  }
  
  const response: ApiResponse = {
    success: true,
    message: 'Preferences updated successfully',
    data: { preferences: user?.preferences },
  };
  
  res.json(response);
});

// Routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.delete('/account', deleteAccount);
router.get('/usage', getApiUsage);
router.put('/preferences', updatePreferences);

// Admin only routes
router.get('/all', restrictTo('admin'), asyncHandler(async (_req: AuthRequest, res: Response) => {
  const users = await User.find().select('-password');
  
  const response: ApiResponse = {
    success: true,
    data: { users },
  };
  
  res.json(response);
}));

export default router;
