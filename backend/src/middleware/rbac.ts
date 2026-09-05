import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/index.js';

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required for statutory role verification.'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `Unauthorized statutory action. Role '${req.user.role}' does not have required permissions [${allowedRoles.join(', ')}].`
      });
      return;
    }

    next();
  };
};
