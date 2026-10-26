import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { Box, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import Datepicker from '../../libs/datepicker/datepicker';
import Button, { PrimaryButton, SecondaryButton } from '../../libs/button/button';
import { ListPageShell } from '../../components/list/ListPageShell';
import { DashboardCard, KpiCard } from '../../components/dashboard/DashboardCard';
import {
  FunnelDisplayStep,
  FunnelNamedCount,
  FunnelStage,
  OrderFunnelReport,
  PaymentFunnel,
} from '../../_models/response/order/funnelReport.response';

Chart.register(...registerables);

const TOP_OPTIONS = [5, 10, 20];

const STAGE_COLORS = [
  '#0237fe',
  '#2563eb',
  '#0ea5e9',
  '#0891b2',
  '#0d9488',
  '#d97706',
  '#059669',
];

const emptyStage = (title: string): FunnelStage => ({
  title,
  orderCount: 0,
  uniqueUserCount: 0,
  percentOfTotal: 0,
});

const emptyPayment = (): PaymentFunnel => ({
  gatewayVisits: 0,
  uniqueUsersAtGateway: 0,
  percentOfTotal: 0,
  successfulPayments: 0,
  failedPayments: 0,
  pendingPayments: 0,
});

const formatCount = (value?: number | null) =>
  (value ?? 0).toLocaleString('fa-IR');

const formatPercent = (value?: number | null) =>
  `${(value ?? 0).toLocaleString('fa-IR', { maximumFractionDigits: 1 })}٪`;

const formatDateFa = (value?: string | null) => {
  if (!value) return 'بدون محدودیت';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('fa-IR');
};

function pickStage(source: any, fallbackTitle: string): FunnelStage {
  if (!source) return emptyStage(fallbackTitle);
  return {
    title: source.title ?? fallbackTitle,
    orderCount: Number(source.orderCount ?? 0),
    uniqueUserCount: Number(source.uniqueUserCount ?? 0),
    percentOfTotal: Number(source.percentOfTotal ?? 0),
  };
}

function pickNamedList(source: any): FunnelNamedCount[] {
  if (!Array.isArray(source)) return [];
  return source.map((item) => ({
    id: item?.id ?? null,
    name: item?.name ?? '—',
    count: Number(item?.count ?? 0),
    percentOfStage: Number(item?.percentOfStage ?? 0),
  }));
}

function normalizeReport(raw: any): OrderFunnelReport {
  const payment = raw?.payment ?? {};
  return {
    fromDate: raw?.fromDate ?? null,
    toDate: raw?.toDate ?? null,
    totalOrders: Number(raw?.totalOrders ?? 0),
    carOrderCount: raw?.carOrderCount == null ? undefined : Number(raw.carOrderCount),
    motorcycleOrderCount:
      raw?.motorcycleOrderCount == null ? undefined : Number(raw.motorcycleOrderCount),
    uniqueUsers: Number(raw?.uniqueUsers ?? 0),
    stage1_SelectVehicle: pickStage(raw?.stage1_SelectVehicle, 'انتخاب خودرو'),
    topVehicles: pickNamedList(raw?.topVehicles),
    stage2_InspectionType: pickStage(
      raw?.stage2_InspectionType,
      'نوع کارشناسی / مشاهده قیمت'
    ),
    topInspectionTypes: pickNamedList(raw?.topInspectionTypes),
    stage3_Location: pickStage(raw?.stage3_Location, 'محل کارشناسی'),
    topLocations: pickNamedList(raw?.topLocations),
    stage4_Schedule: pickStage(raw?.stage4_Schedule, 'زمان کارشناسی'),
    topHours: pickNamedList(raw?.topHours),
    leastHours: pickNamedList(raw?.leastHours),
    stage5_Finalize: pickStage(raw?.stage5_Finalize, 'نهایی‌سازی سفارش'),
    payment: {
      gatewayVisits: Number(payment.gatewayVisits ?? 0),
      uniqueUsersAtGateway: Number(payment.uniqueUsersAtGateway ?? 0),
      percentOfTotal: Number(payment.percentOfTotal ?? 0),
      successfulPayments: Number(payment.successfulPayments ?? 0),
      failedPayments: Number(payment.failedPayments ?? 0),
      pendingPayments: Number(payment.pendingPayments ?? 0),
    },
  };
}

function buildFunnelSteps(report: OrderFunnelReport): FunnelDisplayStep[] {
  const s1 = report.stage1_SelectVehicle;
  const s2 = report.stage2_InspectionType;
  const s3 = report.stage3_Location;
  const s4 = report.stage4_Schedule;
  const s5 = report.stage5_Finalize;
  const pay = report.payment;
  const successPercent =
    report.totalOrders > 0
      ? (pay.successfulPayments / report.totalOrders) * 100
      : 0;

  return [
    {
      key: 'stage1',
      step: 1,
      title: s1.title || 'انتخاب خودرو یا موتورسیکلت',
      criterion: 'انتخاب خودرو یا موتورسیکلت',
      orderCount: s1.orderCount,
      uniqueUserCount: s1.uniqueUserCount,
      percentOfTotal: s1.percentOfTotal,
    },
    {
      key: 'stage2',
      step: 2,
      title: s2.title || 'نوع کارشناسی / مشاهده قیمت',
      criterion: 'نوع کارشناسی / قیمت',
      orderCount: s2.orderCount,
      uniqueUserCount: s2.uniqueUserCount,
      percentOfTotal: s2.percentOfTotal,
    },
    {
      key: 'stage3',
      step: 3,
      title: s3.title || 'محل کارشناسی',
      criterion: 'محل کارشناسی',
      orderCount: s3.orderCount,
      uniqueUserCount: s3.uniqueUserCount,
      percentOfTotal: s3.percentOfTotal,
    },
    {
      key: 'stage4',
      step: 4,
      title: s4.title || 'زمان کارشناسی',
      criterion: 'تاریخ + ساعت کارشناسی',
      orderCount: s4.orderCount,
      uniqueUserCount: s4.uniqueUserCount,
      percentOfTotal: s4.percentOfTotal,
    },
    {
      key: 'stage5',
      step: 5,
      title: s5.title || 'نهایی‌سازی سفارش',
      criterion: 'همه فیلدهای ۱ تا ۴ پر شده',
      orderCount: s5.orderCount,
      uniqueUserCount: s5.uniqueUserCount,
      percentOfTotal: s5.percentOfTotal,
    },
    {
      key: 'gateway',
      step: 6,
      title: 'ورود به درگاه',
      criterion: 'وجود رکورد پرداخت برای سفارش',
      orderCount: pay.gatewayVisits,
      uniqueUserCount: pay.uniqueUsersAtGateway,
      percentOfTotal: pay.percentOfTotal,
    },
    {
      key: 'success',
      step: 7,
      title: 'پرداخت موفق',
      criterion: 'پرداخت تکمیل‌شده',
      orderCount: pay.successfulPayments,
      percentOfTotal: successPercent,
    },
  ];
}

function RankList({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: FunnelNamedCount[];
  emptyText?: string;
}) {
  const max = Math.max(...items.map((item) => item.count), 1);

  return (
    <DashboardCard title={title}>
      {items.length === 0 ? (
        <p className="text-sm text-black-opacity-50 py-4">
          {emptyText || 'داده‌ای برای نمایش وجود ندارد'}
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={`${item.id ?? 'x'}-${item.name}-${index}`}>
              <div className="flex items-center justify-between gap-3 text-sm mb-1">
                <span className="text-primary truncate">
                  <span className="text-black-opacity-40 ml-1 tabular-nums">
                    {formatCount(index + 1)}.
                  </span>
                  {item.name}
                </span>
                <span className="shrink-0 font-bold tabular-nums text-primary">
                  {formatCount(item.count)}
                </span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${Math.max((item.count / max) * 100, 4)}%` }}
                />
              </div>
              <p className="text-[11px] text-black-opacity-50 mt-1">
                {formatPercent(item.percentOfStage)} از این مرحله
              </p>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}

function PaymentDonut({ payment }: { payment: PaymentFunnel }) {
  const chartData = {
    labels: ['موفق', 'ناموفق', 'در انتظار'],
    datasets: [
      {
        label: 'تعداد',
        data: [
          payment.successfulPayments,
          payment.failedPayments,
          payment.pendingPayments,
        ],
        backgroundColor: ['#059669', '#ef4444', '#d97706'],
        borderColor: ['#059669', '#ef4444', '#d97706'],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
  };

  const hasData = payment.gatewayVisits > 0;

  return (
    <DashboardCard title="وضعیت درگاه پرداخت">
      <div className="flex flex-wrap items-center justify-around gap-4">
        <div className="h-56 flex justify-center items-center w-full max-w-[220px] mx-auto">
          {hasData ? (
            <Doughnut data={chartData} options={options} />
          ) : (
            <p className="text-sm text-black-opacity-50">ورود به درگاه ثبت نشده</p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          {chartData.labels.map((label, index) => (
            <div key={label} className="flex items-center text-xs gap-3">
              <span
                className="rounded-full w-3.5 h-3.5 shrink-0"
                style={{
                  backgroundColor: chartData.datasets[0].backgroundColor[index],
                }}
              />
              <span>
                {label}: {formatCount(chartData.datasets[0].data[index])}
              </span>
            </div>
          ))}
          <p className="text-[11px] text-black-opacity-50 mt-1">
            ورود به درگاه: {formatCount(payment.gatewayVisits)}
          </p>
        </div>
      </div>
    </DashboardCard>
  );
}

function FunnelVisual({
  steps,
  totalOrders,
}: {
  steps: FunnelDisplayStep[];
  totalOrders: number;
}) {
  const maxCount = Math.max(...steps.map((step) => step.orderCount), totalOrders, 1);

  return (
    <DashboardCard title="قیف سفارش">
      <p className="text-xs text-black-opacity-50 mb-4">
        واحد شمارش سفارش است. یک کاربر می‌تواند چند سفارش ناقص داشته باشد.
      </p>
      <div className="space-y-3">
        {steps.map((step, index) => {
          const prev = index > 0 ? steps[index - 1] : null;
          const dropCount = prev ? Math.max(prev.orderCount - step.orderCount, 0) : 0;
          const dropPercent =
            prev && prev.orderCount > 0 ? (dropCount / prev.orderCount) * 100 : 0;
          const width = Math.max((step.orderCount / maxCount) * 100, 12);
          const color = STAGE_COLORS[index] ?? '#0237fe';

          return (
            <div key={step.key}>
              {prev && (
                <div className="flex items-center justify-center py-1">
                  <span className="text-[11px] text-black-opacity-40">
                    ریزش از مرحله قبل: {formatCount(dropCount)} سفارش (
                    {formatPercent(dropPercent)})
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
                      {formatCount(step.step)}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-primary !font-peydaBold">
                        {step.title}
                      </h3>
                      <p className="text-[11px] text-black-opacity-50 mt-0.5">
                        {step.criterion}
                      </p>
                    </div>
                  </div>
                  <div className="text-left shrink-0">
                    <p className="text-xl sm:text-2xl font-bold tabular-nums text-primary !font-peydaBold">
                      {formatCount(step.orderCount)}
                    </p>
                    <p className="text-[11px] text-black-opacity-50">سفارش</p>
                  </div>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${width}%`, backgroundColor: color }}
                  />
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] sm:text-xs text-black-opacity-60">
                  <span>{formatPercent(step.percentOfTotal)} از کل سفارش‌ها</span>
                  {step.uniqueUserCount != null && (
                    <span>{formatCount(step.uniqueUserCount)} کاربر یکتا</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}

const OrderFunnel: React.FunctionComponent = () => {
  const { register, control, getValues, reset } = useForm({
    defaultValues: {
      fromDate: '',
      toDate: '',
    },
  });

  const [report, setReport] = useState<OrderFunnelReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [forbidden, setForbidden] = useState(false);
  const [top, setTop] = useState(10);
  const [appliedTop, setAppliedTop] = useState(10);

  const fetchReport = useCallback((params?: { fromDate?: string; toDate?: string; top?: number }) => {
    const top = params?.top ?? 10;
    const query: Record<string, string | number> = { top };
    if (params?.fromDate) query.fromDate = params.fromDate;
    if (params?.toDate) query.toDate = params.toDate;

    setLoading(true);
    setErrorMessage('');
    setForbidden(false);

    instance
      .get(ApiHelper.get('OrderFunnelReport'), { params: query })
      .then((res: any) => {
        if (!res?.data?.isSuccess) {
          setReport(null);
          setErrorMessage(res?.data?.statusMessage || 'خطا در دریافت گزارش');
          return;
        }
        setReport(normalizeReport(res.data.resultObject));
        setAppliedTop(top);
      })
      .catch((err: any) => {
        setReport(null);
        const status = err?.response?.status;
        if (status === 403) {
          setForbidden(true);
          setErrorMessage('عدم دسترسی به این گزارش');
          return;
        }
        if (status >= 500) {
          setErrorMessage('خطای سرور رخ داد. لطفاً دوباره تلاش کنید.');
          return;
        }
        setErrorMessage(
          err?.response?.data?.statusMessage || 'خطا در دریافت گزارش قیف سفارش'
        );
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchReport({ top: 10 });
  }, [fetchReport]);

  const applyFilters = () => {
    const values = getValues();
    fetchReport({
      fromDate: values.fromDate || undefined,
      toDate: values.toDate || undefined,
      top,
    });
  };

  const clearFilters = () => {
    reset({ fromDate: '', toDate: '' });
    setTop(10);
    fetchReport({ top: 10 });
  };

  const steps = useMemo(() => (report ? buildFunnelSteps(report) : []), [report]);
  const isEmpty = report != null && report.totalOrders === 0;
  const payment = report?.payment ?? emptyPayment();
  const hasKindSplit = report?.carOrderCount != null || report?.motorcycleOrderCount != null;

  return (
    <ListPageShell
      title="گزارش قیف سفارش"
      subtitle="تعداد سفارش خودرو و موتورسیکلت در هر مرحله تا پرداخت موفق"
      searchSlot={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
          <Datepicker
            label="از تاریخ"
            register={register}
            control={control}
            title="fromDate"
          />
          <Datepicker
            label="تا تاریخ"
            register={register}
            control={control}
            title="toDate"
          />
          <div className="flex flex-col gap-2">
            <label className="text-xs text-black-opacity-80">تعداد Top</label>
            <select
              className="h-8 rounded-lg border-0 bg-white text-sm px-3 shadow-[0px_0px_0px_1px_rgba(134,143,160,0.16),0px_1px_2px_0px_rgba(0,0,0,0.06)]"
              value={top}
              onChange={(event) => setTop(Number(event.target.value))}
            >
              {TOP_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option.toLocaleString('fa-IR')}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 pb-0.5">
            <Button
              title="اعمال فیلتر"
              active={!loading}
              style={PrimaryButton}
              onClick={applyFilters}
            />
            <Button
              title="حذف فیلتر"
              active={!loading}
              style={SecondaryButton}
              onClick={clearFilters}
            />
          </div>
        </div>
      }
    >
      {loading && !report ? (
        <Box className="flex justify-center items-center py-24">
          <CircularProgress sx={{ color: '#0237fe' }} />
        </Box>
      ) : forbidden ? (
        <div className="bg-white border border-card-border rounded-2xl p-8 text-center shadow-card">
          <p className="text-primary font-bold mb-1">عدم دسترسی</p>
          <p className="text-sm text-black-opacity-60">{errorMessage}</p>
        </div>
      ) : errorMessage && !report ? (
        <div className="bg-white border border-card-border rounded-2xl p-8 text-center shadow-card">
          <p className="text-primary font-bold mb-2">{errorMessage}</p>
          <Button
            title="تلاش دوباره"
            active
            style={PrimaryButton}
            onClick={applyFilters}
          />
        </div>
      ) : isEmpty ? (
        <div className="bg-white border border-card-border rounded-2xl p-8 text-center shadow-card">
          <p className="text-primary font-bold mb-1">در این بازه سفارشی ثبت نشده</p>
          <p className="text-sm text-black-opacity-60">
            بازه تاریخ را تغییر دهید یا فیلتر را حذف کنید.
          </p>
        </div>
      ) : report ? (
        <div className="space-y-4 relative">
          {loading && (
            <div className="absolute inset-0 bg-white/50 z-10 flex items-start justify-center pt-24 rounded-2xl">
              <CircularProgress sx={{ color: '#0237fe' }} size={28} />
            </div>
          )}

          <p className="text-xs text-black-opacity-50">
            بازه:{' '}
            {formatDateFa(report.fromDate)} تا {formatDateFa(report.toDate)} · Top{' '}
            {formatCount(appliedTop)}
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <KpiCard
              label="کل سفارش‌ها"
              value={formatCount(report.totalOrders)}
              hint={hasKindSplit ? 'خودرو و موتورسیکلت' : undefined}
              tone="brand"
            />
            {hasKindSplit && (
              <KpiCard
                label="سفارش خودرو"
                value={formatCount(report.carOrderCount)}
                tone="neutral"
              />
            )}
            {hasKindSplit && (
              <KpiCard
                label="سفارش موتورسیکلت"
                value={formatCount(report.motorcycleOrderCount)}
                tone="success"
              />
            )}
            <KpiCard
              label="کاربران یکتا"
              value={formatCount(report.uniqueUsers)}
              tone="neutral"
            />
            <KpiCard
              label="ورود به درگاه"
              value={formatCount(payment.gatewayVisits)}
              hint={formatPercent(payment.percentOfTotal)}
              tone="warning"
            />
            <KpiCard
              label="پرداخت موفق"
              value={formatCount(payment.successfulPayments)}
              tone="success"
            />
          </div>

          <FunnelVisual steps={steps} totalOrders={report.totalOrders} />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            <RankList title="محبوب‌ترین مدل‌ها" items={report.topVehicles} />
            <RankList
              title="محبوب‌ترین نوع کارشناسی"
              items={report.topInspectionTypes}
            />
            <RankList title="محبوب‌ترین محل" items={report.topLocations} />
            <RankList title="شلوغ‌ترین ساعات" items={report.topHours} />
            <RankList title="خلوت‌ترین ساعات" items={report.leastHours} />
            <PaymentDonut payment={payment} />
          </div>
        </div>
      ) : null}
    </ListPageShell>
  );
};

export default OrderFunnel;
