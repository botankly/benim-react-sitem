import express from 'express';
import { createProductReview, getProductReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:productId')
  .post(protect, createProductReview)
  .get(getProductReviews);

export default router;
