import express from 'express';
import { generateAIReport } from '../controllers/aiController.js';

const router = express.Router();

router.post('/analyze', generateAIReport);

export default router;
