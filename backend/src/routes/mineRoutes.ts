import { Router } from 'express';
import { getMines, getMineById, createMine, updateMine, deleteMine } from '../controllers/mineController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { logAudit } from '../middleware/audit.js';

const router = Router();

router.get('/', getMines);
router.get('/:id', getMineById);

router.post(
  '/',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'HQ_MANAGEMENT']),
  logAudit('MINE_CREATED', 'MINE'),
  createMine
);

router.put(
  '/:id',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'HQ_MANAGEMENT', 'MINE_MANAGER']),
  logAudit('MINE_UPDATED', 'MINE'),
  updateMine
);

router.delete(
  '/:id',
  authenticateToken,
  requireRole(['SUPER_ADMIN']),
  logAudit('MINE_DELETED', 'MINE'),
  deleteMine
);

export default router;
