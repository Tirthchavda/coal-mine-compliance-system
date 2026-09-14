import { Router } from 'express';
import { getAIDashboard, runMineRiskAnalysis, reviewAIPrediction } from '../controllers/aiController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { logAudit } from '../middleware/audit.js';

const router = Router();

router.get('/dashboard', getAIDashboard);

router.post(
  '/risk-analysis/:mineId',
  runMineRiskAnalysis
);

router.put(
  '/review/:id',
  reviewAIPrediction
);

export default router;
