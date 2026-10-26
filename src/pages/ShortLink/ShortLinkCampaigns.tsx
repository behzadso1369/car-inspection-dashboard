import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { ListPageShell } from '../../components/list/ListPageShell';
import { DashboardCard } from '../../components/dashboard/DashboardCard';
import Button, { PrimaryButton } from '../../libs/button/button';
import Datepicker from '../../libs/datepicker/datepicker';
import { ShortLinkCampaignRow } from '../../_models/response/shortLink/shortLink.response';
import { errorText, listCampaigns } from './shortLinkApi';
import { formatPercent } from './shortLinkHelpers';
import { formatToman } from '../SupportOrder/supportOrderApi';
import { CHANNEL_OPTIONS } from './shortLinkConstants';
import { ResponsiveDataView } from '../../components/list/ResponsiveDataView';
import { CardField } from '../../types/list';

function toIsoDate(value: unknown) {
  if (value == null || value === '') return undefined;
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString().slice(0, 10);
}

const ShortLinkCampaigns: React.FunctionComponent = () => {
  const { register, control, getValues } = useForm({
    defaultValues: { fromDate: '', toDate: '' },
  });
  const [rows, setRows] = useState<ShortLinkCampaignRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const channelLabel = (source: string) =>
    CHANNEL_OPTIONS.find((c) => c.value === source)?.label ?? source;

  const fetchReport = useCallback(() => {
    setLoading(true);
    setError(null);
    const { fromDate, toDate } = getValues();
    listCampaigns({
      from: toIsoDate(fromDate),
      to: toIsoDate(toDate),
    })
      .then(setRows)
      .catch((err) => {
        setRows([]);
        setError(errorText(err));
      })
      .finally(() => setLoading(false));
  }, [getValues]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => ({
        links: acc.links + (row.links ?? 0),
        totalClicks: acc.totalClicks + (row.totalClicks ?? 0),
        uniqueClicks: acc.uniqueClicks + (row.uniqueClicks ?? 0),
        reservations: acc.reservations + (row.reservations ?? 0),
        salesAmount: acc.salesAmount + (row.salesAmount ?? 0),
      }),
      { links: 0, totalClicks: 0, uniqueClicks: 0, reservations: 0, salesAmount: 0 }
    );
  }, [rows]);

  const cardFields: CardField<ShortLinkCampaignRow>[] = useMemo(
    () => [
      {
        key: 'campaign',
        label: 'کمپین',
        primary: true,
        getValue: (row) => (
          <span className="dir-ltr text-left break-all">{row.utmCampaign}</span>
        ),
      },
      {
        key: 'channel',
        label: 'کانال',
        getValue: (row) => channelLabel(row.utmSource),
      },
      {
        key: 'medium',
        label: 'medium',
        getValue: (row) => (
          <span className="dir-ltr text-left">{row.utmMedium}</span>
        ),
      },
      {
        key: 'links',
        label: 'لینک',
        getValue: (row) => (row.links ?? 0).toLocaleString('fa-IR'),
      },
      {
        key: 'totalClicks',
        label: 'کلیک کل',
        getValue: (row) => (row.totalClicks ?? 0).toLocaleString('fa-IR'),
      },
      {
        key: 'uniqueClicks',
        label: 'کلیک یکتا',
        getValue: (row) => (row.uniqueClicks ?? 0).toLocaleString('fa-IR'),
      },
      {
        key: 'reservations',
        label: 'رزرو',
        getValue: (row) => (row.reservations ?? 0).toLocaleString('fa-IR'),
      },
      {
        key: 'sales',
        label: 'فروش',
        getValue: (row) => formatToman(row.salesAmount),
      },
      {
        key: 'conversion',
        label: 'نرخ تبدیل',
        badge: true,
        getValue: (row) => formatPercent(row.conversionRate),
      },
    ],
    []
  );

  const getRowKey = (row: ShortLinkCampaignRow) =>
    `${row.utmSource}-${row.utmMedium}-${row.utmCampaign}`;

  const desktopTable = (
    <div className="overflow-x-auto bg-white border border-card-border rounded-2xl shadow-card">
      <table className="w-full min-w-[880px] text-sm">
        <thead>
          <tr className="bg-[#f7fafc] border-b border-card-border text-right">
            <th className="py-3 px-3 whitespace-nowrap">کانال</th>
            <th className="py-3 px-3 whitespace-nowrap">medium</th>
            <th className="py-3 px-3 whitespace-nowrap">کمپین</th>
            <th className="py-3 px-3 whitespace-nowrap">لینک</th>
            <th className="py-3 px-3 whitespace-nowrap">کلیک کل</th>
            <th className="py-3 px-3 whitespace-nowrap">کلیک یکتا</th>
            <th className="py-3 px-3 whitespace-nowrap">رزرو</th>
            <th className="py-3 px-3 whitespace-nowrap">فروش</th>
            <th className="py-3 px-3 whitespace-nowrap">نرخ تبدیل</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && !loading ? (
            <tr>
              <td colSpan={9} className="py-8 text-center text-black-opacity-50">
                داده‌ای یافت نشد
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={getRowKey(row)}
                className="border-b border-card-border/70 hover:bg-brand-soft/20"
              >
                <td className="py-2 px-3">{channelLabel(row.utmSource)}</td>
                <td className="py-2 px-3 dir-ltr text-left">{row.utmMedium}</td>
                <td className="py-2 px-3 dir-ltr text-left">{row.utmCampaign}</td>
                <td className="py-2 px-3">{(row.links ?? 0).toLocaleString('fa-IR')}</td>
                <td className="py-2 px-3">{(row.totalClicks ?? 0).toLocaleString('fa-IR')}</td>
                <td className="py-2 px-3">{(row.uniqueClicks ?? 0).toLocaleString('fa-IR')}</td>
                <td className="py-2 px-3">{(row.reservations ?? 0).toLocaleString('fa-IR')}</td>
                <td className="py-2 px-3 whitespace-nowrap">{formatToman(row.salesAmount)}</td>
                <td className="py-2 px-3 font-medium text-brand">
                  {formatPercent(row.conversionRate)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <ListPageShell
      title="گزارش کمپین"
      subtitle="هر ردیف: source + medium + campaign. نرخ تبدیل = رزرو ÷ کلیک یکتا."
    >
      <DashboardCard title="بازه زمانی (اختیاری)">
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 sm:items-end">
          <div className="w-full sm:min-w-[160px] sm:flex-1 sm:max-w-xs">
            <Datepicker label="از تاریخ" register={register} control={control} title="fromDate" />
          </div>
          <div className="w-full sm:min-w-[160px] sm:flex-1 sm:max-w-xs">
            <Datepicker label="تا تاریخ" register={register} control={control} title="toDate" />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              title="بروزرسانی"
              active={!loading}
              style={PrimaryButton}
              onClick={fetchReport}
            />
            {loading ? <CircularProgress size={22} /> : null}
          </div>
        </div>
      </DashboardCard>

      {error ? (
        <p className="text-red-600 text-sm mt-3" role="alert">
          {error}
        </p>
      ) : null}

      <DashboardCard title="خلاصه" className="mt-3">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
          <div className="rounded-xl bg-surface/80 border border-card-border/60 p-3">
            <p className="text-black-opacity-50 text-xs mb-1">لینک‌ها</p>
            <p className="font-bold text-base">{totals.links.toLocaleString('fa-IR')}</p>
          </div>
          <div className="rounded-xl bg-surface/80 border border-card-border/60 p-3">
            <p className="text-black-opacity-50 text-xs mb-1">کلیک یکتا</p>
            <p className="font-bold text-base">{totals.uniqueClicks.toLocaleString('fa-IR')}</p>
          </div>
          <div className="rounded-xl bg-surface/80 border border-card-border/60 p-3">
            <p className="text-black-opacity-50 text-xs mb-1">رزرو</p>
            <p className="font-bold text-base">{totals.reservations.toLocaleString('fa-IR')}</p>
          </div>
          <div className="col-span-2 lg:col-span-2 rounded-xl bg-surface/80 border border-card-border/60 p-3">
            <p className="text-black-opacity-50 text-xs mb-1">فروش (پرداخت‌شده)</p>
            <p className="font-bold text-base">{formatToman(totals.salesAmount)}</p>
          </div>
        </div>
      </DashboardCard>

      <div className="mt-3">
        <ResponsiveDataView
          rowData={rows}
          fields={cardFields}
          loading={loading}
          emptyMessage="داده‌ای یافت نشد"
          getRowKey={getRowKey}
          desktopView={desktopTable}
        />
      </div>
    </ListPageShell>
  );
};

export default ShortLinkCampaigns;
