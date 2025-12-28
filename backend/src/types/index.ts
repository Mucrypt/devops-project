import { Request } from 'express';
import { Document, Types } from 'mongoose';

// User Types
export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: 'user' | 'admin';
  emailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  subscription: {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'cancelled' | 'past_due';
    startDate?: Date;
    endDate?: Date;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
  };
  apiUsage: {
    requestsThisMonth: number;
    deploymentsThisMonth: number;
    lastReset: Date;
  };
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateVerificationToken(): string;
  generateResetToken(): string;
}

// Project Types
export interface IProject extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  description?: string;
  type: 'nextjs' | 'react' | 'vue' | 'custom';
  status: 'draft' | 'building' | 'built' | 'deployed' | 'failed';
  configuration: {
    framework: string;
    features: string[];
    styling: string;
    database?: string;
    authentication?: string;
    deployment?: string;
  };
  sourceCode?: {
    repository?: string;
    branch?: string;
    files?: Array<{
      path: string;
      content: string;
    }>;
  };
  deployment?: {
    url?: string;
    provider?: string;
    deploymentId?: string;
    lastDeployedAt?: Date;
  };
  chatHistory: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Chat Types
export interface IMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    tokensUsed?: number;
    model?: string;
    processingTime?: number;
  };
}

export interface IChat extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  projectId: Types.ObjectId;
  title: string;
  messages: IMessage[];
  context: {
    currentStep?: string;
    completedSteps?: string[];
    projectState?: Record<string, any>;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Deployment Types
export interface IDeployment extends Document {
  _id: Types.ObjectId;
  projectId: Types.ObjectId;
  userId: Types.ObjectId;
  provider: 'vercel' | 'netlify' | 'aws' | 'custom';
  status: 'pending' | 'building' | 'deployed' | 'failed' | 'cancelled';
  url?: string;
  deploymentId?: string;
  buildLogs?: string[];
  configuration: {
    environmentVariables?: Record<string, string>;
    buildCommand?: string;
    outputDirectory?: string;
    nodeVersion?: string;
  };
  metrics?: {
    buildTime?: number;
    deployTime?: number;
    size?: number;
  };
  error?: {
    message: string;
    stack?: string;
    timestamp: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Request with authenticated user
export interface AuthRequest extends Request {
  user?: IUser;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Filter Types
export interface ProjectFilters {
  status?: string;
  type?: string;
  search?: string;
}

// Analytics Types
export interface AnalyticsData {
  overview: {
    totalProjects: number;
    totalDeployments: number;
    totalChats: number;
    apiUsage: number;
  };
  projectsByStatus: Record<string, number>;
  deploymentsByProvider: Record<string, number>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: Date;
  }>;
}

// Email Types
export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// Webhook Types
export interface WebhookPayload {
  event: string;
  data: Record<string, any>;
  timestamp: Date;
  signature?: string;
}
