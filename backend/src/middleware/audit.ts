import { Request, Response, NextFunction } from 'express';
import { db } from '../db/store.js';

export const logAudit = (action: string, entity: string, getEntityId?: (req: Request) => string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Intercept finish to record log on successful modification
    res.on('finish', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const userId = req.user?.id || 'SYSTEM_ANONYMOUS';
          const userName = req.user?.name || 'System / Unauthenticated';
          const userRole = req.user?.role || 'SYSTEM';
          const entityId = getEntityId ? getEntityId(req) : (req.params.id || req.body?.id || 'N/A');
          const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';

          db.createAuditLog({
            id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            userId,
            userName,
            userRole,
            action,
            entity,
            entityId,
            newValues: req.body ? JSON.stringify(req.body).slice(0, 500) : undefined,
            ipAddress: String(ip),
            createdAt: new Date().toISOString()
          });
        } catch (e) {
          console.error('Failed to write audit log entry', e);
        }
      }
    });

    next();
  };
};
