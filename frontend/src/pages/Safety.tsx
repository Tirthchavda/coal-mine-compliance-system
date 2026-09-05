import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { SafetyRecord, Mine } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import {
  HeartPulse,
  Plus,
  Flame,
  AlertTriangle,
  ShieldCheck,
  Activity,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Safety: React.FC = () => {
  const { hasRole } = useAuth();

  const [records, setRecords] = useState<SafetyRecord[]>([]);
  const [mines, setMines] = useState<Mine[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [mineId, setMineId] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    mineId: '',
    incidentType: 'TELEMETRY_LOG',
    severity: 'LOW',
    description: 'Routine continuous methane and carbon monoxide ventilation telemetry reading.',
    locationInMine: 'Seam 4 Working Face',
    casualties: 0,
    injuries: 0,
    lostHours: 0,
    ppeComplianceRate: 98.0,
    gasLevelCH4: 0.15,
    gasLevelCO: 4.2
  });

  const fetchAuxData = async () => {
    try {
      const res = await api.get('/mines');
      if (res.data.success) setMines(res.data.data);
    } catch (e) {}
  };

  const fetchSafety = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (mineId) params.append('mineId', mineId);

      const res = await api.get(`/safety?${params.toString()}`);
      if (res.data.success) {
        setRecords(res.data.data);
        setAnalytics(res.data.analytics);
      }
    } catch (err) {
      console.error('Failed to load safety records', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuxData();
  }, []);

  useEffect(() => {
    fetchSafety();
  }, [mineId]);

  const handleCreateSafety = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/safety', formData);
      if (res.data.success) {
        setShowAddModal(false);
        fetchSafety();
      }
    } catch (err) {
      console.error('Failed to create safety record', err);
    }
  };

  const columns: Column<SafetyRecord>[] = [
    {
      header: 'Colliery & Location',
      render: (s) => (
        <div>
          <span className="font-bold text-slate-900 text-xs">{s.mine?.name}</span>
          <p className="text-[11px] text-slate-500">{s.locationInMine}</p>
        </div>
      )
    },
    {
      header: 'Incident / Telemetry Type',
      render: (s) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs">{s.incidentType}</span>
          <p className="text-[11px] text-slate-500 line-clamp-1">{s.description}</p>
        </div>
      )
    },
    {
      header: 'CH4 Methane (Std: < 0.75%)',
      render: (s) => {
        const isHazard = s.gasLevelCH4 >= 0.75;
        return (
          <span className={`text-xs font-bold ${isHazard ? 'text-rose-600 font-black' : 'text-slate-800'}`}>
            {s.gasLevelCH4}% {isHazard && '🔥'}
          </span>
        );
      }
    },
    {
      header: 'CO Level (Std: < 50 ppm)',
      render: (s) => {
        const isHazard = s.gasLevelCO >= 50;
        return (
          <span className={`text-xs font-bold ${isHazard ? 'text-rose-600 font-black' : 'text-slate-800'}`}>
            {s.gasLevelCO} ppm {isHazard && '⚠'}
          </span>
        );
      }
    },
    {
      header: 'PPE Compliance',
      render: (s) => (
        <span className="font-bold text-xs text-emerald-700">{s.ppeComplianceRate}%</span>
      )
    },
    {
      header: 'Casualties / Injuries',
      render: (s) => (
        <span className="text-xs font-semibold text-slate-700">
          {s.casualties} cas / {s.injuries} inj
        </span>
      )
    },
    {
      header: 'Date',
      render: (s) => (
        <span className="text-xs text-slate-600 font-mono">
          {new Date(s.date).toLocaleDateString()}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-rose-600" />
            Mine Safety Governance & Gas Telemetry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Continuous surveillance of inflammable gas (CH4), toxic CO, PPE compliance, and zero-harm records.
          </p>
        </div>

        {hasRole(['SUPER_ADMIN', 'SAFETY_INSPECTOR', 'MINE_MANAGER']) && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-gov-primary text-white rounded-lg hover:bg-gov-dark shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Log Safety Incident / Gas Reading
          </button>
        )}
      </div>

      {/* Metrics Row */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Safety Records</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{analytics.totalRecords}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Underground + Opencast</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mean PPE Adherence</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{analytics.avgPPECompliance}%</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Target &gt;= 95%</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Methane Peak Level</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{analytics.maxCH4}%</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Statutory Alarm: 0.75%</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Safety Index</p>
            <p className="text-2xl font-black text-gov-primary mt-1">{analytics.safetyScore} / 100</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Zero Lost-Time Incident standard</p>
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

      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Log Underground Gas Reading / Safety Record"
      >
        <form onSubmit={handleCreateSafety} className="space-y-4 text-xs">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Location in Mine *</label>
              <input
                type="text"
                required
                value={formData.locationInMine}
                onChange={(e) => setFormData({ ...formData, locationInMine: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Incident Type</label>
              <select
                value={formData.incidentType}
                onChange={(e) => setFormData({ ...formData, incidentType: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="TELEMETRY_LOG">Routine Telemetry Reading</option>
                <option value="NEAR_MISS">Near Miss Incident</option>
                <option value="STRATA_MOVEMENT">Strata / Roof Tension</option>
                <option value="EQUIPMENT_HAZARD">HEMM Machinery Hazard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">CH4 Gas (% Vol)</label>
              <input
                type="number"
                step="0.01"
                value={formData.gasLevelCH4}
                onChange={(e) => setFormData({ ...formData, gasLevelCH4: parseFloat(e.target.value) })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">CO Level (ppm)</label>
              <input
                type="number"
                step="0.1"
                value={formData.gasLevelCO}
                onChange={(e) => setFormData({ ...formData, gasLevelCO: parseFloat(e.target.value) })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">PPE Compliance (%)</label>
              <input
                type="number"
                step="1"
                value={formData.ppeComplianceRate}
                onChange={(e) => setFormData({ ...formData, ppeComplianceRate: parseFloat(e.target.value) })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Observation Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            ></textarea>
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
              Log Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Safety;

