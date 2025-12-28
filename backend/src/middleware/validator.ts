import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from '../utils/appError';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details.map((detail) => detail.message).join(', ');
      return next(new ValidationError(message));
    }

    next();
  };
};

// Common validation schemas
export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const projectSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional(),
  type: Joi.string().valid('nextjs', 'react', 'vue', 'custom').required(),
  configuration: Joi.object({
    framework: Joi.string().required(),
    features: Joi.array().items(Joi.string()).optional(),
    styling: Joi.string().optional(),
    database: Joi.string().optional(),
    authentication: Joi.string().optional(),
    deployment: Joi.string().optional(),
  }).optional(),
});

export const chatMessageSchema = Joi.object({
  message: Joi.string().min(1).max(5000).required(),
  projectId: Joi.string().optional(),
});

export const deploymentSchema = Joi.object({
  projectId: Joi.string().required(),
  provider: Joi.string().valid('vercel', 'netlify', 'aws', 'custom').required(),
  configuration: Joi.object({
    environmentVariables: Joi.object().optional(),
    buildCommand: Joi.string().optional(),
    outputDirectory: Joi.string().optional(),
    nodeVersion: Joi.string().optional(),
  }).optional(),
});
