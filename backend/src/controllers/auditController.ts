import { Request, Response } from 'express';
import { db } from '../db/store.js';

export const getAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { entity, action, userId, search } = req.query as Record<string, string>;
    let logs = db.getAuditLogs();

    if (entity) {
      logs = logs.filter(l => l.entity === entity);
    }
    if (action) {
      logs = logs.filter(l => l.action.toLowerCase().includes(action.toLowerCase()));
    }
    if (userId) {
      logs = logs.filter(l => l.userId === userId);
    }
    if (search) {
      const q = search.toLowerCase();
      logs = logs.filter(l => 
        l.userName.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.entity.toLowerCase().includes(q) ||
        l.entityId.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      data: logs,
      count: logs.length
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

