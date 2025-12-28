import { Response, NextFunction } from 'express';
import crypto from 'crypto';
import User from '../models/User.model';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError, ValidationError, AuthenticationError, ConflictError } from '../utils/appError';
import { generateToken } from '../utils/jwt';
import { AuthRequest, ApiResponse } from '../types';
import emailService from '../utils/email';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { username, email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return next(new ConflictError('User with this email or username already exists'));
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
    });

    // Generate verification token
    const verificationToken = user.generateVerificationToken();
    await user.save();

    // Send verification email
    await emailService.sendVerificationEmail(email, verificationToken);

    // Generate JWT
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const response: ApiResponse = {
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          emailVerified: user.emailVerified,
        },
      },
    };

    res.status(201).json(response);
  }
);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return next(new ValidationError('Please provide email and password'));
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new AuthenticationError('Invalid email or password'));
    }

    // Generate JWT
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const response: ApiResponse = {
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          emailVerified: user.emailVerified,
          subscription: user.subscription,
        },
      },
    };

    res.json(response);
  }
);

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    const response: ApiResponse = {
      success: true,
      message: 'Logout successful',
    };

    res.json(response);
  }
);

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = req.user;

    const response: ApiResponse = {
      success: true,
      data: {
        user: {
          id: user?._id,
          username: user?.username,
          email: user?.email,
          firstName: user?.firstName,
          lastName: user?.lastName,
          role: user?.role,
          emailVerified: user?.emailVerified,
          subscription: user?.subscription,
          preferences: user?.preferences,
        },
      },
    };

    res.json(response);
  }
);

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { token } = req.params;

    // Hash token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with this token
    const user = await User.findOne({ verificationToken: hashedToken });

    if (!user) {
      return next(new AppError('Invalid or expired verification token', 400));
    }

    // Verify email
    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // Send welcome email
    await emailService.sendWelcomeEmail(user.email, user.username);

    const response: ApiResponse = {
      success: true,
      message: 'Email verified successfully',
    };

    res.json(response);
  }
);

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('No user found with that email address', 404));
    }

    // Generate reset token
    const resetToken = user.generateResetToken();
    await user.save();

    // Send email
    await emailService.sendPasswordResetEmail(email, resetToken);

    const response: ApiResponse = {
      success: true,
      message: 'Password reset link sent to email',
    };

    res.json(response);
  }
);

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { token } = req.params;
    const { password } = req.body;

    // Hash token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError('Invalid or expired reset token', 400));
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const response: ApiResponse = {
      success: true,
      message: 'Password reset successful',
    };

    res.json(response);
  }
);

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Private
export const refreshToken = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = req.user;

    // Generate new JWT
    const token = generateToken({
      userId: user?._id.toString() || '',
      email: user?.email || '',
      role: user?.role || 'user',
    });

    const response: ApiResponse = {
      success: true,
      message: 'Token refreshed successfully',
      data: { token },
    };

    res.json(response);
  }
);
