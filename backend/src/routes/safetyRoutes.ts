import { Router } from 'express';
import { getSafetyRecords, createSafetyRecord } from '../controllers/safetyController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { logAudit } from '../middleware/audit.js';

const router = Router();

router.get('/', getSafetyRecords);

router.post(
  '/',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'SAFETY_INSPECTOR', 'MINE_MANAGER', 'COMPLIANCE_OFFICER']),
  logAudit('SAFETY_OBSERVATION_LOGGED', 'SAFETY'),
  createSafetyRecord
);

export default router;

