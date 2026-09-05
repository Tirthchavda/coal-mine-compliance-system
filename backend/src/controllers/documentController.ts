import { Request, Response } from 'express';
import { db } from '../db/store.js';
import { Document } from '../types/index.js';

export const getDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mineId, category, status, search, expiringWithinDays } = req.query as Record<string, string>;
    let documents = db.getDocuments();

    // Role-based scoping
    if (req.user?.role === 'MINE_MANAGER' && req.user.assignedMineId) {
      documents = documents.filter(d => d.mineId === req.user?.assignedMineId);
    } else if (req.user?.role === 'COMPLIANCE_OFFICER' && req.user.assignedMineId) {
      documents = documents.filter(d => d.mineId === req.user?.assignedMineId);
    } else if (req.user?.role === 'CONTRACTOR' && req.user.assignedMineId) {
      documents = documents.filter(d => d.mineId === req.user?.assignedMineId);
    }

    if (mineId) {
      documents = documents.filter(d => d.mineId === mineId);
    }
    if (category) {
      documents = documents.filter(d => d.category === category);
    }
    if (status) {
      documents = documents.filter(d => d.verificationStatus === status);
    }
    if (expiringWithinDays) {
      const days = parseInt(expiringWithinDays, 10);
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + days);
      documents = documents.filter(d => {
        if (!d.expiryDate) return false;
        const exp = new Date(d.expiryDate);
        return exp >= new Date() && exp <= targetDate;
      });
    }
    if (search) {
      const q = search.toLowerCase();
      documents = documents.filter(d => 
        d.title.toLowerCase().includes(q) ||
        d.originalName.toLowerCase().includes(q) ||
        d.mine?.name.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      data: documents,
      count: documents.length
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getDocumentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const doc = db.getDocumentById(id);
    if (!doc) {
      res.status(404).json({ success: false, error: 'Document not found' });
      return;
    }
    res.json({ success: true, data: doc });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const file = req.file;

    const targetMineId = (req.user?.role === 'MINE_MANAGER' && req.user.assignedMineId)
      ? req.user.assignedMineId
      : body.mineId;

    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      title: body.title,
      category: body.category || 'DGMS_APPROVAL',
      mineId: targetMineId,
      fileUrl: file ? `/uploads/${file.filename}` : '/uploads/sample-statutory-clearance.pdf',
      fileName: file ? file.filename : 'sample-clearance.pdf',
      originalName: file ? file.originalname : `${body.title}.pdf`,
      fileSizeBytes: file ? file.size : 1048576,
      mimeType: file ? file.mimetype : 'application/pdf',
      uploadedById: req.user?.id || 'usr-admin',
      verificationStatus: 'VERIFIED',
      expiryDate: body.expiryDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = db.createDocument(newDoc);
    res.status(201).json({ success: true, data: created, message: 'Document vaulted and indexed' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const uploadDocument = createDocument;

export const deleteDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = db.deleteDocument(id);
    if (!success) {
      res.status(404).json({ success: false, error: 'Document not found' });
      return;
    }
    res.json({ success: true, message: 'Document successfully removed from vault' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
