import { Router } from 'express';
import { syncUserProgress, getUserProgress } from '../controllers/sync.controller';
import { verifyAuthToken } from '../middleware/auth.middleware';

const router = Router();

// POST /api/sync
router.post('/', verifyAuthToken, syncUserProgress);
router.get('/', verifyAuthToken, getUserProgress);

export default router;