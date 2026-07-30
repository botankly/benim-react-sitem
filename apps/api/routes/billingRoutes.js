import express from 'express';
import { getPlans, createCheckoutSession, handleWebhook, getBillingHistory } from '../controllers/billingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/plans', getPlans);
router.post('/checkout', protect, createCheckoutSession);
router.post('/webhook', handleWebhook);
router.get('/history', protect, getBillingHistory);

export default router;
