import mongoose, { Schema, Model } from 'mongoose';
import { IProject } from '../types';

const projectSchema = new Schema<IProject>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [3, 'Project name must be at least 3 characters'],
      maxlength: [100, 'Project name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    type: {
      type: String,
      enum: ['nextjs', 'react', 'vue', 'custom'],
      required: [true, 'Project type is required'],
    },
    status: {
      type: String,
      enum: ['draft', 'building', 'built', 'deployed', 'failed'],
      default: 'draft',
    },
    configuration: {
      framework: {
        type: String,
        required: true,
      },
      features: [String],
      styling: String,
      database: String,
      authentication: String,
      deployment: String,
    },
    sourceCode: {
      repository: String,
      branch: String,
      files: [
        {
          path: String,
          content: String,
        },
      ],
    },
    deployment: {
      url: String,
      provider: String,
      deploymentId: String,
      lastDeployedAt: Date,
    },
    chatHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Chat',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
projectSchema.index({ userId: 1, createdAt: -1 });
projectSchema.index({ status: 1 });
projectSchema.index({ 'deployment.url': 1 });

// Virtual for chat count
projectSchema.virtual('chatCount', {
  ref: 'Chat',
  localField: '_id',
  foreignField: 'projectId',
  count: true,
});

const Project: Model<IProject> = mongoose.model<IProject>('Project', projectSchema);

export default Project;
