import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { Mine } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { StatCard } from '../components/StatCard';
import {
  Mountain,
  MapPin,
  ShieldCheck,
  AlertOctagon,
  ClipboardList,
  FileText,
  HeartPulse,
  Leaf,
  Sparkles,
  ArrowLeft,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  MOCK_MINES,
  MOCK_COMPLIANCE,
  MOCK_VIOLATIONS,
  MOCK_INSPECTIONS,
  MOCK_DOCUMENTS,
  MOCK_SAFETY,
  MOCK_ENVIRONMENT,
  MOCK_AI_PREDICTIONS
} from '../data/mockData';

const getMockMineProfile = (targetId?: string) => {
  const m = MOCK_MINES.find(item => item.id === targetId) || MOCK_MINES[0];
  return {
    ...m,
    complianceRecords: MOCK_COMPLIANCE.filter(c => c.mineId === m.id || c.mine?.id === m.id),
    violations: MOCK_VIOLATIONS.filter(v => v.mineId === m.id || v.mine?.id === m.id),
    inspections: MOCK_INSPECTIONS.filter(i => i.mineId === m.id || i.mine?.id === m.id),
    documents: MOCK_DOCUMENTS.filter(d => d.mineId === m.id || d.mine?.id === m.id),
    safetyRecords: MOCK_SAFETY.filter(s => s.mineId === m.id || s.mine?.id === m.id),
    environmentalRecords: MOCK_ENVIRONMENT.filter(e => e.mineId === m.id || e.mine?.id === m.id),
    aiPredictions: MOCK_AI_PREDICTIONS.filter(a => a.mineId === m.id || a.mine?.id === m.id)
  };
};

export const MineProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  const [mine, setMine] = useState<any>(getMockMineProfile(id));
  const [activeTab, setActiveTab] = useState<string>('compliance');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchMineDetail = async () => {
    try {
      const res = await api.get(`/mines/${id}`, { timeout: 8000 });
      if (res.data?.success && res.data?.data) {
        setMine(res.data.data);
        return;
      }
    } catch (err) {
      console.warn('Using pre-seeded colliery profile structure');
    } finally {
      setIsLoading(false);
    }
    setMine(getMockMineProfile(id));
  };

  useEffect(() => {
    if (id) fetchMineDetail();
  }, [id]);

  if (isLoading || !mine) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-gov-primary mb-3"></div>
          <p className="text-sm font-semibold text-slate-700">Loading Colliery Profile...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'compliance', label: `Statutory Obligations (${mine.complianceRecords?.length || 0})`, icon: ShieldCheck },
    { id: 'violations', label: `Active Violations (${mine.violations?.filter((v: any) => v.status !== 'CLOSED').length || 0})`, icon: AlertOctagon },
    { id: 'inspections', label: `DGMS Audits (${mine.inspections?.length || 0})`, icon: ClipboardList },
    { id: 'documents', label: `Clearance Vault (${mine.documents?.length || 0})`, icon: FileText },
    { id: 'telemetry', label: 'Safety & Environmental Telemetry', icon: HeartPulse },
    { id: 'ai', label: 'AI Risk Diagnostics', icon: Sparkles }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Back Button */}
      <button
        onClick={() => navigate('/mines')}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-gov-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Coal Mines Directory
      </button>

      {/* Hero Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-gov-primary bg-gov-primary/10 px-2 py-0.5 rounded border border-gov-primary/20">
                {mine.code}
              </span>
              <span className="text-xs font-semibold text-slate-500">• {mine.type}</span>
              <StatusBadge status={mine.operationalStatus} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{mine.name}</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {mine.location} • {mine.district}, {mine.state}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400">Statutory Score</p>
              <p className="text-2xl font-black text-slate-900">{mine.complianceScore}%</p>
            </div>
            <StatusBadge status={mine.riskLevel} type="risk" />
          </div>
        </div>

        {/* Quick Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Owner / Subsidiary</span>
            <strong className="text-slate-800">{mine.owner}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Colliery Manager</span>
            <strong className="text-slate-800">{mine.managerName}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Production Capacity</span>
            <strong className="text-slate-800">{mine.capacityMTPA} MTPA</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">GPS Coordinates</span>
            <strong className="text-slate-800 font-mono">{mine.latitude}°N, {mine.longitude}°E</strong>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gov-primary text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'compliance' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Statutory Obligations Under Active Surveillance</h3>
            <div className="divide-y divide-slate-100">
              {mine.complianceRecords?.map((r: any) => (
                <div
                  key={r.id}
                  onClick={() => navigate(`/compliance/${r.id}`)}
                  className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{r.requirement?.title}</span>
                      <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1 rounded">
                        {r.requirement?.regulationReference}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px]">{r.requirement?.requirement}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={r.status} />
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'violations' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Statutory Violations & DGMS Directives</h3>
            <div className="space-y-2">
              {mine.violations?.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4">No active statutory violations recorded.</p>
              ) : (
                mine.violations?.map((v: any) => (
                  <div
                    key={v.id}
                    onClick={() => navigate(`/violations?search=${v.id}`)}
                    className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-100 transition-colors text-xs cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{v.title}</span>
                        <StatusBadge status={v.severity} type="severity" />
                      </div>
                      <p className="text-slate-600 mt-1 text-[11px]">{v.description}</p>
                      <p className="text-slate-400 text-[10px] mt-1">Deadline: {new Date(v.deadline).toLocaleDateString()}</p>
                    </div>
                    <StatusBadge status={v.status} />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'inspections' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">DGMS Safety Inspections & Audits</h3>
            <div className="divide-y divide-slate-100 text-xs">
              {mine.inspections?.map((i: any) => (
                <div key={i.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{i.inspectionType?.replace(/_/g, ' ')}</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">{i.summary}</p>
                    <p className="text-[10px] text-slate-400">Date: {new Date(i.scheduledDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={i.status} />
                    <span className="block text-xs font-extrabold text-slate-800 mt-1">
                      Score: {i.overallScore ? `${i.overallScore}%` : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Statutory Clearances & Return Vault</h3>
            <div className="divide-y divide-slate-100 text-xs">
              {mine.documents?.map((d: any) => (
                <div key={d.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gov-primary" />
                    <div>
                      <span className="font-bold text-slate-900">{d.title}</span>
                      <p className="text-slate-400 text-[10px] font-mono">{d.originalName}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-600">
                    Expires: {d.expiryDate ? new Date(d.expiryDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'telemetry' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-rose-600" />
                Underground Gas Telemetry & Safety
              </h4>
              <div className="space-y-2 text-xs">
                {mine.safetyRecords?.map((s: any) => (
                  <div key={s.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex justify-between font-bold">
                      <span>{s.incidentType}</span>
                      <span className="text-emerald-700">PPE: {s.ppeComplianceRate}%</span>
                    </div>
                    <p className="text-slate-600 mt-1">{s.description}</p>
                    <div className="mt-2 text-[10px] text-slate-400 flex gap-4">
                      <span>CH4: <strong>{s.gasLevelCH4}%</strong></span>
                      <span>CO: <strong>{s.gasLevelCO} ppm</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-600" />
                CPCB Environmental Telemetry
              </h4>
              <div className="space-y-2 text-xs">
                {mine.environmentalData?.map((e: any) => (
                  <div key={e.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex justify-between font-bold">
                      <span>PM10: {e.pm10} µg/m³</span>
                      <span>Water pH: {e.waterPh}</span>
                    </div>
                    <div className="mt-2 text-[10px] text-slate-400 flex gap-4">
                      <span>TDS: {e.waterTds} mg/L</span>
                      <span>Noise: {e.noiseDb} dB</span>
                      <span>OB Dump: <strong>{e.overburdenStabilityStatus}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gov-gold" />
              AI Statutory Risk Intelligence
            </h3>

            {mine.aiPrediction ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Risk Assessment</span>
                    <p className="text-2xl font-black text-slate-900 mt-0.5">{mine.aiPrediction.riskScore} / 100</p>
                  </div>
                  <StatusBadge status={mine.aiPrediction.riskLevel} type="risk" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                  <div>
                    <strong className="block font-bold text-slate-800 mb-1">Identified Risk Drivers:</strong>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                      {mine.aiPrediction.factors?.map((f: string, idx: number) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <strong className="block font-bold text-gov-primary mb-1">AI Recommendation:</strong>
                    <p className="text-slate-700 font-medium text-[11px]">
                      {mine.aiPrediction.recommendations?.[0] || 'Maintain surveillance.'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 italic py-2">No AI prediction generated yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MineProfile;

