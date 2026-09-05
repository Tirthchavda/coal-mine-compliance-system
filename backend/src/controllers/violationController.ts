import { Request, Response } from 'express';
import { db } from '../db/store.js';
import { Violation } from '../types/index.js';

export const getViolations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mineId, category, severity, status, search } = req.query as Record<string, string>;
    let violations = db.getViolations();

    // Role-based data scoping
    if (req.user?.role === 'MINE_MANAGER' && req.user.assignedMineId) {
      violations = violations.filter(v => v.mineId === req.user?.assignedMineId);
    } else if (req.user?.role === 'COMPLIANCE_OFFICER' && req.user.assignedMineId) {
      violations = violations.filter(v => v.mineId === req.user?.assignedMineId);
    } else if (req.user?.role === 'CONTRACTOR' && req.user.assignedMineId) {
      violations = violations.filter(v => v.mineId === req.user?.assignedMineId);
    }

    if (mineId) {
      violations = violations.filter(v => v.mineId === mineId);
    }
    if (category) {
      violations = violations.filter(v => v.category === category);
    }
    if (severity) {
      violations = violations.filter(v => v.severity === severity);
    }
    if (status) {
      violations = violations.filter(v => v.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      violations = violations.filter(v => 
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.mine?.name.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      data: violations,
      count: violations.length
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getViolationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const violation = db.getViolationById(id);
    if (!violation) {
      res.status(404).json({ success: false, error: 'Violation record not found' });
      return;
    }
    res.json({ success: true, data: violation });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createViolation = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const newViolation: Violation = {
      id: `viol-${Date.now()}`,
      mineId: body.mineId,
      inspectionId: body.inspectionId,
      complianceRecordId: body.complianceRecordId,
      category: body.category || 'SAFETY',
      severity: body.severity || 'HIGH',
      title: body.title,
      description: body.description,
      status: 'OPEN',
      deadline: body.deadline || '2026-09-20',
      remedialAction: body.remedialAction,
      issuedDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = db.createViolation(newViolation);
    res.status(201).json({ success: true, data: created, message: 'Statutory violation notice officially issued' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateViolation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = db.updateViolation(id, updates);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Violation record not found' });
      return;
    }
    res.json({ success: true, data: updated, message: 'Violation status updated' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
