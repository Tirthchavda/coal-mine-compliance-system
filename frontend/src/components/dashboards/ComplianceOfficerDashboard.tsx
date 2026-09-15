import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Leaf,
  FileCheck,
  Calendar,
  AlertTriangle,
  UploadCloud,
  FileSpreadsheet,
  Activity,
  Wind,
  Droplets,
  Volume2,
  ArrowRight,
  CheckCircle2,
  Send,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar
} from 'recharts';

export const ComplianceOfficerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [docUploaded, setDocUploaded] = useState<boolean>(false);

  const envTrendData = [
    { date: 'Mon', pm10: 82, pm25: 42, waterPh: 7.2 },
    { date: 'Tue', pm10: 88, pm25: 45, waterPh: 7.1 },
    { date: 'Wed', pm10: 79, pm25: 39, waterPh: 7.4 },
    { date: 'Thu', pm10: 92, pm25: 48, waterPh: 7.0 },
    { date: 'Fri', pm10: 85, pm25: 44, waterPh: 7.3 },
    { date: 'Sat', pm10: 80, pm25: 41, waterPh: 7.2 },
    { date: 'Sun', pm10: 76, pm25: 38, waterPh: 7.3 }
  ];

  const vaultHorizon = [
    { horizon: 'Expired', count: 2, fill: '#e11d48' },
    { horizon: '< 30 Days', count: 4, fill: '#ea580c' },
    { horizon: '30-90 Days', count: 8, fill: '#d97706' },
    { horizon: '> 90 Days', count: 24, fill: '#10b981' }
  ];

  const upcomingFilings = [
    { name: 'CPCB Form V Environmental Statement', deadline: '30 Sep 2026', authority: 'State Pollution Control Board', status: 'DUE_SOON' },
    { name: 'Quarterly Ground Water Discharge Audit', deadline: '15 Oct 2026', authority: 'CGWA', status: 'IN_PROGRESS' },
    { name: 'Annual Mining Plan Compliance Return', deadline: '31 Dec 2026', authority: 'Ministry of Coal / IBM', status: 'PLANNED' }
  ];

  const handleDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDocUploaded(true);
    setTimeout(() => {
      setDocUploaded(false);
      setShowUploadModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Compliance Officer Hero Banner */}
      <div className="bg-gradient-to-r from-gov-dark via-slate-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {t('role.COMPLIANCE_OFFICER', 'Statutory & Environmental Surveillance')}
              </span>
              <span className="text-slate-300 text-xs font-semibold">
                • {user?.name || 'Priyanka Sen'} • ECL Statutory Surveillance Cell
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              {t('compliance.title', 'Statutory Clearances & Environmental Quality Portal')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-medium">
              Continuous CPCB/SPCB environmental monitoring, clearance vault horizon & statutory return filing ledger
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              {t('compliance.uploadDoc', 'Upload Clearance Document')}
            </button>
            <button
              onClick={() => navigate('/environment')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Leaf className="w-4 h-4 text-gov-gold" />
              Environmental Quality
            </button>
          </div>
        </div>
      </div>

      {/* Compliance KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ambient Air PM10 */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-emerald-500 border border-slate-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">PM10 Air Quality</p>
              <p className="mt-2 text-2xl font-black text-slate-900">82 µg/m³</p>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Within CPCB Limit (&lt; 100)
              </span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <Wind className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Water Quality pH */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-gov-primary border border-slate-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Effluent Water pH</p>
              <p className="mt-2 text-2xl font-black text-slate-900">7.2 pH</p>
              <span className="text-[10px] font-bold text-gov-primary bg-sky-50 px-2 py-0.5 rounded">
                Optimal Neutral (6.5 - 8.5)
              </span>
            </div>
            <div className="p-3 bg-sky-50 text-gov-primary rounded-xl border border-sky-100">
              <Droplets className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Valid Clearances in Vault */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-emerald-500 border border-slate-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Clearances in Vault</p>
              <p className="mt-2 text-2xl font-black text-emerald-600">38 Documents</p>
              <span className="text-[10px] font-bold text-slate-500">EC, CTO, Mining Plans</span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <FileCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Expiring Clearances */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-rose-600 border border-slate-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Expiring Clearances (30d)</p>
              <p className="mt-2 text-2xl font-black text-rose-600">2 Permits</p>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                Action Required (SPCB CTO)
              </span>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Ambient Trends + Vault Horizon */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Ambient Air Quality Trends */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {t('compliance.airQuality', 'Ambient Air Quality (CPCB Continuous Monitoring)')}
              </h3>
              <p className="text-xs text-slate-500">PM10 and PM2.5 levels vs National Standards</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
              7-Day Continuous
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={envTrendData}>
                <defs>
                  <linearGradient id="pm10Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="pm25Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 120]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="pm10" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#pm10Grad)" name="PM10 (µg/m³)" />
                <Area type="monotone" dataKey="pm25" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#pm25Grad)" name="PM2.5 (µg/m³)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Clearance Vault Expiry Horizon */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {t('compliance.vaultHealth', 'Clearance Vault Horizon')}
              </h3>
              <p className="text-xs text-slate-500">Document expiry countdown</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vaultHorizon} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="horizon" type="category" tick={{ fontSize: 11 }} width={90} />
                <Tooltip />
                <Bar dataKey="count" fill="#003366" name="Documents" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Upcoming Statutory Filings Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Upcoming Statutory Obligation Calendar</h3>
            <p className="text-xs text-slate-500">Upcoming environmental returns, consents and regulatory renewals</p>
          </div>
          <button
            onClick={() => navigate('/documents')}
            className="text-xs font-bold text-gov-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            Document Vault <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Statutory Filing</th>
                <th className="px-4 py-3">Regulatory Authority</th>
                <th className="px-4 py-3">Filing Deadline</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {upcomingFilings.map(filing => (
                <tr key={filing.name} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900">{filing.name}</td>
                  <td className="px-4 py-3">{filing.authority}</td>
                  <td className="px-4 py-3 font-bold text-amber-700">{filing.deadline}</td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-700">
                      {filing.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="text-xs font-bold text-gov-primary hover:underline cursor-pointer"
                    >
                      Upload & File →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Upload Statutory Document */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Upload Statutory Clearance Document
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {docUploaded ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-sm font-black text-slate-900">Clearance Document Saved to Vault!</h4>
                <p className="text-xs text-slate-500">Document cryptographic fingerprint generated & verified.</p>
              </div>
            ) : (
              <form onSubmit={handleDocSubmit} className="space-y-4 mt-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Clearance Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Consent to Operate (CTO) Renewal 2026-2031"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Document Category</label>
                    <select className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-primary">
                      <option>CONSENT_TO_OPERATE</option>
                      <option>ENVIRONMENTAL_CLEARANCE</option>
                      <option>MINING_PLAN</option>
                      <option>STATUTORY_FORM_V</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Expiry Date</label>
                    <input
                      type="date"
                      defaultValue="2028-12-31"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-primary"
                    />
                  </div>
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 cursor-pointer">
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                  <p className="font-bold text-slate-700">Choose PDF / TIFF clearance file</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Maximum size: 25MB (Digital Signature verified)</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Upload & Commit to Vault
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceOfficerDashboard;

