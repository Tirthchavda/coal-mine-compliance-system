import { Router } from 'express';
import { 
  getViolations, 
  getViolationById, 
  createViolation, 
  updateViolation 
} from '../controllers/violationController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { logAudit } from '../middleware/audit.js';

const router = Router();

router.get('/', getViolations);
router.get('/:id', getViolationById);

router.post(
  '/',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'SAFETY_INSPECTOR', 'COMPLIANCE_OFFICER', 'HQ_MANAGEMENT']),
  logAudit('VIOLATION_ISSUED', 'VIOLATION'),
  createViolation
);

router.put(
  '/:id',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'SAFETY_INSPECTOR', 'MINE_MANAGER', 'COMPLIANCE_OFFICER', 'CONTRACTOR']),
  logAudit('VIOLATION_UPDATED', 'VIOLATION'),
  updateViolation
);

export default router;
