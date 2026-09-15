import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Mountain,
  Flame,
  Wind,
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  Users,
  Activity,
  HardHat,
  BellRing,
  ArrowRight,
  Send,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export const MineManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [returnSubmitted, setReturnSubmitted] = useState<boolean>(false);
  const [drillActive, setDrillActive] = useState<boolean>(false);

  const worksiteCapas = [
    { worksite: 'Seam IV Extraction Face', open: 2, inProgress: 3, resolved: 8 },
    { worksite: 'Conveyor Chute 4 Transfer', open: 1, inProgress: 2, resolved: 5 },
    { worksite: 'East Haul Road Pit 2', open: 0, inProgress: 1, resolved: 6 },
    { worksite: 'Substation #3 Switchgear', open: 0, inProgress: 0, resolved: 4 }
  ];

  const shiftAttendance = {
    totalMuster: 342,
    present: 336,
    ppeCompliant: 330,
    gasSafetyCertified: 336
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReturnSubmitted(true);
    setTimeout(() => {
      setReturnSubmitted(false);
      setShowFormModal(false);
    }, 1500);
  };

  const triggerDrill = () => {
    setDrillActive(true);
    setTimeout(() => setDrillActive(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Manager Hero Banner */}
      <div className="bg-gradient-to-r from-gov-dark via-slate-900 to-amber-950 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {t('role.MINE_MANAGER', 'Colliery General Management')}
              </span>
              <span className="text-slate-300 text-xs font-semibold">
                • {user?.name || 'Suresh Chandra Verma'} • Jharia Coalfield Project
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              {t('manager.title', 'Colliery Operations & Shift Safety Command')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-medium">
              Real-time SCADA gas telemetry, shift worker muster & local CAPA enforcement for Jharia Block II Colliery
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowFormModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gov-gold hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              {t('manager.dailyReturnBtn', 'Submit Daily Form IV Return')}
            </button>

            <button
              onClick={triggerDrill}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                drillActive ? 'bg-rose-600 text-white animate-pulse' : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <BellRing className="w-4 h-4 text-amber-400" />
              {drillActive ? '🚨 Pit Siren Active' : 'Trigger Safety Drill'}
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Mine Shift KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Real-Time Methane CH4 */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-emerald-500 border border-slate-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('manager.methaneCH4', 'Methane (CH4)')}
              </p>
              <p className="mt-2 text-2xl font-black text-slate-900">0.14 %</p>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Normal (&lt; 0.75% limit)
              </span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <Flame className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Real-Time Carbon Monoxide CO */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-emerald-500 border border-slate-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('manager.carbonCO', 'Carbon Monoxide (CO)')}
              </p>
              <p className="mt-2 text-2xl font-black text-slate-900">7.2 ppm</p>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Normal (&lt; 50 ppm limit)
              </span>
            </div>
            <div className="p-3 bg-sky-50 text-sky-600 rounded-xl border border-sky-100">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Ventilation Airflow */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-gov-primary border border-slate-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('manager.airVelocity', 'Ventilation Airflow')}
              </p>
              <p className="mt-2 text-2xl font-black text-slate-900">3.4 m/s</p>
              <span className="text-[10px] font-bold text-gov-primary bg-sky-50 px-2 py-0.5 rounded">
                Compliant (Min 1.5 m/s)
              </span>
            </div>
            <div className="p-3 bg-sky-50 text-gov-primary rounded-xl border border-sky-100">
              <Wind className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Shift Muster & PPE */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-amber-500 border border-slate-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Shift Worker Muster</p>
              <p className="mt-2 text-2xl font-black text-slate-900">336 / 342</p>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                98.2% PPE Verified
              </span>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
              <HardHat className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Worksite CAPA Progress + Shift Health Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Worksite CAPA Remediations */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Colliery Worksite CAPA Status</h3>
              <p className="text-xs text-slate-500">Remediation actions by active seam and pit location</p>
            </div>
            <button
              onClick={() => navigate('/actions')}
              className="text-xs font-bold text-gov-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              All CAPAs <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={worksiteCapas} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="worksite" type="category" tick={{ fontSize: 11 }} width={160} />
                <Tooltip />
                <Legend />
                <Bar dataKey="resolved" fill="#10b981" name="Resolved" stackId="a" />
                <Bar dataKey="inProgress" fill="#0284c7" name="In Progress" stackId="a" />
                <Bar dataKey="open" fill="#e11d48" name="Open" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Local Mine Shift Compliance Card */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">Today's Shift Compliance</h3>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Grade 94/100
              </span>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-600 font-medium">Overburden Stability</span>
                <span className="font-bold text-emerald-600">STABLE</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-600 font-medium">Dust Sprinkler Pressure</span>
                <span className="font-bold text-emerald-600">4.2 bar (Active)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-600 font-medium">Haulage Brake Interlocks</span>
                <span className="font-bold text-emerald-600">Pass (Checked 06:00)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-600 font-medium">DGMS Flame Safety Test</span>
                <span className="font-bold text-emerald-600">Certified by Overman</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/compliance')}
            className="w-full mt-4 py-2 text-xs font-bold text-center bg-gov-primary text-white rounded-lg hover:bg-gov-dark transition-colors cursor-pointer"
          >
            Review Statutory Checklist
          </button>
        </div>

      </div>

      {/* Modal: Submit Daily Form IV Return */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-gov-primary" />
                <h3 className="text-sm font-black text-slate-900">
                  Submit Daily Statutory Form IV Shift Return
                </h3>
              </div>
              <button
                onClick={() => setShowFormModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {returnSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-sm font-black text-slate-900">Form IV Return Filed with DGMS Portal!</h4>
                <p className="text-xs text-slate-500">Statutory return hash: DGMS-JHR-2026-F4-0812</p>
              </div>
            ) : (
              <form onSubmit={handleReturnSubmit} className="space-y-4 mt-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Colliery Name</label>
                  <input
                    type="text"
                    disabled
                    value="Jharia Block II (BCCL-JHR-01)"
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Shift In-Charge</label>
                    <input
                      type="text"
                      disabled
                      value={user?.name || 'S. C. Verma'}
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Max CH4 Level Observed</label>
                    <input
                      type="text"
                      defaultValue="0.14 %"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Manager Statutory Remarks & Declarations</label>
                  <textarea
                    rows={3}
                    defaultValue="All statutory ventilation circuits in normal order. Tell-tale roof tellers read stable. Dust suppression operating at full pressure."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-primary"
                  ></textarea>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFormModal(false)}
                    className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-bold bg-gov-primary hover:bg-gov-dark text-white rounded-lg flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Sign & Submit Form IV
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

export default MineManagerDashboard;

