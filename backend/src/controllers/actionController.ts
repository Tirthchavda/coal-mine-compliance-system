import { Request, Response } from 'express';
import { db } from '../db/store.js';
import { CorrectiveAction } from '../types/index.js';

export const getActions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mineId, status, priority, overdueOnly, search } = req.query as Record<string, string>;
    let actions = db.getCorrectiveActions();

    // Role-based data scoping
    if (req.user?.role === 'CONTRACTOR') {
      actions = actions.filter(a => a.assignedToId === req.user?.id || (req.user?.assignedMineId && a.mineId === req.user.assignedMineId));
    } else if (req.user?.role === 'MINE_MANAGER' && req.user.assignedMineId) {
      actions = actions.filter(a => a.mineId === req.user?.assignedMineId);
    } else if (req.user?.role === 'COMPLIANCE_OFFICER' && req.user.assignedMineId) {
      actions = actions.filter(a => a.mineId === req.user?.assignedMineId);
    }

    if (mineId) {
      actions = actions.filter(a => a.mineId === mineId);
    }
    if (status) {
      actions = actions.filter(a => a.status === status);
    }
    if (priority) {
      actions = actions.filter(a => a.priority === priority);
    }
    if (overdueOnly === 'true') {
      actions = actions.filter(a => a.status === 'OVERDUE' || (new Date(a.deadline) < new Date() && a.status !== 'COMPLETED' && a.status !== 'CLOSED'));
    }
    if (search) {
      const q = search.toLowerCase();
      actions = actions.filter(a => 
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.assignedTo?.name.toLowerCase().includes(q) ||
        a.mine?.name.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      data: actions,
      count: actions.length
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const targetMineId = (req.user?.role === 'MINE_MANAGER' && req.user.assignedMineId)
      ? req.user.assignedMineId
      : body.mineId;

    const newAction: CorrectiveAction = {
      id: `act-${Date.now()}`,
      violationId: body.violationId,
      mineId: targetMineId,
      title: body.title,
      description: body.description,
      assignedToId: body.assignedToId || req.user?.id,
      deadline: body.deadline || '2026-09-30',
      priority: body.priority || 'HIGH',
      status: 'OPEN',
      progressPercentage: 0,
      remarks: body.remarks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = db.createAction(newAction);

    // Update violation status to IN_PROGRESS
    if (body.violationId) {
      db.updateViolation(body.violationId, { status: 'IN_PROGRESS' });
    }

    res.status(201).json({ success: true, data: created, message: 'Corrective action plan assigned' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.progressPercentage === 100 && updates.status !== 'CLOSED') {
      updates.status = 'PENDING_VERIFICATION';
      updates.completedDate = new Date().toISOString();
    } else if (updates.progressPercentage > 0 && updates.status === 'OPEN') {
      updates.status = 'IN_PROGRESS';
    }

    const updated = db.updateAction(id, updates);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Action record not found' });
      return;
    }
    res.json({ success: true, data: updated, message: 'CAPA progress updated' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const verifyAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isApproved, remarks } = req.body;

    const action = db.getActionById(id);
    if (!action) {
      res.status(404).json({ success: false, error: 'Action record not found' });
      return;
    }

    let updated;
    if (isApproved) {
      updated = db.updateAction(id, {
        status: 'CLOSED',
        progressPercentage: 100,
        verifiedById: req.user?.id || 'usr-inspector',
        verifiedAt: new Date().toISOString(),
        remarks: remarks || 'Verified and approved on physical site inspection.'
      });
    } else {
      updated = db.updateAction(id, {
        status: 'IN_PROGRESS',
        progressPercentage: 60,
        remarks: `Verification rejected: ${remarks || 'Physical remediation deficient'}`
      });
    }

    res.json({ success: true, data: updated, message: isApproved ? 'Remediation officially certified' : 'Remediation rejected' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
