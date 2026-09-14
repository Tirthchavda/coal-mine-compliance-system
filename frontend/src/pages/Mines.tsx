import React, { useState, useEffect, useMemo } from 'react';
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

import { MOCK_MINES } from '../data/mockData';

export const Mines: React.FC = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  const [mines, setMines] = useState<Mine[]>(MOCK_MINES);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      const res = await api.get('/mines', { timeout: 8000 });
      if (res.data?.success && res.data?.data && res.data.data.length > 0) {
        setMines(res.data.data);
      }
    } catch (err) {
      console.warn('Using pre-seeded mines data fallback');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMines();
  }, []);

  // Instantaneous 0ms client-side filter computation
  const filteredMines = useMemo(() => {
    return mines.filter((m) => {
      if (search && search.trim()) {
        const tokens = search.toLowerCase().trim().split(/\s+/);
        const haystack = `${m.name || ''} ${m.code || ''} ${m.owner || ''} ${m.district || ''} ${m.state || ''} ${m.managerName || ''} ${m.location || ''} ${m.type || ''} ${m.riskLevel || ''} ${m.operationalStatus || ''}`.toLowerCase();
        const allMatched = tokens.every((tok) => haystack.includes(tok));
        if (!allMatched) return false;
      }
      if (stateFilter && stateFilter.trim()) {
        if ((m.state || '').toLowerCase().trim() !== stateFilter.toLowerCase().trim()) return false;
      }
      if (typeFilter && typeFilter.trim()) {
        if ((m.type || '').toUpperCase().trim() !== typeFilter.toUpperCase().trim()) return false;
      }
      if (statusFilter && statusFilter.trim()) {
        if ((m.operationalStatus || '').toUpperCase().trim() !== statusFilter.toUpperCase().trim()) return false;
      }
      if (riskFilter && riskFilter.trim()) {
        if ((m.riskLevel || '').toUpperCase().trim() !== riskFilter.toUpperCase().trim()) return false;
      }
      return true;
    });
  }, [mines, search, stateFilter, typeFilter, statusFilter, riskFilter]);

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
            Surveillance registry of 15 high-capacity Indian coal collieries under DGMS oversight.
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

      {/* Quick Filter Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleResetFilters}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            !search && !stateFilter && !typeFilter && !statusFilter && !riskFilter
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Collieries ({mines.length})
        </button>
        <button
          onClick={() => setRiskFilter(riskFilter === 'CRITICAL' ? '' : 'CRITICAL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            riskFilter === 'CRITICAL'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
          }`}
        >
          <span>🔴</span> Critical Risk ({mines.filter(m => m.riskLevel === 'CRITICAL').length})
        </button>
        <button
          onClick={() => setRiskFilter(riskFilter === 'HIGH' ? '' : 'HIGH')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            riskFilter === 'HIGH'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100'
          }`}
        >
          <span>🟠</span> High Risk ({mines.filter(m => m.riskLevel === 'HIGH').length})
        </button>
        <button
          onClick={() => setTypeFilter(typeFilter === 'OPENCAST' ? '' : 'OPENCAST')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            typeFilter === 'OPENCAST'
              ? 'bg-gov-primary text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Opencast Mines ({mines.filter(m => m.type === 'OPENCAST').length})
        </button>
        <button
          onClick={() => setTypeFilter(typeFilter === 'UNDERGROUND' ? '' : 'UNDERGROUND')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            typeFilter === 'UNDERGROUND'
              ? 'bg-gov-primary text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Underground Mines ({mines.filter(m => m.type === 'UNDERGROUND').length})
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search mine name, code, manager, location, state..."
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
          <option value="Tamil Nadu">Tamil Nadu</option>
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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 text-xs focus:outline-none"
        >
          <option value="">All Operational Statuses</option>
          <option value="OPERATIONAL">OPERATIONAL</option>
          <option value="TEMPORARILY_CLOSED">TEMPORARILY CLOSED</option>
          <option value="MAINTENANCE">MAINTENANCE</option>
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
            Reset ({filteredMines.length})
          </button>
        )}
      </div>

      {/* Showing Count Information */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-800">{filteredMines.length}</strong> of <strong className="text-slate-800">{mines.length}</strong> registered collieries
        </span>
        {(search || stateFilter || typeFilter || statusFilter || riskFilter) && (
          <span className="text-gov-primary font-bold bg-gov-primary/10 px-2 py-0.5 rounded">
            Filtered View Active
          </span>
        )}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredMines}
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

