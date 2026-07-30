import express from 'express';
import { generateAIReport } from '../controllers/aiController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/analyze', protect, admin, generateAIReport);

export default router;
