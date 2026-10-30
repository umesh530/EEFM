import express from 'express';
import { analyzeDecision, chatWithAI } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/analyze', protect, analyzeDecision);
router.post('/chat', protect, chatWithAI);

export default router;
