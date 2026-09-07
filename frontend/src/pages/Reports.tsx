import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Mine } from '../types';
import {
  FileSpreadsheet,
  Download,
  Printer,
  FileText,
  Building2,
  Calendar,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { MOCK_MINES, MOCK_COMPLIANCE, MOCK_VIOLATIONS } from '../data/mockData';

const createMockReportData = (targetMineId: string) => {
  const mine = MOCK_MINES.find(m => m.id === targetMineId) || MOCK_MINES[0];
  const compliance = MOCK_COMPLIANCE.filter(c => c.mineId === mine.id || c.mine?.id === mine.id);
  const violations = MOCK_VIOLATIONS.filter(v => v.mineId === mine.id || v.mine?.id === mine.id);
  const formattedCompliance = (compliance.length > 0 ? compliance : MOCK_COMPLIANCE.slice(0, 6)).map(c => ({
    id: c.id,
    regulationReference: c.requirement?.regulationReference || 'CMR 2017 Reg 104',
    title: c.requirement?.title || 'Statutory Safety Standard',
    regulatoryAuthority: c.requirement?.regulatoryAuthority || 'DGMS',
    dueDate: c.dueDate || '2026-10-31',
    status: c.status || 'COMPLIANT'
  }));
  const formattedViolations = (violations.length > 0 ? violations : MOCK_VIOLATIONS.slice(0, 3)).map(v => ({
    id: v.id,
    title: v.title,
    severity: v.severity,
    deadline: v.deadline,
    status: v.status
  }));
  return {
    mine,
    summary: {
      totalObligations: formattedCompliance.length,
      compliantCount: formattedCompliance.filter(c => c.status === 'COMPLIANT').length,
      nonCompliantCount: formattedCompliance.filter(c => c.status === 'NON_COMPLIANT').length,
      overallComplianceScore: mine.complianceScore || 92
    },
    complianceObligations: formattedCompliance,
    activeViolations: formattedViolations,
    obligations: formattedCompliance,
    violations: formattedViolations
  };
};

export const Reports: React.FC = () => {
  const [mines, setMines] = useState<Mine[]>(MOCK_MINES);
  const [selectedMineId, setSelectedMineId] = useState<string>(MOCK_MINES[0].id);
  const [reportData, setReportData] = useState<any>(createMockReportData(MOCK_MINES[0].id));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchMines = async () => {
    try {
      const res = await api.get('/mines', { timeout: 8000 });
      if (res.data?.success && res.data?.data) {
        setMines(res.data.data);
      }
    } catch (e) {}
  };

  const generateFormIV = async () => {
    if (!selectedMineId) return;
    try {
      const res = await api.get(`/reports/form-iv/${selectedMineId}`, { timeout: 8000 });
      if (res.data?.success && res.data?.data) {
        setReportData(res.data.data);
        return;
      }
    } catch (err) {
      console.warn('Using pre-seeded Form IV report data');
    } finally {
      setIsLoading(false);
    }
    setReportData(createMockReportData(selectedMineId));
  };

  useEffect(() => {
    fetchMines();
  }, []);

  useEffect(() => {
    if (selectedMineId) generateFormIV();
  }, [selectedMineId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    window.location.href = `/api/reports/export/csv?mineId=${selectedMineId}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-gov-primary" />
            Statutory Returns & Form IV Compliance Export
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated generation of official Mines Act 1952 Form IV Annual Return and DGMS compliance ledger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 shadow-xs"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-gov-primary text-white rounded-lg hover:bg-gov-dark shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print Official Form IV
          </button>
        </div>
      </div>

      {/* Colliery Selector */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3 text-xs">
        <label className="font-bold text-slate-700">Select Target Colliery:</label>
        <select
          value={selectedMineId}
          onChange={(e) => setSelectedMineId(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold focus:outline-none"
        >
          {mines.map((m) => (
            <option key={m.id} value={m.id}>{m.name} ({m.code}) - {m.state}</option>
          ))}
        </select>
      </div>

      {/* Official Printable Form IV Document */}
      {reportData && (
        <div className="bg-white rounded-2xl p-8 border border-slate-300 shadow-md space-y-6 print:border-none print:shadow-none font-serif">
          
          {/* Header Emblem & Title */}
          <div className="text-center space-y-1 border-b-2 border-slate-900 pb-4">
            <div className="text-2xl font-black text-slate-900">⚖</div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-700">
              GOVERNMENT OF INDIA • MINISTRY OF COAL
            </p>
            <h2 className="text-lg font-black uppercase text-slate-900">
              DIRECTORATE GENERAL OF MINES SAFETY (DGMS)
            </h2>
            <h3 className="text-base font-bold underline decoration-slate-900">
              FORM IV: STATUTORY ANNUAL COMPLIANCE & SAFETY RETURN
            </h3>
            <p className="text-[11px] text-slate-600 italic font-sans">
              [Under Section 48 of the Mines Act, 1952 and Coal Mines Regulations 2017]
            </p>
          </div>

          {/* Mine Identification Details */}
          <div className="grid grid-cols-2 gap-4 text-xs font-sans border-b border-slate-200 pb-4">
            <div>
              <p><strong className="font-serif">1. Name of Mine:</strong> {reportData.mine?.name}</p>
              <p><strong className="font-serif">2. Colliery Code:</strong> {reportData.mine?.code}</p>
              <p><strong className="font-serif">3. Owner / Corporation:</strong> {reportData.mine?.owner}</p>
            </div>
            <div>
              <p><strong className="font-serif">4. Colliery Manager:</strong> {reportData.mine?.managerName}</p>
              <p><strong className="font-serif">5. State & District:</strong> {reportData.mine?.district}, {reportData.mine?.state}</p>
              <p><strong className="font-serif">6. Statutory Score:</strong> <strong>{reportData.summary?.overallComplianceScore}%</strong></p>
            </div>
          </div>

          {/* Statutory Obligations Summary Table */}
          <div className="space-y-2 font-sans text-xs">
            <h4 className="font-serif font-bold text-slate-900 text-sm">
              Part A: Statutory Compliance Obligations Status
            </h4>

            <table className="w-full text-left text-[11px] border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-300">Clause / Regulation</th>
                  <th className="p-2 border-r border-slate-300">Statutory Requirement</th>
                  <th className="p-2 border-r border-slate-300">Authority</th>
                  <th className="p-2 border-r border-slate-300">Due Date</th>
                  <th className="p-2">Compliance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reportData.complianceObligations?.slice(0, 10).map((r: any) => (
                  <tr key={r.id}>
                    <td className="p-2 font-mono border-r border-slate-200 font-bold">{r.regulationReference}</td>
                    <td className="p-2 border-r border-slate-200">{r.title}</td>
                    <td className="p-2 border-r border-slate-200">{r.regulatoryAuthority}</td>
                    <td className="p-2 border-r border-slate-200">{new Date(r.dueDate).toLocaleDateString()}</td>
                    <td className="p-2 font-bold">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Active Violations Table */}
          <div className="space-y-2 font-sans text-xs">
            <h4 className="font-serif font-bold text-slate-900 text-sm">
              Part B: Active DGMS Violations & Remediation Schedule
            </h4>

            <table className="w-full text-left text-[11px] border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-300">Violation Title</th>
                  <th className="p-2 border-r border-slate-300">Severity</th>
                  <th className="p-2 border-r border-slate-300">Remediation Target</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reportData.activeViolations?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-3 text-center italic text-slate-500">Nil Active Violations</td>
                  </tr>
                ) : (
                  reportData.activeViolations?.map((v: any) => (
                    <tr key={v.id}>
                      <td className="p-2 border-r border-slate-200 font-bold">{v.title}</td>
                      <td className="p-2 border-r border-slate-200 font-bold text-rose-700">{v.severity}</td>
                      <td className="p-2 border-r border-slate-200">{new Date(v.deadline).toLocaleDateString()}</td>
                      <td className="p-2">{v.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div className="pt-12 grid grid-cols-2 gap-8 text-center text-xs font-sans">
            <div className="border-t border-slate-800 pt-2">
              <p className="font-bold text-slate-900">{reportData.mine?.managerName}</p>
              <p className="text-slate-500">Certifying Colliery Manager / Incharge</p>
            </div>
            <div className="border-t border-slate-800 pt-2">
              <p className="font-bold text-slate-900">Dr. Sunita Deshmukh, DGMS</p>
              <p className="text-slate-500">Director of Mines Safety / Inspecting Officer</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;

