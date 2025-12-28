import express, { Router } from 'express';
import {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refreshToken,
  getMe,
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { validate, registerSchema, loginSchema } from '../middleware/validator';
import { authLimiter } from '../middleware/rateLimiter';

const router: Router = express.Router();

// Public routes
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);

// Protected routes
router.post('/logout', protect, logout);
router.post('/refresh-token', protect, refreshToken);
router.get('/me', protect, getMe);

export default router;
