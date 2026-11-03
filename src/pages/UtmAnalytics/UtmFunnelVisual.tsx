import { DashboardCard } from '../../components/dashboard/DashboardCard';
import { UtmFunnelStep } from '../../_models/response/utm/utmAnalytics.response';
import { formatCount, formatPercent } from './utmAnalyticsHelpers';

const STAGE_COLORS = ['#0f766e', '#2563eb', '#0ea5e9', '#0891b2', '#0d9488', '#059669'];

export function UtmFunnelVisual({ steps }: { steps: UtmFunnelStep[] }) {
  const maxVisitors = Math.max(...steps.map((s) => s.uniqueVisitors), 1);

  return (
    <DashboardCard title="قیف UTM">
      <p className="text-xs text-black-opacity-50 mb-4">
        عرض هر مرحله بر اساس <strong>بازدیدکننده یکتا</strong> است. درصدها از API نسبت به مرحله قبل
        و نسبت به اولین کلیک آمده‌اند.
      </p>
      <div className="space-y-3">
        {steps.map((step, index) => {
          const prev = index > 0 ? steps[index - 1] : null;
          const width = Math.max((step.uniqueVisitors / maxVisitors) * 100, 10);
          const color = STAGE_COLORS[index] ?? '#0f766e';

          return (
            <div key={`${step.title}-${index}`}>
              {prev && (
                <div className="flex items-center justify-center py-1">
                  <span className="text-[11px] text-black-opacity-40">
                    {formatPercent(step.percentOfPrevious)} از مرحله قبل ·{' '}
                    {formatPercent(step.percentOfFirst)} از کلیک اول
                  </span>
                </div>
              )}
              <div className="rounded-xl border border-card-border p-3 sm:p-4 bg-white">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div className="flex items-start gap-3 min-w-0">
                    <span
                      className="shrink-0 w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center"
                      style={{ backgroundColor: color }}
                    >
                      {formatCount(index + 1)}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-primary !font-peydaBold">
                      {step.title}
                    </h3>
                  </div>
                  <div className="text-left shrink-0">
                    <p className="text-xl font-bold tabular-nums text-primary !font-peydaBold">
                      {formatCount(step.uniqueVisitors)}
                    </p>
                    <p className="text-[11px] text-black-opacity-50">بازدیدکننده یکتا</p>
                  </div>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${width}%`, backgroundColor: color }}
                  />
                </div>
                <p className="text-[11px] text-black-opacity-60 mt-2">
                  {formatCount(step.visits)} بازدید (شامل تکرار)
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}
