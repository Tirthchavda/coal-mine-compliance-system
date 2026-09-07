import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Document, Mine } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import {
  FileText,
  UploadCloud,
  Filter,
  Download,
  Eye,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_DOCUMENTS, MOCK_MINES } from '../data/mockData';

export const Documents: React.FC = () => {
  const { hasRole } = useAuth();

  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [mines, setMines] = useState<Mine[]>(MOCK_MINES);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Filters
  const [search, setSearch] = useState<string>('');
  const [mineId, setMineId] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [expiringWithinDays, setExpiringWithinDays] = useState<string>('');

  // Upload Modal
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    category: 'DGMS_APPROVAL',
    mineId: '',
    expiryDate: '2027-12-31'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchAuxData = async () => {
    try {
      const res = await api.get('/mines', { timeout: 8000 });
      if (res.data?.success) setMines(res.data.data);
    } catch (e) {}
  };

  const fetchDocuments = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (mineId) params.append('mineId', mineId);
      if (categoryFilter) params.append('category', categoryFilter);
      if (expiringWithinDays) params.append('expiringWithinDays', expiringWithinDays);

      const res = await api.get(`/documents?${params.toString()}`, { timeout: 8000 });
      if (res.data?.success && res.data?.data) {
        setDocuments(res.data.data);
        return;
      }
    } catch (err) {
      console.warn('Using pre-seeded statutory documents vault');
    } finally {
      setIsLoading(false);
    }

    // Client-side fallback filter
    let filtered = [...MOCK_DOCUMENTS];
    if (mineId) filtered = filtered.filter(d => (d.mineId === mineId || d.mine?.id === mineId));
    if (categoryFilter) filtered = filtered.filter(d => d.category === categoryFilter);
    if (expiringWithinDays) {
      const days = parseInt(expiringWithinDays, 10);
      const now = new Date();
      filtered = filtered.filter(d => {
        if (!d.expiryDate) return false;
        const diffDays = (new Date(d.expiryDate).getTime() - now.getTime()) / (1000 * 3600 * 24);
        return diffDays >= 0 && diffDays <= days;
      });
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(d =>
        d.title.toLowerCase().includes(q) ||
        (d.fileName || '').toLowerCase().includes(q) ||
        (d.originalName || '').toLowerCase().includes(q) ||
        d.mine?.name.toLowerCase().includes(q)
      );
    }
    setDocuments(filtered);
  };

  useEffect(() => {
    fetchAuxData();
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [search, mineId, categoryFilter, expiringWithinDays]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append('title', uploadFormData.title);
      form.append('category', uploadFormData.category);
      form.append('mineId', uploadFormData.mineId);
      form.append('expiryDate', uploadFormData.expiryDate);
      if (selectedFile) {
        form.append('file', selectedFile);
      }

      const res = await api.post('/documents', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setShowUploadModal(false);
        fetchDocuments();
      }
    } catch (err) {
      console.error('Failed to upload document', err);
    }
  };

  const columns: Column<Document>[] = [
    {
      header: 'Statutory Document Title',
      render: (d) => (
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-gov-primary/10 text-gov-primary mt-0.5">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-xs">{d.title}</p>
            <p className="text-[11px] text-slate-500 font-mono">{d.originalName}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Colliery',
      render: (d) => (
        <div>
          <span className="font-bold text-xs text-slate-800">{d.mine?.name}</span>
          <p className="text-[10px] text-slate-400 font-mono">{d.mine?.code}</p>
        </div>
      )
    },
    {
      header: 'Category',
      render: (d) => (
        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
          {d.category?.replace(/_/g, ' ')}
        </span>
      )
    },
    {
      header: 'Expiry Date',
      render: (d) => {
        const isExpired = d.expiryDate && new Date(d.expiryDate) < new Date();
        return (
          <div>
            <span className={`text-xs font-bold ${isExpired ? 'text-rose-600 font-black' : 'text-slate-700'}`}>
              {d.expiryDate ? new Date(d.expiryDate).toLocaleDateString() : 'N/A'}
            </span>
            {isExpired && (
              <span className="block text-[9px] font-extrabold text-rose-600 uppercase">
                EXPIRED
              </span>
            )}
          </div>
        );
      }
    },
    {
      header: 'Verification',
      render: (d) => <StatusBadge status={d.verificationStatus} type="verification" />
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (d) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <a
            href={d.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg text-gov-primary hover:bg-gov-primary/10 transition-colors"
            title="Download / View Clearance"
          >
            <Download className="w-4 h-4" />
          </a>
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
            <FileText className="w-6 h-6 text-gov-primary" />
            Statutory Document Vault & Clearance Repository
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Centralized index of DGMS approvals, Environmental Clearances (EC), CTOs, and Form IV annual returns.
          </p>
        </div>

        {hasRole(['SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'MINE_MANAGER', 'HQ_MANAGEMENT']) && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-gov-primary text-white rounded-lg hover:bg-gov-dark shadow-sm"
          >
            <UploadCloud className="w-4 h-4" />
            Upload Clearance
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search document title, clearance number, filename..."
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
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 text-xs focus:outline-none"
        >
          <option value="">All Document Categories</option>
          <option value="DGMS_APPROVAL">DGMS Statutory Approvals</option>
          <option value="ENVIRONMENTAL_CLEARANCE">Environmental Clearance (EC)</option>
          <option value="CONSENT_TO_OPERATE">Consent to Operate (CTO)</option>
          <option value="MINING_PLAN">Approved Mining Plan</option>
          <option value="STATUTORY_FORM_IV">Form IV / Form V Returns</option>
          <option value="SAFETY_COMMITTEE_MINUTES">Safety Committee Records</option>
        </select>

        <select
          value={expiringWithinDays}
          onChange={(e) => setExpiringWithinDays(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 text-xs focus:outline-none font-bold"
        >
          <option value="">All Expiries</option>
          <option value="30">Expiring in 30 Days</option>
          <option value="90">Expiring in 90 Days</option>
        </select>

        {(search || mineId || categoryFilter || expiringWithinDays) && (
          <button
            onClick={() => { setSearch(''); setMineId(''); setCategoryFilter(''); setExpiringWithinDays(''); }}
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
        data={documents}
        isLoading={isLoading}
      />

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Statutory Clearance / Return Document"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Colliery *</label>
            <select
              required
              value={uploadFormData.mineId}
              onChange={(e) => setUploadFormData({ ...uploadFormData, mineId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            >
              <option value="">-- Select Colliery --</option>
              {mines.map((m) => (
                <option key={m.id} value={m.id}>{m.name} ({m.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Document Title *</label>
            <input
              type="text"
              required
              value={uploadFormData.title}
              onChange={(e) => setUploadFormData({ ...uploadFormData, title: e.target.value })}
              placeholder="e.g. Consent to Operate (CTO) Renewal Order 2026-2029"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Clearance Category</label>
              <select
                value={uploadFormData.category}
                onChange={(e) => setUploadFormData({ ...uploadFormData, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="DGMS_APPROVAL">DGMS Statutory Approval</option>
                <option value="ENVIRONMENTAL_CLEARANCE">Environmental Clearance (EC)</option>
                <option value="CONSENT_TO_OPERATE">Consent to Operate (CTO)</option>
                <option value="MINING_PLAN">Mining Plan</option>
                <option value="STATUTORY_FORM_IV">Form IV / Form V Return</option>
                <option value="SAFETY_COMMITTEE_MINUTES">Safety Committee Minutes</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Statutory Expiry Date</label>
              <input
                type="date"
                value={uploadFormData.expiryDate}
                onChange={(e) => setUploadFormData({ ...uploadFormData, expiryDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">PDF File Attachment</label>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowUploadModal(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gov-primary text-white font-bold"
            >
              Upload & Index
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Documents;

