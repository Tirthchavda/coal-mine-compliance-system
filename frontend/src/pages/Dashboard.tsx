import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { UserRole } from '../types';
import { MOCK_MINES, MOCK_VIOLATIONS } from '../data/mockData';

// Role-Specific Custom Dashboards
import { SuperAdminDashboard } from '../components/dashboards/SuperAdminDashboard';
import { HQManagementDashboard } from '../components/dashboards/HQManagementDashboard';
import { MineManagerDashboard } from '../components/dashboards/MineManagerDashboard';
import { SafetyInspectorDashboard } from '../components/dashboards/SafetyInspectorDashboard';
import { ComplianceOfficerDashboard } from '../components/dashboards/ComplianceOfficerDashboard';
import { ContractorDashboard } from '../components/dashboards/ContractorDashboard';
import { WorkerDashboard } from '../components/dashboards/WorkerDashboard';

const DEFAULT_DASHBOARD_DATA = {
  kpis: {
    totalMines: 15,
    compliantMines: 10,
    atRiskMines: 3,
    criticalMines: 2,
    criticalViolations: 4,
    activeViolations: 15,
    overdueActions: 3,
    pendingActions: 12,
    avgComplianceScore: 86.4,
    upcomingDeadlines: 7,
    expiredDocuments: 2,
    avgSafetyScore: 92,
    avgEnvScore: 88
  },
  severityCounts: {
    CRITICAL: 4,
    HIGH: 6,
    MEDIUM: 3,
    LOW: 2
  },
  complianceByCategory: [
    { category: 'DGMS Safety (CMR 2017)', rate: 94 },
    { category: 'CPCB Environment', rate: 89 },
    { category: 'Health & Welfare', rate: 96 },
    { category: 'Approved Mining Plan', rate: 92 }
  ],
  monthlyTrends: [
    { month: 'Oct 2025', complianceRate: 78, activeViolations: 22 },
    { month: 'Nov 2025', complianceRate: 81, activeViolations: 18 },
    { month: 'Dec 2025', complianceRate: 80, activeViolations: 19 },
    { month: 'Jan 2026', complianceRate: 83, activeViolations: 16 },
    { month: 'Feb 2026', complianceRate: 84, activeViolations: 15 },
    { month: 'Mar 2026', complianceRate: 86.4, activeViolations: 15 }
  ],
  topMines: MOCK_MINES.map(m => ({
    id: m.id,
    name: `${m.name} (${m.code})`,
    code: m.code,
    state: m.state,
    score: m.complianceScore,
    risk: m.riskLevel,
    violationsCount: MOCK_VIOLATIONS.filter(v => v.mineId === m.id && v.status !== 'CLOSED').length
  }))
};

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(DEFAULT_DASHBOARD_DATA);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/analytics/dashboard', { timeout: 8000 });
      if (res.data?.success && res.data?.data) {
        setData(res.data.data);
      }
    } catch (err) {
      // Use fallback data
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const currentRole: UserRole = user?.role || 'SUPER_ADMIN';

  switch (currentRole) {
    case 'WORKER':
      return <WorkerDashboard />;
    case 'HQ_MANAGEMENT':
      return <HQManagementDashboard />;
    case 'MINE_MANAGER':
      return <MineManagerDashboard />;
    case 'SAFETY_INSPECTOR':
      return <SafetyInspectorDashboard />;
    case 'COMPLIANCE_OFFICER':
      return <ComplianceOfficerDashboard />;
    case 'CONTRACTOR':
      return <ContractorDashboard />;
    case 'SUPER_ADMIN':
    default:
      return <SuperAdminDashboard data={data} />;
  }
};

export default Dashboard;
