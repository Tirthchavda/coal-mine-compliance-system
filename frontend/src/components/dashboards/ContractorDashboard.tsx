import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Truck,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  FileCheck2,
  HardHat,
  Users,
  ShieldCheck,
  Activity,
  ArrowRight,
  Send,
  X,
  Sparkles
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

export const ContractorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [showEvidenceModal, setShowEvidenceModal] = useState<boolean>(false);
  const [evidenceSubmitted, setEvidenceSubmitted] = useState<boolean>(false);

  const [assignedCapas, setAssignedCapas] = useState([
    {
      id: 'capa-c1',
      title: 'Conveyor Chute 4 Dust Suppression Sprinkler Retrofit',
      deadline: '28 Sep 2026',
      priority: 'HIGH',
      progress: 75,
      status: 'IN_PROGRESS',
      location: 'Pit 2 Transfer Point'
    },
    {
      id: 'capa-c2',
      title: 'Haul Road Guard Berm Height Reinforcement (1.5m min)',
      deadline: '02 Oct 2026',
      priority: 'CRITICAL',
      progress: 40,
      status: 'IN_PROGRESS',
      location: 'East Dump Ramp 3'
    },
    {
      id: 'capa-c3',
      title: 'Overburden Bench Slope Angle Dressing (45-degree slope)',
      deadline: '10 Oct 2026',
      priority: 'MEDIUM',
      progress: 100,
      status: 'PENDING_VERIFICATION',
      location: 'North Pit Bench 6'
    }
  ]);

  const hemmMachinery = [
    { machine: 'Dumper CAT-777D (D-04)', status: 'OPERATIONAL', fitnessScore: 98, lastCheck: 'Today 06:00' },
    { machine: 'Hydraulic Shovel P&H 1900 (S-02)', status: 'OPERATIONAL', fitnessScore: 94, lastCheck: 'Today 06:15' },
    { machine: 'Blast Hole Drill ROC L8 (DR-01)', status: 'OPERATIONAL', fitnessScore: 96, lastCheck: 'Today 06:30' },
    { machine: 'Crawler Dozer D375A (DZ-03)', status: 'MAINTENANCE', fitnessScore: 78, lastCheck: 'Track Pin Overhaul' }
  ];

  const handleEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEvidenceSubmitted(true);
    setTimeout(() => {
      setEvidenceSubmitted(false);
      setShowEvidenceModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Contractor Hero Banner */}
      <div className="bg-gradient-to-r from-gov-dark via-slate-900 to-amber-950 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {t('role.CONTRACTOR', 'Mining Contractor & HEMM Operations')}
              </span>
              <span className="text-slate-300 text-xs font-semibold">
                • {user?.name || 'Vikramaditya Construction Ltd'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              {t('contractor.title', 'Mining Contractor & HEMM Safety Operations')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-medium">
              Assigned CAPA remediations, heavy earthmoving machinery fitness logs & workforce safety compliance
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowEvidenceModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              {t('contractor.submitEvidence', 'Submit CAPA Evidence')}
            </button>
            <button
              onClick={() => navigate('/actions')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4 text-gov-gold" />
              My Assigned Actions
            </button>
          </div>
        </div>
      </div>

      {/* Contractor KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Assigned CAPAs */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-gov-primary border border-slate-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Assigned CAPA Tasks</p>
              <p className="mt-2 text-2xl font-black text-slate-900">3 Remedials</p>
              <p className="mt-1 text-xs text-slate-500">2 In Progress • 1 Submitted</p>
            </div>
            <div className="p-3 bg-sky-50 text-gov-primary rounded-xl border border-sky-100">
              <FileCheck2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* HEMM Machinery Fitness */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-emerald-500 border border-slate-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('contractor.hemmFitness', 'HEMM Machinery Fitness')}
              </p>
              <p className="mt-2 text-2xl font-black text-emerald-600">96.4%</p>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                3/4 Equipment Shift Ready
              </span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <Truck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Contractor Crew Safety */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-indigo-500 border border-slate-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('contractor.crewSafety', 'Contractor Crew Medicals')}
              </p>
              <p className="mt-2 text-2xl font-black text-indigo-600">100% Valid</p>
              <p className="mt-1 text-xs text-slate-500">84 Workers Certified</p>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Next Audit Milestone */}
        <div className="bg-white rounded-xl shadow-xs border-l-4 border-l-amber-500 border border-slate-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Next DGMS Verification</p>
              <p className="mt-2 text-2xl font-black text-amber-600">3 Days</p>
              <p className="mt-1 text-xs text-slate-500">Haul Road Guard Berm Audit</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Active CAPA Cards + HEMM Machinery Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active CAPA Remediation Progress */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Active CAPA Remediation Cards</h3>
              <p className="text-xs text-slate-500">Contractor corrective action milestones and verification readiness</p>
            </div>
            <button
              onClick={() => setShowEvidenceModal(true)}
              className="text-xs font-bold text-gov-primary hover:underline cursor-pointer"
            >
              + Submit Evidence
            </button>
          </div>

          <div className="space-y-4">
            {assignedCapas.map(capa => (
              <div key={capa.id} className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all bg-slate-50/50">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        capa.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-700' :
                        capa.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-sky-100 text-sky-700'
                      }`}>
                        {capa.priority}
                      </span>
                      <span className="text-xs font-bold text-slate-500">📍 {capa.location}</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 mt-1.5">{capa.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Deadline: <span className="font-bold text-slate-700">{capa.deadline}</span></p>
                  </div>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                    capa.status === 'PENDING_VERIFICATION' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                    'bg-sky-50 text-gov-primary border border-sky-200'
                  }`}>
                    {capa.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>Remediation Progress</span>
                    <span>{capa.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all ${
                        capa.progress === 100 ? 'bg-emerald-500' : 'bg-gov-primary'
                      }`}
                      style={{ width: `${capa.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HEMM Machinery Daily Checklist */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">HEMM Pre-Shift Log</h3>
              <span className="text-xs font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                Shift A Ready
              </span>
            </div>

            <div className="divide-y divide-slate-100 mt-2 space-y-3 text-xs">
              {hemmMachinery.map((mach, i) => (
                <div key={i} className="pt-3 first:pt-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{mach.machine}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                      mach.status === 'OPERATIONAL' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {mach.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>Fitness: <strong className="text-slate-800">{mach.fitnessScore}%</strong></span>
                    <span>{mach.lastCheck}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <p className="text-xs font-bold text-slate-700">Contractor Safety Steward</p>
            <p className="text-[11px] text-slate-500 mt-0.5">All 84 operators verified with DGMS Form B muster</p>
          </div>
        </div>

      </div>

      {/* Modal: Submit CAPA Resolution Evidence */}
      {showEvidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-gov-primary" />
                <h3 className="text-sm font-black text-slate-900">
                  Submit CAPA Resolution Evidence
                </h3>
              </div>
              <button
                onClick={() => setShowEvidenceModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {evidenceSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-sm font-black text-slate-900">Evidence Uploaded for Verification!</h4>
                <p className="text-xs text-slate-500">DGMS Safety Inspector & Mine Manager notified for sign-off.</p>
              </div>
            ) : (
              <form onSubmit={handleEvidenceSubmit} className="space-y-4 mt-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Assigned CAPA</label>
                  <select className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-primary">
                    <option>Conveyor Chute 4 Sprinkler Retrofit (Pit 2)</option>
                    <option>Haul Road Guard Berm Height (East Dump)</option>
                    <option>Overburden Bench Slope Angle Dressing</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Completion Progress</label>
                    <select className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-primary">
                      <option>100% - Fully Resolved (Request Sign-Off)</option>
                      <option>75% - Major Rectification Completed</option>
                      <option>50% - In Progress</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Date of Completion</label>
                    <input
                      type="date"
                      defaultValue="2026-09-15"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contractor Rectification Summary</label>
                  <textarea
                    rows={3}
                    placeholder="Detail the mechanical or civil work carried out..."
                    defaultValue="Installed heavy duty high pressure mist nozzles across 120 meters of conveyor chute. Flow rate verified at 4.2 bar."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-primary"
                  ></textarea>
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 cursor-pointer">
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                  <p className="font-bold text-slate-700">Attach Geotagged Site Photo / Certificate</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG or PDF with GPS coordinates</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEvidenceModal(false)}
                    className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit for Official Sign-off
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

export default ContractorDashboard;

