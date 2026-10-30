import express from 'express';
import { createMaterial, getMaterials } from '../controllers/materialController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getMaterials);
router.post('/', protect, authorize('admin', 'procurement_manager'), createMaterial);

export default router;
