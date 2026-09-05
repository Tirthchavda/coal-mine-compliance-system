import { Request, Response } from 'express';
import { db } from '../db/store.js';
import { ComplianceRecord } from '../types/index.js';

export const getComplianceRecords = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mineId, category, status, riskLevel, search } = req.query as Record<string, string>;
    let records = db.getComplianceRecords();

    // Role-based data scoping
    if (req.user?.role === 'MINE_MANAGER' && req.user.assignedMineId) {
      records = records.filter(r => r.mineId === req.user?.assignedMineId);
    } else if (req.user?.role === 'COMPLIANCE_OFFICER' && req.user.assignedMineId) {
      records = records.filter(r => r.mineId === req.user?.assignedMineId);
    } else if (req.user?.role === 'CONTRACTOR' && req.user.assignedMineId) {
      records = records.filter(r => r.mineId === req.user?.assignedMineId);
    }

    if (mineId) {
      records = records.filter(r => r.mineId === mineId);
    }
    if (category) {
      records = records.filter(r => r.requirement?.category === category);
    }
    if (status) {
      records = records.filter(r => r.status === status);
    }
    if (riskLevel) {
      records = records.filter(r => r.riskLevel === riskLevel);
    }
    if (search) {
      const q = search.toLowerCase();
      records = records.filter(r => 
        r.requirement?.title.toLowerCase().includes(q) ||
        r.requirement?.regulationReference.toLowerCase().includes(q) ||
        r.requirement?.requirement.toLowerCase().includes(q) ||
        r.mine?.name.toLowerCase().includes(q) ||
        (r.remarks && r.remarks.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      data: records,
      count: records.length
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getComplianceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const record = db.getComplianceById(id);
    if (!record) {
      res.status(404).json({ success: false, error: 'Statutory compliance obligation not found' });
      return;
    }

    // Role check if mine manager or contractor
    if (req.user?.role === 'MINE_MANAGER' && req.user.assignedMineId && record.mineId !== req.user.assignedMineId) {
      res.status(403).json({ success: false, error: 'Unauthorized to view compliance records of another colliery.' });
      return;
    }

    // Get linked violations and corrective actions
    const relatedViolations = db.getViolations().filter(v => v.complianceRecordId === record.id);
    const relatedActions = db.getCorrectiveActions().filter(a => relatedViolations.some(v => v.id === a.violationId));

    res.json({
      success: true,
      data: {
        ...record,
        relatedViolations,
        relatedActions
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getRequirements = async (req: Request, res: Response): Promise<void> => {
  try {
    const reqs = db.getRequirements();
    res.json({ success: true, data: reqs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createComplianceRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const targetMineId = (req.user?.role === 'MINE_MANAGER' && req.user.assignedMineId)
      ? req.user.assignedMineId
      : body.mineId;

    const newRecord: ComplianceRecord = {
      id: `comp-${Date.now()}`,
      requirementId: body.requirementId,
      mineId: targetMineId,
      status: body.status || 'PENDING',
      applicableDate: body.applicableDate || new Date().toISOString(),
      dueDate: body.dueDate || '2026-10-31',
      responsibleOfficerId: body.responsibleOfficerId || req.user?.id,
      riskLevel: body.riskLevel || 'LOW',
      remarks: body.remarks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = db.createCompliance(newRecord);
    res.status(201).json({ success: true, data: created, message: 'Compliance obligation scheduled' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateComplianceRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.status === 'COMPLIANT') {
      updates.lastVerifiedAt = new Date().toISOString();
    }
    const updated = db.updateCompliance(id, updates);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Compliance record not found' });
      return;
    }
    res.json({ success: true, data: updated, message: 'Compliance status updated' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
