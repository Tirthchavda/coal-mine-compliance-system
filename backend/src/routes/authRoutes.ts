import { Router } from 'express';
import { login, logout, switchDemoRole, getCurrentUser } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.post('/logout', authenticateToken, logout);
router.post('/switch-demo', switchDemoRole);
router.get('/me', authenticateToken, getCurrentUser);

export default router;

