import express from 'express';
import { createProcurement, getProcurements } from '../controllers/procurementController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getProcurements);
router.post('/', protect, authorize('admin', 'procurement_manager', 'project_manager'), createProcurement);

export default router;
