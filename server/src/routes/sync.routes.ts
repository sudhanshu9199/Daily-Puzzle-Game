import { Router } from 'express';
import { syncUserProgress } from '../controllers/sync.controller';

const router = Router();

// POST /api/sync
router.post('/', syncUserProgress);

export default router;