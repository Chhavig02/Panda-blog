import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import axios from 'axios';
import User from '../models/User.model';
import { logger } from '../utils/logger';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      tokens: 1, // Initial tokens on registration
    });

    await user.save();

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'secret';
    const userId = String(user._id);
    const token = jwt.sign(
      { userId, email: user.email },
      jwtSecret as string,
      { expiresIn: '24h' }
    );

    logger.info(`User registered: ${user._id}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          tokens: user.tokens,
          isPremium: user.isPremium,
        },
        token,
      },
    });
  } catch (error: any) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    if (id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own profile',
      });
    }

    const { bio, avatar } = req.body;
    const updateData: any = {};

    if (bio !== undefined) updateData.bio = bio;
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error: any) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const addTokens = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token amount',
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { tokens: amount } },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Tokens added successfully',
      data: user,
    });
  } catch (error: any) {
    logger.error('Add tokens error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const upgradeToPremium = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const requiredTokens = 50;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.tokens < requiredTokens) {
      return res.status(400).json({
        success: false,
        message: `Insufficient tokens. Required: ${requiredTokens}, Available: ${user.tokens}`,
      });
    }

    user.tokens -= requiredTokens;
    user.isPremium = true;
    await user.save();

    res.json({
      success: true,
      message: 'Upgraded to premium successfully',
      data: user,
    });
  } catch (error: any) {
    logger.error('Upgrade premium error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const { limit = 50 } = req.query;
    const POST_SERVICE_URL = process.env.POST_SERVICE_URL || 'http://localhost:5002';

    // Get all users
    const users = await User.find().select('-password').lean();

    // Fetch posts for each user to calculate stats
    const leaderboardData = await Promise.all(
      users.map(async (user) => {
        try {
          // Get user's posts
          const postsResponse = await axios.get(
            `${POST_SERVICE_URL}/api/v1/posts?authorId=${user._id}&limit=1000`
          );
          const posts = postsResponse.data?.success
            ? postsResponse.data.data?.posts || postsResponse.data.data || []
            : [];

          // Calculate stats
          const postsCount = posts.length;
          const totalLikes = posts.reduce((sum: number, post: any) => sum + (post.likes || 0), 0);
          const totalViews = posts.reduce((sum: number, post: any) => sum + (post.views || 0), 0);
          
          // Get comments count (try to fetch from comment service)
          let totalComments = 0;
          try {
            const COMMENT_SERVICE_URL = process.env.COMMENT_SERVICE_URL || 'http://localhost:5003';
            const postIds = posts.map((p: any) => p._id || p.id);
            if (postIds.length > 0) {
              const commentsPromises = postIds.map((postId: string) =>
                axios.get(`${COMMENT_SERVICE_URL}/api/v1/comments/${postId}`).catch(() => ({ data: { success: false, data: [] } }))
              );
              const commentsResponses = await Promise.all(commentsPromises);
              totalComments = commentsResponses.reduce((sum: number, res: any) => {
                const comments = res.data?.success ? (res.data.data?.comments || res.data.data || []) : [];
                return sum + comments.length;
              }, 0);
            }
          } catch (error) {
            // Ignore comment service errors
          }

          // Calculate score: posts * 10 + likes * 3 + views * 0.1 + tokens / 10
          const score = Math.floor(
            postsCount * 10 + totalLikes * 3 + totalViews * 0.1 + user.tokens / 10
          );

          return {
            id: user._id,
            username: user.username,
            avatar: user.avatar,
            tokens: user.tokens,
            posts: postsCount,
            likes: totalLikes,
            comments: totalComments,
            views: totalViews,
            score,
            isPremium: user.isPremium,
          };
        } catch (error) {
          // Return basic stats if post service fails
          return {
            id: user._id,
            username: user.username,
            avatar: user.avatar,
            tokens: user.tokens,
            posts: 0,
            likes: 0,
            comments: 0,
            views: 0,
            score: Math.floor(user.tokens / 10),
            isPremium: user.isPremium,
          };
        }
      })
    );

    // Sort by score and add rank
    leaderboardData.sort((a, b) => b.score - a.score);
    const leaderboard = leaderboardData.slice(0, Number(limit)).map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    res.json({
      success: true,
      data: leaderboard,
    });
  } catch (error: any) {
    logger.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

