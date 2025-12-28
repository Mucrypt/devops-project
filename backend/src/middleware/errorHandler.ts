import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import logger from '../utils/logger';

interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  stack?: string;
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = err.message || 'Internal Server Error';
  let isOperational = false;

  // Handle operational errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error: ' + err.message;
    isOperational = true;
  }

  // Handle Mongoose duplicate key errors
  if (err.name === 'MongoServerError' && 'code' in err && err.code === 11000) {
    statusCode = 409;
    const field = Object.keys((err as any).keyPattern)[0];
    message = `Duplicate field value: ${field}. Please use another value.`;
    isOperational = true;
  }

  // Handle Mongoose cast errors
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${(err as any).path}: ${(err as any).value}`;
    isOperational = true;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
    isOperational = true;
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your token has expired. Please log in again.';
    isOperational = true;
  }

  // Log error
  if (!isOperational) {
    logger.error('Unhandled error:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
    });
  }

  // Send error response
  const response: ErrorResponse = {
    success: false,
    message,
  };

  // Include error details in development
  if (process.env.NODE_ENV === 'development') {
    response.error = err.message;
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
