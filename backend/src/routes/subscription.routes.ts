import express, { Router, Response } from 'express';
import { protect } from '../middleware/auth.middleware';
import { AuthRequest, ApiResponse } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import User from '../models/User.model';

const router: Router = express.Router();

// @desc    Get subscription plans
// @route   GET /api/subscriptions/plans
// @access  Public
const getPlans = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      features: [
        '3 projects',
        '10 deployments/month',
        'Basic support',
        'Community features',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29,
      features: [
        'Unlimited projects',
        'Unlimited deployments',
        'Priority support',
        'Advanced AI features',
        'Custom domains',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      features: [
        'Everything in Pro',
        'Dedicated support',
        'SLA guarantees',
        'Custom integrations',
        'Team collaboration',
      ],
    },
  ];
  
  const response: ApiResponse = {
    success: true,
    data: { plans },
  };
  
  res.json(response);
});

// All other routes are protected
router.get('/plans', getPlans);
router.use(protect);

// @desc    Subscribe to a plan
// @route   POST /api/subscriptions/subscribe
// @access  Private
const subscribe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { plan } = req.body;
  const user = await User.findById(req.user?._id);
  
  if (user) {
    user.subscription.plan = plan;
    user.subscription.status = 'active';
    user.subscription.startDate = new Date();
    await user.save();
  }
  
  const response: ApiResponse = {
    success: true,
    message: `Successfully subscribed to ${plan} plan`,
    data: { subscription: user?.subscription },
  };
  
  res.json(response);
});

// @desc    Cancel subscription
// @route   POST /api/subscriptions/cancel
// @access  Private
const cancelSubscription = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?._id);
  
  if (user) {
    user.subscription.status = 'cancelled';
    user.subscription.endDate = new Date();
    await user.save();
  }
  
  const response: ApiResponse = {
    success: true,
    message: 'Subscription cancelled successfully',
    data: { subscription: user?.subscription },
  };
  
  res.json(response);
});

// @desc    Update subscription
// @route   PUT /api/subscriptions
// @access  Private
const updateSubscription = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { plan } = req.body;
  const user = await User.findById(req.user?._id);
  
  if (user) {
    user.subscription.plan = plan;
    await user.save();
  }
  
  const response: ApiResponse = {
    success: true,
    message: 'Subscription updated successfully',
    data: { subscription: user?.subscription },
  };
  
  res.json(response);
});

// @desc    Get billing history
// @route   GET /api/subscriptions/billing
// @access  Private
const getBillingHistory = asyncHandler(async (_req: AuthRequest, res: Response) => {
  // This would integrate with Stripe to get actual billing history
  const billingHistory = [
    {
      id: '1',
      date: new Date(),
      amount: 29,
      status: 'paid',
      description: 'Pro Plan - Monthly',
    },
  ];
  
  const response: ApiResponse = {
    success: true,
    data: { billingHistory },
  };
  
  res.json(response);
});

// Routes
router.post('/subscribe', subscribe);
router.post('/cancel', cancelSubscription);
router.put('/', updateSubscription);
router.get('/billing', getBillingHistory);

export default router;
