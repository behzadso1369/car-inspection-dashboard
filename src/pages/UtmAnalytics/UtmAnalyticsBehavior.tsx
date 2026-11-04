import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { ListPageShell } from '../../components/list/ListPageShell';
import { DashboardCard } from '../../components/dashboard/DashboardCard';
import { UtmAnalyticsFilters } from './UtmAnalyticsFilters';
import { useUtmReportFilters } from './useUtmReportFilters';
import { errorText, fetchUtmHours, fetchUtmJourneys, fetchUtmPaths } from './utmAnalyticsApi';
import { formatCount, formatPercent } from './utmAnalyticsHelpers';
import { UtmHourRow, UtmJourneyRow, UtmPathRow } from '../../_models/response/utm/utmAnalytics.response';
import { UtmKindChip } from './UtmKindChip';

Chart.register(...registerables);

const UtmAnalyticsBehavior: React.FunctionComponent = () => {
  const { form, appliedFilters, filterOptions, applyFilters, clearFilters } =
    useUtmReportFilters();
  const { register, control, setValue, watch } = form;

  const [paths, setPaths] = useState<UtmPathRow[]>([]);
  const [journeys, setJourneys] = useState<UtmJourneyRow[]>([]);
  const [hours, setHours] = useState<UtmHourRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchUtmPaths(appliedFilters, 40),
      fetchUtmJourneys(appliedFilters, 30),
      fetchUtmHours(appliedFilters),
    ])
      .then(([p, j, h]) => {
        setPaths(p);
        setJourneys(j);
        setHours(h);
      })
      .catch((err) => {
        setPaths([]);
        setJourneys([]);
        setHours([]);
        setError(errorText(err));
      })
      .finally(() => setLoading(false));
  }, [appliedFilters]);

  useEffect(() => {
    load();
  }, [load]);

  const hoursChart = useMemo(() => {
    const sorted = [...hours].sort((a, b) => a.hour - b.hour);
    return {
      labels: sorted.map((h) => h.hour.toLocaleString('fa-IR')),
      datasets: [
        {
          label: 'بازدید',
          data: sorted.map((h) => h.visits),
          backgroundColor: 'rgba(15, 118, 110, 0.65)',
        },
        {
          label: 'یکتا',
          data: sorted.map((h) => h.uniqueVisitors),
          backgroundColor: 'rgba(37, 99, 235, 0.55)',
        },
      ],
    };
  }, [hours]);

  return (
    <ListPageShell
      title="مسیرها و رفتار"
      subtitle="مسیرهای پرتکرار، الگوی سفر کاربر و توزیع ساعتی (۰–۲۳)"
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
      {loading && paths.length === 0 ? (
        <Box className="flex justify-center py-24">
          <CircularProgress sx={{ color: '#0f766e' }} />
        </Box>
      ) : error ? (
        <div className="bg-white border border-card-border rounded-2xl p-8 text-center shadow-card">
          <p className="text-primary font-bold">{error}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <DashboardCard title="مسیرهای پر بازدید">
            {paths.length === 0 ? (
              <p className="text-sm text-black-opacity-50 py-4">داده‌ای نیست</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse min-w-[640px]">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="p-2 border border-card-border text-right">مسیر</th>
                      <th className="p-2 border border-card-border text-right">نوع</th>
                      <th className="p-2 border border-card-border text-right">بازدید</th>
                      <th className="p-2 border border-card-border text-right">یکتا</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paths.map((row) => (
                      <tr key={`${row.path}-${row.kind}`}>
                        <td className="p-2 border border-card-border dir-ltr text-left break-all text-xs">
                          {row.path}
                        </td>
                        <td className="p-2 border border-card-border">
                          <UtmKindChip kind={row.kind} title={row.kindTitle} />
                        </td>
                        <td className="p-2 border border-card-border tabular-nums">
                          {formatCount(row.visits)}
                        </td>
                        <td className="p-2 border border-card-border tabular-nums">
                          {formatCount(row.uniqueVisitors)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DashboardCard>

          <DashboardCard title="الگوی رفتار (journeys)">
            <p className="text-xs text-black-opacity-50 mb-3">
              روی حداکثر ۲۰٬۰۰۰ بازدید اخیر بازه محاسبه می‌شود؛ برای کمپین شلوغ فیلتر تاریخ/کمپین را
              تنگ کنید.
            </p>
            {journeys.length === 0 ? (
              <p className="text-sm text-black-opacity-50 py-4">داده‌ای نیست</p>
            ) : (
              <ul className="space-y-3">
                {journeys.map((row) => (
                  <li
                    key={row.sequence}
                    className="border border-card-border rounded-xl p-3 bg-white"
                  >
                    <p className="text-sm font-bold text-primary mb-1">{row.sequenceTitle}</p>
                    <p className="text-[11px] text-black-opacity-45 dir-ltr text-left mb-2 break-all">
                      {row.sequence}
                    </p>
                    <div className="flex flex-wrap gap-x-4 text-xs text-black-opacity-70">
                      <span>{formatCount(row.visitors)} بازدیدکننده</span>
                      <span>{formatCount(row.visits)} بازدید</span>
                      <span>{formatPercent(row.percentOfVisitors)} از کل</span>
                      <span>
                        میانگین {row.avgDurationMinutes.toLocaleString('fa-IR')} دقیقه
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </DashboardCard>

          <DashboardCard title="توزیع ساعتی">
            <div className="h-64 sm:h-80">
              {hours.length > 0 ? (
                <Bar
                  data={hoursChart}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } },
                  }}
                />
              ) : (
                <p className="text-sm text-black-opacity-50 py-8 text-center">داده ساعتی نیست</p>
              )}
            </div>
          </DashboardCard>
        </div>
      )}
    </ListPageShell>
  );
};

export default UtmAnalyticsBehavior;
