import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { logAudit } from '../middleware/audit.js';

const router = Router();

router.get('/', authenticateToken, getUsers);

router.post(
  '/',
  authenticateToken,
  requireRole(['SUPER_ADMIN']),
  logAudit('USER_CREATED', 'USER'),
  createUser
);

router.put(
  '/:id',
  authenticateToken,
  requireRole(['SUPER_ADMIN']),
  logAudit('USER_UPDATED', 'USER'),
  updateUser
);

router.delete(
  '/:id',
  authenticateToken,
  requireRole(['SUPER_ADMIN']),
  logAudit('USER_DELETED', 'USER'),
  deleteUser
);

export default router;
