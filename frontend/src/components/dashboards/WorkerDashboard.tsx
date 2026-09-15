import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  HardHat,
  Wind,
  Flame,
  Activity,
  PlusCircle,
  FileCheck2,
  AlertOctagon,
  Clock,
  Sparkles,
  Award,
  Eye,
  Send,
  X
} from 'lucide-react';

export const WorkerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // State for Report Hazard Modal
  const [showHazardModal, setShowHazardModal] = useState<boolean>(false);
  const [hazardSubmitted, setHazardSubmitted] = useState<boolean>(false);
  const [hazardData, setHazardData] = useState({
    pitLocation: 'Seam IV - Incline 3 Face',
    category: 'SAFETY',
    severity: 'HIGH',
    description: '',
    observedGasLevel: 'Normal'
  });

  // PPE Checklist State
  const [ppeItems, setPpeItems] = useState([
    { id: 'ppe-1', name: 'BIS Approved Mining Hard Hat & Cap Lamp', checked: true },
    { id: 'ppe-2', name: 'Self-Contained Self-Rescuer (SCSR Gas Mask)', checked: true },
    { id: 'ppe-3', name: 'Steel-Toe Metatarsal Safety Boots', checked: true },
    { id: 'ppe-4', name: 'Dust Protection Respirator Mask (P100)', checked: true },
    { id: 'ppe-5', name: 'High-Visibility Reflective Safety Jacket', checked: true },
    { id: 'ppe-6', name: 'Safety Harness & Lanyard (for working at heights)', checked: false }
  ]);

  const [myObservations, setMyObservations] = useState([
    {
      id: 'obs-101',
      title: 'Conveyor Chute 4 Sprinkler Line Pressure Low',
      location: 'Pit 2 Transfer Point',
      severity: 'HIGH',
      status: 'IN_PROGRESS',
      reportedAt: 'Today, 07:15 AM',
      assignedTo: 'Mechanical Crew (BCCL)'
    },
    {
      id: 'obs-102',
      title: 'Haul Road Drainage Silt Accumulation',
      location: 'East Dump Approach Road',
      severity: 'MEDIUM',
      status: 'RESOLVED',
      reportedAt: 'Yesterday',
      assignedTo: 'Civil Maintenance'
    },
    {
      id: 'obs-103',
      title: 'Tell-Tale Roof Convergence Gauge Check (0.8mm delta)',
      location: 'Seam IV Gallery 6',
      severity: 'LOW',
      status: 'VERIFIED',
      reportedAt: '3 days ago',
      assignedTo: 'Strata Control Officer'
    }
  ]);

  const togglePpe = (id: string) => {
    setPpeItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleHazardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hazardData.description.trim()) return;

    const newObs = {
      id: `obs-${Date.now().toString().slice(-4)}`,
      title: hazardData.description,
      location: hazardData.pitLocation,
      severity: hazardData.severity,
      status: 'OPEN',
      reportedAt: 'Just now',
      assignedTo: 'Shift Safety In-Charge'
    };

    setMyObservations([newObs, ...myObservations]);
    setHazardSubmitted(true);
    setTimeout(() => {
      setHazardSubmitted(false);
      setShowHazardModal(false);
      setHazardData({
        pitLocation: 'Seam IV - Incline 3 Face',
        category: 'SAFETY',
        severity: 'HIGH',
        description: '',
        observedGasLevel: 'Normal'
      });
    }, 1500);
  };

  const ppeCount = ppeItems.filter(p => p.checked).length;
  const ppePercentage = Math.round((ppeCount / ppeItems.length) * 100);

  return (
    <div className="space-y-6">
      {/* Worker Hero Banner */}
      <div className="bg-gradient-to-r from-gov-dark via-slate-900 to-gov-primary text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-700/50 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {t('role.WORKER', 'Frontline Mine Worker & Safety Steward')}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Shift Active (Shift A)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              {t('worker.title', 'Mine Worker & Ground Safety Console')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-medium">
              {user?.name || 'Worker'} • {user?.department || 'Underground Seam IV'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowHazardModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <AlertTriangle className="w-4 h-4" />
              {t('worker.reportHazard', 'Report Ground Hazard / Near-Miss')}
            </button>

            <button
              onClick={() => navigate('/safety')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <HardHat className="w-4 h-4 text-gov-gold" />
              {t('nav.safety', 'Safety Directives')}
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Shift KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Shift Atmospheric Telemetry */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-emerald-500 border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">Pit Atmosphere (CH4)</p>
              <p className="text-2xl font-black text-slate-900 mt-1">0.14%</p>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Safe (&lt; 0.75% threshold)
              </span>
            </div>
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
              <Wind className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Card 2: PPE Readiness */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-gov-primary border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">PPE Verification</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{ppePercentage}%</p>
              <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                {ppeCount} of {ppeItems.length} Verified
              </span>
            </div>
            <div className="p-3 bg-sky-100 text-gov-primary rounded-xl">
              <HardHat className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Card 3: Reported Observations */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-amber-500 border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">My Hazard Reports</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{myObservations.length}</p>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                2 Rectified • 1 Active
              </span>
            </div>
            <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Card 4: Safety Training Refresher */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-indigo-500 border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">DGMS Safety Badge</p>
              <p className="text-2xl font-black text-slate-900 mt-1">Grade A</p>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                Refresher Valid (Oct 2026)
              </span>
            </div>
            <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Split: PPE Verification & Pit Telemetry Dials + My Reported Hazard Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive PPE & Live Gas Health */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Daily PPE Checklist Panel */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gov-primary/10 text-gov-primary flex items-center justify-center font-bold">
                  <HardHat className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {t('worker.ppeChecklist', 'Daily PPE & Safety Self-Verification')}
                  </h3>
                  <p className="text-[11px] text-slate-500">DGMS Regulation 182 Statutory Mandatory Shift Gear</p>
                </div>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {ppeCount}/{ppeItems.length} Equipped
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {ppeItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => togglePpe(item.id)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    item.checked
                      ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs">{item.name}</span>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                    item.checked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {item.checked && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Real-Time Seam IV Gas Telemetry Matrix */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {t('worker.pitTelemetry', 'Live Pit Atmosphere & Ventilation Telemetry')}
                  </h3>
                  <p className="text-[11px] text-slate-500">Continuous SCADA Sensors • Jharia Seam IV</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                Safe Telemetry
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center">
                <p className="text-[11px] font-extrabold text-slate-500 uppercase">Methane (CH4)</p>
                <p className="text-2xl font-black text-slate-900 mt-1">0.14 %</p>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '18%' }}></div>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Limit: 0.75%</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center">
                <p className="text-[11px] font-extrabold text-slate-500 uppercase">Carbon Monoxide (CO)</p>
                <p className="text-2xl font-black text-slate-900 mt-1">7.2 ppm</p>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Limit: 50.0 ppm</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center">
                <p className="text-[11px] font-extrabold text-slate-500 uppercase">Ventilation Velocity</p>
                <p className="text-2xl font-black text-slate-900 mt-1">3.4 m/s</p>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2 overflow-hidden">
                  <div className="bg-sky-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Min: 1.5 m/s</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Col: My Ground Hazard Reports Feed */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  {t('worker.myTasks', 'My Reported Observations')}
                </h3>
              </div>
              <button
                onClick={() => setShowHazardModal(true)}
                className="text-[11px] text-gov-primary font-bold hover:underline cursor-pointer"
              >
                + Add New
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-3 space-y-3">
              {myObservations.map(obs => (
                <div key={obs.id} className="pt-3 first:pt-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                      obs.severity === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {obs.severity}
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      obs.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' :
                      obs.status === 'IN_PROGRESS' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {obs.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 mt-1 leading-snug">{obs.title}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5">
                    <span>📍 {obs.location}</span>
                    <span>{obs.reportedAt}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Assigned to: {obs.assignedTo}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Safety Tip */}
          <div className="mt-6 p-3.5 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>DGMS Safety Reminder</span>
            </div>
            <p className="text-[11px] text-amber-800 mt-1">
              "Never enter an unventilated blind gallery or cross a danger fence without an authorized Flame Safety Lamp test."
            </p>
          </div>
        </div>

      </div>

      {/* Modal: Report Ground Hazard / Compliance Incident */}
      {showHazardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {t('worker.reportHazard', 'Report Ground Hazard / Incident')}
                  </h3>
                  <p className="text-[11px] text-slate-500">Statutory Form & Immediate Shift Alert</p>
                </div>
              </div>
              <button
                onClick={() => setShowHazardModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {hazardSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-sm font-black text-slate-900">Ground Hazard Logged Successfully!</h4>
                <p className="text-xs text-slate-500">Shift Safety Supervisor & Mine Manager have been alerted.</p>
              </div>
            ) : (
              <form onSubmit={handleHazardSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pit Location / Seam</label>
                  <input
                    type="text"
                    required
                    value={hazardData.pitLocation}
                    onChange={(e) => setHazardData({ ...hazardData, pitLocation: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Hazard Severity</label>
                    <select
                      value={hazardData.severity}
                      onChange={(e) => setHazardData({ ...hazardData, severity: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-primary"
                    >
                      <option value="CRITICAL">Critical (Immediate Danger)</option>
                      <option value="HIGH">High (Urgent Attention)</option>
                      <option value="MEDIUM">Medium (Maintenance)</option>
                      <option value="LOW">Low (Minor Observation)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={hazardData.category}
                      onChange={(e) => setHazardData({ ...hazardData, category: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-primary"
                    >
                      <option value="SAFETY">Roof / Strata Support</option>
                      <option value="VENTILATION">Ventilation & Gas</option>
                      <option value="HAULAGE">Conveyor / Haulage</option>
                      <option value="ELECTRICAL">Electrical Equipment</option>
                      <option value="DUST">Dust Suppression</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Observation Description</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the hazard clearly (e.g. Side spalling observed near junction 4, timber prop dislodged)..."
                    value={hazardData.description}
                    onChange={(e) => setHazardData({ ...hazardData, description: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-primary"
                  ></textarea>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowHazardModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-gov-primary hover:bg-gov-dark text-white rounded-lg flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Ground Hazard
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

export default WorkerDashboard;

