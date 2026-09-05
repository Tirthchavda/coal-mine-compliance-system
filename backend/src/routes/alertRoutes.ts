import { Router } from 'express';
import { getAlerts, markAlertRead, createAlert } from '../controllers/alertController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, getAlerts);
router.put('/:id/read', authenticateToken, markAlertRead);
router.post('/', authenticateToken, createAlert);

export default router;

