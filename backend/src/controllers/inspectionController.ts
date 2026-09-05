import { Request, Response } from 'express';
import { db } from '../db/store.js';
import { Inspection, InspectionFinding } from '../types/index.js';

export const getInspections = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mineId, status, inspectorId, search } = req.query as Record<string, string>;
    let inspections = db.getInspections();

    // Scoping: Mine Manager sees audits for their mine
    if (req.user?.role === 'MINE_MANAGER' && req.user.assignedMineId) {
      inspections = inspections.filter(i => i.mineId === req.user?.assignedMineId);
    }

    if (mineId) {
      inspections = inspections.filter(i => i.mineId === mineId);
    }
    if (status) {
      inspections = inspections.filter(i => i.status === status);
    }
    if (inspectorId) {
      inspections = inspections.filter(i => i.inspectorId === inspectorId);
    }
    if (search) {
      const q = search.toLowerCase();
      inspections = inspections.filter(i => 
        i.inspectionType.toLowerCase().includes(q) ||
        i.summary.toLowerCase().includes(q) ||
        i.inspector?.name.toLowerCase().includes(q) ||
        i.mine?.name.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      data: inspections,
      count: inspections.length
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getInspectionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const inspection = db.getInspectionById(id);
    if (!inspection) {
      res.status(404).json({ success: false, error: 'Inspection record not found' });
      return;
    }
    res.json({ success: true, data: inspection });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createInspection = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const newInspection: Inspection = {
      id: `insp-${Date.now()}`,
      mineId: body.mineId,
      inspectorId: body.inspectorId || req.user?.id || 'usr-inspector',
      scheduledDate: body.scheduledDate || new Date().toISOString(),
      status: 'SCHEDULED',
      inspectionType: body.inspectionType || 'ROUTINE_STATUTORY',
      summary: body.summary || 'Statutory safety and compliance inspection.',
      findings: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = db.createInspection(newInspection);
    res.status(201).json({ success: true, data: created, message: 'Inspection successfully scheduled' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const addFinding = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const body = req.body;

    const finding: InspectionFinding = {
      id: `fnd-${Date.now()}`,
      inspectionId: id,
      checklistItem: body.checklistItem,
      category: body.category || 'SAFETY',
      observation: body.observation,
      isViolation: Boolean(body.isViolation),
      severity: body.severity || 'HIGH',
      createdAt: new Date().toISOString()
    };

    const inspection = db.addFindingToInspection(id, finding);
    if (!inspection) {
      res.status(404).json({ success: false, error: 'Inspection not found' });
      return;
    }

    res.status(201).json({
      success: true,
      data: inspection,
      message: finding.isViolation
        ? 'Finding logged and automatically escalated to formal statutory violation notice'
        : 'Observation finding logged successfully'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const completeInspection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { overallScore, reportUrl } = req.body;

    const completed = db.updateInspection(id, {
      status: 'COMPLETED',
      completedDate: new Date().toISOString(),
      overallScore: overallScore ? parseFloat(overallScore) : 85.0,
      reportUrl
    });

    if (!completed) {
      res.status(404).json({ success: false, error: 'Inspection not found' });
      return;
    }

    res.json({ success: true, data: completed, message: 'Inspection marked completed & score recorded' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
