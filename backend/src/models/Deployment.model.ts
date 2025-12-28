import mongoose, { Schema, Model } from 'mongoose';
import { IDeployment } from '../types';

const deploymentSchema = new Schema<IDeployment>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project ID is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    provider: {
      type: String,
      enum: ['vercel', 'netlify', 'aws', 'custom'],
      required: [true, 'Deployment provider is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'building', 'deployed', 'failed', 'cancelled'],
      default: 'pending',
    },
    url: {
      type: String,
      trim: true,
    },
    deploymentId: {
      type: String,
      trim: true,
    },
    buildLogs: [String],
    configuration: {
      environmentVariables: {
        type: Map,
        of: String,
      },
      buildCommand: String,
      outputDirectory: String,
      nodeVersion: String,
    },
    metrics: {
      buildTime: Number, // in seconds
      deployTime: Number, // in seconds
      size: Number, // in bytes
    },
    error: {
      message: String,
      stack: String,
      timestamp: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
deploymentSchema.index({ projectId: 1, createdAt: -1 });
deploymentSchema.index({ userId: 1 });
deploymentSchema.index({ status: 1 });
deploymentSchema.index({ provider: 1 });

// Virtual for duration
deploymentSchema.virtual('totalDuration').get(function () {
  if (this.metrics?.buildTime && this.metrics?.deployTime) {
    return this.metrics.buildTime + this.metrics.deployTime;
  }
  return null;
});

const Deployment: Model<IDeployment> = mongoose.model<IDeployment>(
  'Deployment',
  deploymentSchema
);

export default Deployment;
