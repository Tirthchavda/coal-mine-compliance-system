import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { Inspection, Mine } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import {
  ClipboardCheck,
  Plus,
  Filter,
  CheckCircle,
  AlertTriangle,
  Play,
  FileCheck,
  ShieldCheck,
  Search,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import { MOCK_INSPECTIONS, MOCK_MINES } from '../data/mockData';

export const Inspections: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialNew = searchParams.get('new');
  const initialMineId = searchParams.get('mineId') || '';

  const { hasRole } = useAuth();

  const [inspections, setInspections] = useState<Inspection[]>(MOCK_INSPECTIONS);
  const [mines, setMines] = useState<Mine[]>(MOCK_MINES);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [search, setSearch] = useState<string>('');
  const [mineId, setMineId] = useState<string>(initialMineId);
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Schedule Modal
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(initialNew === 'true');
  const [scheduleData, setScheduleData] = useState({
    mineId: initialMineId,
    inspectionType: 'ROUTINE_STATUTORY',
    scheduledDate: new Date().toISOString().split('T')[0],
    summary: 'Quarterly statutory surveillance of colliery workings and safety mechanisms.'
  });

  // Execute Inspection Modal
  const [activeInsp, setActiveInsp] = useState<Inspection | null>(null);
  const [showExecuteModal, setShowExecuteModal] = useState<boolean>(false);
  const [checklistItem, setChecklistItem] = useState<string>('');
  const [category, setCategory] = useState<string>('SAFETY');
  const [observation, setObservation] = useState<string>('');
  const [isViolation, setIsViolation] = useState<boolean>(false);
  const [severity, setSeverity] = useState<string>('HIGH');
  const [finalScore, setFinalScore] = useState<string>('85');

  const fetchAuxData = async () => {
    try {
      const res = await api.get('/mines', { timeout: 8000 });
      if (res.data?.success) setMines(res.data.data);
    } catch (e) {}
  };

  const fetchInspections = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (mineId) params.append('mineId', mineId);
      if (statusFilter) params.append('status', statusFilter);

      const res = await api.get(`/inspections?${params.toString()}`, { timeout: 8000 });
      if (res.data?.success && res.data?.data) {
        setInspections(res.data.data);
      }
    } catch (err) {
      console.warn('Using pre-seeded DGMS safety inspection records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuxData();
  }, []);

  useEffect(() => {
    fetchInspections();
  }, [search, mineId, statusFilter]);

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/inspections', scheduleData);
      if (res.data.success) {
        setShowScheduleModal(false);
        fetchInspections();
      }
    } catch (err) {
      console.error('Failed to schedule inspection', err);
    }
  };

  const handleAddFinding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInsp) return;
    try {
      const res = await api.post(`/inspections/${activeInsp.id}/findings`, {
        checklistItem,
        category,
        observation,
        isViolation,
        severity
      });
      if (res.data.success) {
        setChecklistItem('');
        setObservation('');
        setIsViolation(false);
        const refreshed = await api.get(`/inspections/${activeInsp.id}`);
        if (refreshed.data.success) setActiveInsp(refreshed.data.data);
        fetchInspections();
      }
    } catch (err) {
      console.error('Failed to log finding', err);
    }
  };

  const handleCompleteInspection = async () => {
    if (!activeInsp) return;
    try {
      const res = await api.put(`/inspections/${activeInsp.id}/complete`, {
        overallScore: parseFloat(finalScore)
      });
      if (res.data.success) {
        setShowExecuteModal(false);
        fetchInspections();
      }
    } catch (err) {
      console.error('Failed to complete inspection', err);
    }
  };

  const columns: Column<Inspection>[] = [
    {
      header: 'Inspection Type & ID',
      render: (i) => (
        <div>
          <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">
            {i.id}
          </span>
          <p className="font-bold text-slate-900 text-xs mt-1">{i.inspectionType.replace(/_/g, ' ')}</p>
          <p className="text-[11px] text-slate-500 line-clamp-1">{i.summary}</p>
        </div>
      )
    },
    {
      header: 'Colliery',
      render: (i) => (
        <div>
          <span className="font-bold text-xs text-slate-800">{i.mine?.name}</span>
          <p className="text-[10px] text-slate-400 font-mono">{i.mine?.code}</p>
        </div>
      )
    },
    {
      header: 'Statutory Inspector',
      render: (i) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs">{i.inspector?.name}</span>
          <p className="text-[10px] text-slate-400">{i.inspector?.department}</p>
        </div>
      )
    },
    {
      header: 'Date',
      render: (i) => (
        <span className="text-xs font-semibold text-slate-700">
          {new Date(i.scheduledDate).toLocaleDateString()}
        </span>
      )
    },
    {
      header: 'Status',
      render: (i) => <StatusBadge status={i.status} />
    },
    {
      header: 'Score',
      render: (i) => (
        <span className="font-extrabold text-xs text-slate-900">
          {i.overallScore ? `${i.overallScore}%` : 'Pending'}
        </span>
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (i) => (
        <button
          onClick={() => {
            setActiveInsp(i);
            setShowExecuteModal(true);
          }}
          className="px-2.5 py-1 text-xs font-bold text-gov-primary bg-gov-primary/10 rounded-lg hover:bg-gov-primary hover:text-white transition-colors"
        >
          {i.status === 'COMPLETED' ? 'View Findings' : 'Conduct Audit →'}
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-gov-primary" />
            DGMS Statutory Inspections & Safety Audits
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Conduct formal audits, record checklist observations, and convert severe findings into statutory violations.
          </p>
        </div>

        {hasRole(['SUPER_ADMIN', 'SAFETY_INSPECTOR', 'HQ_MANAGEMENT']) && (
          <button
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-gov-primary text-white rounded-lg hover:bg-gov-dark shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Schedule Audit
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search inspector, summary, colliery..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none"
          />
        </div>

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

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 text-xs focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>

        {(search || mineId || statusFilter) && (
          <button
            onClick={() => { setSearch(''); setMineId(''); setStatusFilter(''); }}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={inspections}
        isLoading={isLoading}
      />

      {/* Schedule Modal */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Schedule DGMS Statutory Inspection"
      >
        <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Colliery *</label>
            <select
              required
              value={scheduleData.mineId}
              onChange={(e) => setScheduleData({ ...scheduleData, mineId: e.target.value })}
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
              <label className="block font-bold text-slate-700 mb-1">Inspection Type</label>
              <select
                value={scheduleData.inspectionType}
                onChange={(e) => setScheduleData({ ...scheduleData, inspectionType: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="ROUTINE_STATUTORY">Routine Statutory Audit</option>
                <option value="DGMS_SURPRISE">DGMS Surprise Inspection</option>
                <option value="SAFETY_AUDIT">Comprehensive Safety Audit</option>
                <option value="ENVIRONMENTAL_AUDIT">Environmental & Effluent Audit</option>
                <option value="VENTILATION_SPECIAL">Ventilation & Telemetry Special</option>
                <option value="ELECTRICAL_MECHANICAL">Electrical & HEMM Safety</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Scheduled Date *</label>
              <input
                type="date"
                required
                value={scheduleData.scheduledDate}
                onChange={(e) => setScheduleData({ ...scheduleData, scheduledDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Inspection Scope & Directives</label>
            <textarea
              rows={3}
              value={scheduleData.summary}
              onChange={(e) => setScheduleData({ ...scheduleData, summary: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowScheduleModal(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gov-primary text-white font-bold"
            >
              Schedule Audit
            </button>
          </div>
        </form>
      </Modal>

      {/* Conduct / View Inspection Modal */}
      {activeInsp && (
        <Modal
          isOpen={showExecuteModal}
          onClose={() => setShowExecuteModal(false)}
          title={`Inspection: ${activeInsp.inspectionType.replace(/_/g, ' ')} [${activeInsp.mine?.code}]`}
          maxWidth="3xl"
        >
          <div className="space-y-6 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-2">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Colliery</span>
                <strong className="text-slate-800">{activeInsp.mine?.name}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Inspector</span>
                <strong className="text-slate-800">{activeInsp.inspector?.name}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                <StatusBadge status={activeInsp.status} />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Inspection Findings & Observations ({activeInsp.findings?.length || 0})
              </h4>

              <div className="space-y-2">
                {activeInsp.findings?.length === 0 ? (
                  <p className="text-slate-500 italic py-2">No findings recorded yet.</p>
                ) : (
                  activeInsp.findings?.map((f: any, idx: number) => (
                    <div
                      key={f.id || idx}
                      className={`p-3 rounded-lg border text-xs ${
                        f.isViolation ? 'bg-rose-50/50 border-rose-200' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{f.checklistItem}</span>
                        {f.isViolation ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                            ⚠ VIOLATION ESCALATED ({f.severity})
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                            ✓ SATISFACTORY
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 mt-1">{f.observation}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {activeInsp.status !== 'COMPLETED' && (
              <form onSubmit={handleAddFinding} className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs">+ Add Checklist Item & Observation</h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Checklist Parameter *</label>
                    <input
                      type="text"
                      required
                      value={checklistItem}
                      onChange={(e) => setChecklistItem(e.target.value)}
                      placeholder="e.g. Strata Support Load Cells"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="SAFETY">SAFETY</option>
                      <option value="ENVIRONMENTAL">ENVIRONMENTAL</option>
                      <option value="MINING">MINING</option>
                      <option value="STATUTORY">STATUTORY</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Observation Notes *</label>
                  <textarea
                    rows={2}
                    required
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                    placeholder="Enter physical observations, instrument readings..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                  ></textarea>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isViolation}
                      onChange={(e) => setIsViolation(e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                    />
                    <span className="font-bold text-rose-700">Flag as Statutory Breach / Auto-Create Violation</span>
                  </label>

                  {isViolation && (
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value)}
                      className="px-2 py-1 border border-rose-300 bg-rose-50 text-rose-800 rounded font-bold text-xs"
                    >
                      <option value="CRITICAL">CRITICAL</option>
                      <option value="HIGH">HIGH</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="LOW">LOW</option>
                    </select>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900"
                >
                  Save Finding
                </button>
              </form>
            )}

            {activeInsp.status !== 'COMPLETED' && (
              <div className="p-4 rounded-xl bg-gov-primary/10 border border-gov-primary/30 flex items-center justify-between">
                <div>
                  <strong className="text-gov-dark block font-bold">Finalize Audit & Record Score</strong>
                  <p className="text-slate-600 text-[11px]">Marks audit as official and logs certificate.</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={finalScore}
                    onChange={(e) => setFinalScore(e.target.value)}
                    className="w-16 px-2 py-1 border border-slate-300 rounded text-xs font-bold"
                  />
                  <button
                    onClick={handleCompleteInspection}
                    className="px-4 py-1.5 bg-gov-primary text-white font-bold rounded-lg hover:bg-gov-dark shadow-sm"
                  >
                    Complete Inspection
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Inspections;

