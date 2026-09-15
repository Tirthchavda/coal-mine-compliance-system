import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Building2,
  TrendingUp,
  DollarSign,
  AlertOctagon,
  FileSpreadsheet,
  Award,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Download
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line
} from 'recharts';

export const HQManagementDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const subsidiaryData = [
    { name: 'SECL (Bilaspur)', productionMT: 48.5, complianceScore: 91, penaltyRiskLakhs: 4.5, mines: 4 },
    { name: 'WCL (Nagpur)', productionMT: 32.0, complianceScore: 89, penaltyRiskLakhs: 8.0, mines: 3 },
    { name: 'ECL (Sanctoria)', productionMT: 28.2, complianceScore: 88, penaltyRiskLakhs: 12.5, mines: 3 },
    { name: 'BCCL (Dhanbad)', productionMT: 36.8, complianceScore: 83, penaltyRiskLakhs: 24.0, mines: 5 }
  ];

  const productionVsComplianceTrend = [
    { month: 'Q1-25', coalProductionMT: 32.4, complianceAvg: 81 },
    { month: 'Q2-25', coalProductionMT: 35.1, complianceAvg: 83 },
    { month: 'Q3-25', coalProductionMT: 38.6, complianceAvg: 82 },
    { month: 'Q4-25', coalProductionMT: 41.2, complianceAvg: 85 },
    { month: 'Q1-26', coalProductionMT: 44.8, complianceAvg: 86.4 }
  ];

  return (
    <div className="space-y-6">
      {/* HQ Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-gov-dark to-slate-800 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-400/20 text-indigo-300 border border-indigo-400/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {t('role.HQ_MANAGEMENT', 'Corporate Executive Directorate')}
              </span>
              <span className="text-slate-300 text-xs font-semibold">
                • {user?.name || 'HQ Executive'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              {t('hq.title', 'Corporate Operations & Statutory Governance Command')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-medium">
              Coal India Ltd (CIL) • Multi-Subsidiary Production vs Environmental & Safety Statutory Compliance
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/reports')}
              className="px-4 py-2.5 rounded-xl bg-gov-gold hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Board Audit Pack (Form IV)
            </button>
            <button
              onClick={() => navigate('/analytics')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-gov-gold" />
              National Analytics
            </button>
          </div>
        </div>
      </div>

      {/* HQ Corporate KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Production MT */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-gov-primary border border-slate-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">CIL Coal Production (YTD)</p>
              <p className="mt-2 text-2xl font-black text-slate-900">145.5 MT</p>
              <p className="mt-1 text-xs text-slate-500">Across 15 Active Collieries</p>
            </div>
            <div className="p-3 bg-sky-50 text-gov-primary rounded-xl border border-sky-100">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Penalty Exposure Risk */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-rose-600 border border-slate-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('hq.penaltyExposure', 'Statutory Penalty Exposure')}
              </p>
              <p className="mt-2 text-2xl font-black text-rose-600">₹49.0 L</p>
              <p className="mt-1 text-xs text-slate-500">Down from ₹72.5 L in Q3</p>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Corporate Compliance Index */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-emerald-500 border border-slate-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Corporate Compliance Avg</p>
              <p className="mt-2 text-2xl font-black text-emerald-600">86.4%</p>
              <p className="mt-1 text-xs text-emerald-700 font-bold">Target &gt; 85.0% Met</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Expiring Clearances Horizon */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-amber-500 border border-slate-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Expiring CTO / ECs (90d)</p>
              <p className="mt-2 text-2xl font-black text-amber-600">2 Clearances</p>
              <p className="mt-1 text-xs text-slate-500">BCCL Chute 4 & Raniganj EC</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Visuals: Subsidiary Benchmarks + Production vs Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Subsidiary Performance Comparison */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {t('hq.subsidiaryScore', 'Subsidiary Compliance & Production Benchmark')}
              </h3>
              <p className="text-xs text-slate-500">Compliance score % vs Output MTPA by Subsidiary</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
              CIL Subsidiaries
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subsidiaryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" orientation="left" domain={[60, 100]} tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="complianceScore" fill="#003366" name="Compliance Score %" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="productionMT" fill="#d97706" name="Production Output (MT)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Production vs Compliance Trend Line */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {t('hq.productionRatio', 'Quarterly Production vs Statutory Compliance')}
              </h3>
              <p className="text-xs text-slate-500">Demonstrating sustainable output with increasing regulatory adherence</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productionVsComplianceTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[75, 95]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="complianceAvg" stroke="#10b981" strokeWidth={3} name="Avg Compliance %" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Subsidiary Direct Action Matrix Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">CIL Subsidiary Statutory Health Ledger</h3>
            <p className="text-xs text-slate-500">Direct subsidiary executive accountability and statutory penalty breakdown</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Subsidiary Company</th>
                <th className="px-4 py-3">Active Mines</th>
                <th className="px-4 py-3">Output (MTPA)</th>
                <th className="px-4 py-3">Compliance Index</th>
                <th className="px-4 py-3">Penalty Risk (₹ Lakhs)</th>
                <th className="px-4 py-3 text-right">Corporate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {subsidiaryData.map(sub => (
                <tr key={sub.name} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gov-primary" />
                    {sub.name}
                  </td>
                  <td className="px-4 py-3">{sub.mines} Collieries</td>
                  <td className="px-4 py-3 font-semibold">{sub.productionMT} MT</td>
                  <td className="px-4 py-3">
                    <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      {sub.complianceScore}%
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-rose-600">₹{sub.penaltyRiskLakhs} L</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => navigate('/compliance')}
                      className="text-xs font-bold text-gov-primary hover:text-gov-dark hover:underline cursor-pointer"
                    >
                      Drill-down →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HQManagementDashboard;

