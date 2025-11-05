import { Request, Response } from 'express';
import Post from '../models/Post.model';
import { logger } from '../utils/logger';
import axios from 'axios';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:5001';

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, sort = 'rankingScore', search, tag, authorId } = req.query;

    const query: any = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }
    if (tag) {
      query.tags = { $in: [tag] };
    }
    if (authorId) {
      query.authorId = authorId;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOption: any = { [sort as string]: -1 };

    const posts = await Post.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Post.countDocuments(query);

    // Get comment counts for posts
    const COMMENT_SERVICE_URL = process.env.COMMENT_SERVICE_URL || 'http://localhost:5003';
    const postsWithComments = await Promise.all(
      posts.map(async (post: any) => {
        try {
          const commentsResponse = await axios.get(
            `${COMMENT_SERVICE_URL}/api/v1/comments/${post._id}?limit=1`
          );
          const commentsCount = commentsResponse.data?.success
            ? commentsResponse.data.data?.pagination?.total || 0
            : 0;
          return {
            ...post,
            commentsCount,
          };
        } catch (error) {
          return {
            ...post,
            commentsCount: 0,
          };
        }
      })
    );

    res.json({
      success: true,
      data: {
        posts: postsWithComments,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error: any) {
    logger.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error: any) {
    logger.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { title, content, tags, featuredImage, isPremium } = req.body;

    // Fetch user info
    let authorName = 'Unknown';
    try {
      const userResponse = await axios.get(
        `${USER_SERVICE_URL}/api/v1/users/profile/${userId}`
      );
      if (userResponse.data.success) {
        authorName = userResponse.data.data.username;
      }
    } catch (error) {
      logger.warn('Could not fetch user info:', error);
    }

    const post = new Post({
      title,
      content,
      authorId: userId,
      authorName,
      tags: tags || [],
      featuredImage: featuredImage || 'https://images.unsplash.com/photo-1488998427799-e3362cec87c3?w=800&h=400&fit=crop',
      isPremium: isPremium || false,
    });

    await post.save();

    // Reward user with 5 tokens for creating a post
    try {
      await axios.post(
        `${USER_SERVICE_URL}/api/v1/users/tokens/add`,
        { amount: 5 },
        {
          headers: {
            'Authorization': `Bearer ${req.headers.authorization?.replace('Bearer ', '')}`,
          },
        }
      );
      logger.info(`Rewarded 5 tokens to user ${userId} for creating post ${post._id}`);
    } catch (error) {
      logger.warn('Could not reward tokens for post creation:', error);
      // Don't fail the post creation if token reward fails
    }

    logger.info(`Post created: ${post._id} by user ${userId}`);

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post,
    });
  } catch (error: any) {
    logger.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;
    const { title, content, tags, featuredImage } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    if (post.authorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own posts',
      });
    }

    if (title) post.title = title;
    if (content) post.content = content;
    if (tags) post.tags = tags;
    if (featuredImage) post.featuredImage = featuredImage;

    await post.save();

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: post,
    });
  } catch (error: any) {
    logger.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    if (post.authorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own posts',
      });
    }

    await Post.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error: any) {
    logger.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const likePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const isLiked = post.likedBy.includes(userId);

    if (isLiked) {
      post.likes = Math.max(0, post.likes - 1);
      post.likedBy = post.likedBy.filter((id) => id !== userId);
    } else {
      post.likes += 1;
      post.likedBy.push(userId);
      
      // Reward post author with 1 token for receiving a like (only if not self-like)
      if (post.authorId !== userId) {
        try {
          await axios.post(
            `${USER_SERVICE_URL}/api/v1/users/tokens/add`,
            { amount: 1, targetUserId: post.authorId }, // Pass author ID
            {
              headers: {
                'Authorization': `Bearer ${req.headers.authorization?.replace('Bearer ', '')}`,
              },
            }
          );
          logger.info(`Rewarded 1 token to post author ${post.authorId} for like on post ${post._id}`);
        } catch (error) {
          logger.warn('Could not reward token for like:', error);
          // Don't fail the like if token reward fails
        }
      }
    }

    await post.save();

    res.json({
      success: true,
      message: isLiked ? 'Post unliked' : 'Post liked',
      data: post,
    });
  } catch (error: any) {
    logger.error('Like post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const sharePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const isShared = post.sharedBy.includes(userId);

    if (isShared) {
      // Unshare
      post.shares = Math.max(0, post.shares - 1);
      post.sharedBy = post.sharedBy.filter((id) => id !== userId);
    } else {
      // Share
      post.shares += 1;
      post.sharedBy.push(userId);
    }

    await post.save();

    res.json({
      success: true,
      message: isShared ? 'Post unshared' : 'Post shared',
      data: post,
    });
  } catch (error: any) {
    logger.error('Share post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const incrementViews = async (req: Request, res: Response, next: any) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndUpdate(id, { $inc: { views: 1 } });
  } catch (error) {
    logger.error('Increment views error:', error);
  }
  next();
};

export const getTopPosts = async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;

    const posts = await Post.find()
      .sort({ rankingScore: -1 })
      .limit(Number(limit))
      .lean();

    res.json({
      success: true,
      data: posts,
    });
  } catch (error: any) {
    logger.error('Get top posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

