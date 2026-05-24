import express from 'express';
import { exportData, importData } from '../controllers/backupController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth protection and admin authorization to all backup routes
router.use(protect);
router.use(authorize('admin'));

router.post('/export', exportData);
router.post('/import', importData);

export default router;
