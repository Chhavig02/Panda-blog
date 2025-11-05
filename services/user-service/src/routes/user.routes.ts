import express from 'express';
import {
  registerUser,
  getUserProfile,
  updateUserProfile,
  addTokens,
  upgradeToPremium,
  getLeaderboard,
} from '../controllers/user.controller';
import { validateRegister, validateUpdateProfile } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/register', validateRegister, registerUser);
router.get('/profile/:id', getUserProfile);
router.put('/profile/:id', authenticate, validateUpdateProfile, updateUserProfile);
router.post('/tokens/add', authenticate, addTokens);
router.post('/premium/upgrade', authenticate, upgradeToPremium);
router.get('/leaderboard', getLeaderboard);

export default router;

