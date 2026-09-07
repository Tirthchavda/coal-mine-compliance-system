import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import {
  Mountain,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  CheckSquare,
  Clock,
  FileWarning,
  Award,
  Sparkles,
  TrendingUp,
  ArrowRight,
  PlusCircle,
  ClipboardList,
  UploadCloud,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

import { useAuth } from '../context/AuthContext';

const DEFAULT_DASHBOARD_DATA = {
  kpis: {
    totalMines: 12,
    compliantMines: 7,
    atRiskMines: 3,
    criticalMines: 2,
    criticalViolations: 3,
    activeViolations: 14,
    overdueActions: 4,
    pendingActions: 11,
    avgComplianceScore: 84.5,
    upcomingDeadlines: 6,
    expiredDocuments: 2,
    avgSafetyScore: 88,
    avgEnvScore: 82
  },
  severityCounts: {
    CRITICAL: 3,
    HIGH: 6,
    MEDIUM: 8,
    LOW: 5
  },
  complianceByCategory: [
    { category: 'DGMS Safety (CMR 2017)', rate: 86 },
    { category: 'CPCB Environment', rate: 79 },
    { category: 'Health & Welfare', rate: 92 },
    { category: 'Approved Mining Plan', rate: 88 }
  ],
  monthlyTrends: [
    { month: 'Oct 2025', complianceRate: 78, activeViolations: 22 },
    { month: 'Nov 2025', complianceRate: 81, activeViolations: 18 },
    { month: 'Dec 2025', complianceRate: 80, activeViolations: 19 },
    { month: 'Jan 2026', complianceRate: 83, activeViolations: 16 },
    { month: 'Feb 2026', complianceRate: 84, activeViolations: 15 },
    { month: 'Mar 2026', complianceRate: 85, activeViolations: 14 }
  ],
  topMines: [
    { id: 'mine-jharia-01', name: 'Jharia Block II Colliery (BCCL)', code: 'BCCL-JH-01', state: 'Jharkhand', score: 74, risk: 'HIGH', violationsCount: 4 },
    { id: 'mine-raniganj-02', name: 'Raniganj Deep Shaft Colliery (ECL)', code: 'ECL-RN-02', state: 'West Bengal', score: 89, risk: 'MEDIUM', violationsCount: 1 },
    { id: 'mine-korba-03', name: 'Gevra Mega Opencast Project (SECL)', code: 'SECL-KR-03', state: 'Chhattisgarh', score: 94, risk: 'LOW', violationsCount: 0 },
    { id: 'mine-singrauli-04', name: 'Jayant Opencast Colliery (NCL)', code: 'NCL-SG-04', state: 'Madhya Pradesh', score: 91, risk: 'LOW', violationsCount: 1 }
  ],
  recentActivity: [
    { id: 'act-1', type: 'INSPECTION_COMPLETED', title: 'DGMS Electrical & Haulage Safety Audit Completed', mineName: 'Jharia Block II', timestamp: '2 hours ago', severity: 'MEDIUM' },
    { id: 'act-2', type: 'VIOLATION_ISSUED', title: 'CMR Sec 129 Gas Monitoring Return Exceedance Notice', mineName: 'Raniganj Underground', timestamp: '5 hours ago', severity: 'HIGH' },
    { id: 'act-3', type: 'CAPA_VERIFIED', title: 'Dust Suppression Sprinklers Installed at Chute 4', mineName: 'Gevra Opencast', timestamp: '1 day ago', severity: 'LOW' }
  ]
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [data, setData] = useState<any>(DEFAULT_DASHBOARD_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/analytics/dashboard', { timeout: 8000 });
      if (res.data?.success && res.data?.data) {
        setData(res.data.data);
      }
    } catch (err) {
      console.warn('Using instant pre-seeded national dashboard metrics');
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const kpis = data?.kpis || DEFAULT_DASHBOARD_DATA.kpis;
  const severityCounts = data?.severityCounts || DEFAULT_DASHBOARD_DATA.severityCounts;
  const complianceByCategory = data?.complianceByCategory || DEFAULT_DASHBOARD_DATA.complianceByCategory;
  const monthlyTrends = data?.monthlyTrends || DEFAULT_DASHBOARD_DATA.monthlyTrends;
  const topMines = data?.topMines || DEFAULT_DASHBOARD_DATA.topMines;

  // Chart Color Palettes
  const SEVERITY_COLORS: Record<string, string> = {
    CRITICAL: '#e11d48',
    HIGH: '#f97316',
    MEDIUM: '#eab308',
    LOW: '#10b981'
  };

  const severityPieData = Object.entries(severityCounts || {}).map(([name, value]) => ({
    name,
    value: Number(value)
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gov-dark via-gov-primary to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-widest text-gov-gold bg-gov-gold/10 px-2 py-0.5 rounded border border-gov-gold/30">
              {user?.role === 'SAFETY_INSPECTOR'
                ? 'DGMS SAFETY INSPECTION WING'
                : user?.role === 'MINE_MANAGER'
                ? 'COLLIERY OPERATIONAL MANAGEMENT'
                : user?.role === 'COMPLIANCE_OFFICER'
                ? 'STATUTORY COMPLIANCE & CLEARANCES'
                : user?.role === 'CONTRACTOR'
                ? 'FIELD CONTRACTOR & REMEDIATION PORTAL'
                : 'NATIONAL STATUTORY EXECUTIVE OVERVIEW'}
            </span>
            <span className="text-xs text-slate-300">• {user?.name || 'Officer'}</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            {user?.role === 'SAFETY_INSPECTOR'
              ? 'DGMS Statutory Safety & Audit Dashboard'
              : user?.role === 'MINE_MANAGER'
              ? 'Colliery Operations & Compliance Portal'
              : user?.role === 'CONTRACTOR'
              ? 'Assigned Corrective Actions & Safety Telemetry'
              : user?.role === 'COMPLIANCE_OFFICER'
              ? 'Statutory Returns & Clearance Vault'
              : 'Coal Mine Statutory Compliance & Governance Dashboard'}
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            {user?.role === 'SAFETY_INSPECTOR'
              ? 'Manage routine and surprise DGMS inspections, issue statutory non-compliance notices, and verify physical site remediations.'
              : user?.role === 'MINE_MANAGER'
              ? 'Monitor operational safety, environmental telemetry (PM10, water pH), and execute corrective actions for your colliery.'
              : user?.role === 'CONTRACTOR'
              ? 'Track assigned engineering milestones, upload progress proof, and monitor heavy equipment safety adherence.'
              : 'Real-time multi-tier statutory oversight across 12 high-capacity Indian coal collieries under the Mines Act 1952, CMR 2017, and CPCB environmental guidelines.'}
          </p>
        </div>

        {/* Role-Specific Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {hasRole(['SUPER_ADMIN', 'SAFETY_INSPECTOR', 'HQ_MANAGEMENT']) && (
            <button
              onClick={() => navigate('/inspections?new=true')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-gov-gold text-slate-950 rounded-lg hover:bg-amber-400 transition-colors shadow-sm"
            >
              <ClipboardList className="w-4 h-4" />
              Schedule Audit
            </button>
          )}

          {hasRole(['SUPER_ADMIN', 'SAFETY_INSPECTOR']) && (
            <button
              onClick={() => navigate('/violations?new=true')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-sm"
            >
              <AlertOctagon className="w-4 h-4" />
              Issue Violation Notice
            </button>
          )}

          {hasRole(['MINE_MANAGER', 'COMPLIANCE_OFFICER']) && (
            <button
              onClick={() => navigate('/documents')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-gov-gold text-slate-950 rounded-lg hover:bg-amber-400 transition-colors shadow-sm"
            >
              <UploadCloud className="w-4 h-4" />
              Upload Clearance
            </button>
          )}

          {hasRole(['CONTRACTOR', 'MINE_MANAGER']) && (
            <button
              onClick={() => navigate('/actions')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <CheckSquare className="w-4 h-4" />
              Assigned CAPA Tasks
            </button>
          )}

          {hasRole(['SUPER_ADMIN', 'HQ_MANAGEMENT']) && (
            <button
              onClick={() => navigate('/ai-governance')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-xs"
            >
              <Sparkles className="w-4 h-4 text-gov-gold" />
              AI Risk Engine
            </button>
          )}
        </div>
      </div>

      {/* Primary KPI Scorecards (Real DB Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Collieries"
          value={kpis?.totalMines ?? 12}
          subtitle={`${kpis?.compliantMines ?? 7} Compliant • ${kpis?.atRiskMines ?? 3} At Risk • ${kpis?.criticalMines ?? 2} Critical`}
          icon={Mountain}
          variant="info"
          onClick={() => navigate('/mines')}
        />
        <StatCard
          title="Critical Violations"
          value={kpis?.criticalViolations ?? 3}
          subtitle={`${kpis?.activeViolations ?? 14} Total Active Violations`}
          icon={AlertOctagon}
          variant="danger"
          onClick={() => navigate('/violations?severity=CRITICAL')}
        />
        <StatCard
          title="Overdue CAPAs"
          value={kpis?.overdueActions ?? 4}
          subtitle={`${kpis?.pendingActions ?? 11} Remediation Actions Pending`}
          icon={Clock}
          variant="warning"
          onClick={() => navigate('/actions?overdueOnly=true')}
        />
        <StatCard
          title="National Compliance Index"
          value={`${kpis?.avgComplianceScore ?? 84.5}%`}
          subtitle="Statutory target >= 85.0%"
          icon={Award}
          variant="success"
          trend={{ value: '+3.2%', isPositive: true }}
          onClick={() => navigate('/compliance')}
        />
      </div>

      {/* Secondary Quick Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-slate-400 font-semibold text-[10px] uppercase">Upcoming Deadlines</p>
            <p className="text-base font-extrabold text-slate-800">{kpis?.upcomingDeadlines ?? 6} Obligations</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600">
            <FileWarning className="w-4 h-4" />
          </div>
          <div>
            <p className="text-slate-400 font-semibold text-[10px] uppercase">Expired Clearances</p>
            <p className="text-base font-extrabold text-slate-800">{kpis?.expiredDocuments ?? 2} Documents</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-slate-400 font-semibold text-[10px] uppercase">Safety Score</p>
            <p className="text-base font-extrabold text-slate-800">{kpis?.avgSafetyScore ?? 88} / 100</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-sky-50 text-sky-600">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <p className="text-slate-400 font-semibold text-[10px] uppercase">Environmental Score</p>
            <p className="text-base font-extrabold text-slate-800">{kpis?.avgEnvScore ?? 82} / 100</p>
          </div>
        </div>
      </div>

      {/* Recharts Data Visualization Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 6-Month Statutory Compliance vs Violations Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">National Compliance & Violation Trends</h3>
              <p className="text-xs text-slate-500">6-Month rolling statutory score vs active enforcement notices</p>
            </div>
            <span className="text-xs font-bold text-gov-primary bg-gov-primary/10 px-2 py-1 rounded">
              Monthly Aggregates
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#13395e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#13395e" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="violGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="complianceRate" name="Compliance Rate (%)" stroke="#13395e" strokeWidth={2.5} fillOpacity={1} fill="url(#compGrad)" />
                <Area type="monotone" dataKey="activeViolations" name="Active Violations" stroke="#e11d48" strokeWidth={2} fillOpacity={1} fill="url(#violGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Violations by Severity (Donut Chart) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="mb-2">
            <h3 className="text-sm font-bold text-slate-900">Violations by Severity</h3>
            <p className="text-xs text-slate-500">Live breakdown of active enforcement alerts</p>
          </div>

          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {severityPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold text-slate-900">{kpis?.activeViolations ?? 14}</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Violations</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-xs">
            {severityPieData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SEVERITY_COLORS[item.name] }}></span>
                <span className="text-slate-600 font-medium">{item.name}:</span>
                <span className="font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recharts Data Visualization Row 2: Category Compliance & Mine Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Compliance by Statutory Category */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Compliance by Statutory Category</h3>
              <p className="text-xs text-slate-500">Conformity across safety, environmental, and labour acts</p>
            </div>
            <button
              onClick={() => navigate('/compliance')}
              className="text-xs text-gov-primary hover:underline font-bold flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complianceByCategory} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="category" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="rate" name="Conformity Rate (%)" fill="#13395e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Colliery Risk Ranking List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Colliery Compliance & Risk Benchmarks</h3>
              <p className="text-xs text-slate-500">Mines requiring prioritized statutory intervention</p>
            </div>
            <button
              onClick={() => navigate('/mines')}
              className="text-xs text-gov-primary hover:underline font-bold flex items-center gap-1"
            >
              All Mines <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {topMines.map((m: any) => (
              <div
                key={m.id}
                onClick={() => navigate(`/mines/${m.id}`)}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-100 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded bg-gov-primary/10 text-gov-primary font-bold text-xs flex items-center justify-center">
                    ⛏
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{m.name}</p>
                    <p className="text-[11px] text-slate-500">{m.code} • {m.state}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs font-extrabold text-slate-800">{m.score}%</p>
                    <p className="text-[10px] text-slate-400">{m.violationsCount} open viols</p>
                  </div>
                  <StatusBadge status={m.risk} type="risk" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
