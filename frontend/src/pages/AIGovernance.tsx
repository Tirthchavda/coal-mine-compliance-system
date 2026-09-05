import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { AIPrediction, Mine } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import {
  Sparkles,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Play,
  RotateCcw,
  Cpu,
  HelpCircle,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AIGovernance: React.FC = () => {
  const { hasRole } = useAuth();

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [mines, setMines] = useState<Mine[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Run Analysis Modal
  const [selectedMineId, setSelectedMineId] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Human Review Modal
  const [reviewPrediction, setReviewPrediction] = useState<AIPrediction | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState<string>('');

  const fetchAuxData = async () => {
    try {
      const res = await api.get('/mines');
      if (res.data.success) {
        setMines(res.data.data);
        if (res.data.data.length > 0) setSelectedMineId(res.data.data[0].id);
      }
    } catch (e) {}
  };

  const fetchAIDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/ai/dashboard');
      if (res.data.success) {
        setDashboardData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load AI Dashboard', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuxData();
    fetchAIDashboard();
  }, []);

  const handleRunAnalysis = async () => {
    if (!selectedMineId) return;
    try {
      setIsAnalyzing(true);
      const res = await api.post(`/ai/risk-analysis/${selectedMineId}`);
      if (res.data.success) {
        setAnalysisResult(res.data.data);
        fetchAIDashboard();
      }
    } catch (err) {
      console.error('Failed to run AI risk model', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleHumanDecision = async (isAccepted: boolean) => {
    if (!reviewPrediction) return;
    try {
      const res = await api.put(`/ai/review/${reviewPrediction.id}`, {
        isAccepted,
        reviewRemarks: reviewRemarks || (isAccepted ? 'Approved by DGMS Inspector' : 'Rejected upon physical verification')
      });
      if (res.data.success) {
        setReviewPrediction(null);
        setReviewRemarks('');
        fetchAIDashboard();
      }
    } catch (err) {
      console.error('Failed to record human review', err);
    }
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-gov-primary mb-3"></div>
          <p className="text-sm font-semibold text-slate-700">Connecting to AI Governance & Decision Support Engine...</p>
        </div>
      </div>
    );
  }

  const { engineStatus, metrics, predictions } = dashboardData;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-gov-dark to-gov-primary text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-widest text-gov-gold bg-gov-gold/10 px-2 py-0.5 rounded border border-gov-gold/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              DECISION SUPPORT INTELLIGENCE
            </span>
            <span className="text-xs text-slate-300">• Human-in-the-Loop Governance</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            AI Statutory Risk Diagnostics & Explainability Console
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Predictive early-warning risk models evaluating active violations, overdue CAPAs, ventilation gas telemetry, and environmental thresholds with full statutory factor explainability.
          </p>
        </div>

        {/* Engine Status Badge */}
        <div className="p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xs text-right text-xs">
          <span className="text-[10px] text-gov-gold uppercase font-bold block">Active AI Engine</span>
          <strong className="text-white font-extrabold flex items-center gap-1.5 justify-end mt-0.5">
            <Cpu className="w-4 h-4 text-gov-gold" />
            {engineStatus.model}
          </strong>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Deterministic Rule Engine fallback verified
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Analyzed Collieries</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{metrics.totalPredictions}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">100% telemetry coverage</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">High Risk Detections</p>
          <p className="text-2xl font-black text-rose-600 mt-1">{metrics.highRiskMinesCount}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Critical/High hazard profile</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Model Confidence</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{metrics.avgConfidence}%</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Explainable factor alignment</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Human-In-The-Loop Reviews</p>
          <p className="text-2xl font-black text-gov-primary mt-1">
            {metrics.humanAccepted} <span className="text-xs text-emerald-600 font-bold">Approved</span> • {metrics.humanRejected} <span className="text-xs text-rose-600 font-bold">Rejected</span>
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">{metrics.pendingReview} Pending Official Review</p>
        </div>
      </div>

      {/* Interactive Risk Analysis Executor */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gov-gold" />
              Run Real-Time AI Statutory Risk Model
            </h3>
            <p className="text-xs text-slate-500">
              Computes multi-factor penalty weights across live violations, CAPA lag, and telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedMineId}
              onChange={(e) => setSelectedMineId(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
            >
              {mines.map((m) => (
                <option key={m.id} value={m.id}>{m.name} ({m.code})</option>
              ))}
            </select>

            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="px-4 py-2 bg-gov-primary text-white text-xs font-bold rounded-lg hover:bg-gov-dark transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
            >
              {isAnalyzing ? (
                <>Analyzing...</>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-gov-gold" /> Execute Model
                </>
              )}
            </button>
          </div>
        </div>

        {/* Real-time Analysis Result Card */}
        {analysisResult && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Diagnosis Summary</span>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-3xl font-black text-slate-900">{analysisResult.riskScore} / 100</span>
                  <StatusBadge status={analysisResult.riskLevel} type="risk" />
                  <span className="text-xs text-slate-500">Confidence: <strong>{analysisResult.confidence}%</strong></span>
                </div>
              </div>

              <span className="text-[11px] font-bold bg-gov-primary/10 text-gov-primary px-2.5 py-1 rounded">
                Engine: {analysisResult.engine}
              </span>
            </div>

            {/* Explainable Penalties Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-200 text-xs">
              <div className="p-2 rounded bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">Violations Penalty</span>
                <strong className="text-rose-600 font-extrabold">{analysisResult.breakdown?.statutoryViolationsPenalty} pts</strong>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">Overdue CAPA</span>
                <strong className="text-amber-600 font-extrabold">{analysisResult.breakdown?.overdueCapaPenalty} pts</strong>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">Environmental</span>
                <strong className="text-slate-800 font-extrabold">{analysisResult.breakdown?.environmentalBreachPenalty} pts</strong>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">Strata & Gas Safety</span>
                <strong className="text-slate-800 font-extrabold">{analysisResult.breakdown?.strataGasSafetyPenalty} pts</strong>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">Document Expiries</span>
                <strong className="text-slate-800 font-extrabold">{analysisResult.breakdown?.documentExpiryPenalty} pts</strong>
              </div>
            </div>

            {/* Factors & Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200 text-xs">
              <div>
                <strong className="text-slate-800 block font-bold mb-1">Identified Risk Drivers:</strong>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {analysisResult.factors?.map((f: string, idx: number) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong className="text-gov-primary block font-bold mb-1">AI Recommended Statutory Actions:</strong>
                <ul className="list-disc list-inside space-y-1 text-slate-700 font-medium">
                  {analysisResult.recommendations?.map((r: string, idx: number) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Predictions Registry */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Colliery AI Risk Diagnostics & Human Review Ledger ({predictions?.length || 0})
        </h3>

        <div className="space-y-3">
          {predictions?.map((p: any) => (
            <div
              key={p.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors text-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gov-dark text-gov-gold font-bold flex items-center justify-center">
                    ⛏
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{p.mine?.name}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">{p.mine?.code} • {p.mine?.state}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Risk Index</span>
                    <span className="text-base font-black text-slate-900">{p.riskScore} / 100</span>
                  </div>
                  <StatusBadge status={p.riskLevel} type="risk" />
                </div>
              </div>

              {/* Factors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Key Factors:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                    {p.factors?.slice(0, 2).map((f: string, idx: number) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-gov-primary block mb-1">AI Recommendation:</span>
                  <p className="text-slate-700 font-medium text-[11px]">
                    {p.recommendations?.[0] || 'Maintain scheduled surveillance.'}
                  </p>
                </div>
              </div>

              {/* Human Decision Status */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500">Human Decision:</span>
                  {p.isAccepted === true ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Accepted ({p.reviewedBy?.name || 'Officer'})
                    </span>
                  ) : p.isAccepted === false ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Rejected
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      Pending Official Review
                    </span>
                  )}
                </div>

                {hasRole(['SUPER_ADMIN', 'SAFETY_INSPECTOR', 'HQ_MANAGEMENT', 'MINE_MANAGER']) && (
                  <button
                    onClick={() => {
                      setReviewPrediction(p);
                      setReviewRemarks(p.reviewRemarks || '');
                    }}
                    className="px-3 py-1 text-xs font-bold text-gov-primary bg-gov-primary/10 rounded-lg hover:bg-gov-primary hover:text-white transition-colors"
                  >
                    Review & Decide →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Human Review Modal */}
      {reviewPrediction && (
        <Modal
          isOpen={Boolean(reviewPrediction)}
          onClose={() => setReviewPrediction(null)}
          title={`Human-In-The-Loop Decision: ${reviewPrediction.mine?.name}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <strong className="text-slate-800 block">AI Recommended Statutory Action:</strong>
              <p className="text-slate-700 font-medium">{reviewPrediction.recommendations?.[0]}</p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Review Remarks / Justification</label>
              <textarea
                rows={3}
                value={reviewRemarks}
                onChange={(e) => setReviewRemarks(e.target.value)}
                placeholder="Enter justification for approving or rejecting AI decision support..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              ></textarea>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => handleHumanDecision(false)}
                className="px-4 py-2 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold"
              >
                Reject Recommendation
              </button>
              <button
                type="button"
                onClick={() => handleHumanDecision(true)}
                className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-sm"
              >
                Accept & Initiate Directive
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AIGovernance;

