import { Router } from 'express';
import { 
  getComplianceRecords, 
  getComplianceById, 
  getRequirements, 
  createComplianceRecord, 
  updateComplianceRecord 
} from '../controllers/complianceController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { logAudit } from '../middleware/audit.js';

const router = Router();

router.get('/', getComplianceRecords);
router.get('/requirements', getRequirements);
router.get('/:id', getComplianceById);

router.post(
  '/',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'HQ_MANAGEMENT', 'COMPLIANCE_OFFICER', 'MINE_MANAGER']),
  logAudit('COMPLIANCE_SCHEDULED', 'COMPLIANCE'),
  createComplianceRecord
);

router.put(
  '/:id',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'SAFETY_INSPECTOR', 'COMPLIANCE_OFFICER', 'MINE_MANAGER']),
  logAudit('COMPLIANCE_UPDATED', 'COMPLIANCE'),
  updateComplianceRecord
);

export default router;
