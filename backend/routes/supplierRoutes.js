import express from 'express';
import { createSupplier, getSuppliers } from '../controllers/supplierController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getSuppliers);
router.post('/', protect, authorize('admin', 'procurement_manager'), createSupplier);

export default router;
