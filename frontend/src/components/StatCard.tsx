import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  trend?: {
    value: string;
    isPositive: boolean;
  };
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  trend,
  onClick
}) => {
  let iconBg = 'bg-slate-100 text-slate-700';
  let borderHighlight = 'border-slate-200';

  if (variant === 'success') {
    iconBg = 'bg-emerald-100 text-emerald-700';
    borderHighlight = 'border-l-4 border-l-emerald-500';
  } else if (variant === 'warning') {
    iconBg = 'bg-amber-100 text-amber-700';
    borderHighlight = 'border-l-4 border-l-amber-500';
  } else if (variant === 'danger') {
    iconBg = 'bg-rose-100 text-rose-700';
    borderHighlight = 'border-l-4 border-l-rose-600';
  } else if (variant === 'info') {
    iconBg = 'bg-sky-100 text-sky-700';
    borderHighlight = 'border-l-4 border-l-gov-primary';
  }

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border border-slate-200 p-5 transition-all duration-200 hover:shadow-md ${borderHighlight} ${
        onClick ? 'cursor-pointer hover:border-slate-300' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 tracking-tight">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          <span className={`font-semibold ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend.value}
          </span>
          <span className="text-slate-400">vs statutory benchmark</span>
        </div>
      )}
    </div>
  );
};

