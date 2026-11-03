import React, { useCallback, useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { ListPageShell } from '../../components/list/ListPageShell';
import { DashboardCard } from '../../components/dashboard/DashboardCard';
import { UtmAnalyticsFilters } from './UtmAnalyticsFilters';
import { useUtmReportFilters } from './useUtmReportFilters';
import { errorText, fetchUtmBreakdown } from './utmAnalyticsApi';
import { displayGroupKey, formatCount, formatPercent } from './utmAnalyticsHelpers';
import { formatToman } from '../SupportOrder/supportOrderApi';
import { UtmBreakdownRow } from '../../_models/response/utm/utmAnalytics.response';
import { useShortLinkChannelOptions } from '../ShortLink/useShortLinkChannelOptions';

function formatBreakdownCell(
  row: UtmBreakdownRow,
  mode: 'campaign' | 'sourceMedium',
  channelTitle: (key: string) => string
) {
  if (mode === 'sourceMedium') {
    return displayGroupKey(row.groupKey || row.sourceMedium);
  }
  const key = row.groupKey || row.campaign || '';
  return channelTitle(key) !== key ? channelTitle(key) : displayGroupKey(key);
}

function BreakdownTable({
  title,
  rows,
  columnTitle,
  mode,
  channelTitle,
}: {
  title: string;
  rows: UtmBreakdownRow[];
  columnTitle: string;
  mode: 'campaign' | 'sourceMedium';
  channelTitle: (key: string) => string;
}) {
  return (
    <DashboardCard title={title}>
      {rows.length === 0 ? (
        <p className="text-sm text-black-opacity-50 py-4">داده‌ای نیست</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[720px]">
            <thead>
              <tr className="bg-slate-50 text-black-opacity-70">
                <th className="text-right p-2 border border-card-border">{columnTitle}</th>
                <th className="text-right p-2 border border-card-border">بازدید</th>
                <th className="text-right p-2 border border-card-border">یکتا</th>
                <th className="text-right p-2 border border-card-border">کلیک کوتاه</th>
                <th className="text-right p-2 border border-card-border">hit</th>
                <th className="text-right p-2 border border-card-border">سفارش</th>
                <th className="text-right p-2 border border-card-border">پرداخت</th>
                <th className="text-right p-2 border border-card-border">فروش</th>
                <th className="text-right p-2 border border-card-border">تبدیل</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${title}-${row.groupKey}`}>
                  <td className="p-2 border border-card-border dir-ltr text-left break-all">
                    {formatBreakdownCell(row, mode, channelTitle)}
                  </td>
                  <td className="p-2 border border-card-border tabular-nums">{formatCount(row.visits)}</td>
                  <td className="p-2 border border-card-border tabular-nums">
                    {formatCount(row.uniqueVisitors)}
                  </td>
                  <td className="p-2 border border-card-border tabular-nums">
                    {formatCount(row.shortClicks)}
                  </td>
                  <td className="p-2 border border-card-border tabular-nums">{formatCount(row.hits)}</td>
                  <td className="p-2 border border-card-border tabular-nums">
                    {formatCount(row.attributedOrders)}
                  </td>
                  <td className="p-2 border border-card-border tabular-nums">
                    {formatCount(row.paidOrders)}
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
  );
}

const UtmAnalyticsChannels: React.FunctionComponent = () => {
  const { channelTitle } = useShortLinkChannelOptions(false);
  const { form, appliedFilters, filterOptions, applyFilters, clearFilters } =
    useUtmReportFilters();
  const { register, control, setValue, watch } = form;

  const [campaignRows, setCampaignRows] = useState<UtmBreakdownRow[]>([]);
  const [sourceMediumRows, setSourceMediumRows] = useState<UtmBreakdownRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchUtmBreakdown(appliedFilters, 'campaign'),
      fetchUtmBreakdown(appliedFilters, 'sourceMedium'),
    ])
      .then(([campaign, sourceMedium]) => {
        setCampaignRows(campaign);
        setSourceMediumRows(sourceMedium);
      })
      .catch((err) => {
        setCampaignRows([]);
        setSourceMediumRows([]);
        setError(errorText(err));
      })
      .finally(() => setLoading(false));
  }, [appliedFilters]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ListPageShell
      title="کانال‌ها و کمپین‌ها"
      subtitle="دو نمای campaign و source/medium برای مقایسه منبع ورود"
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
      {loading && campaignRows.length === 0 && sourceMediumRows.length === 0 ? (
        <Box className="flex justify-center py-24">
          <CircularProgress sx={{ color: '#0f766e' }} />
        </Box>
      ) : error ? (
        <div className="bg-white border border-card-border rounded-2xl p-8 text-center shadow-card">
          <p className="text-primary font-bold">{error}</p>
        </div>
      ) : (
        <div className="space-y-4 relative">
          {loading && (
            <div className="absolute inset-0 bg-white/40 z-10 rounded-2xl" />
          )}
          <BreakdownTable
            title="طبقه‌بندی کمپین"
            rows={campaignRows}
            columnTitle="کمپین"
            mode="campaign"
            channelTitle={channelTitle}
          />
          <BreakdownTable
            title="منبع / medium"
            rows={sourceMediumRows}
            columnTitle="source / medium"
            mode="sourceMedium"
            channelTitle={channelTitle}
          />
        </div>
      )}
    </ListPageShell>
  );
};

export default UtmAnalyticsChannels;
