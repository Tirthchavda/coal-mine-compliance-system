import { Router } from 'express';
import { getAIDashboard, runMineRiskAnalysis, reviewAIPrediction } from '../controllers/aiController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { logAudit } from '../middleware/audit.js';

const router = Router();

router.get('/dashboard', getAIDashboard);

router.post(
  '/risk-analysis/:mineId',
  authenticateToken,
  logAudit('AI_RISK_ANALYSIS_EXECUTED', 'AI_GOVERNANCE'),
  runMineRiskAnalysis
);

router.put(
  '/review/:id',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'SAFETY_INSPECTOR', 'HQ_MANAGEMENT', 'MINE_MANAGER']),
  logAudit('AI_RECOMMENDATION_REVIEWED', 'AI_GOVERNANCE'),
  reviewAIPrediction
);

export default router;
