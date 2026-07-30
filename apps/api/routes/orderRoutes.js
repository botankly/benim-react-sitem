import express from 'express';
import { createOrder, getUserOrders, getOrders } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getOrders);

router.route('/my-orders')
  .get(protect, getUserOrders);

export default router;
