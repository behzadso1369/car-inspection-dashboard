import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { ListPageShell } from '../../components/list/ListPageShell';
import { DashboardCard, KpiCard } from '../../components/dashboard/DashboardCard';
import { formatToman } from '../SupportOrder/supportOrderApi';
import {
  UtmAnalyticsFilters,
} from './UtmAnalyticsFilters';
import { UtmFunnelVisual } from './UtmFunnelVisual';
import { useUtmReportFilters } from './useUtmReportFilters';
import {
  errorText,
  fetchUtmBreakdown,
  fetchUtmDaily,
  fetchUtmFunnel,
  fetchUtmOverview,
} from './utmAnalyticsApi';
import {
  displayGroupKey,
  formatCount,
  formatDateFa,
  formatPercent,
} from './utmAnalyticsHelpers';
import {
  UtmBreakdownRow,
  UtmDailyRow,
  UtmFunnelStep,
  UtmOverview,
} from '../../_models/response/utm/utmAnalytics.response';

Chart.register(...registerables);

const UtmAnalyticsDashboard: React.FunctionComponent = () => {
  const { form, appliedFilters, filterOptions, applyFilters, clearFilters } =
    useUtmReportFilters();
  const { register, control, setValue, watch } = form;

  const [overview, setOverview] = useState<UtmOverview | null>(null);
  const [funnel, setFunnel] = useState<UtmFunnelStep[]>([]);
  const [daily, setDaily] = useState<UtmDailyRow[]>([]);
  const [breakdown, setBreakdown] = useState<UtmBreakdownRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    const filters = appliedFilters;
    Promise.all([
      fetchUtmOverview(filters),
      fetchUtmFunnel(filters),
      fetchUtmDaily(filters),
      fetchUtmBreakdown(filters, 'campaign'),
    ])
      .then(([ov, fn, dy, bd]) => {
        setOverview(ov);
        setFunnel(fn);
        setDaily(dy);
        setBreakdown(bd.slice(0, 12));
      })
      .catch((err) => {
        setOverview(null);
        setFunnel([]);
        setDaily([]);
        setBreakdown([]);
        setError(errorText(err));
      })
      .finally(() => setLoading(false));
  }, [appliedFilters]);

  useEffect(() => {
    load();
  }, [load]);

  const dailyChart = useMemo(() => {
    const labels = daily.map((row) => {
      if (!row.date) return '—';
      return formatDateFa(row.date);
    });
    return {
      labels,
      datasets: [
        {
          label: 'بازدید',
          data: daily.map((r) => r.visits),
          borderColor: '#0f766e',
          backgroundColor: 'rgba(15, 118, 110, 0.12)',
          tension: 0.25,
          fill: true,
        },
        {
          label: 'بازدیدکننده یکتا',
          data: daily.map((r) => r.uniqueVisitors),
          borderColor: '#2563eb',
          backgroundColor: 'transparent',
          tension: 0.25,
        },
      ],
    };
  }, [daily]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' as const } },
  };

  const isEmpty = overview != null && overview.humanVisits === 0 && overview.totalVisits === 0;

  return (
    <ListPageShell
      title="داشبورد UTM"
      subtitle="خلاصه بازدید، قیف، روند روزانه و برترین کمپین‌ها — KPI اصلی بدون ربات (مگر سوییچ عیب‌یابی)"
      searchSlot={
        <UtmAnalyticsFilters
          register={register}
          control={control}
          setValue={setValue}
          watch={watch}
          filterOptions={filterOptions}
          loading={loading}
          onApply={applyFilters}
          onClear={clearFilters}
        />
      }
    >
      {loading && !overview ? (
        <Box className="flex justify-center py-24">
          <CircularProgress sx={{ color: '#0f766e' }} />
        </Box>
      ) : error && !overview ? (
        <div className="bg-white border border-card-border rounded-2xl p-8 text-center shadow-card">
          <p className="text-primary font-bold mb-2">{error}</p>
        </div>
      ) : isEmpty ? (
        <div className="bg-white border border-card-border rounded-2xl p-8 text-center shadow-card">
          <p className="text-primary font-bold mb-1">در این بازه بازدیدی ثبت نشده</p>
          <p className="text-sm text-black-opacity-60">فیلتر را تغییر دهید یا بازه را گسترش دهید.</p>
        </div>
      ) : overview ? (
        <div className="space-y-4 relative">
          {loading && (
            <div className="absolute inset-0 bg-white/50 z-10 flex items-start justify-center pt-24 rounded-2xl">
              <CircularProgress sx={{ color: '#0f766e' }} size={28} />
            </div>
          )}
          <p className="text-xs text-black-opacity-50">
            بازه گزارش: {formatDateFa(overview.from)} تا {formatDateFa(overview.to)}
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard
              label="بازدید انسانی"
              value={formatCount(overview.humanVisits)}
              hint={`کل ${formatCount(overview.totalVisits)} · ربات ${formatCount(overview.botVisits)}`}
              tone="brand"
            />
            <KpiCard
              label="بازدیدکننده یکتا"
              value={formatCount(overview.uniqueVisitors)}
              tone="neutral"
            />
            <KpiCard
              label="کلیک لینک کوتاه"
              value={formatCount(overview.shortClicks)}
              hint={`hit: ${formatCount(overview.hits)}`}
              tone="warning"
            />
            <KpiCard
              label="فروش (پرداخت‌شده)"
              value={formatToman(overview.salesAmount)}
              hint={`${formatCount(overview.paidOrders)} سفارش · نرخ ${formatPercent(overview.paidConversionRate)}`}
              tone="success"
            />
            <KpiCard
              label="سفارش نسبت‌داده‌شده"
              value={formatCount(overview.attributedOrders)}
              hint={`نرخ تبدیل ${formatPercent(overview.conversionRate)}`}
              tone="neutral"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {funnel.length > 0 && <UtmFunnelVisual steps={funnel} />}
            <DashboardCard title="روند روزانه">
              <div className="h-64 sm:h-72">
                {daily.length > 0 ? (
                  <Line data={dailyChart} options={chartOptions} />
                ) : (
                  <p className="text-sm text-black-opacity-50 py-8 text-center">داده روزانه نیست</p>
                )}
              </div>
            </DashboardCard>
          </div>

          <DashboardCard title="برترین کمپین‌ها">
            {breakdown.length === 0 ? (
              <p className="text-sm text-black-opacity-50 py-4">داده‌ای نیست</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse min-w-[640px]">
                  <thead>
                    <tr className="bg-slate-50 text-black-opacity-70">
                      <th className="text-right p-2 border border-card-border">کمپین</th>
                      <th className="text-right p-2 border border-card-border">بازدید</th>
                      <th className="text-right p-2 border border-card-border">یکتا</th>
                      <th className="text-right p-2 border border-card-border">سفارش</th>
                      <th className="text-right p-2 border border-card-border">فروش</th>
                      <th className="text-right p-2 border border-card-border">تبدیل</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakdown.map((row) => (
                      <tr key={row.groupKey}>
                        <td className="p-2 border border-card-border dir-ltr text-left">
                          {displayGroupKey(row.groupKey || row.campaign)}
                        </td>
                        <td className="p-2 border border-card-border tabular-nums">
                          {formatCount(row.visits)}
                        </td>
                        <td className="p-2 border border-card-border tabular-nums">
                          {formatCount(row.uniqueVisitors)}
                        </td>
                        <td className="p-2 border border-card-border tabular-nums">
                          {formatCount(row.attributedOrders)}
                        </td>
                        <td className="p-2 border border-card-border">{formatToman(row.salesAmount)}</td>
                        <td className="p-2 border border-card-border">{formatPercent(row.conversionRate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DashboardCard>
        </div>
      ) : null}
    </ListPageShell>
  );
};

export default UtmAnalyticsDashboard;
