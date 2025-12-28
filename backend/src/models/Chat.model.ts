import mongoose, { Schema, Model } from 'mongoose';
import { IChat } from '../types';

const chatSchema = new Schema<IChat>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Chat title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    messages: [
      {
        role: {
          type: String,
          enum: ['user', 'assistant', 'system'],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        metadata: {
          tokensUsed: Number,
          model: String,
          processingTime: Number,
        },
      },
    ],
    context: {
      currentStep: String,
      completedSteps: [String],
      projectState: Schema.Types.Mixed,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
chatSchema.index({ userId: 1, createdAt: -1 });
chatSchema.index({ projectId: 1 });
chatSchema.index({ isActive: 1 });

// Virtual for message count
chatSchema.virtual('messageCount').get(function () {
  return this.messages.length;
});

const Chat: Model<IChat> = mongoose.model<IChat>('Chat', chatSchema);

export default Chat;
