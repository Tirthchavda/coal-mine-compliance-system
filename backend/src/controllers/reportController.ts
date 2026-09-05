import { Request, Response } from 'express';
import { db } from '../db/store.js';

export const getFormIVReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mineId } = req.params;
    const mine = db.getMineById(mineId);

    if (!mine) {
      res.status(404).json({ success: false, error: 'Colliery not found for Form IV generation.' });
      return;
    }

    const complianceObligations = db.getComplianceRecords().filter(c => c.mineId === mine.id);
    const activeViolations = db.getViolations().filter(v => v.mineId === mine.id && v.status !== 'CLOSED');
    const safetyRecords = db.getSafetyRecords().filter(s => s.mineId === mine.id);
    const documents = db.getDocuments().filter(d => d.mineId === mine.id);

    const compliantCount = complianceObligations.filter(c => c.status === 'COMPLIANT').length;
    const totalObligations = complianceObligations.length;
    const score = totalObligations > 0 ? Math.round((compliantCount / totalObligations) * 100) : 100;

    res.json({
      success: true,
      data: {
        formType: 'FORM_IV_ANNUAL_STATUTORY_RETURN',
        act: 'Mines Act, 1952 [Section 48] & Coal Mines Regulations 2017',
        year: 2026,
        generatedDate: new Date().toISOString(),
        mine: {
          id: mine.id,
          name: mine.name,
          code: mine.code,
          owner: mine.owner,
          managerName: mine.managerName,
          state: mine.state,
          district: mine.district,
          capacityMTPA: mine.capacityMTPA,
          type: mine.type
        },
        summary: {
          overallComplianceScore: score,
          totalStatutoryObligations: totalObligations,
          compliantObligations: compliantCount,
          activeViolationsCount: activeViolations.length,
          safetyIncidentCount: safetyRecords.length,
          clearancesVaultedCount: documents.length
        },
        complianceObligations: complianceObligations.map(c => ({
          id: c.id,
          regulationReference: c.requirement?.regulationReference || 'CMR Sec 104',
          title: c.requirement?.title || 'Safety Obligation',
          regulatoryAuthority: c.requirement?.regulatoryAuthority || 'DGMS',
          dueDate: c.dueDate,
          status: c.status
        })),
        activeViolations: activeViolations.map(v => ({
          id: v.id,
          title: v.title,
          severity: v.severity,
          deadline: v.deadline,
          status: v.status
        }))
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const generateReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reportType, mineId, format } = req.query as Record<string, string>;

    let title = 'Statutory Compliance & Governance Monitoring Report';
    let headers: string[] = [];
    let rows: any[] = [];

    if (reportType === 'VIOLATIONS') {
      title = 'DGMS Statutory Violations & Enforcement Notice Log';
      headers = ['Violation ID', 'Colliery', 'Title', 'Severity', 'Category', 'Status', 'Deadline'];
      let list = db.getViolations();
      if (mineId) list = list.filter(v => v.mineId === mineId);
      rows = list.map(v => ({
        id: v.id,
        colliery: v.mine?.name,
        title: v.title,
        severity: v.severity,
        category: v.category,
        status: v.status,
        deadline: v.deadline
      }));
    } else if (reportType === 'INSPECTIONS') {
      title = 'DGMS Safety Inspections & Audits Return';
      headers = ['Inspection ID', 'Colliery', 'Type', 'Scheduled Date', 'Status', 'Score', 'Inspector'];
      let list = db.getInspections();
      if (mineId) list = list.filter(i => i.mineId === mineId);
      rows = list.map(i => ({
        id: i.id,
        colliery: i.mine?.name,
        type: i.inspectionType,
        date: i.scheduledDate,
        status: i.status,
        score: i.overallScore ? `${i.overallScore}%` : 'Pending',
        inspector: i.inspector?.name
      }));
    } else if (reportType === 'MINES') {
      title = 'National Coal Mines Directory & Risk Benchmark Return';
      headers = ['Code', 'Colliery Name', 'State', 'Type', 'Compliance Score', 'Risk Level', 'Status'];
      const list = db.getMines();
      rows = list.map(m => ({
        code: m.code,
        name: m.name,
        state: m.state,
        type: m.type,
        score: `${m.complianceScore}%`,
        risk: m.riskLevel,
        status: m.operationalStatus
      }));
    } else {
      // Default COMPLIANCE
      title = 'Statutory Compliance Obligations & Status Statement';
      headers = ['Obligation ID', 'Clause Reference', 'Colliery', 'Category', 'Authority', 'Due Date', 'Status'];
      let list = db.getComplianceRecords();
      if (mineId) list = list.filter(c => c.mineId === mineId);
      rows = list.map(c => ({
        id: c.id,
        ref: c.requirement?.regulationReference,
        colliery: c.mine?.name,
        category: c.requirement?.category,
        authority: c.requirement?.regulatoryAuthority,
        dueDate: c.dueDate,
        status: c.status
      }));
    }

    if (format === 'csv') {
      const csvHeader = headers.join(',') + '\n';
      const csvRows = rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${reportType || 'Compliance'}_Report_${Date.now()}.csv"`);
      res.send(csvHeader + csvRows);
      return;
    }

    res.json({
      success: true,
      title,
      generatedAt: new Date().toISOString(),
      recordCount: rows.length,
      headers,
      data: rows
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
