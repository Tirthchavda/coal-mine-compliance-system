import { Router } from 'express';
import { 
  getActions, 
  createAction, 
  updateAction, 
  verifyAction 
} from '../controllers/actionController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { logAudit } from '../middleware/audit.js';

const router = Router();

router.get('/', getActions);

router.post(
  '/',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'MINE_MANAGER', 'COMPLIANCE_OFFICER']),
  logAudit('CAPA_ASSIGNED', 'CORRECTIVE_ACTION'),
  createAction
);

router.put(
  '/:id',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'MINE_MANAGER', 'CONTRACTOR', 'COMPLIANCE_OFFICER']),
  logAudit('CAPA_PROGRESS_UPDATED', 'CORRECTIVE_ACTION'),
  updateAction
);

router.put(
  '/:id/verify',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'SAFETY_INSPECTOR', 'HQ_MANAGEMENT']),
  logAudit('CAPA_VERIFIED', 'CORRECTIVE_ACTION'),
  verifyAction
);

export default router;
