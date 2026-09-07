import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/authRoutes.js';
import mineRoutes from './routes/mineRoutes.js';
import complianceRoutes from './routes/complianceRoutes.js';
import inspectionRoutes from './routes/inspectionRoutes.js';
import violationRoutes from './routes/violationRoutes.js';
import actionRoutes from './routes/actionRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import safetyRoutes from './routes/safetyRoutes.js';
import environmentRoutes from './routes/environmentRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import userRoutes from './routes/userRoutes.js';

import { errorHandler } from './middleware/errorHandler.js';
import { setupSwagger } from './swagger.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure upload directory exists
const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (e) {}
}

// Universal Robust CORS Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads serving
app.use('/uploads', express.static(uploadDir));

// API Documentation
setupSwagger(app);

// Root Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'HEALTHY',
    service: 'Coal Mine Statutory Compliance & Governance Monitoring Backend',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/mines', mineRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/violations', violationRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/environment', environmentRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);

// Check if Frontend Static Build is available and serve it
const candidateDistPaths = [
  path.resolve(process.cwd(), '../frontend/dist'),
  path.resolve(process.cwd(), 'frontend/dist'),
  path.resolve(process.cwd(), 'dist'),
  path.resolve(process.cwd(), '../dist')
];

const frontendDistPath = candidateDistPaths.find(p => fs.existsSync(path.join(p, 'index.html')));

if (frontendDistPath) {
  console.log(`Serving unified Frontend Static UI from: ${frontendDistPath}`);
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.status(200).json({
      status: 'ONLINE',
      service: 'Coal Mine Statutory Compliance & Governance Monitoring Backend',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  });
}

// Centralized error handling
app.use(errorHandler);

// Start Server binding on 0.0.0.0 for cloud containers
if (process.env.NODE_ENV !== 'test') {
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`================================================================`);
    console.log(` Coal Mine Statutory Compliance & Governance Monitoring Backend `);
    console.log(` Active Port: http://0.0.0.0:${PORT}                          `);
    console.log(` OpenAPI Docs: http://localhost:${PORT}/api/docs                 `);
    console.log(` Health Check: http://localhost:${PORT}/api/health               `);
    console.log(`================================================================`);
  });
}

export default app;
