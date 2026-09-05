import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { Mine, MineType, OperationalStatus, RiskLevel } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import {
  Mountain,
  Plus,
  Filter,
  Eye,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Mines: React.FC = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  const [mines, setMines] = useState<Mine[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const [search, setSearch] = useState<string>('');
  const [stateFilter, setStateFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<string>('');

  // Register Mine Modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    owner: 'Coal India Limited (CIL)',
    type: 'UNDERGROUND' as MineType,
    state: 'Jharkhand',
    district: 'Dhanbad',
    location: 'Jharia Coalfield',
    latitude: 23.7483,
    longitude: 86.4194,
    managerName: 'Sanjay Kumar Mukherjee',
    capacityMTPA: 4.5,
    operationalStatus: 'OPERATIONAL' as OperationalStatus
  });

  const fetchMines = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (stateFilter) params.append('state', stateFilter);
      if (typeFilter) params.append('type', typeFilter);
      if (statusFilter) params.append('status', statusFilter);
      if (riskFilter) params.append('riskLevel', riskFilter);

      const res = await api.get(`/mines?${params.toString()}`);
      if (res.data.success) {
        setMines(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load mines', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMines();
  }, [search, stateFilter, typeFilter, statusFilter, riskFilter]);

  const handleResetFilters = () => {
    setSearch('');
    setStateFilter('');
    setTypeFilter('');
    setStatusFilter('');
    setRiskFilter('');
  };

  const handleCreateMine = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/mines', formData);
      if (res.data.success) {
        setShowAddModal(false);
        fetchMines();
      }
    } catch (err) {
      console.error('Failed to create mine', err);
    }
  };

  const columns: Column<Mine>[] = [
    {
      header: 'Colliery Details',
      render: (m) => (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-gov-primary/10 text-gov-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
            ⛏
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-xs">{m.name}</span>
              <span className="font-mono text-[10px] font-bold text-gov-primary bg-gov-primary/10 px-1.5 py-0.5 rounded">
                {m.code}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">{m.owner}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Location & State',
      render: (m) => (
        <div>
          <span className="text-xs font-semibold text-slate-800">{m.district}, {m.state}</span>
          <p className="text-[10px] text-slate-400 font-mono">{m.latitude}°N, {m.longitude}°E</p>
        </div>
      )
    },
    {
      header: 'Type & Capacity',
      render: (m) => (
        <div>
          <span className="text-xs font-semibold text-slate-700">{m.type}</span>
          <p className="text-[11px] text-slate-500">{m.capacityMTPA} MTPA</p>
        </div>
      )
    },
    {
      header: 'Compliance Score',
      render: (m) => (
        <div className="flex items-center gap-2">
          <div className="w-12 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                m.complianceScore >= 85 ? 'bg-emerald-500' : m.complianceScore >= 70 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${m.complianceScore}%` }}
            ></div>
          </div>
          <span className="font-extrabold text-xs text-slate-900">{m.complianceScore}%</span>
        </div>
      )
    },
    {
      header: 'Risk Level',
      render: (m) => <StatusBadge status={m.riskLevel} type="risk" />
    },
    {
      header: 'Status',
      render: (m) => <StatusBadge status={m.operationalStatus} />
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (m) => (
        <button
          onClick={() => navigate(`/mines/${m.id}`)}
          className="px-2.5 py-1 text-xs font-bold text-gov-primary bg-gov-primary/10 rounded-lg hover:bg-gov-primary hover:text-white transition-colors"
        >
          Profile →
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
            <Mountain className="w-6 h-6 text-gov-primary" />
            National Coal Mines Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Surveillance registry of 12 high-capacity Indian coal collieries under DGMS oversight.
          </p>
        </div>

        {hasRole(['SUPER_ADMIN', 'HQ_MANAGEMENT']) && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-gov-primary text-white rounded-lg hover:bg-gov-dark shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Register New Colliery
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search mine name, code, manager, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-primary text-slate-900 text-xs"
          />
        </div>

        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 text-xs focus:outline-none"
        >
          <option value="">All States</option>
          <option value="Jharkhand">Jharkhand</option>
          <option value="Odisha">Odisha</option>
          <option value="Chhattisgarh">Chhattisgarh</option>
          <option value="West Bengal">West Bengal</option>
          <option value="Madhya Pradesh">Madhya Pradesh</option>
          <option value="Telangana">Telangana</option>
          <option value="Maharashtra">Maharashtra</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 text-xs focus:outline-none"
        >
          <option value="">All Mine Types</option>
          <option value="OPENCAST">OPENCAST</option>
          <option value="UNDERGROUND">UNDERGROUND</option>
          <option value="MIXED">MIXED</option>
        </select>

        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 text-xs focus:outline-none"
        >
          <option value="">All Risk Levels</option>
          <option value="LOW">Low Risk</option>
          <option value="MEDIUM">Medium Risk</option>
          <option value="HIGH">High Risk</option>
          <option value="CRITICAL">Critical Risk</option>
        </select>

        {(search || stateFilter || typeFilter || statusFilter || riskFilter) && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-bold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={mines}
        isLoading={isLoading}
        onRowClick={(m) => navigate(`/mines/${m.id}`)}
      />

      {/* Register Colliery Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register New Coal Mining Colliery"
        subtitle="Mines Act 1952 Statutory Registration"
      >
        <form onSubmit={handleCreateMine} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mine Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Talcher West Colliery"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mine Code *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. MCL-TAL-01"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mine Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as MineType })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="UNDERGROUND">UNDERGROUND</option>
                <option value="OPENCAST">OPENCAST</option>
                <option value="MIXED">MIXED</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">State</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">District</label>
              <input
                type="text"
                required
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Colliery Manager *</label>
              <input
                type="text"
                required
                value={formData.managerName}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Capacity (MTPA) *</label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.capacityMTPA}
                onChange={(e) => setFormData({ ...formData, capacityMTPA: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
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
              className="px-5 py-2 rounded-lg bg-gov-primary text-white font-bold hover:bg-gov-dark"
            >
              Register Colliery
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Mines;

