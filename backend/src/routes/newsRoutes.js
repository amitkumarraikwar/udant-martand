import express from 'express';
import { getNews, createNews, updateNews, deleteNews, getNewsById, getNewsBySlug } from '../controllers/newsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getNews)
  .post(protect, createNews);

// Slug-based public route — must be declared BEFORE /:id
router.get('/slug/:slug', getNewsBySlug);

router.route('/:id')
  .get(getNewsById)
  .put(protect, updateNews)
  .delete(protect, deleteNews);

export default router;
