import { Router } from 'express';
import { getEnvironmentalRecords, createEnvironmentalRecord } from '../controllers/environmentController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { logAudit } from '../middleware/audit.js';

const router = Router();

router.get('/', getEnvironmentalRecords);

router.post(
  '/',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'MINE_MANAGER', 'HQ_MANAGEMENT']),
  logAudit('ENV_TELEMETRY_LOGGED', 'ENVIRONMENT'),
  createEnvironmentalRecord
);

export default router;

