import express from 'express';
import {
  changePassword,
  getProfile,
  loginUser,
  registerUser,
  updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.patch('/profile', protect, updateProfile);
router.patch('/password', protect, changePassword);

export default router;
