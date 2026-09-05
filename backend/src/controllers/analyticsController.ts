import { Request, Response } from 'express';
import { db } from '../db/store.js';

export const getDashboardAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    let mines = db.getMines();
    let compliance = db.getComplianceRecords();
    let violations = db.getViolations();
    let actions = db.getCorrectiveActions();
    let inspections = db.getInspections();
    let documents = db.getDocuments();

    // Data Scoping by User Role
    if (req.user?.role === 'MINE_MANAGER' && req.user.assignedMineId) {
      mines = mines.filter(m => m.id === req.user?.assignedMineId);
      compliance = compliance.filter(c => c.mineId === req.user?.assignedMineId);
      violations = violations.filter(v => v.mineId === req.user?.assignedMineId);
      actions = actions.filter(a => a.mineId === req.user?.assignedMineId);
      inspections = inspections.filter(i => i.mineId === req.user?.assignedMineId);
      documents = documents.filter(d => d.mineId === req.user?.assignedMineId);
    } else if (req.user?.role === 'CONTRACTOR') {
      if (req.user.assignedMineId) {
        mines = mines.filter(m => m.id === req.user?.assignedMineId);
      }
      actions = actions.filter(a => a.assignedToId === req.user?.id || (req.user?.assignedMineId && a.mineId === req.user.assignedMineId));
      violations = violations.filter(v => actions.some(a => a.violationId === v.id));
    } else if (req.user?.role === 'COMPLIANCE_OFFICER' && req.user.assignedMineId) {
      mines = mines.filter(m => m.id === req.user?.assignedMineId);
      compliance = compliance.filter(c => c.mineId === req.user?.assignedMineId);
      documents = documents.filter(d => d.mineId === req.user?.assignedMineId);
    }

    const totalMines = mines.length;
    const compliantMines = mines.filter(m => m.riskLevel === 'LOW').length;
    const atRiskMines = mines.filter(m => m.riskLevel === 'HIGH' || m.riskLevel === 'CRITICAL').length;
    const criticalViolations = violations.filter(v => v.severity === 'CRITICAL' && v.status !== 'CLOSED' && v.status !== 'RESOLVED').length;
    const overdueActions = actions.filter(a => a.status === 'OVERDUE' || (new Date(a.deadline) < new Date() && a.status !== 'COMPLETED' && a.status !== 'CLOSED')).length;
    const expiredDocs = documents.filter(d => d.verificationStatus === 'EXPIRED' || (d.expiryDate && new Date(d.expiryDate) < new Date())).length;

    // Severity Breakdown
    const severityBreakdown = {
      critical: violations.filter(v => v.severity === 'CRITICAL').length,
      high: violations.filter(v => v.severity === 'HIGH').length,
      medium: violations.filter(v => v.severity === 'MEDIUM').length,
      low: violations.filter(v => v.severity === 'LOW').length
    };

    // Category Breakdown
    const categories = ['SAFETY', 'ENVIRONMENTAL', 'MINING', 'LABOUR', 'STATUTORY', 'OPERATIONAL'];
    const complianceByCategory = categories.map(cat => {
      const catRecs = compliance.filter(c => c.requirement?.category === cat);
      const compCount = catRecs.filter(c => c.status === 'COMPLIANT').length;
      return {
        category: cat,
        total: catRecs.length,
        compliant: compCount,
        rate: catRecs.length > 0 ? Math.round((compCount / catRecs.length) * 100) : 100
      };
    });

    // 12-Month Trends
    const monthlyTrends = [
      { month: 'Sep 25', complianceRate: 88, violationsLogged: 8, inspectionsCompleted: 4, actionsResolved: 7 },
      { month: 'Oct 25', complianceRate: 89, violationsLogged: 7, inspectionsCompleted: 5, actionsResolved: 6 },
      { month: 'Nov 25', complianceRate: 91, violationsLogged: 5, inspectionsCompleted: 6, actionsResolved: 8 },
      { month: 'Dec 25', complianceRate: 90, violationsLogged: 9, inspectionsCompleted: 4, actionsResolved: 5 },
      { month: 'Jan 26', complianceRate: 92, violationsLogged: 6, inspectionsCompleted: 7, actionsResolved: 9 },
      { month: 'Feb 26', complianceRate: 94, violationsLogged: 4, inspectionsCompleted: 8, actionsResolved: 11 },
      { month: 'Mar 26', complianceRate: 93, violationsLogged: 7, inspectionsCompleted: 6, actionsResolved: 8 },
      { month: 'Apr 26', complianceRate: 91, violationsLogged: 8, inspectionsCompleted: 5, actionsResolved: 7 },
      { month: 'May 26', complianceRate: 93, violationsLogged: 5, inspectionsCompleted: 7, actionsResolved: 10 },
      { month: 'Jun 26', complianceRate: 95, violationsLogged: 3, inspectionsCompleted: 9, actionsResolved: 12 },
      { month: 'Jul 26', complianceRate: 92, violationsLogged: 6, inspectionsCompleted: 6, actionsResolved: 7 },
      { month: 'Aug 26', complianceRate: 94, violationsLogged: 4, inspectionsCompleted: 8, actionsResolved: 9 }
    ];

    const topMines = mines.map(m => ({
      id: m.id,
      name: m.name,
      code: m.code,
      state: m.state,
      score: m.complianceScore,
      risk: m.riskLevel,
      violationsCount: violations.filter(v => v.mineId === m.id && v.status !== 'CLOSED').length
    }));

    const avgScore = mines.length > 0 
      ? Math.round(mines.reduce((acc, m) => acc + m.complianceScore, 0) / mines.length)
      : 90;

    res.json({
      success: true,
      data: {
        kpis: {
          totalMines,
          compliantMines,
          atRiskMines,
          criticalViolations,
          overdueActions,
          expiredDocs,
          averageComplianceScore: avgScore
        },
        severityBreakdown,
        complianceByCategory,
        monthlyTrends,
        topMines,
        recentActivity: db.getAuditLogs().slice(0, 10)
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
