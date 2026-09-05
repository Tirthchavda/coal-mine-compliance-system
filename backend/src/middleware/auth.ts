import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { UserRole } from '../types/index.js';
import { db } from '../db/store.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  assignedMineId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Access denied. No statutory authentication token provided.'
    });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || 'coal_mine_statutory_compliance_jwt_secret_key_2026_secure';
    const decoded = verifyToken(token, secret) as AuthenticatedUser;
    
    // Optional: verify user still exists in DB
    const user = db.getUserById(decoded.id);
    if (user && user.status === 'ACTIVE') {
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        assignedMineId: user.assignedMineId
      };
    } else {
      req.user = decoded;
    }
    
    next();
  } catch (err) {
    res.status(403).json({
      success: false,
      error: 'Invalid or expired session token. Please re-authenticate.'
    });
  }
};
