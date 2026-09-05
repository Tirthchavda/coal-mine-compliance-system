import { Request, Response } from 'express';
import { db } from '../db/store.js';
import { Alert } from '../types/index.js';

export const getAlerts = async (req: Request, res: Response): Promise<void> => {
  try {
    const alerts = db.getAlerts();
    res.json({
      success: true,
      data: alerts,
      unreadCount: alerts.filter(a => !a.isRead).length
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const markAlertRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const alert = db.markAlertRead(id);
    if (!alert) {
      res.status(404).json({ success: false, error: 'Alert not found' });
      return;
    }
    res.json({ success: true, data: alert });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const alert: Alert = {
      id: `alt-${Date.now()}`,
      mineId: body.mineId,
      title: body.title,
      message: body.message,
      type: body.type || 'COMPLIANCE',
      severity: body.severity || 'MEDIUM',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    db.createAlert(alert);
    res.status(201).json({ success: true, data: alert });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

