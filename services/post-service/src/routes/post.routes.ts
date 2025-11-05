import express from 'express';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  sharePost,
  incrementViews,
  getTopPosts,
} from '../controllers/post.controller';
import { validatePost } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllPosts);
router.get('/top', getTopPosts);
router.get('/:id', incrementViews, getPostById);
router.post('/', authenticate, validatePost, createPost);
router.put('/:id', authenticate, validatePost, updatePost);
router.delete('/:id', authenticate, deletePost);
router.post('/:id/like', authenticate, likePost);
router.post('/:id/share', authenticate, sharePost);

export default router;

