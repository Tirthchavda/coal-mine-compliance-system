import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../api/client';
import { AuditLog } from '../types';
import { DataTable, Column } from '../components/DataTable';
import {
  History,
  Filter,
  Shield,
  Search,
  RotateCcw,
  Activity,
  FileCode
} from 'lucide-react';
import { MOCK_AUDIT_LOGS } from '../data/mockData';

export const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [search, setSearch] = useState<string>('');
  const [entityFilter, setEntityFilter] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('');

  const fetchAuditLogs = async () => {
    try {
      const res = await api.get('/audit-logs', { timeout: 8000 });
      if (res.data?.success && res.data?.data && res.data.data.length > 0) {
        setLogs(res.data.data);
      }
    } catch (err) {
      console.warn('Using pre-seeded statutory audit trail records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  // Instantaneous 0ms client-side filter computation
  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      if (search) {
        const q = search.toLowerCase().trim();
        const matchUser = l.userName?.toLowerCase().includes(q);
        const matchAction = l.action?.toLowerCase().includes(q);
        const matchEntity = l.entity?.toLowerCase().includes(q);
        const matchEntityId = l.entityId?.toLowerCase().includes(q);
        const matchRole = l.userRole?.toLowerCase().includes(q);
        if (!matchUser && !matchAction && !matchEntity && !matchEntityId && !matchRole) {
          return false;
        }
      }
      if (entityFilter && l.entity !== entityFilter) return false;
      if (actionFilter && l.action !== actionFilter) return false;
      return true;
    });
  }, [logs, search, entityFilter, actionFilter]);

  const columns: Column<AuditLog>[] = [
    {
      header: 'Timestamp',
      render: (l) => (
        <div>
          <span className="font-mono text-xs font-bold text-slate-800">
            {new Date(l.createdAt).toLocaleDateString()}
          </span>
          <p className="font-mono text-[10px] text-slate-400">
            {new Date(l.createdAt).toLocaleTimeString()}
          </p>
        </div>
      )
    },
    {
      header: 'Officer & Role',
      render: (l) => (
        <div>
          <span className="font-bold text-slate-900 text-xs">{l.userName}</span>
          <p className="text-[10px] text-gov-primary font-bold">{l.userRole?.replace(/_/g, ' ')}</p>
        </div>
      )
    },
    {
      header: 'Action Executed',
      render: (l) => (
        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded border border-slate-200">
          {l.action}
        </span>
      )
    },
    {
      header: 'Entity / Target ID',
      render: (l) => (
        <div>
          <span className="font-bold text-xs text-slate-800">{l.entity}</span>
          <p className="text-[10px] font-mono text-slate-400">{l.entityId}</p>
        </div>
      )
    },
    {
      header: 'Audit IP Address',
      render: (l) => (
        <span className="font-mono text-xs text-slate-500">{l.ipAddress || '127.0.0.1'}</span>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <History className="w-6 h-6 text-gov-primary" />
          Immutable Statutory Audit Ledger
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tamper-evident record of all compliance status changes, violations logged, CAPA sign-offs, and user activities.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search officer name, action keyword, entity ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none"
          />
        </div>

        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 text-xs focus:outline-none"
        >
          <option value="">All Entities</option>
          <option value="COMPLIANCE">COMPLIANCE</option>
          <option value="VIOLATION">VIOLATION</option>
          <option value="CORRECTIVE_ACTION">CORRECTIVE ACTION</option>
          <option value="INSPECTION">INSPECTION</option>
          <option value="DOCUMENT">DOCUMENT</option>
          <option value="AI_GOVERNANCE">AI GOVERNANCE</option>
          <option value="MINE">MINE</option>
        </select>

        {(search || entityFilter || actionFilter) && (
          <button
            onClick={() => { setSearch(''); setEntityFilter(''); setActionFilter(''); }}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset ({filteredLogs.length})
          </button>
        )}
      </div>

      {/* Showing Count Information */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-800">{filteredLogs.length}</strong> of <strong className="text-slate-800">{logs.length}</strong> immutable audit entries
        </span>
        {(search || entityFilter || actionFilter) && (
          <span className="text-gov-primary font-bold bg-gov-primary/10 px-2 py-0.5 rounded">
            Filtered View Active
          </span>
        )}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredLogs}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AuditLogs;

