import express from 'express';
import { createProject, getProjectById, getProjects } from '../controllers/projectController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getProjects);
router.post('/', protect, authorize('admin', 'procurement_manager', 'project_manager'), createProject);
router.get('/:id', protect, getProjectById);

export default router;
