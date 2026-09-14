import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../api/client';
import { User, UserRole, UserStatus, Mine } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import {
  Users as UsersIcon,
  UserPlus,
  Shield,
  Filter,
  CheckCircle,
  Building2,
  Mail,
  Phone,
  Search,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_USERS, MOCK_MINES } from '../data/mockData';

export const Users: React.FC = () => {
  const { hasRole } = useAuth();

  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [mines, setMines] = useState<Mine[]>(MOCK_MINES);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Filters
  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Add User Modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'CoalGov@2026',
    role: 'COMPLIANCE_OFFICER' as UserRole,
    department: 'Statutory Compliance Wing',
    phone: '+91 98300 12345',
    assignedMineId: '',
    status: 'ACTIVE' as UserStatus
  });

  const fetchAuxData = async () => {
    try {
      const res = await api.get('/mines', { timeout: 8000 });
      if (res.data?.success && res.data?.data && res.data.data.length > 0) {
        setMines(res.data.data);
      }
    } catch (e) {}
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users', { timeout: 8000 });
      if (res.data?.success && res.data?.data && res.data.data.length > 0) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.warn('Using pre-seeded official users directory');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuxData();
    fetchUsers();
  }, []);

  // Instantaneous 0ms client-side filter computation
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (search) {
        const q = search.toLowerCase().trim();
        const matchName = u.name?.toLowerCase().includes(q);
        const matchEmail = u.email?.toLowerCase().includes(q);
        const matchDept = u.department?.toLowerCase().includes(q);
        const matchPhone = u.phone?.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchDept && !matchPhone) {
          return false;
        }
      }
      if (roleFilter && u.role !== roleFilter) return false;
      if (statusFilter && u.status !== statusFilter) return false;
      return true;
    });
  }, [users, search, roleFilter, statusFilter]);

  const handleResetFilters = () => {
    setSearch('');
    setRoleFilter('');
    setStatusFilter('');
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/users', formData);
      if (res.data.success) {
        setShowAddModal(false);
        fetchUsers();
      }
    } catch (err) {
      console.error('Failed to create user', err);
    }
  };

  const columns: Column<User>[] = [
    {
      header: 'Official Name & Email',
      render: (u) => (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gov-dark text-gov-gold font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
            {u.name.charAt(0)}
          </div>
          <div>
            <span className="font-bold text-slate-900 text-xs">{u.name}</span>
            <p className="text-[11px] text-slate-500 font-mono">{u.email}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Statutory Role & RBAC',
      render: (u) => (
        <div>
          <span className="font-bold text-xs text-gov-primary bg-gov-primary/10 px-2 py-0.5 rounded">
            {u.role.replace(/_/g, ' ')}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">{u.department}</p>
        </div>
      )
    },
    {
      header: 'Assigned Colliery',
      render: (u) => {
        const mine = mines.find(m => m.id === u.assignedMineId);
        return (
          <span className="text-xs font-semibold text-slate-700">
            {mine ? mine.name : 'Central Headquarters / All Mines'}
          </span>
        );
      }
    },
    {
      header: 'Phone',
      render: (u) => (
        <span className="text-xs font-mono text-slate-600">{u.phone || 'N/A'}</span>
      )
    },
    {
      header: 'Status',
      render: (u) => <StatusBadge status={u.status} />
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <UsersIcon className="w-6 h-6 text-gov-primary" />
            User Directory & Role-Based Access Control (RBAC)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage administrative personnel, DGMS safety inspectors, colliery managers, and mining partners.
          </p>
        </div>

        {hasRole(['SUPER_ADMIN']) && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-gov-primary text-white rounded-lg hover:bg-gov-dark shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Create Official Account
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search name, email, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 text-xs focus:outline-none"
        >
          <option value="">All Roles</option>
          <option value="SUPER_ADMIN">SUPER ADMIN</option>
          <option value="HQ_MANAGEMENT">HQ MANAGEMENT</option>
          <option value="MINE_MANAGER">MINE MANAGER</option>
          <option value="SAFETY_INSPECTOR">SAFETY INSPECTOR</option>
          <option value="COMPLIANCE_OFFICER">COMPLIANCE OFFICER</option>
          <option value="CONTRACTOR">CONTRACTOR</option>
        </select>

        {(search || roleFilter || statusFilter) && (
          <button
            onClick={() => { setSearch(''); setRoleFilter(''); setStatusFilter(''); }}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset ({filteredUsers.length})
          </button>
        )}
      </div>

      {/* Showing Count Information */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-800">{filteredUsers.length}</strong> of <strong className="text-slate-800">{users.length}</strong> official user accounts
        </span>
        {(search || roleFilter || statusFilter) && (
          <span className="text-gov-primary font-bold bg-gov-primary/10 px-2 py-0.5 rounded">
            Filtered View Active
          </span>
        )}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        isLoading={isLoading}
      />

      {/* Add User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create Official User Account"
      >
        <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ramesh Chandra Verma"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. ramesh@mine.gov.in"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">System Role (RBAC) *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold"
              >
                <option value="SUPER_ADMIN">SUPER ADMIN (Full Control)</option>
                <option value="HQ_MANAGEMENT">HQ MANAGEMENT (Executive Analytics)</option>
                <option value="MINE_MANAGER">MINE MANAGER (Colliery Incharge)</option>
                <option value="SAFETY_INSPECTOR">SAFETY INSPECTOR (DGMS Audits)</option>
                <option value="COMPLIANCE_OFFICER">COMPLIANCE OFFICER (Statutory Returns)</option>
                <option value="CONTRACTOR">CONTRACTOR (Field Partner)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Assigned Colliery</label>
              <select
                value={formData.assignedMineId}
                onChange={(e) => setFormData({ ...formData, assignedMineId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="">-- Central Headquarters (All Mines) --</option>
                {mines.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} ({m.code})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
              className="px-5 py-2 rounded-lg bg-gov-primary text-white font-bold"
            >
              Create Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;

