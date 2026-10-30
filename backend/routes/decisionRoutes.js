import express from 'express';
import { evaluateDecision, getDecisions } from '../controllers/decisionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getDecisions);
router.post('/evaluate', protect, evaluateDecision);

export default router;
