import { Request, Response } from 'express';
import Comment from '../models/Comment.model';
import { logger } from '../utils/logger';
import axios from 'axios';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:5001';

export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Comment.countDocuments({ postId });

    res.json({
      success: true,
      data: {
        comments,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error: any) {
    logger.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = (req as any).user?.userId;
    const { content } = req.body;

    // Fetch user info
    let commenterName = 'Unknown';
    try {
      const userResponse = await axios.get(
        `${USER_SERVICE_URL}/api/v1/users/profile/${userId}`
      );
      if (userResponse.data.success) {
        commenterName = userResponse.data.data.username;
      }
    } catch (error) {
      logger.warn('Could not fetch user info:', error);
    }

    const comment = new Comment({
      postId,
      commenterId: userId,
      commenterName,
      content,
    });

    await comment.save();

    logger.info(`Comment created: ${comment._id} by user ${userId}`);

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: comment,
    });
  } catch (error: any) {
    logger.error('Create comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;
    const { content } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    if (comment.commenterId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own comments',
      });
    }

    comment.content = content;
    await comment.save();

    res.json({
      success: true,
      message: 'Comment updated successfully',
      data: comment,
    });
  } catch (error: any) {
    logger.error('Update comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    if (comment.commenterId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own comments',
      });
    }

    await Comment.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error: any) {
    logger.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

