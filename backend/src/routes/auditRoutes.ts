import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

router.get(
  '/',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'HQ_MANAGEMENT']),
  getAuditLogs
);

export default router;
