import express from 'express';
import { getPage, upsertPage, getPages, deletePage } from '../controllers/pageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getPages)
  .post(protect, upsertPage);

router.route('/:slug')
  .get(getPage)
  .delete(protect, deletePage);

export default router;
