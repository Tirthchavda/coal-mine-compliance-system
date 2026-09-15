import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
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

import {
  Shield,
  Building2,
  Mountain,
  ClipboardCheck,
  Leaf,
  Truck,
  HardHat,
  Sparkles
} from 'lucide-react';

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

const ALL_ROLES: { role: UserRole; labelKey: string; defaultLabel: string; icon: React.ElementType }[] = [
  { role: 'SUPER_ADMIN', labelKey: 'role.SUPER_ADMIN', defaultLabel: 'Super Admin', icon: Shield },
  { role: 'HQ_MANAGEMENT', labelKey: 'role.HQ_MANAGEMENT', defaultLabel: 'HQ Management', icon: Building2 },
  { role: 'MINE_MANAGER', labelKey: 'role.MINE_MANAGER', defaultLabel: 'Mine Manager', icon: Mountain },
  { role: 'SAFETY_INSPECTOR', labelKey: 'role.SAFETY_INSPECTOR', defaultLabel: 'Safety Inspector', icon: ClipboardCheck },
  { role: 'COMPLIANCE_OFFICER', labelKey: 'role.COMPLIANCE_OFFICER', defaultLabel: 'Compliance Officer', icon: Leaf },
  { role: 'CONTRACTOR', labelKey: 'role.CONTRACTOR', defaultLabel: 'Mining Contractor', icon: Truck },
  { role: 'WORKER', labelKey: 'role.WORKER', defaultLabel: 'Mine Worker', icon: HardHat }
];

export const Dashboard: React.FC = () => {
  const { user, switchRole } = useAuth();
  const { t } = useLanguage();
  const [data, setData] = useState<any>(DEFAULT_DASHBOARD_DATA);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/analytics/dashboard', { timeout: 8000 });
      if (res.data?.success && res.data?.data) {
        setData(res.data.data);
      }
    } catch (err) {
      // Use fallback
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const currentRole: UserRole = user?.role || 'SUPER_ADMIN';

  const renderRoleDashboard = () => {
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

  return (
    <div className="space-y-6">
      {/* Interactive Quick Role Switcher Banner */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200/90 p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <div className="p-1.5 rounded-lg bg-gov-primary/10 text-gov-primary">
            <Sparkles className="w-4 h-4 text-gov-gold" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-800 tracking-tight leading-none">
              Role-Based Governance View
            </p>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">
              Switch role to view dedicated tailored dashboard, analytics & controls:
            </p>
          </div>
        </div>

        {/* Role Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {ALL_ROLES.map(({ role, labelKey, defaultLabel, icon: Icon }) => {
            const isActive = currentRole === role;
            return (
              <button
                key={role}
                type="button"
                onClick={() => switchRole(role)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gov-primary text-white shadow-xs font-extrabold ring-2 ring-gov-gold/40'
                    : 'bg-slate-100/90 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 border border-slate-200/70'
                }`}
                title={`Switch to ${defaultLabel} Dashboard`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-gov-gold' : 'text-slate-500'}`} />
                <span>{t(labelKey, defaultLabel)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Dynamic Role-Based Custom Dashboard */}
      {renderRoleDashboard()}
    </div>
  );
};

export default Dashboard;
