import { Router } from 'express';
import { 
  getInspections, 
  getInspectionById, 
  createInspection, 
  addFinding, 
  completeInspection 
} from '../controllers/inspectionController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { logAudit } from '../middleware/audit.js';

const router = Router();

router.get('/', getInspections);
router.get('/:id', getInspectionById);

router.post(
  '/',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'SAFETY_INSPECTOR', 'HQ_MANAGEMENT']),
  logAudit('INSPECTION_SCHEDULED', 'INSPECTION'),
  createInspection
);

router.post(
  '/:id/findings',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'SAFETY_INSPECTOR']),
  logAudit('FINDING_LOGGED', 'INSPECTION'),
  addFinding
);

router.put(
  '/:id/complete',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'SAFETY_INSPECTOR']),
  logAudit('INSPECTION_COMPLETED', 'INSPECTION'),
  completeInspection
);

export default router;
