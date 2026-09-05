import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  User,
  Mine,
  ComplianceRequirement,
  ComplianceRecord,
  Inspection,
  InspectionFinding,
  Violation,
  CorrectiveAction,
  Document,
  SafetyRecord,
  EnvironmentalRecord,
  Alert,
  AIPrediction,
  AuditLog
} from '../types/index.js';
import { generateSeedData } from './seedData.js';

interface DatabaseSchema {
  users: User[];
  mines: Mine[];
  requirements: ComplianceRequirement[];
  complianceRecords: ComplianceRecord[];
  inspections: Inspection[];
  inspectionFindings: InspectionFinding[];
  violations: Violation[];
  correctiveActions: CorrectiveAction[];
  documents: Document[];
  safetyRecords: SafetyRecord[];
  environmentalData: EnvironmentalRecord[];
  alerts: Alert[];
  aiPredictions: AIPrediction[];
  auditLogs: AuditLog[];
}

export class DatabaseStore {
  private data: DatabaseSchema;
  private filePath: string;

  constructor(filePath?: string) {
    const defaultDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(defaultDir)) {
      try {
        fs.mkdirSync(defaultDir, { recursive: true });
      } catch (e) {
        // Fallback
      }
    }
    this.filePath = filePath || path.resolve(defaultDir, 'coal_governance_db.json');
    this.data = this.loadOrSeed();
  }

  private loadOrSeed(): DatabaseSchema {
    if (fs.existsSync(this.filePath)) {
      try {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.mines && parsed.users && parsed.complianceRecords) {
          return parsed;
        }
      } catch (err) {
        console.warn('Could not read existing database file, reseeding initial data...');
      }
    }
    const seed = generateSeedData();
    this.persist(seed);
    return seed;
  }

  private persist(dataToSave?: DatabaseSchema) {
    try {
      const data = dataToSave || this.data;
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting database state to disk:', err);
    }
  }

  public resetToSeed() {
    this.data = generateSeedData();
    this.persist();
  }

  // --- USERS ---
  public getUsers() { return this.data.users; }
  public getUserById(id: string) { return this.data.users.find(u => u.id === id); }
  public getUserByEmail(email: string) { return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase()); }
  public createUser(user: User) {
    this.data.users.push(user);
    this.persist();
    return user;
  }
  public updateUser(id: string, updates: Partial<User>) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates, updatedAt: new Date().toISOString() };
    this.persist();
    return this.data.users[idx];
  }
  public deleteUser(id: string) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return false;
    this.data.users.splice(idx, 1);
    this.persist();
    return true;
  }

  // --- MINES ---
  public getMines() { return this.data.mines; }
  public getMineById(id: string) { 
    return this.data.mines.find(m => m.id === id || m.code.toLowerCase() === id.toLowerCase()); 
  }
  public createMine(mine: Mine) {
    this.data.mines.push(mine);
    this.recalculateMineScores(mine.id);
    this.persist();
    return mine;
  }
  public updateMine(id: string, updates: Partial<Mine>) {
    const idx = this.data.mines.findIndex(m => m.id === id);
    if (idx === -1) return null;
    this.data.mines[idx] = { ...this.data.mines[idx], ...updates, updatedAt: new Date().toISOString() };
    this.recalculateMineScores(id);
    this.persist();
    return this.data.mines[idx];
  }
  public deleteMine(id: string) {
    const idx = this.data.mines.findIndex(m => m.id === id);
    if (idx === -1) return false;
    this.data.mines.splice(idx, 1);
    this.persist();
    return true;
  }

  // --- COMPLIANCE REQUIREMENTS ---
  public getRequirements() { return this.data.requirements; }
  public getRequirementById(id: string) { return this.data.requirements.find(r => r.id === id); }
  public createRequirement(req: ComplianceRequirement) {
    this.data.requirements.push(req);
    this.persist();
    return req;
  }

  // --- COMPLIANCE RECORDS ---
  public getComplianceRecords() { 
    return this.data.complianceRecords.map(r => this.populateCompliance(r)); 
  }
  public getComplianceById(id: string) {
    const rec = this.data.complianceRecords.find(r => r.id === id);
    return rec ? this.populateCompliance(rec) : null;
  }
  public createCompliance(rec: ComplianceRecord) {
    this.data.complianceRecords.push(rec);
    this.recalculateMineScores(rec.mineId);
    this.persist();
    return this.populateCompliance(rec);
  }
  public updateCompliance(id: string, updates: Partial<ComplianceRecord>) {
    const idx = this.data.complianceRecords.findIndex(r => r.id === id);
    if (idx === -1) return null;
    this.data.complianceRecords[idx] = { ...this.data.complianceRecords[idx], ...updates, updatedAt: new Date().toISOString() };
    this.recalculateMineScores(this.data.complianceRecords[idx].mineId);
    this.persist();
    return this.populateCompliance(this.data.complianceRecords[idx]);
  }
  public deleteCompliance(id: string) {
    const idx = this.data.complianceRecords.findIndex(r => r.id === id);
    if (idx === -1) return false;
    const mineId = this.data.complianceRecords[idx].mineId;
    this.data.complianceRecords.splice(idx, 1);
    this.recalculateMineScores(mineId);
    this.persist();
    return true;
  }

  // --- INSPECTIONS ---
  public getInspections() { 
    return this.data.inspections.map(i => this.populateInspection(i)); 
  }
  public getInspectionById(id: string) {
    const insp = this.data.inspections.find(i => i.id === id);
    return insp ? this.populateInspection(insp) : null;
  }
  public createInspection(insp: Inspection) {
    this.data.inspections.push(insp);
    this.persist();
    return this.populateInspection(insp);
  }
  public updateInspection(id: string, updates: Partial<Inspection>) {
    const idx = this.data.inspections.findIndex(i => i.id === id);
    if (idx === -1) return null;
    this.data.inspections[idx] = { ...this.data.inspections[idx], ...updates, updatedAt: new Date().toISOString() };
    this.persist();
    return this.populateInspection(this.data.inspections[idx]);
  }
  public deleteInspection(id: string) {
    const idx = this.data.inspections.findIndex(i => i.id === id);
    if (idx === -1) return false;
    this.data.inspections.splice(idx, 1);
    this.persist();
    return true;
  }

  // --- INSPECTION FINDINGS ---
  public getFindingsByInspectionId(inspectionId: string) {
    return this.data.inspectionFindings.filter(f => f.inspectionId === inspectionId);
  }
  public createFinding(finding: InspectionFinding) {
    this.data.inspectionFindings.push(finding);
    this.persist();
    return finding;
  }

  // --- VIOLATIONS ---
  public getViolations() {
    return this.data.violations.map(v => this.populateViolation(v));
  }
  public getViolationById(id: string) {
    const v = this.data.violations.find(viol => viol.id === id);
    return v ? this.populateViolation(v) : null;
  }
  public createViolation(viol: Violation) {
    this.data.violations.push(viol);
    this.recalculateMineScores(viol.mineId);
    this.persist();
    return this.populateViolation(viol);
  }
  public updateViolation(id: string, updates: Partial<Violation>) {
    const idx = this.data.violations.findIndex(v => v.id === id);
    if (idx === -1) return null;
    this.data.violations[idx] = { ...this.data.violations[idx], ...updates, updatedAt: new Date().toISOString() };
    this.recalculateMineScores(this.data.violations[idx].mineId);
    this.persist();
    return this.populateViolation(this.data.violations[idx]);
  }
  public deleteViolation(id: string) {
    const idx = this.data.violations.findIndex(v => v.id === id);
    if (idx === -1) return false;
    const mineId = this.data.violations[idx].mineId;
    this.data.violations.splice(idx, 1);
    this.recalculateMineScores(mineId);
    this.persist();
    return true;
  }

  // --- CORRECTIVE ACTIONS ---
  public getCorrectiveActions() {
    return this.data.correctiveActions.map(a => this.populateAction(a));
  }
  public getActionById(id: string) {
    const a = this.data.correctiveActions.find(act => act.id === id);
    return a ? this.populateAction(a) : null;
  }
  public createAction(act: CorrectiveAction) {
    this.data.correctiveActions.push(act);
    this.recalculateMineScores(act.mineId);
    this.persist();
    return this.populateAction(act);
  }
  public updateAction(id: string, updates: Partial<CorrectiveAction>) {
    const idx = this.data.correctiveActions.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.data.correctiveActions[idx] = { ...this.data.correctiveActions[idx], ...updates, updatedAt: new Date().toISOString() };
    
    // Auto-update linked violation if action closed
    if (updates.status === 'CLOSED' || updates.status === 'COMPLETED') {
      const vIdx = this.data.violations.findIndex(v => v.id === this.data.correctiveActions[idx].violationId);
      if (vIdx !== -1 && updates.status === 'CLOSED') {
        this.data.violations[vIdx].status = 'RESOLVED';
      }
    }

    this.recalculateMineScores(this.data.correctiveActions[idx].mineId);
    this.persist();
    return this.populateAction(this.data.correctiveActions[idx]);
  }
  public deleteAction(id: string) {
    const idx = this.data.correctiveActions.findIndex(a => a.id === id);
    if (idx === -1) return false;
    const mineId = this.data.correctiveActions[idx].mineId;
    this.data.correctiveActions.splice(idx, 1);
    this.recalculateMineScores(mineId);
    this.persist();
    return true;
  }

  // --- DOCUMENTS ---
  public getDocuments() {
    return this.data.documents.map(d => this.populateDocument(d));
  }
  public getDocumentById(id: string) {
    const d = this.data.documents.find(doc => doc.id === id);
    return d ? this.populateDocument(d) : null;
  }
  public createDocument(doc: Document) {
    this.data.documents.push(doc);
    this.persist();
    return this.populateDocument(doc);
  }
  public updateDocument(id: string, updates: Partial<Document>) {
    const idx = this.data.documents.findIndex(d => d.id === id);
    if (idx === -1) return null;
    this.data.documents[idx] = { ...this.data.documents[idx], ...updates, updatedAt: new Date().toISOString() };
    this.persist();
    return this.populateDocument(this.data.documents[idx]);
  }
  public deleteDocument(id: string) {
    const idx = this.data.documents.findIndex(d => d.id === id);
    if (idx === -1) return false;
    this.data.documents.splice(idx, 1);
    this.persist();
    return true;
  }

  // --- SAFETY ---
  public getSafetyRecords() { return this.data.safetyRecords; }
  public createSafetyRecord(rec: SafetyRecord) {
    this.data.safetyRecords.push(rec);
    this.persist();
    return rec;
  }

  // --- ENVIRONMENTAL ---
  public getEnvironmentalData() { return this.data.environmentalData; }
  public createEnvironmentalRecord(rec: EnvironmentalRecord) {
    this.data.environmentalData.push(rec);
    this.persist();
    return rec;
  }

  // --- ALERTS ---
  public getAlerts() { return this.data.alerts; }
  public markAlertRead(id: string) {
    const alert = this.data.alerts.find(a => a.id === id);
    if (alert) {
      alert.isRead = true;
      this.persist();
    }
    return alert;
  }
  public createAlert(alert: Alert) {
    this.data.alerts.unshift(alert);
    this.persist();
    return alert;
  }

  // --- AI PREDICTIONS ---
  public getAIPredictions() { return this.data.aiPredictions; }
  public getAIPredictionByMine(mineId: string) { 
    return this.data.aiPredictions.find(p => p.mineId === mineId); 
  }
  public updateAIPrediction(id: string, updates: Partial<AIPrediction>) {
    const idx = this.data.aiPredictions.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.aiPredictions[idx] = { ...this.data.aiPredictions[idx], ...updates };
    this.persist();
    return this.data.aiPredictions[idx];
  }
  public createAIPrediction(pred: AIPrediction) {
    const existingIdx = this.data.aiPredictions.findIndex(p => p.mineId === pred.mineId);
    if (existingIdx !== -1) {
      this.data.aiPredictions[existingIdx] = pred;
    } else {
      this.data.aiPredictions.push(pred);
    }
    this.persist();
    return pred;
  }

  // --- AUDIT LOGS ---
  public getAuditLogs() { return this.data.auditLogs; }
  public createAuditLog(log: AuditLog) {
    this.data.auditLogs.unshift(log);
    this.persist();
    return log;
  }

  // --- DYNAMIC RE-CALCULATION & JOINS ---
  private recalculateMineScores(mineId: string) {
    const mine = this.data.mines.find(m => m.id === mineId);
    if (!mine) return;

    const mineComps = this.data.complianceRecords.filter(c => c.mineId === mineId);
    const mineViols = this.data.violations.filter(v => v.mineId === mineId && v.status !== 'CLOSED' && v.status !== 'RESOLVED');
    const criticalViols = mineViols.filter(v => v.severity === 'CRITICAL').length;
    const highViols = mineViols.filter(v => v.severity === 'HIGH').length;

    let baseScore = 100;
    if (mineComps.length > 0) {
      const compliantCount = mineComps.filter(c => c.status === 'COMPLIANT').length;
      const partialCount = mineComps.filter(c => c.status === 'PARTIALLY_COMPLIANT').length;
      baseScore = Math.round(((compliantCount * 1.0 + partialCount * 0.5) / mineComps.length) * 100);
    }

    // Deductions for active violations
    baseScore = Math.max(10, baseScore - (criticalViols * 12) - (highViols * 5));
    mine.complianceScore = baseScore;

    if (baseScore < 60 || criticalViols >= 2) {
      mine.riskLevel = 'CRITICAL';
    } else if (baseScore < 75 || criticalViols === 1 || highViols >= 3) {
      mine.riskLevel = 'HIGH';
    } else if (baseScore < 88 || highViols >= 1) {
      mine.riskLevel = 'MEDIUM';
    } else {
      mine.riskLevel = 'LOW';
    }
  }

  private populateCompliance(rec: ComplianceRecord): ComplianceRecord {
    const requirement = this.data.requirements.find(r => r.id === rec.requirementId);
    const mine = this.data.mines.find(m => m.id === rec.mineId);
    const officer = this.data.users.find(u => u.id === rec.responsibleOfficerId);
    return {
      ...rec,
      requirement,
      mine,
      responsibleOfficer: officer
    };
  }

  private populateInspection(insp: Inspection): Inspection {
    const mine = this.data.mines.find(m => m.id === insp.mineId);
    const inspector = this.data.users.find(u => u.id === insp.inspectorId);
    const findings = this.data.inspectionFindings.filter(f => f.inspectionId === insp.id);
    return {
      ...insp,
      mine,
      inspector,
      findings
    };
  }

  private populateViolation(viol: Violation): Violation {
    const mine = this.data.mines.find(m => m.id === viol.mineId);
    const compliance = this.data.complianceRecords.find(c => c.id === viol.complianceRecordId);
    const inspection = this.data.inspections.find(i => i.id === viol.inspectionId);
    const responsible = this.data.users.find(u => u.id === viol.responsiblePersonId);
    const actions = this.data.correctiveActions.filter(a => a.violationId === viol.id);
    return {
      ...viol,
      mine,
      complianceRecord: compliance ? this.populateCompliance(compliance) : undefined,
      inspection,
      responsiblePerson: responsible,
      correctiveActions: actions
    };
  }

  private populateAction(act: CorrectiveAction): CorrectiveAction {
    const mine = this.data.mines.find(m => m.id === act.mineId);
    const viol = this.data.violations.find(v => v.id === act.violationId);
    const assignee = this.data.users.find(u => u.id === act.assignedToId);
    const verifier = this.data.users.find(u => u.id === act.verifiedById);
    return {
      ...act,
      mine,
      violation: viol,
      assignedTo: assignee,
      verifiedBy: verifier
    };
  }

  private populateDocument(doc: Document): Document {
    const mine = this.data.mines.find(m => m.id === doc.mineId);
    const uploader = this.data.users.find(u => u.id === doc.uploadedById);
    return {
      ...doc,
      mine,
      uploadedBy: uploader
    };
  }
}

// Export singleton database instance
export const db = new DatabaseStore();

