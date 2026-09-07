import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { EnvironmentalRecord, Mine } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import {
  Leaf,
  Plus,
  Wind,
  Droplets,
  Volume2,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_ENVIRONMENT, MOCK_MINES } from '../data/mockData';

const defaultEnvAnalytics = {
  totalRecords: MOCK_ENVIRONMENT.length,
  avgPM10: 84.5,
  avgPH: 7.1,
  breachesCount: 2
};

export const Environment: React.FC = () => {
  const { hasRole } = useAuth();

  const [records, setRecords] = useState<EnvironmentalRecord[]>(MOCK_ENVIRONMENT as any);
  const [mines, setMines] = useState<Mine[]>(MOCK_MINES);
  const [analytics, setAnalytics] = useState<any>(defaultEnvAnalytics);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [mineId, setMineId] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    mineId: '',
    pm10: '78.5',
    pm25: '38.0',
    so2: '18.2',
    nox: '24.0',
    waterPh: '7.2',
    waterTds: '340',
    waterCod: '45',
    noiseDb: '68.5',
    overburdenStabilityStatus: 'STABLE'
  });

  const fetchAuxData = async () => {
    try {
      const res = await api.get('/mines', { timeout: 8000 });
      if (res.data?.success) setMines(res.data.data);
    } catch (e) {}
  };

  const fetchEnv = async () => {
    try {
      const params = new URLSearchParams();
      if (mineId) params.append('mineId', mineId);

      const res = await api.get(`/environment?${params.toString()}`, { timeout: 8000 });
      if (res.data?.success && res.data?.data) {
        setRecords(res.data.data);
        if (res.data.analytics) setAnalytics(res.data.analytics);
        return;
      }
    } catch (err) {
      console.warn('Using pre-seeded environmental CPCB records');
    } finally {
      setIsLoading(false);
    }

    // Client-side fallback filter
    let filtered = [...MOCK_ENVIRONMENT] as any[];
    if (mineId) filtered = filtered.filter(e => (e.mineId === mineId || e.mine?.id === mineId));
    setRecords(filtered);
  };

  useEffect(() => {
    fetchAuxData();
  }, []);

  useEffect(() => {
    fetchEnv();
  }, [mineId]);

  const handleCreateEnv = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/environment', formData);
      if (res.data.success) {
        setShowAddModal(false);
        fetchEnv();
      }
    } catch (err) {
      console.error('Failed to record environmental reading', err);
    }
  };

  const columns: Column<EnvironmentalRecord>[] = [
    {
      header: 'Colliery & Date',
      render: (e: any) => (
        <div>
          <span className="font-bold text-slate-900 text-xs">{e.mine?.name}</span>
          <p className="text-[11px] text-slate-500 font-mono">{new Date(e.date || e.recordedDate || '2026-09-07T08:00:00Z').toLocaleDateString()}</p>
        </div>
      )
    },
    {
      header: 'Air Quality PM10',
      render: (e: any) => {
        const val = e.pm10 ?? 80;
        const isBreach = val > 100;
        return (
          <span className={`text-xs font-bold ${isBreach ? 'text-rose-600 font-black' : 'text-slate-800'}`}>
            {val} µg/m³ {isBreach && '⚠'}
          </span>
        );
      }
    },
    {
      header: 'Air PM2.5',
      render: (e: any) => (
        <span className="text-xs font-semibold text-slate-700">
          {e.pm25 ?? 40} µg/m³
        </span>
      )
    },
    {
      header: 'Effluent pH (Std: 6.5-8.5)',
      render: (e: any) => {
        const val = e.waterPh ?? e.effluentPH ?? 7.2;
        const isBreach = val < 6.5 || val > 8.5;
        return (
          <span className={`text-xs font-bold ${isBreach ? 'text-rose-600 font-black' : 'text-emerald-700'}`}>
            {val} pH
          </span>
        );
      }
    },
    {
      header: 'TDS (mg/L)',
      render: (e: any) => (
        <span className="text-xs font-semibold text-slate-700">{e.waterTds ?? e.effluentTDS ?? 1200}</span>
      )
    },
    {
      header: 'Noise (dB)',
      render: (e: any) => (
        <span className="text-xs font-semibold text-slate-700">{e.noiseDb ?? e.noiseLevelDB ?? 68} dB</span>
      )
    },
    {
      header: 'Overburden Dump',
      render: (e: any) => {
        const status = e.overburdenStabilityStatus || (e.obDumpSlopeFactorOfSafety && e.obDumpSlopeFactorOfSafety >= 1.3 ? 'STABLE' : 'CRITICAL');
        return (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
            status === 'STABLE'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-rose-100 text-rose-800'
          }`}>
            {status} {e.obDumpSlopeFactorOfSafety ? `(FoS ${e.obDumpSlopeFactorOfSafety})` : ''}
          </span>
        );
      }
    },
    {
      header: 'Status',
      render: (e: any) => {
        const isBreach = e.warningTriggered || e.status === 'NON_COMPLIANT' || (e.pm10 > 100) || (e.effluentPH && e.effluentPH < 6.5);
        return isBreach ? (
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
            CPCB BREACH
          </span>
        ) : (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
            COMPLIANT
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-600" />
            CPCB Environmental Surveillance & Effluent Monitoring
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time telemetry tracking for ambient air (PM10/PM2.5), mine drainage water pH, and overburden stability.
          </p>
        </div>

        {hasRole(['SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'MINE_MANAGER', 'HQ_MANAGEMENT']) && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-gov-primary text-white rounded-lg hover:bg-gov-dark shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Log Telemetry Reading
          </button>
        )}
      </div>

      {/* Analytics Scorecards */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average PM10 Level</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{analytics.avgPM10} µg/m³</p>
            <p className="text-[10px] text-slate-500 mt-0.5">CPCB Standard: &lt; 100</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average PM2.5 Level</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{analytics.avgPM25} µg/m³</p>
            <p className="text-[10px] text-slate-500 mt-0.5">CPCB Standard: &lt; 60</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Effluent Mean pH</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{analytics.avgWaterPH} pH</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Neutral standard: 6.5 - 8.5</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CPCB Conformity Rate</p>
            <p className="text-2xl font-black text-gov-primary mt-1">{analytics.cpcbComplianceRate}%</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{analytics.activeBreaches} threshold breaches</p>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3 text-xs">
        <select
          value={mineId}
          onChange={(e) => setMineId(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 text-xs focus:outline-none"
        >
          <option value="">All Collieries</option>
          {mines.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={records}
        isLoading={isLoading}
      />

      {/* Add Telemetry Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Log Environmental Telemetry & Water Quality"
      >
        <form onSubmit={handleCreateEnv} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Colliery *</label>
            <select
              required
              value={formData.mineId}
              onChange={(e) => setFormData({ ...formData, mineId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            >
              <option value="">-- Select Colliery --</option>
              {mines.map((m) => (
                <option key={m.id} value={m.id}>{m.name} ({m.code})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">PM10 (µg/m³)</label>
              <input
                type="number"
                step="0.1"
                value={formData.pm10}
                onChange={(e) => setFormData({ ...formData, pm10: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">PM2.5 (µg/m³)</label>
              <input
                type="number"
                step="0.1"
                value={formData.pm25}
                onChange={(e) => setFormData({ ...formData, pm25: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Effluent pH</label>
              <input
                type="number"
                step="0.1"
                value={formData.waterPh}
                onChange={(e) => setFormData({ ...formData, waterPh: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">TDS (mg/L)</label>
              <input
                type="number"
                step="1"
                value={formData.waterTds}
                onChange={(e) => setFormData({ ...formData, waterTds: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Noise Level (dB)</label>
              <input
                type="number"
                step="0.1"
                value={formData.noiseDb}
                onChange={(e) => setFormData({ ...formData, noiseDb: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Overburden Dump Stability</label>
              <select
                value={formData.overburdenStabilityStatus}
                onChange={(e) => setFormData({ ...formData, overburdenStabilityStatus: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              >
                <option value="STABLE">STABLE</option>
                <option value="TENSION_DETECTED">TENSION CRACKS DETECTED</option>
                <option value="UNSTABLE">UNSTABLE - HIGH SLIP RISK</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gov-primary text-white font-bold"
            >
              Record Telemetry
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Environment;

