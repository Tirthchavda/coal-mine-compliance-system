import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../StatusBadge';
import {
  Mountain,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Award,
  Sparkles,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  BarChart3,
  FileSpreadsheet,
  Users
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

interface SuperAdminDashboardProps {
  data: any;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ data }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  const kpis = data?.kpis || {
    totalMines: 15,
    compliantMines: 10,
    atRiskMines: 3,
    criticalMines: 2,
    criticalViolations: 4,
    activeViolations: 15,
    overdueActions: 3,
    avgComplianceScore: 86.4
  };

  const severityCounts = data?.severityCounts || { CRITICAL: 4, HIGH: 6, MEDIUM: 3, LOW: 2 };
  const monthlyTrends = data?.monthlyTrends || [
    { month: 'Oct 2025', complianceRate: 78, activeViolations: 22 },
    { month: 'Nov 2025', complianceRate: 81, activeViolations: 18 },
    { month: 'Dec 2025', complianceRate: 80, activeViolations: 19 },
    { month: 'Jan 2026', complianceRate: 83, activeViolations: 16 },
    { month: 'Feb 2026', complianceRate: 84, activeViolations: 15 },
    { month: 'Mar 2026', complianceRate: 86.4, activeViolations: 15 }
  ];

  const stateDistribution = [
    { state: 'Jharkhand', mines: 5, complianceScore: 84 },
    { state: 'West Bengal', mines: 3, complianceScore: 88 },
    { state: 'Odisha', mines: 3, complianceScore: 91 },
    { state: 'Chhattisgarh', mines: 2, complianceScore: 82 },
    { state: 'Madhya Pradesh', mines: 1, complianceScore: 89 },
    { state: 'Telangana', mines: 1, complianceScore: 87 }
  ];

  const criticalCount = Number(severityCounts?.CRITICAL ?? 4);
  const highCount = Number(severityCounts?.HIGH ?? 6);
  const mediumCount = Number(severityCounts?.MEDIUM ?? 3);
  const lowCount = Number(severityCounts?.LOW ?? 2);
  const totalViolations = criticalCount + highCount + mediumCount + lowCount || 15;

  const severityPieData = [
    { name: 'CRITICAL', label: t('risk.CRITICAL', 'Critical Priority'), value: criticalCount, color: '#e11d48' },
    { name: 'HIGH', label: t('risk.HIGH', 'High Priority'), value: highCount, color: '#ea580c' },
    { name: 'MEDIUM', label: t('risk.MEDIUM', 'Medium Priority'), value: mediumCount, color: '#d97706' },
    { name: 'LOW', label: t('risk.LOW', 'Low Priority'), value: lowCount, color: '#0284c7' }
  ];

  const topMines = data?.topMines || [];

  return (
    <div className="space-y-6">
      {/* Super Admin National Command Header */}
      <div className="bg-gradient-to-r from-gov-dark via-slate-900 to-gov-primary text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-gov-gold/20 text-gov-gold border border-gov-gold/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {t('role.SUPER_ADMIN', 'Central Regulatory Directorate')}
              </span>
              <span className="text-slate-300 text-xs font-semibold">
                • {user?.name || 'Super Admin'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              {t('header.portalTitle', 'National Coal Mine Statutory Compliance Portal')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-medium">
              Ministry of Coal • Directorate General of Mines Safety (DGMS) Central Statutory Surveillance
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/inspections')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              {t('btn.scheduleAudit', 'Schedule Audit')}
            </button>
            <button
              onClick={() => navigate('/violations')}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <AlertOctagon className="w-4 h-4" />
              {t('btn.issueNotice', 'Issue Violation Notice')}
            </button>
            <button
              onClick={() => navigate('/ai-governance')}
              className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-gov-gold" />
              {t('btn.aiRiskEngine', 'AI Risk Engine')}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Collieries */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-gov-primary border border-slate-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('dash.totalCollieries', 'Total Collieries')}
              </p>
              <p className="mt-2 text-2xl font-black text-slate-900">{kpis.totalMines}</p>
              <p className="mt-1 text-xs text-slate-500">
                {kpis.compliantMines} Compliant • {kpis.atRiskMines} At Risk • {kpis.criticalMines} Critical
              </p>
            </div>
            <div className="p-3 rounded-xl bg-sky-50 text-gov-primary border border-sky-100">
              <Mountain className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Critical Violations */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-rose-600 border border-slate-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('dash.criticalViolations', 'Critical Violations')}
              </p>
              <p className="mt-2 text-2xl font-black text-rose-600">{kpis.criticalViolations}</p>
              <p className="mt-1 text-xs text-slate-500">{kpis.activeViolations} Total Active Violations</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <AlertOctagon className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Overdue CAPAs */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-amber-500 border border-slate-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('dash.overdueCapas', 'Overdue CAPAs')}
              </p>
              <p className="mt-2 text-2xl font-black text-amber-600">{kpis.overdueActions}</p>
              <p className="mt-1 text-xs text-slate-500">Remediation Actions Pending</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* National Compliance Index */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-emerald-500 border border-slate-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('dash.complianceIndex', 'National Compliance Index')}
              </p>
              <p className="mt-2 text-2xl font-black text-emerald-600">{kpis.avgComplianceScore}%</p>
              <p className="mt-1 text-xs font-bold text-emerald-700">+3.2% vs statutory target (85.0%)</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts: Trends + Severity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* National Compliance & Trends */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">National Compliance & Violation Trends</h3>
              <p className="text-xs text-slate-500">6-Month rolling statutory score vs active enforcement notices</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
              Monthly Aggregates
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends}>
                <defs>
                  <linearGradient id="superAdminScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#003366" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#003366" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="complianceRate" stroke="#003366" strokeWidth={2.5} fillOpacity={1} fill="url(#superAdminScore)" name="Compliance Rate %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Violations by Severity */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Violations by Severity</h3>
              <p className="text-xs text-slate-500">Live breakdown of active enforcement alerts</p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 bg-rose-50 text-rose-700 rounded-lg">
              {totalViolations} notices
            </span>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={severityPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                  {severityPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            {severityPieData.map(item => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-600 font-medium">{item.label}:</span>
                <span className="font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* State-Wise Distribution & Colliery Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* State-Wise Colliery BarChart */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">State-Wise Compliance Scores</h3>
              <p className="text-xs text-slate-500">Average compliance index across coal-producing states</p>
            </div>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" domain={[60, 100]} tick={{ fontSize: 10 }} />
                <YAxis dataKey="state" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip />
                <Bar dataKey="complianceScore" fill="#003366" radius={[0, 4, 4, 0]} name="Compliance Score %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* High Risk Colliery Watchlist */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Statutory Intervention Watchlist</h3>
              <p className="text-xs text-slate-500">Mines requiring prioritized regulatory oversight</p>
            </div>
            <button
              onClick={() => navigate('/mines')}
              className="text-xs font-bold text-gov-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              All 15 Mines <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2">Colliery</th>
                  <th className="px-3 py-2">State</th>
                  <th className="px-3 py-2">Compliance</th>
                  <th className="px-3 py-2">Risk Level</th>
                  <th className="px-3 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {topMines.slice(0, 5).map((m: any) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2.5 font-bold text-slate-900">{m.name}</td>
                    <td className="px-3 py-2.5">{m.state}</td>
                    <td className="px-3 py-2.5 font-bold">{m.score}%</td>
                    <td className="px-3 py-2.5">
                      <StatusBadge type="risk" value={m.risk} size="sm" />
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        onClick={() => navigate(`/mines/${m.id}`)}
                        className="text-[11px] font-bold text-gov-primary hover:text-gov-dark hover:underline cursor-pointer"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

