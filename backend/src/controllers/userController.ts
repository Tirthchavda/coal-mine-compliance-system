import { Request, Response } from 'express';
import { hashPassword } from '../utils/bcrypt.js';
import { db } from '../db/store.js';
import { User } from '../types/index.js';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role, mineId, search } = req.query as Record<string, string>;
    let users = db.getUsers();

    if (role) {
      users = users.filter(u => u.role === role);
    }
    if (mineId) {
      users = users.filter(u => u.assignedMineId === mineId);
    }
    if (search) {
      const q = search.toLowerCase();
      users = users.filter(u => 
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      data: users.map(u => ({ ...u, passwordHash: undefined })),
      count: users.length
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const passwordHash = await hashPassword(body.password || 'CoalGov@2026');

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: body.name,
      email: body.email.toLowerCase(),
      passwordHash,
      role: body.role || 'COMPLIANCE_OFFICER',
      department: body.department || 'Statutory Compliance Wing',
      phone: body.phone,
      assignedMineId: body.assignedMineId,
      status: body.status || 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = db.createUser(newUser);
    res.status(201).json({
      success: true,
      data: { ...created, passwordHash: undefined },
      message: 'Official user created successfully'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.password) {
      updates.passwordHash = await hashPassword(updates.password);
      delete updates.password;
    }

    const updated = db.updateUser(id, updates);
    if (!updated) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }
    const { passwordHash: _, ...safe } = updated;
    res.json({ success: true, data: safe, message: 'User updated' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = db.deleteUser(id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }
    res.json({ success: true, message: 'User deleted' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

