import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  ShieldAlert,
  ClipboardCheck,
  AlertOctagon,
  CheckCircle2,
  FileText,
  Calendar,
  Eye,
  PlusCircle,
  FileCheck2,
  ArrowRight,
  Send,
  X,
  Scale
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
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const SafetyInspectorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [showNoticeModal, setShowNoticeModal] = useState<boolean>(false);
  const [noticeSubmitted, setNoticeSubmitted] = useState<boolean>(false);

  const auditCategoryData = [
    { category: 'Ventilation & Gas (CMR 153)', audits: 8, violationsFound: 3 },
    { category: 'Strata Control & Support (CMR 123)', audits: 12, violationsFound: 4 },
    { category: 'HEMM & Haulage Machinery (CMR 91)', audits: 9, violationsFound: 2 },
    { category: 'Explosives & Shotfiring (CMR 160)', audits: 6, violationsFound: 1 },
    { category: 'Electrical Safety (CEA Reg 2010)', audits: 7, violationsFound: 2 }
  ];

  const pendingSignOffs = [
    {
      id: 'capa-v12',
      mineName: 'Jharia Block II',
      title: 'Ventilation Fan Auto-Switchover Mechanism Replacement',
      severity: 'CRITICAL',
      submittedBy: 'S. C. Verma (Manager)',
      evidenceType: 'Electrical Certificate & Photo'
    },
    {
      id: 'capa-v15',
      mineName: 'Raniganj Underground',
      title: 'Haul Road Guard Berm Height Raised to 1.5m',
      severity: 'HIGH',
      submittedBy: 'Vikramaditya Construction',
      evidenceType: 'Surveyor Field Measurement Report'
    },
    {
      id: 'capa-v18',
      mineName: 'Gevra Opencast',
      title: 'Dust Suppression Mist Cannons Commissioned',
      severity: 'MEDIUM',
      submittedBy: 'Compliance Officer',
      evidenceType: 'Commissioning Invoice & Geotagged Photo'
    }
  ];

  const handleNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNoticeSubmitted(true);
    setTimeout(() => {
      setNoticeSubmitted(false);
      setShowNoticeModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Inspector Hero Banner */}
      <div className="bg-gradient-to-r from-gov-dark via-slate-900 to-rose-950 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-rose-400/20 text-rose-300 border border-rose-400/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {t('role.SAFETY_INSPECTOR', 'DGMS Statutory Inspection Directorate')}
              </span>
              <span className="text-slate-300 text-xs font-semibold">
                • {user?.name || 'P. K. Ramanathan (Director Mines Safety)'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              {t('inspector.title', 'DGMS Statutory Inspection & Enforcement Console')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-medium">
              Statutory audit schedule, Section 22 improvement notices, evidence audit & CAPA sign-off for Eastern Region
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowNoticeModal(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <AlertOctagon className="w-4 h-4" />
              {t('inspector.issueNotice', 'Issue Section 22 Notice')}
            </button>
            <button
              onClick={() => navigate('/inspections')}
              className="px-4 py-2.5 rounded-xl bg-gov-gold hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <ClipboardCheck className="w-4 h-4" />
              {t('inspector.scheduleAudit', 'Schedule Surprise Audit')}
            </button>
          </div>
        </div>
      </div>

      {/* Inspector KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Inspections Scheduled */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-gov-primary border border-slate-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">DGMS Inspections (YTD)</p>
              <p className="mt-2 text-2xl font-black text-slate-900">42 Audits</p>
              <p className="mt-1 text-xs text-slate-500">38 Completed • 4 Scheduled</p>
            </div>
            <div className="p-3 bg-sky-50 text-gov-primary rounded-xl border border-sky-100">
              <ClipboardCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Section 22 Notices */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-rose-600 border border-slate-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Section 22 Notices</p>
              <p className="mt-2 text-2xl font-black text-rose-600">6 Notices</p>
              <p className="mt-1 text-xs text-slate-500">2 Prohibition • 4 Improvement</p>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
              <Scale className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Awaiting Inspector Sign-off */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-amber-500 border border-slate-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('inspector.pendingSignOff', 'Pending Inspector Sign-Off')}
              </p>
              <p className="mt-2 text-2xl font-black text-amber-600">3 CAPAs</p>
              <p className="mt-1 text-xs text-slate-500">Evidence Awaiting Approval</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
              <FileCheck2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* High Risk Mines on Watchlist */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-indigo-500 border border-slate-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">DGMS Priority Watchlist</p>
              <p className="mt-2 text-2xl font-black text-indigo-600">2 Mines</p>
              <p className="mt-1 text-xs text-slate-500">Jharia & Raniganj Pits</p>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Audits by Category + Pending Sign-offs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Audits by CMR Regulation */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Audits & Violations by Coal Mines Regulation (CMR 2017)
              </h3>
              <p className="text-xs text-slate-500">Field inspections vs regulatory non-compliances identified</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={auditCategoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="audits" fill="#003366" name="Audits Conducted" radius={[4, 4, 0, 0]} />
                <Bar dataKey="violationsFound" fill="#e11d48" name="Statutory Violations Issued" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending Inspector Sign-Off Queue */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">CAPA Verification Queue</h3>
              <span className="text-xs font-black bg-amber-50 text-amber-700 px-2 py-0.5 rounded">
                3 Pending
              </span>
            </div>

            <div className="divide-y divide-slate-100 mt-2 space-y-3">
              {pendingSignOffs.map(capa => (
                <div key={capa.id} className="pt-3 first:pt-0">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-extrabold text-gov-primary">{capa.mineName}</span>
                    <span className={`px-1.5 py-0.5 rounded font-black ${
                      capa.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {capa.severity}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 mt-1 leading-snug">{capa.title}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Evidence: {capa.evidenceType}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/actions')}
            className="w-full mt-4 py-2 text-xs font-bold text-center bg-gov-primary text-white rounded-lg hover:bg-gov-dark transition-colors cursor-pointer"
          >
            Review Evidence & Sign-off →
          </button>
        </div>

      </div>

      {/* Modal: Issue Section 22 Notice */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Issue Statutory Notice (Mines Act Section 22 / 22A)
                </h3>
              </div>
              <button
                onClick={() => setShowNoticeModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {noticeSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-sm font-black text-slate-900">Section 22 Notice Dispatched to Mine Manager!</h4>
                <p className="text-xs text-slate-500">Notice Number: DGMS-SEC22-2026-0094</p>
              </div>
            ) : (
              <form onSubmit={handleNoticeSubmit} className="space-y-4 mt-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Colliery</label>
                  <select className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-primary">
                    <option>Jharia Block II (BCCL)</option>
                    <option>Raniganj Underground (ECL)</option>
                    <option>Gevra Opencast (SECL)</option>
                    <option>Korba West (SECL)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Statutory Section</label>
                    <select className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-primary">
                      <option>Section 22(1) - Urgent Danger Notice</option>
                      <option>Section 22(3) - Prohibition Order</option>
                      <option>Section 22A - Electrical Non-Compliance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Compliance Deadline</label>
                    <input
                      type="date"
                      defaultValue="2026-09-30"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Inspector Contravention Findings</label>
                  <textarea
                    rows={3}
                    placeholder="State the observed statutory contraventions and mandated remedial directives..."
                    defaultValue="Tell-tale roof indicators in seam IV demonstrate non-compliance with approved Strata Management Plan."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-primary"
                  ></textarea>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNoticeModal(false)}
                    className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Issue Formal Notice
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

export default SafetyInspectorDashboard;

