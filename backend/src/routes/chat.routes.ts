import express, { Router, Response, NextFunction } from 'express';
import { protect } from '../middleware/auth.middleware';
import { validate, chatMessageSchema } from '../middleware/validator';
import { AuthRequest, ApiResponse } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import Chat from '../models/Chat.model';
import Project from '../models/Project.model';
import { AppError } from '../utils/appError';

const router: Router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Create new chat
// @route   POST /api/chat
// @access  Private
const createChat = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { projectId, title } = req.body;
    
    // Verify project belongs to user
    const project = await Project.findOne({
      _id: projectId,
      userId: req.user?._id,
    });
    
    if (!project) {
      return next(new AppError('Project not found', 404));
    }
    
    const chat = await Chat.create({
      userId: req.user?._id,
      projectId,
      title: title || `Chat ${new Date().toLocaleDateString()}`,
      messages: [],
    });
    
    // Add chat to project
    project.chatHistory.push(chat._id);
    await project.save();
    
    const response: ApiResponse = {
      success: true,
      message: 'Chat created successfully',
      data: { chat },
    };
    
    res.status(201).json(response);
  }
);

// @desc    Get all chats
// @route   GET /api/chat
// @access  Private
const getChats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { projectId, page = 1, limit = 20 } = req.query;
  
  const query: any = { userId: req.user?._id };
  if (projectId) query.projectId = projectId;
  
  const skip = (Number(page) - 1) * Number(limit);
  
  const chats = await Chat.find(query)
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('projectId', 'name type');
    
  const total = await Chat.countDocuments(query);
  
  const response: ApiResponse = {
    success: true,
    data: { chats },
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
  };
  
  res.json(response);
});

// @desc    Get single chat
// @route   GET /api/chat/:id
// @access  Private
const getChat = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user?._id,
    }).populate('projectId', 'name type');
    
    if (!chat) {
      return next(new AppError('Chat not found', 404));
    }
    
    const response: ApiResponse = {
      success: true,
      data: { chat },
    };
    
    res.json(response);
  }
);

// @desc    Send message in chat
// @route   POST /api/chat/:id/messages
// @access  Private
const sendMessage = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { message } = req.body;
    
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user?._id,
    });
    
    if (!chat) {
      return next(new AppError('Chat not found', 404));
    }
    
    // Add user message
    chat.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });
    
    // Here you would integrate with AI service
    // For now, just echo back
    const aiResponse = `Echo: ${message}`;
    
    chat.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
      metadata: {
        model: 'gpt-4',
        tokensUsed: 100,
        processingTime: 500,
      },
    });
    
    await chat.save();
    
    const response: ApiResponse = {
      success: true,
      data: {
        message: chat.messages[chat.messages.length - 1],
      },
    };
    
    res.json(response);
  }
);

// @desc    Update chat
// @route   PUT /api/chat/:id
// @access  Private
const updateChat = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?._id },
      { title: req.body.title, isActive: req.body.isActive },
      { new: true }
    );
    
    if (!chat) {
      return next(new AppError('Chat not found', 404));
    }
    
    const response: ApiResponse = {
      success: true,
      message: 'Chat updated successfully',
      data: { chat },
    };
    
    res.json(response);
  }
);

// @desc    Delete chat
// @route   DELETE /api/chat/:id
// @access  Private
const deleteChat = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const chat = await Chat.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?._id,
    });
    
    if (!chat) {
      return next(new AppError('Chat not found', 404));
    }
    
    // Remove chat from project
    await Project.findByIdAndUpdate(chat.projectId, {
      $pull: { chatHistory: chat._id },
    });
    
    const response: ApiResponse = {
      success: true,
      message: 'Chat deleted successfully',
    };
    
    res.json(response);
  }
);

// Routes
router.post('/', createChat);
router.get('/', getChats);
router.get('/:id', getChat);
router.post('/:id/messages', validate(chatMessageSchema), sendMessage);
router.put('/:id', updateChat);
router.delete('/:id', deleteChat);

export default router;
