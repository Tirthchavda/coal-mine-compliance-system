import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { CorrectiveAction, Mine } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import {
  CheckSquare,
  Filter,
  CheckCircle,
  Clock,
  RotateCcw,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const CorrectiveActions: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialOverdue = searchParams.get('overdueOnly') || '';
  const initialSearch = searchParams.get('search') || '';

  const { hasRole } = useAuth();

  const [actions, setActions] = useState<CorrectiveAction[]>([]);
  const [mines, setMines] = useState<Mine[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const [search, setSearch] = useState<string>(initialSearch);
  const [mineId, setMineId] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [overdueOnly, setOverdueOnly] = useState<string>(initialOverdue);

  // Update Progress Modal
  const [selectedAction, setSelectedAction] = useState<CorrectiveAction | null>(null);
  const [showProgressModal, setShowProgressModal] = useState<boolean>(false);
  const [progressVal, setProgressVal] = useState<number>(0);
  const [progressRemarks, setProgressRemarks] = useState<string>('');

  // Verify Modal
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
  const [verifyRemarks, setVerifyRemarks] = useState<string>('');

  const fetchAuxData = async () => {
    try {
      const res = await api.get('/mines');
      if (res.data.success) setMines(res.data.data);
    } catch (e) {}
  };

  const fetchActions = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (mineId) params.append('mineId', mineId);
      if (statusFilter) params.append('status', statusFilter);
      if (overdueOnly) params.append('overdueOnly', overdueOnly);

      const res = await api.get(`/actions?${params.toString()}`);
      if (res.data.success) {
        setActions(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load corrective actions', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuxData();
  }, []);

  useEffect(() => {
    fetchActions();
  }, [search, mineId, statusFilter, overdueOnly]);

  const handleUpdateProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAction) return;
    try {
      const res = await api.put(`/actions/${selectedAction.id}`, {
        progressPercentage: progressVal,
        remarks: progressRemarks || selectedAction.remarks
      });
      if (res.data.success) {
        setShowProgressModal(false);
        fetchActions();
      }
    } catch (err) {
      console.error('Failed to update progress', err);
    }
  };

  const handleVerify = async (isApproved: boolean) => {
    if (!selectedAction) return;
    try {
      const res = await api.put(`/actions/${selectedAction.id}/verify`, {
        isApproved,
        remarks: verifyRemarks || 'Site inspection completed and verified.'
      });
      if (res.data.success) {
        setShowVerifyModal(false);
        fetchActions();
      }
    } catch (err) {
      console.error('Failed to verify action', err);
    }
  };

  const columns: Column<CorrectiveAction>[] = [
    {
      header: 'Remediation Task (CAPA)',
      render: (a) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-xs">{a.title}</span>
            <span className="font-mono text-[10px] text-slate-400">[{a.id}]</span>
          </div>
          <p className="text-[11px] text-slate-600 line-clamp-1">{a.description}</p>
        </div>
      )
    },
    {
      header: 'Colliery',
      render: (a) => (
        <div>
          <span className="font-bold text-xs text-slate-800">{a.mine?.name}</span>
          <p className="text-[10px] text-slate-400 font-mono">{a.mine?.code}</p>
        </div>
      )
    },
    {
      header: 'Assigned Engineer / Partner',
      render: (a) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs">{a.assignedTo?.name || 'Assigned Officer'}</span>
          <p className="text-[10px] text-slate-400">{a.assignedTo?.department}</p>
        </div>
      )
    },
    {
      header: 'Progress',
      render: (a) => (
        <div className="w-28">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 mb-1">
            <span>{a.progressPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                a.progressPercentage === 100
                  ? 'bg-emerald-500'
                  : a.progressPercentage > 50
                  ? 'bg-sky-500'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${a.progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )
    },
    {
      header: 'Target Deadline',
      render: (a) => {
        const isOverdue = new Date(a.deadline) < new Date() && a.status !== 'COMPLETED' && a.status !== 'CLOSED';
        return (
          <span className={`text-xs font-bold ${isOverdue ? 'text-rose-600 font-black' : 'text-slate-700'}`}>
            {new Date(a.deadline).toLocaleDateString()}
          </span>
        );
      }
    },
    {
      header: 'Status',
      render: (a) => <StatusBadge status={a.status} />
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (a) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          {a.status !== 'CLOSED' && (
            <button
              onClick={() => {
                setSelectedAction(a);
                setProgressVal(a.progressPercentage);
                setShowProgressModal(true);
              }}
              className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200"
            >
              Update Progress
            </button>
          )}

          {(a.status === 'PENDING_VERIFICATION' || a.status === 'IN_PROGRESS' || a.progressPercentage >= 90) &&
            hasRole(['SUPER_ADMIN', 'SAFETY_INSPECTOR', 'HQ_MANAGEMENT']) && (
              <button
                onClick={() => {
                  setSelectedAction(a);
                  setShowVerifyModal(true);
                }}
                className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200"
              >
                Sign-off Verification
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
            <CheckSquare className="w-6 h-6 text-gov-primary" />
            Corrective & Preventive Actions (CAPA)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track remediation milestones, assignees, overdue deadlines, and DGMS sign-off verifications.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search CAPA task, assignee, colliery..."
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
          <option value="">All CAPA Statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="PENDING_VERIFICATION">PENDING VERIFICATION</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="OVERDUE">OVERDUE</option>
          <option value="CLOSED">CLOSED</option>
        </select>

        <label className="flex items-center gap-1.5 font-bold text-rose-700 cursor-pointer bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200">
          <input
            type="checkbox"
            checked={overdueOnly === 'true'}
            onChange={(e) => setOverdueOnly(e.target.checked ? 'true' : '')}
            className="rounded text-rose-600 focus:ring-rose-500"
          />
          Overdue Only
        </label>

        {(search || mineId || statusFilter || overdueOnly) && (
          <button
            onClick={() => { setSearch(''); setMineId(''); setStatusFilter(''); setOverdueOnly(''); }}
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
        data={actions}
        isLoading={isLoading}
      />

      {/* Update Progress Modal */}
      {selectedAction && (
        <Modal
          isOpen={showProgressModal}
          onClose={() => setShowProgressModal(false)}
          title={`Update Progress: ${selectedAction.title}`}
        >
          <form onSubmit={handleUpdateProgress} className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Remediation Progress:</span>
                <span className="text-base text-gov-primary font-extrabold">{progressVal}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={progressVal}
                onChange={(e) => setProgressVal(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gov-primary"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0% Initiated</span>
                <span>50% In Progress</span>
                <span>100% Ready for Verification</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Remediation Status Notes & Evidence Link</label>
              <textarea
                rows={3}
                value={progressRemarks}
                onChange={(e) => setProgressRemarks(e.target.value)}
                placeholder="Detail corrective actions completed on site..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              ></textarea>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowProgressModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-gov-primary text-white font-bold"
              >
                Save Progress
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Verify Modal */}
      {selectedAction && (
        <Modal
          isOpen={showVerifyModal}
          onClose={() => setShowVerifyModal(false)}
          title={`DGMS Statutory Verification: ${selectedAction.title}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-slate-700 leading-relaxed">
                As a Statutory Inspector / Super Admin, you are certifying that the physical site remediation satisfies all statutory parameters under the Coal Mines Regulations 2017.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Inspector Verification Remarks</label>
              <textarea
                rows={3}
                value={verifyRemarks}
                onChange={(e) => setVerifyRemarks(e.target.value)}
                placeholder="Enter physical audit findings and sign-off justification..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              ></textarea>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => handleVerify(false)}
                className="px-4 py-2 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold"
              >
                Reject / Require More Work
              </button>
              <button
                type="button"
                onClick={() => handleVerify(true)}
                className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700"
              >
                Approve & Resolve Violation
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CorrectiveActions;

