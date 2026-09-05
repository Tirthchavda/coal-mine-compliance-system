import { Request, Response } from 'express';
import { db } from '../db/store.js';
import { Mine } from '../types/index.js';

export const getMines = async (req: Request, res: Response): Promise<void> => {
  try {
    const { state, type, status, riskLevel, search } = req.query as Record<string, string>;
    let mines = db.getMines();

    if (state) {
      mines = mines.filter(m => m.state.toLowerCase() === state.toLowerCase());
    }
    if (type) {
      mines = mines.filter(m => m.type === type);
    }
    if (status) {
      mines = mines.filter(m => m.operationalStatus === status);
    }
    if (riskLevel) {
      mines = mines.filter(m => m.riskLevel === riskLevel);
    }
    if (search) {
      const q = search.toLowerCase();
      mines = mines.filter(m => 
        m.name.toLowerCase().includes(q) ||
        m.code.toLowerCase().includes(q) ||
        m.district.toLowerCase().includes(q) ||
        m.state.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      data: mines,
      count: mines.length
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getMineById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const mine = db.getMineById(id);

    if (!mine) {
      res.status(404).json({ success: false, error: 'Colliery not found' });
      return;
    }

    // Populate related datasets
    const compliance = db.getComplianceRecords().filter(c => c.mineId === mine.id);
    const violations = db.getViolations().filter(v => v.mineId === mine.id);
    const inspections = db.getInspections().filter(i => i.mineId === mine.id);
    const documents = db.getDocuments().filter(d => d.mineId === mine.id);
    const safety = db.getSafetyRecords().filter(s => s.mineId === mine.id);
    const environment = db.getEnvironmentalData().filter(e => e.mineId === mine.id);
    const aiPrediction = db.getAIPredictionByMine(mine.id);

    res.json({
      success: true,
      data: {
        ...mine,
        stats: {
          complianceCount: compliance.length,
          compliantCount: compliance.filter(c => c.status === 'COMPLIANT').length,
          activeViolationsCount: violations.filter(v => v.status !== 'CLOSED' && v.status !== 'RESOLVED').length,
          criticalViolationsCount: violations.filter(v => v.severity === 'CRITICAL' && v.status !== 'CLOSED').length,
          inspectionsCount: inspections.length,
          documentsCount: documents.length
        },
        complianceRecords: compliance,
        violations,
        inspections,
        documents,
        safetyRecords: safety,
        environmentalData: environment,
        aiPrediction
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createMine = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const existing = db.getMines().find(m => m.code.toLowerCase() === body.code?.toLowerCase());
    if (existing) {
      res.status(400).json({ success: false, error: `Colliery code '${body.code}' already exists.` });
      return;
    }

    const newMine: Mine = {
      id: `mine-${Date.now()}`,
      name: body.name,
      code: body.code.toUpperCase(),
      owner: body.owner || 'Coal India Limited (CIL)',
      type: body.type || 'OPENCAST',
      state: body.state,
      district: body.district,
      location: body.location || `${body.district}, ${body.state}`,
      latitude: parseFloat(body.latitude) || 23.5,
      longitude: parseFloat(body.longitude) || 85.5,
      managerName: body.managerName || 'Project Officer',
      capacityMTPA: parseFloat(body.capacityMTPA) || 5.0,
      operationalStatus: body.operationalStatus || 'OPERATIONAL',
      complianceScore: 100,
      riskLevel: 'LOW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = db.createMine(newMine);
    res.status(201).json({ success: true, data: created, message: 'Colliery successfully registered' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateMine = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = db.updateMine(id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Colliery not found' });
      return;
    }
    res.json({ success: true, data: updated, message: 'Colliery updated successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteMine = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = db.deleteMine(id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Colliery not found' });
      return;
    }
    res.json({ success: true, message: 'Colliery deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

