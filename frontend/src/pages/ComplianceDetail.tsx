import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import {
  ShieldCheck,
  ArrowLeft,
  AlertOctagon,
  CheckSquare,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  History,
  Upload,
  User,
  Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_COMPLIANCE } from '../data/mockData';

const getMockComplianceDetail = (targetId?: string) => {
  return MOCK_COMPLIANCE.find(c => c.id === targetId) || MOCK_COMPLIANCE[0];
};

export const ComplianceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();

  const [record, setRecord] = useState<any>(getMockComplianceDetail(id));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Status Change Modal
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<string>(getMockComplianceDetail(id)?.status || 'COMPLIANT');
  const [statusRemarks, setStatusRemarks] = useState<string>('');

  // Create Violation Modal
  const [showViolationModal, setShowViolationModal] = useState<boolean>(false);
  const [violTitle, setViolTitle] = useState<string>('');
  const [violDesc, setViolDesc] = useState<string>('');
  const [violSeverity, setViolSeverity] = useState<string>('HIGH');

  const fetchDetail = async () => {
    try {
      const res = await api.get(`/compliance/${id}`, { timeout: 8000 });
      if (res.data?.success && res.data?.data) {
        setRecord(res.data.data);
        setNewStatus(res.data.data.status);
        return;
      }
    } catch (err) {
      console.warn('Using pre-seeded compliance obligation detail');
    } finally {
      setIsLoading(false);
    }
    const defaultRec = getMockComplianceDetail(id);
    setRecord(defaultRec);
    setNewStatus(defaultRec?.status || 'COMPLIANT');
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.put(`/compliance/${id}`, {
        status: newStatus,
        remarks: statusRemarks || record.remarks
      });
      if (res.data.success) {
        setShowStatusModal(false);
        fetchDetail();
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleEscalateViolation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/violations', {
        mineId: record.mineId,
        complianceRecordId: record.id,
        title: violTitle || `Deficiency in ${record.requirement?.title}`,
        description: violDesc || record.remarks || 'Statutory breach identified during compliance audit.',
        category: record.requirement?.category || 'SAFETY',
        severity: violSeverity
      });
      if (res.data.success) {
        setShowViolationModal(false);
        await api.put(`/compliance/${id}`, { status: 'NON_COMPLIANT' });
        fetchDetail();
      }
    } catch (err) {
      console.error('Failed to create violation', err);
    }
  };

  if (isLoading || !record) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-gov-primary mb-3"></div>
          <p className="text-sm font-semibold text-slate-700">Loading statutory obligation record...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Back Button & Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/compliance')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-gov-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Compliance Obligations
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {hasRole(['SUPER_ADMIN', 'SAFETY_INSPECTOR', 'COMPLIANCE_OFFICER', 'MINE_MANAGER']) && (
            <button
              onClick={() => setShowStatusModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gov-primary text-white rounded-lg hover:bg-gov-dark shadow-sm"
            >
              <CheckCircle className="w-4 h-4 text-gov-gold" />
              Update Statutory Status
            </button>
          )}

          {hasRole(['SUPER_ADMIN', 'SAFETY_INSPECTOR']) && (
            <button
              onClick={() => {
                setViolTitle(`Deficiency in ${record.requirement?.title}`);
                setViolDesc(record.remarks || '');
                setShowViolationModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700 shadow-sm"
            >
              <AlertOctagon className="w-4 h-4" />
              Escalate to Violation
            </button>
          )}
        </div>
      </div>

      {/* Main Requirement Detail Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-gov-primary bg-gov-primary/10 px-2 py-0.5 rounded">
                {record.requirement?.regulationReference}
              </span>
              <span className="text-xs font-semibold text-slate-500">• {record.requirement?.category}</span>
              <StatusBadge status={record.status} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {record.requirement?.title}
            </h1>
            <p className="text-xs text-slate-600 max-w-3xl">
              {record.requirement?.requirement}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-right min-w-[200px]">
            <p className="text-[10px] uppercase font-bold text-slate-400">Statutory Due Date</p>
            <p className="text-base font-black text-slate-900 mt-0.5">
              {new Date(record.dueDate).toLocaleDateString()}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              Authority: <strong>{record.requirement?.regulatoryAuthority}</strong>
            </p>
          </div>
        </div>

        {/* Detailed Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Colliery / Mine</span>
            <strong className="text-slate-800 text-xs">{record.mine?.name}</strong>
            <p className="text-[10px] text-slate-500">{record.mine?.code} • {record.mine?.state}</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Responsible Officer</span>
            <strong className="text-slate-800 text-xs">{record.responsibleOfficer?.name || 'Priyanka Sen'}</strong>
            <p className="text-[10px] text-slate-500">{record.responsibleOfficer?.department || 'Statutory Compliance Wing'}</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Inspection Frequency</span>
            <strong className="text-slate-800 text-xs">{record.requirement?.frequency}</strong>
            <p className="text-[10px] text-slate-500">Priority: {record.requirement?.priority}</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Last Verification</span>
            <strong className="text-slate-800 text-xs">
              {record.lastVerifiedAt ? new Date(record.lastVerifiedAt).toLocaleDateString() : 'Pending Official Audit'}
            </strong>
          </div>
        </div>

        {/* Remarks Box */}
        {record.remarks && (
          <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 text-xs">
            <strong className="text-amber-900 block font-bold mb-0.5">Statutory Remarks & Notes:</strong>
            <p className="text-amber-800">{record.remarks}</p>
          </div>
        )}

        {/* Penalty Clause Warning */}
        {record.requirement?.penaltyClause && (
          <div className="p-3 rounded-lg bg-rose-50/60 border border-rose-200 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-rose-900 block font-bold">Statutory Penalty & Prohibition Clause:</strong>
              <p className="text-rose-800">{record.requirement?.penaltyClause}</p>
            </div>
          </div>
        )}
      </div>

      {/* Linked Violations & Corrective Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Linked Violations */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            Related Statutory Violations ({record.relatedViolations?.length || 0})
          </h3>

          <div className="space-y-2">
            {record.relatedViolations?.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-3">No active statutory violations linked to this obligation.</p>
            ) : (
              record.relatedViolations?.map((v: any) => (
                <div
                  key={v.id}
                  onClick={() => navigate(`/violations?search=${v.id}`)}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition-colors cursor-pointer text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{v.title}</span>
                    <StatusBadge status={v.severity} type="severity" />
                  </div>
                  <p className="text-slate-600 mt-1 text-[11px]">{v.description}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Deadline: {new Date(v.deadline).toLocaleDateString()}</span>
                    <StatusBadge status={v.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Linked Corrective Actions (CAPA) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-gov-primary" />
            Remediation Actions (CAPA) ({record.relatedActions?.length || 0})
          </h3>

          <div className="space-y-2">
            {record.relatedActions?.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-3">No corrective actions currently assigned.</p>
            ) : (
              record.relatedActions?.map((a: any) => (
                <div
                  key={a.id}
                  onClick={() => navigate(`/actions?search=${a.id}`)}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition-colors cursor-pointer text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{a.title}</span>
                    <StatusBadge status={a.status} />
                  </div>
                  <p className="text-slate-600 mt-1 text-[11px]">{a.description}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Progress: <strong>{a.progressPercentage}%</strong></span>
                    <span>Due: {new Date(a.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Statutory Compliance Status"
      >
        <form onSubmit={handleStatusUpdate} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">New Compliance Status *</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            >
              <option value="COMPLIANT">COMPLIANT (Satisfies all regulations)</option>
              <option value="PARTIALLY_COMPLIANT">PARTIALLY COMPLIANT (Minor remediation needed)</option>
              <option value="NON_COMPLIANT">NON COMPLIANT (Statutory violation active)</option>
              <option value="PENDING">PENDING (Awaiting inspection proof)</option>
              <option value="EXPIRED">EXPIRED (Clearance/permission lapsed)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Official Verification Remarks</label>
            <textarea
              rows={3}
              value={statusRemarks}
              onChange={(e) => setStatusRemarks(e.target.value)}
              placeholder="Detail verification findings and evidence..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowStatusModal(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gov-primary text-white font-bold"
            >
              Confirm Status Update
            </button>
          </div>
        </form>
      </Modal>

      {/* Escalate to Violation Modal */}
      <Modal
        isOpen={showViolationModal}
        onClose={() => setShowViolationModal(false)}
        title="Escalate Compliance Deficiency to Statutory Violation"
      >
        <form onSubmit={handleEscalateViolation} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Violation Title *</label>
            <input
              type="text"
              required
              value={violTitle}
              onChange={(e) => setViolTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Statutory Severity Level</label>
            <select
              value={violSeverity}
              onChange={(e) => setViolSeverity(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold"
            >
              <option value="CRITICAL">CRITICAL (Immediate hazard / prohibition)</option>
              <option value="HIGH">HIGH (Major statutory non-compliance)</option>
              <option value="MEDIUM">MEDIUM (Technical deficiency)</option>
              <option value="LOW">LOW (Minor procedural lag)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Technical Observation Details *</label>
            <textarea
              rows={4}
              required
              value={violDesc}
              onChange={(e) => setViolDesc(e.target.value)}
              placeholder="State precise defect, location, and statutory non-conformity..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowViolationModal(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-rose-600 text-white font-bold"
            >
              Issue Formal Violation Notice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ComplianceDetail;

