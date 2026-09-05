import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { ComplianceRecord, Mine, ComplianceRequirement } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import {
  ShieldCheck,
  Plus,
  Filter,
  Eye,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Clock,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Compliance: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const { hasRole } = useAuth();

  const [records, setRecords] = useState<ComplianceRecord[]>([]);
  const [mines, setMines] = useState<Mine[]>([]);
  const [requirements, setRequirements] = useState<ComplianceRequirement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const [search, setSearch] = useState<string>(initialSearch);
  const [mineId, setMineId] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [riskLevel, setRiskLevel] = useState<string>('');

  // Add Compliance Modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    requirementId: '',
    mineId: '',
    applicableDate: new Date().toISOString().split('T')[0],
    dueDate: '2026-10-31',
    status: 'PENDING',
    riskLevel: 'LOW',
    remarks: ''
  });

  const fetchAuxData = async () => {
    try {
      const [minesRes, reqsRes] = await Promise.all([
        api.get('/mines'),
        api.get('/compliance/requirements')
      ]);
      if (minesRes.data.success) setMines(minesRes.data.data);
      if (reqsRes.data.success) setRequirements(reqsRes.data.data);
    } catch (e) {}
  };

  const fetchCompliance = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (mineId) params.append('mineId', mineId);
      if (category) params.append('category', category);
      if (status) params.append('status', status);
      if (riskLevel) params.append('riskLevel', riskLevel);

      const res = await api.get(`/compliance?${params.toString()}`);
      if (res.data.success) {
        setRecords(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load compliance records', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuxData();
  }, []);

  useEffect(() => {
    fetchCompliance();
  }, [search, mineId, category, status, riskLevel]);

  const handleResetFilters = () => {
    setSearch('');
    setMineId('');
    setCategory('');
    setStatus('');
    setRiskLevel('');
  };

  const handleCreateCompliance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/compliance', formData);
      if (res.data.success) {
        setShowAddModal(false);
        fetchCompliance();
      }
    } catch (err) {
      console.error('Failed to create compliance record', err);
    }
  };

  const columns: Column<ComplianceRecord>[] = [
    {
      header: 'Statutory Obligation & Clause',
      render: (r) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-xs">{r.requirement?.title}</span>
            <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1 rounded border border-slate-200">
              {r.requirement?.regulationReference}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 line-clamp-1">{r.requirement?.requirement}</p>
        </div>
      )
    },
    {
      header: 'Colliery',
      render: (r) => (
        <div>
          <span className="font-bold text-xs text-slate-800">{r.mine?.name}</span>
          <p className="text-[10px] text-slate-400 font-mono">{r.mine?.code}</p>
        </div>
      )
    },
    {
      header: 'Category',
      render: (r) => (
        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {r.requirement?.category}
        </span>
      )
    },
    {
      header: 'Authority',
      render: (r) => (
        <span className="text-[11px] text-slate-600 font-medium">
          {r.requirement?.regulatoryAuthority}
        </span>
      )
    },
    {
      header: 'Statutory Due Date',
      render: (r) => {
        const isOverdue = new Date(r.dueDate) < new Date() && r.status !== 'COMPLIANT';
        return (
          <span className={`text-xs font-bold ${isOverdue ? 'text-rose-600 font-extrabold' : 'text-slate-700'}`}>
            {new Date(r.dueDate).toLocaleDateString()}
          </span>
        );
      }
    },
    {
      header: 'Status',
      render: (r) => <StatusBadge status={r.status} />
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (r) => (
        <button
          onClick={() => navigate(`/compliance/${r.id}`)}
          className="px-2.5 py-1 text-xs font-bold text-gov-primary bg-gov-primary/10 rounded-lg hover:bg-gov-primary hover:text-white transition-colors"
        >
          View / Update →
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
            <ShieldCheck className="w-6 h-6 text-gov-primary" />
            Statutory Compliance Obligations Registry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time compliance monitoring under Mines Act 1952, CMR 2017, EPA 1986, and Water/Air Pollution Acts.
          </p>
        </div>

        {hasRole(['SUPER_ADMIN', 'HQ_MANAGEMENT', 'COMPLIANCE_OFFICER', 'MINE_MANAGER']) && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-gov-primary text-white rounded-lg hover:bg-gov-dark shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Schedule Obligation
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search clause, regulation, colliery name, remarks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-primary text-slate-900 text-xs"
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
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 text-xs focus:outline-none"
        >
          <option value="">All Statutory Categories</option>
          <option value="SAFETY">Safety (CMR 2017)</option>
          <option value="ENVIRONMENTAL">Environmental (EPA/CPCB)</option>
          <option value="MINING">Mining & DGMS</option>
          <option value="LABOUR">Labour & Creche</option>
          <option value="STATUTORY">Statutory Returns</option>
          <option value="OPERATIONAL">Operational HEMM</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 text-xs focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="COMPLIANT">Compliant</option>
          <option value="PARTIALLY_COMPLIANT">Partially Compliant</option>
          <option value="NON_COMPLIANT">Non-Compliant</option>
          <option value="PENDING">Pending Verification</option>
          <option value="EXPIRED">Expired</option>
        </select>

        {(search || mineId || category || status || riskLevel) && (
          <button
            onClick={handleResetFilters}
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
        data={records}
        isLoading={isLoading}
        onRowClick={(r) => navigate(`/compliance/${r.id}`)}
      />

      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Schedule Statutory Compliance Obligation"
        subtitle="Assign statutory regulation monitoring to colliery"
      >
        <form onSubmit={handleCreateCompliance} className="space-y-4 text-xs">
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
            <label className="block font-bold text-slate-700 mb-1">Statutory Requirement Rule *</label>
            <select
              required
              value={formData.requirementId}
              onChange={(e) => setFormData({ ...formData, requirementId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            >
              <option value="">-- Select Statutory Clause --</option>
              {requirements.map((r) => (
                <option key={r.id} value={r.id}>{r.title} [{r.regulationReference}]</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Due Date *</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Initial Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="PENDING">PENDING</option>
                <option value="COMPLIANT">COMPLIANT</option>
                <option value="PARTIALLY_COMPLIANT">PARTIALLY_COMPLIANT</option>
                <option value="NON_COMPLIANT">NON_COMPLIANT</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Remarks & Observations</label>
            <textarea
              rows={3}
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Enter initial site observation or verification notes..."
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
              Schedule Obligation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Compliance;

