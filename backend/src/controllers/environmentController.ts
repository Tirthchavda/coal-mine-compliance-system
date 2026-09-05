import { Request, Response } from 'express';
import { db } from '../db/store.js';
import { EnvironmentalRecord } from '../types/index.js';

export const getEnvironmentalRecords = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mineId, startDate, endDate } = req.query as Record<string, string>;
    let records = db.getEnvironmentalRecords();

    // Role-based scoping
    if (req.user?.role === 'MINE_MANAGER' && req.user.assignedMineId) {
      records = records.filter(e => e.mineId === req.user?.assignedMineId);
    } else if (req.user?.role === 'COMPLIANCE_OFFICER' && req.user.assignedMineId) {
      records = records.filter(e => e.mineId === req.user?.assignedMineId);
    }

    if (mineId) {
      records = records.filter(e => e.mineId === mineId);
    }

    const totalRecords = records.length;
    const avgPM10 = totalRecords > 0 
      ? Math.round((records.reduce((acc, r) => acc + r.pm10, 0) / totalRecords) * 10) / 10 
      : 78.5;
    const avgPM25 = totalRecords > 0 
      ? Math.round((records.reduce((acc, r) => acc + r.pm25, 0) / totalRecords) * 10) / 10 
      : 38.0;
    const avgWaterPH = totalRecords > 0 
      ? Math.round((records.reduce((acc, r) => acc + r.waterPh, 0) / totalRecords) * 10) / 10 
      : 7.2;
    const activeBreaches = records.filter(r => r.warningTriggered || r.pm10 > 100 || r.waterPh < 6.5 || r.waterPh > 8.5).length;

    res.json({
      success: true,
      data: records,
      analytics: {
        totalRecords,
        avgPM10,
        avgPM25,
        avgWaterPH,
        activeBreaches,
        cpcbComplianceRate: totalRecords > 0 ? Math.round(((totalRecords - activeBreaches) / totalRecords) * 100) : 98
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createEnvironmentalRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const pm10 = parseFloat(body.pm10 || '78.5');
    const pm25 = parseFloat(body.pm25 || '38.0');
    const waterPh = parseFloat(body.waterPh || '7.2');
    const warningTriggered = pm10 > 100 || pm25 > 60 || waterPh < 6.5 || waterPh > 8.5;

    const targetMineId = (req.user?.role === 'MINE_MANAGER' && req.user.assignedMineId)
      ? req.user.assignedMineId
      : body.mineId;

    const newRecord: EnvironmentalRecord = {
      id: `env-${Date.now()}`,
      mineId: targetMineId,
      date: body.date || new Date().toISOString(),
      pm10,
      pm25,
      so2: parseFloat(body.so2 || '18.0'),
      nox: parseFloat(body.nox || '24.0'),
      waterPh,
      waterTds: parseFloat(body.waterTds || '340'),
      waterCod: parseFloat(body.waterCod || '45'),
      noiseDb: parseFloat(body.noiseDb || '68.0'),
      overburdenStabilityStatus: body.overburdenStabilityStatus || 'STABLE',
      warningTriggered,
      createdAt: new Date().toISOString()
    };

    const created = db.createEnvironmentalRecord(newRecord);
    res.status(201).json({ success: true, data: created, message: 'Environmental telemetry recorded' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
