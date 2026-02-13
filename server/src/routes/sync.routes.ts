import { Router } from 'express';
import { syncUserProgress } from '../controllers/sync.controller';
import { verifyAuthToken } from '../middleware/auth.middleware';

const router = Router();

// POST /api/sync
router.post('/', verifyAuthToken, syncUserProgress);

export default router;