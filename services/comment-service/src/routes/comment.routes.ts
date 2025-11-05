import express from 'express';
import {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
} from '../controllers/comment.controller';
import { validateComment } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/:postId', getCommentsByPost);
router.post('/:postId', authenticate, validateComment, createComment);
router.put('/:id', authenticate, validateComment, updateComment);
router.delete('/:id', authenticate, deleteComment);

export default router;

