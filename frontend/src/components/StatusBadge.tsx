import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'status' | 'risk' | 'severity' | 'verification';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'status', className = '' }) => {
  const norm = (status || '').toUpperCase();

  let bg = 'bg-slate-100 text-slate-700 border-slate-200';
  let dot = 'bg-slate-400';

  if (norm === 'COMPLIANT' || norm === 'VERIFIED' || norm === 'RESOLVED' || norm === 'CLOSED' || norm === 'LOW' || norm === 'ACTIVE') {
    bg = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    dot = 'bg-emerald-500';
  } else if (norm === 'PARTIALLY_COMPLIANT' || norm === 'MEDIUM' || norm === 'IN_PROGRESS' || norm === 'ACTION_SUBMITTED' || norm === 'UNDER_VERIFICATION') {
    bg = 'bg-amber-50 text-amber-800 border-amber-300';
    dot = 'bg-amber-500';
  } else if (norm === 'NON_COMPLIANT' || norm === 'CRITICAL' || norm === 'EXPIRED' || norm === 'OVERDUE' || norm === 'SUSPENDED') {
    bg = 'bg-rose-50 text-rose-800 border-rose-300';
    dot = 'bg-rose-600 animate-pulse';
  } else if (norm === 'HIGH' || norm === 'OPEN' || norm === 'REJECTED') {
    bg = 'bg-orange-50 text-orange-800 border-orange-300';
    dot = 'bg-orange-500';
  } else if (norm === 'PENDING' || norm === 'SCHEDULED' || norm === 'DEVELOPMENT') {
    bg = 'bg-sky-50 text-sky-800 border-sky-300';
    dot = 'bg-sky-500';
  }

  const formatText = (text: string) => {
    return text.replace(/_/g, ' ');
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
      {formatText(norm)}
    </span>
  );
};

