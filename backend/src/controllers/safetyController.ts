import { Request, Response } from 'express';
import { db } from '../db/store.js';
import { SafetyRecord } from '../types/index.js';

export const getSafetyRecords = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mineId, incidentType, startDate, endDate } = req.query as Record<string, string>;
    let records = db.getSafetyRecords();

    // Role-based scoping
    if (req.user?.role === 'MINE_MANAGER' && req.user.assignedMineId) {
      records = records.filter(r => r.mineId === req.user?.assignedMineId);
    } else if (req.user?.role === 'CONTRACTOR' && req.user.assignedMineId) {
      records = records.filter(r => r.mineId === req.user?.assignedMineId);
    }

    if (mineId) {
      records = records.filter(r => r.mineId === mineId);
    }
    if (incidentType) {
      records = records.filter(r => r.incidentType === incidentType);
    }

    const totalRecords = records.length;
    const avgPPE = totalRecords > 0 
      ? Math.round((records.reduce((acc, r) => acc + r.ppeComplianceRate, 0) / totalRecords) * 10) / 10 
      : 98.0;
    const maxCH4 = totalRecords > 0 
      ? Math.max(...records.map(r => r.gasLevelCH4 || 0)) 
      : 0.15;

    res.json({
      success: true,
      data: records,
      analytics: {
        totalRecords,
        avgPPECompliance: avgPPE,
        maxCH4,
        safetyScore: Math.min(100, Math.round(avgPPE * 0.95 + (maxCH4 < 0.75 ? 5 : 0)))
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createSafetyRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const targetMineId = (req.user?.role === 'MINE_MANAGER' && req.user.assignedMineId)
      ? req.user.assignedMineId
      : body.mineId;

    const newRecord: SafetyRecord = {
      id: `saf-${Date.now()}`,
      mineId: targetMineId,
      date: body.date || new Date().toISOString(),
      incidentType: body.incidentType || 'TELEMETRY_LOG',
      severity: body.severity || 'LOW',
      description: body.description || 'Continuous underground ventilation & gas telemetry reading.',
      locationInMine: body.locationInMine || 'Working Face District',
      casualties: parseInt(body.casualties || '0', 10),
      injuries: parseInt(body.injuries || '0', 10),
      lostHours: parseInt(body.lostHours || '0', 10),
      ppeComplianceRate: parseFloat(body.ppeComplianceRate || '98'),
      gasLevelCH4: parseFloat(body.gasLevelCH4 || '0.15'),
      gasLevelCO: parseFloat(body.gasLevelCO || '4.0'),
      createdAt: new Date().toISOString()
    };

    const created = db.createSafetyRecord(newRecord);
    res.status(201).json({ success: true, data: created, message: 'Safety & gas telemetry reading recorded' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
