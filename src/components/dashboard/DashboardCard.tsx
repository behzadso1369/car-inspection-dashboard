import { ReactNode } from 'react';

export interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  onTitleClick?: () => void;
}

export function DashboardCard({
  title,
  children,
  className = '',
  onTitleClick,
}: DashboardCardProps) {
  return (
    <div
      className={`h-full bg-white p-4 sm:p-5 rounded-2xl border border-card-border shadow-card hover:shadow-card-hover transition-shadow ${className}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1 h-5 rounded-full bg-brand shrink-0" />
        <h2
          onClick={onTitleClick}
          className={`text-primary text-base sm:text-lg font-bold !font-peydaBold ${
            onTitleClick ? 'cursor-pointer hover:text-brand' : ''
          }`}
        >
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

export interface KpiCardProps {
  label: string;
  value: string | number;
  hint?: string;
  tone?: 'brand' | 'success' | 'warning' | 'neutral';
}

const kpiTone: Record<NonNullable<KpiCardProps['tone']>, string> = {
  brand: 'border-brand/20 bg-gradient-to-br from-brand/10 to-white',
  success: 'border-mid-green/20 bg-gradient-to-br from-emerald-50 to-white',
  warning: 'border-amber-200 bg-gradient-to-br from-amber-50 to-white',
  neutral: 'border-card-border bg-white',
};

const kpiAccent: Record<NonNullable<KpiCardProps['tone']>, string> = {
  brand: 'bg-brand',
  success: 'bg-mid-green',
  warning: 'bg-amber-500',
  neutral: 'bg-primary/40',
};

export function KpiCard({ label, value, hint, tone = 'neutral' }: KpiCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 shadow-card min-h-[100px] flex flex-col justify-center ${kpiTone[tone]}`}
    >
      <span
        className={`absolute top-0 left-0 w-1 h-full ${kpiAccent[tone]}`}
      />
      <p className="text-xs text-black-opacity-60 mb-1.5 pr-1">{label}</p>
      <p className="text-xl sm:text-2xl font-bold text-primary !font-peydaBold tabular-nums pr-1">
        {value}
      </p>
      {hint && <p className="text-[11px] text-black-opacity-50 mt-1 pr-1">{hint}</p>}
    </div>
  );
}

export default DashboardCard;
