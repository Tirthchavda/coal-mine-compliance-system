import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getDocuments, uploadDocument, deleteDocument } from '../controllers/documentController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { logAudit } from '../middleware/audit.js';

const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  try { fs.mkdirSync(uploadDir, { recursive: true }); } catch (e) {}
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `clearance-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`);
  }
});

const upload = multer({ storage, limits: { fileSize: 25 * 1024 * 1024 } });

const router = Router();

router.get('/', getDocuments);

router.post(
  '/',
  authenticateToken,
  requireRole(['SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'MINE_MANAGER', 'HQ_MANAGEMENT']),
  upload.single('file'),
  logAudit('DOCUMENT_UPLOADED', 'DOCUMENT'),
  uploadDocument
);

router.delete(
  '/:id',
  authenticateToken,
  requireRole(['SUPER_ADMIN']),
  logAudit('DOCUMENT_DELETED', 'DOCUMENT'),
  deleteDocument
);

export default router;
