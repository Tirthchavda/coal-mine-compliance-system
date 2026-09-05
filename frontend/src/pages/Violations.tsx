import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { Violation, Mine, ViolationSeverity } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import {
  AlertOctagon,
  Plus,
  Filter,
  CheckCircle,
  Clock,
  RotateCcw,
  Sparkles,
  Search,
  CheckSquare,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Violations: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialNew = searchParams.get('new');
  const initialSeverity = searchParams.get('severity') || '';
  const initialSearch = searchParams.get('search') || '';

  const { hasRole } = useAuth();

  const [violations, setViolations] = useState<Violation[]>([]);
  const [mines, setMines] = useState<Mine[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const [search, setSearch] = useState<string>(initialSearch);
  const [mineId, setMineId] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>(initialSeverity);
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Add Violation Modal
  const [showAddModal, setShowAddModal] = useState<boolean>(initialNew === 'true');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mineId: '',
    category: 'SAFETY',
    severity: 'CRITICAL' as ViolationSeverity,
    deadline: '2026-09-15',
    remarks: ''
  });

  // Assign CAPA Modal
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
  const [showCapaModal, setShowCapaModal] = useState<boolean>(false);
  const [capaTitle, setCapaTitle] = useState<string>('');
  const [capaDesc, setCapaDesc] = useState<string>('');
  const [capaDeadline, setCapaDeadline] = useState<string>('2026-09-20');

  const fetchAuxData = async () => {
    try {
      const res = await api.get('/mines');
      if (res.data.success) setMines(res.data.data);
    } catch (e) {}
  };

  const fetchViolations = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (mineId) params.append('mineId', mineId);
      if (severityFilter) params.append('severity', severityFilter);
      if (statusFilter) params.append('status', statusFilter);

      const res = await api.get(`/violations?${params.toString()}`);
      if (res.data.success) {
        setViolations(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load violations', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuxData();
  }, []);

  useEffect(() => {
    fetchViolations();
  }, [search, mineId, severityFilter, statusFilter]);

  const handleCreateViolation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/violations', formData);
      if (res.data.success) {
        setShowAddModal(false);
        fetchViolations();
      }
    } catch (err) {
      console.error('Failed to log violation', err);
    }
  };

  const handleCreateCapa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedViolation) return;
    try {
      const res = await api.post('/actions', {
        violationId: selectedViolation.id,
        mineId: selectedViolation.mineId,
        title: capaTitle || `Remediation for ${selectedViolation.title}`,
        description: capaDesc || 'Perform mandatory physical rectification to resolve statutory breach.',
        deadline: capaDeadline,
        priority: selectedViolation.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH'
      });
      if (res.data.success) {
        setShowCapaModal(false);
        fetchViolations();
      }
    } catch (err) {
      console.error('Failed to create CAPA', err);
    }
  };

  const columns: Column<Violation>[] = [
    {
      header: 'Statutory Violation Notice',
      render: (v) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-xs">{v.title}</span>
            <span className="font-mono text-[10px] text-slate-400">[{v.id}]</span>
          </div>
          <p className="text-[11px] text-slate-500 line-clamp-1">{v.description}</p>
        </div>
      )
    },
    {
      header: 'Colliery',
      render: (v) => (
        <div>
          <span className="font-bold text-xs text-slate-800">{v.mine?.name}</span>
          <p className="text-[10px] text-slate-400 font-mono">{v.mine?.code}</p>
        </div>
      )
    },
    {
      header: 'Category',
      render: (v) => (
        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
          {v.category}
        </span>
      )
    },
    {
      header: 'Severity',
      render: (v) => <StatusBadge status={v.severity} type="severity" />
    },
    {
      header: 'Statutory Deadline',
      render: (v) => {
        const isOverdue = new Date(v.deadline) < new Date() && v.status !== 'CLOSED' && v.status !== 'RESOLVED';
        return (
          <span className={`text-xs font-bold ${isOverdue ? 'text-rose-600 font-black' : 'text-slate-700'}`}>
            {new Date(v.deadline).toLocaleDateString()}
          </span>
        );
      }
    },
    {
      header: 'Status',
      render: (v) => <StatusBadge status={v.status} />
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (v) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          {v.status !== 'CLOSED' && hasRole(['SUPER_ADMIN', 'SAFETY_INSPECTOR', 'MINE_MANAGER', 'COMPLIANCE_OFFICER']) && (
            <button
              onClick={() => {
                setSelectedViolation(v);
                setCapaTitle(`Remediation for: ${v.title}`);
                setShowCapaModal(true);
              }}
              className="px-2.5 py-1 text-xs font-bold text-gov-primary bg-gov-primary/10 rounded-lg hover:bg-gov-primary hover:text-white transition-colors"
            >
              Assign CAPA →
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-rose-600" />
            Statutory Violations & Enforcement Notices
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full violation lifecycle management under CMR 2017 with AI severity classification and CAPA assignments.
          </p>
        </div>

        {hasRole(['SUPER_ADMIN', 'SAFETY_INSPECTOR']) && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Issue Violation Notice
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search violation title, defect details, colliery..."
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
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 text-xs focus:outline-none"
        >
          <option value="">All Severities</option>
          <option value="CRITICAL">CRITICAL</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 text-xs focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="ACTION_SUBMITTED">ACTION SUBMITTED</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="CLOSED">CLOSED</option>
        </select>

        {(search || mineId || severityFilter || statusFilter) && (
          <button
            onClick={() => { setSearch(''); setMineId(''); setSeverityFilter(''); setStatusFilter(''); }}
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
        data={violations}
        isLoading={isLoading}
      />

      {/* Add Violation Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Issue Formal Statutory Violation Notice"
      >
        <form onSubmit={handleCreateViolation} className="space-y-4 text-xs">
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

          <div>
            <label className="block font-bold text-slate-700 mb-1">Violation Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Non-Functional Auxiliary Ventilation Fan in District 3"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="SAFETY">SAFETY</option>
                <option value="ENVIRONMENTAL">ENVIRONMENTAL</option>
                <option value="MINING">MINING</option>
                <option value="LABOUR">LABOUR</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Severity Level</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value as ViolationSeverity })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Remediation Deadline *</label>
              <input
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Statutory Deficiency Description *</label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="State observation findings and regulatory non-conformity..."
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
              className="px-5 py-2 rounded-lg bg-rose-600 text-white font-bold"
            >
              Issue Notice
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign CAPA Modal */}
      {selectedViolation && (
        <Modal
          isOpen={showCapaModal}
          onClose={() => setShowCapaModal(false)}
          title={`Assign Corrective Action (CAPA): ${selectedViolation.title}`}
        >
          <form onSubmit={handleCreateCapa} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Remediation Milestone Title *</label>
              <input
                type="text"
                required
                value={capaTitle}
                onChange={(e) => setCapaTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Action Description & Target Objective *</label>
              <textarea
                rows={3}
                required
                value={capaDesc}
                onChange={(e) => setCapaDesc(e.target.value)}
                placeholder="State specific engineering and operational tasks..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              ></textarea>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Completion Target Deadline *</label>
              <input
                type="date"
                required
                value={capaDeadline}
                onChange={(e) => setCapaDeadline(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCapaModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-gov-primary text-white font-bold"
              >
                Assign Remediation Milestone
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Violations;

