import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import {
  BarChart3,
  TrendingUp,
  Filter,
  Layers,
  Award,
  AlertTriangle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { MOCK_MINES, MOCK_VIOLATIONS } from '../data/mockData';

const defaultAnalyticsData = {
  monthlyTrends: [
    { month: 'Oct 2025', inspectionsCompleted: 12, actionsResolved: 10 },
    { month: 'Nov 2025', inspectionsCompleted: 14, actionsResolved: 13 },
    { month: 'Dec 2025', inspectionsCompleted: 16, actionsResolved: 15 },
    { month: 'Jan 2026', inspectionsCompleted: 18, actionsResolved: 16 },
    { month: 'Feb 2026', inspectionsCompleted: 20, actionsResolved: 19 },
    { month: 'Mar 2026', inspectionsCompleted: 22, actionsResolved: 21 },
    { month: 'Apr 2026', inspectionsCompleted: 19, actionsResolved: 18 },
    { month: 'May 2026', inspectionsCompleted: 24, actionsResolved: 22 },
    { month: 'Jun 2026', inspectionsCompleted: 21, actionsResolved: 20 },
    { month: 'Jul 2026', inspectionsCompleted: 25, actionsResolved: 23 },
    { month: 'Aug 2026', inspectionsCompleted: 28, actionsResolved: 26 },
    { month: 'Sep 2026', inspectionsCompleted: 15, actionsResolved: 14 }
  ],
  complianceByCategory: [
    { category: 'Safety (CMR 2017)', rate: 94 },
    { category: 'Water Act & AMD', rate: 91 },
    { category: 'Air Quality CAAQMS', rate: 88 },
    { category: 'Forest & Ecology', rate: 96 },
    { category: 'PESO Explosives', rate: 98 },
    { category: 'Mine Closure Plan', rate: 92 }
  ],
  topMines: MOCK_MINES.map(m => ({
    id: m.id,
    name: m.name,
    code: m.code,
    state: m.state,
    score: m.complianceScore,
    violationsCount: MOCK_VIOLATIONS.filter(v => v.mineId === m.id && v.status !== 'CLOSED').length,
    risk: m.riskLevel
  }))
};

export const Analytics: React.FC = () => {
  const [data, setData] = useState<any>(defaultAnalyticsData);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/analytics/dashboard', { timeout: 8000 });
      if (res.data?.success && res.data?.data) {
        setData(res.data.data);
      }
    } catch (err) {
      console.warn('Using pre-seeded national statutory analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-gov-primary mb-3"></div>
          <p className="text-sm font-semibold text-slate-700">Synthesizing National Governance Analytics...</p>
        </div>
      </div>
    );
  }

  const { monthlyTrends, complianceByCategory, topMines } = data;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-gov-primary" />
          National Statutory Compliance & Safety Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Executive multi-dimensional benchmarking across Indian coal mining subsidiaries and state jurisdictions.
        </p>
      </div>

      {/* Row 1: 12-Month Trends & Resolution Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Monthly Inspection & Resolution Trend</h3>
          <p className="text-xs text-slate-500 mb-4">Statutory audits completed vs corrective actions verified</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="inspectionsCompleted" name="Inspections Completed" stroke="#13395e" strokeWidth={2.5} />
                <Line type="monotone" dataKey="actionsResolved" name="Actions Resolved" stroke="#10b981" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Statutory Compliance by Act & Rule</h3>
          <p className="text-xs text-slate-500 mb-4">Adherence rates across individual statutory domains</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complianceByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '11px' }} />
                <Bar dataKey="rate" name="Conformity (%)" fill="#1b4d7e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Colliery Comparison Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">National Colliery Compliance Benchmarks</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100/80 text-slate-700 text-[11px] uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Mine Code & Name</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Compliance Score</th>
                <th className="px-4 py-3">Active Violations</th>
                <th className="px-4 py-3">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {topMines?.map((m: any) => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-slate-900">{m.name} ({m.code})</td>
                  <td className="px-4 py-3">{m.state}</td>
                  <td className="px-4 py-3 font-extrabold text-slate-900">{m.score}%</td>
                  <td className="px-4 py-3 font-bold text-rose-600">{m.violationsCount}</td>
                  <td className="px-4 py-3 font-bold">{m.risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

