import React from 'react';
import { Dialog, DialogTitle, IconButton, useMediaQuery, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  OrderByUserBodyZone,
  OrderByUserOrder,
  OrderByUserPayment,
  OrderByUserReportItem,
  OrderByUserWalletTx,
} from '../../_models/response/order/orderByUser.response';
import { formatSignedToman, formatToman, txAmountClass } from '../Wallet/walletHelpers';

const IMAGE_BASE = 'https://api.carmacheck.com/';
const dash = 'ثبت نشده است';

const ITEM_STATUS: Record<number, { label: string; className: string }> = {
  0: { label: 'بررسی نشده', className: 'bg-gray-100 text-gray-600' },
  1: { label: 'سالم', className: 'bg-emerald-50 text-mid-green' },
  2: { label: 'دارای ایراد', className: 'bg-red-50 text-mid-red' },
  3: { label: 'موضوعیت ندارد', className: 'bg-gray-100 text-gray-600' },
};

const ZONE_STATUS: Record<number, { label: string; className: string }> = {
  0: { label: 'بررسی نشده', className: 'bg-gray-100 text-gray-600' },
  1: { label: 'سالم', className: 'bg-emerald-50 text-mid-green' },
  2: { label: 'رنگ‌شده', className: 'bg-orange-100 text-orange-800' },
  3: { label: 'آسیب‌دیده', className: 'bg-red-50 text-mid-red' },
  4: { label: 'تعویض‌شده', className: 'bg-purple-100 text-purple-800' },
};

const VIEW_GROUP: Record<string, string> = {
  Top: 'نمای بالا',
  SideLeft: 'نمای چپ',
  SideRight: 'نمای راست',
  Front: 'نمای جلو',
  Rear: 'نمای عقب',
};

const REPORT_STATUS: Record<string, string> = {
  Draft: 'پیش‌نویس',
  Submitted: 'ثبت‌شده',
};

const toImageUrl = (path?: string | null) => {
  if (!path) return null;
  const clean = path.replace(/\\/g, '/').replace(/^\/+/, '');
  if (/^https?:\/\//i.test(clean)) return clean;
  return `${IMAGE_BASE}${clean}`;
};

const clock = (value?: string | null) => {
  if (!value) return dash;
  return value.length >= 5 ? value.slice(0, 5) : value;
};

const hasCoords = (lat?: number | null, lng?: number | null) =>
  lat != null && lng != null && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng));

const paymentClass = (status?: number) => {
  if (status === 1) return 'bg-emerald-50 text-mid-green';
  if (status === 2) return 'bg-amber-50 text-amber-700';
  if (status === 3) return 'bg-red-50 text-mid-red';
  return 'bg-gray-100 text-gray-700';
};

const paymentTitleClass = (title?: string | null) => {
  if (!title) return 'bg-gray-100 text-gray-700';
  if (title.includes('لغو')) return 'bg-red-50 text-mid-red';
  if (title.includes('تایید نشده')) return 'bg-amber-50 text-amber-700';
  if (title.includes('تایید شده') || title.includes('پرداخت شده')) return 'bg-emerald-50 text-mid-green';
  return 'bg-gray-100 text-gray-700';
};

const itemLabel = (item: OrderByUserReportItem) =>
  item.title || item.nameFa || item.name || item.question || item.featureName || item.code || 'آیتم';

const zoneLabel = (zone: OrderByUserBodyZone) => zone.nameFa || zone.name || zone.code || 'قطعه';

const txDate = (tx: OrderByUserWalletTx) => tx.createdOnPersian || tx.createdOn || dash;

function groupBy<T>(rows: T[], keyOf: (row: T) => string) {
  const map = new Map<string, T[]>();
  rows.forEach((row) => {
    const key = keyOf(row);
    const list = map.get(key) ?? [];
    list.push(row);
    map.set(key, list);
  });
  return [...map.entries()];
}

const Field: React.FC<{ label: string; value?: React.ReactNode; className?: string }> = ({
  label,
  value,
  className = '',
}) => (
  <div className={`flex flex-col gap-1 rounded-xl bg-[#FCFCFC] p-3 border border-card-border min-w-0 ${className}`}>
    <span className="text-[11px] text-black-opacity-50">{label}</span>
    <span className="text-sm text-primary break-words">{value || dash}</span>
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="bg-white rounded-2xl border border-card-border p-3 sm:p-4">
    <h3 className="text-sm font-bold text-primary mb-3 !font-peydaBold">{title}</h3>
    {children}
  </section>
);

const Pill: React.FC<{ className: string; children: React.ReactNode }> = ({ className, children }) => (
  <span className={`inline-flex text-[11px] px-2.5 py-1 rounded-full font-medium ${className}`}>{children}</span>
);

const GoogleMapEmbed: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const embedSrc = `https://maps.google.com/maps?q=${lat},${lng}&hl=fa&z=16&output=embed`;
  const openSrc = `https://www.google.com/maps?q=${lat},${lng}`;
  return (
    <div className="mt-3">
      <div className="relative w-full overflow-hidden rounded-xl border border-card-border bg-surface">
        <iframe
          title="موقعیت محل درخواست"
          src={embedSrc}
          className="block w-full h-52 sm:h-64 border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <a
        href={openSrc}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 min-h-[44px] inline-flex items-center justify-center rounded-xl bg-brand text-white text-sm font-medium px-4"
      >
        مشاهده در گوگل‌مپ
      </a>
    </div>
  );
};

const WalletRows: React.FC<{ rows: OrderByUserWalletTx[] }> = ({ rows }) => {
  if (!rows.length) {
    return <p className="text-sm text-black-opacity-50">تراکنش کیف‌پولی برای این سفارش نیست.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="border-b bg-gray-50 text-black-opacity-60">
            <th className="text-right p-2 font-medium">نوع</th>
            <th className="text-right p-2 font-medium">مبلغ</th>
            <th className="text-right p-2 font-medium">موجودی بعد</th>
            <th className="text-right p-2 font-medium">توضیحات</th>
            <th className="text-right p-2 font-medium">تاریخ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((tx, index) => (
            <tr key={tx.id ?? index} className="border-b border-card-border">
              <td className="p-2">{tx.typeTitle || dash}</td>
              <td className={`p-2 ${txAmountClass(tx.amount)}`}>{formatSignedToman(tx.amount)}</td>
              <td className="p-2">{formatToman(tx.balanceAfter)}</td>
              <td className="p-2">{tx.description || '—'}</td>
              <td className="p-2 whitespace-nowrap">{txDate(tx)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PaymentRows: React.FC<{ rows: OrderByUserPayment[] }> = ({ rows }) => {
  if (!rows.length) {
    return <p className="text-sm text-black-opacity-50">تراکنش درگاهی برای این سفارش نیست.</p>;
  }
  return (
    <div className="space-y-2">
      {rows.map((payment) => (
        <div key={payment.id} className="rounded-xl border border-card-border p-3">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-sm font-bold text-primary">{formatToman(payment.amount)}</span>
            <Pill className={paymentClass(payment.status)}>{payment.statusTitle || dash}</Pill>
            {payment.gateway && <span className="text-xs text-black-opacity-50">{payment.gateway}</span>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-black-opacity-70">
            <span>پیگیری: <bdi className="text-primary">{payment.trackId || '—'}</bdi></span>
            <span>مرجع: <bdi className="text-primary">{payment.refId || '—'}</bdi></span>
            <span>کارت: <bdi className="text-primary">{payment.cardNumber || '—'}</bdi></span>
            <span>زمان پرداخت: {payment.paidAtPersian || '—'}</span>
          </div>
          {payment.paymentUrl && (
            <a
              href={payment.paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-xs text-brand"
            >
              لینک درگاه
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

interface OrderByUserDetailProps {
  open: boolean;
  order: OrderByUserOrder | null;
  onClose: () => void;
}

const OrderByUserDetail: React.FunctionComponent<OrderByUserDetailProps> = ({ open, order, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = order?.location;
  const report = order?.report;
  const assignment = order?.expertAssignment;
  const showMap =
    !!location?.isOnSite && hasCoords(location.address?.lat, location.address?.lng);

  const sheetUrls = [
    ...new Set(
      [report?.imagePath, report?.inspectionSheetImagePath]
        .map((path) => toImageUrl(path))
        .filter((url): url is string => !!url)
    ),
  ];

  const itemGroups = groupBy(report?.items ?? [], (item) => item.groupTitle || item.groupName || 'چک‌لیست');
  const zoneGroups = groupBy(
    report?.bodyZones ?? [],
    (zone) => VIEW_GROUP[zone.viewGroup || ''] || zone.viewGroup || 'بدنه'
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 'min(96vw, 980px)' },
          maxWidth: '100%',
          m: { xs: 0, sm: 1.5 },
          height: { xs: '100dvh', sm: 'auto' },
          maxHeight: { xs: '100dvh', sm: '92dvh' },
          borderRadius: { xs: 0, sm: '16px' },
          background: '#F4F6FB',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <DialogTitle className="!p-0 shrink-0">
        <div className="flex items-start justify-between gap-3 px-4 py-3 bg-white border-b border-card-border">
          <div className="min-w-0">
            <p className="text-base sm:text-lg font-bold text-primary !font-peydaBold">
              جزئیات سفارش {order ? `#${order.id}` : ''}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {order?.code && <span className="text-xs text-black-opacity-50">کد {order.code}</span>}
              {order?.paymentStatusTitle && (
                <Pill className={paymentTitleClass(order.paymentStatusTitle)}>{order.paymentStatusTitle}</Pill>
              )}
              {order?.flowStateTitle && (
                <Pill className="bg-brand-soft text-brand">{order.flowStateTitle}</Pill>
              )}
            </div>
          </div>
          <IconButton onClick={onClose} aria-label="بستن" size="small">
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
        {!order ? (
          <p className="text-center text-black-opacity-50 py-12">سفارشی انتخاب نشده است.</p>
        ) : (
          <>
            <Section title="خلاصه سفارش">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                <Field label="شناسه" value={`#${order.id}`} />
                <Field label="کد" value={order.code} />
                <Field label="تاریخ ثبت" value={order.createdOnPersian} />
                <Field label="خودرو" value={order.carName} />
                <Field label="نوع کارشناسی" value={order.inspectionType} />
                <Field label="ساعت برنامه‌ریزی" value={clock(order.scheduledTime)} />
                {(order.scheduledDatePersian || order.scheduledDate) && (
                  <Field label="تاریخ برنامه‌ریزی" value={order.scheduledDatePersian || order.scheduledDate} />
                )}
                <Field label="قیمت" value={formatToman(order.price)} />
                <Field label="تخفیف" value={formatToman(order.discount)} />
                <Field
                  label="مبلغ نهایی"
                  value={<span className="font-bold text-brand">{formatToman(order.finalPrice)}</span>}
                />
                <Field label="وضعیت پرداخت" value={order.paymentStatusTitle} />
                <Field label="مرحله" value={order.flowStateTitle} />
                <Field label="پرداخت" value={order.isComplete ? 'انجام شده' : 'انجام نشده'} />
              </div>
            </Section>

            <Section title="محل درخواست">
              {!location ? (
                <p className="text-sm text-black-opacity-50">محل ثبت نشده است.</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Field label="نوع محل" value={location.name} />
                    <Field label="هزینه اضافه محل" value={formatToman(location.additionalCost)} />
                    <Field label="آدرس" value={location.displayAddress} className="sm:col-span-2" />
                  </div>
                  {showMap && (
                    <GoogleMapEmbed lat={Number(location.address?.lat)} lng={Number(location.address?.lng)} />
                  )}
                </>
              )}
            </Section>

            <Section title="تراکنش درگاه">
              <PaymentRows rows={order.payments ?? []} />
            </Section>

            <Section title="تراکنش کیف‌پول سفارش">
              <WalletRows rows={order.walletTransactions ?? []} />
            </Section>

            <Section title="اعزام کارشناس">
              {assignment?.statusText ? (
                <p className="text-sm text-primary">{assignment.statusText}</p>
              ) : (
                <p className="text-sm text-black-opacity-50">اعزام کارشناسی برای این سفارش ثبت نشده است.</p>
              )}
            </Section>

            <Section title="گزارش کارشناسی">
              {!report ? (
                <p className="text-sm text-black-opacity-50">گزارش کارشناسی ثبت نشده است.</p>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-black-opacity-50">وضعیت گزارش</span>
                    <Pill className="bg-brand-soft text-brand">
                      {REPORT_STATUS[report.status || ''] || report.status || dash}
                    </Pill>
                  </div>
                  {report.summaryNote && (
                    <p className="text-sm text-primary bg-[#FCFCFC] border border-card-border rounded-xl p-3">
                      {report.summaryNote}
                    </p>
                  )}
                  {sheetUrls.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {sheetUrls.map((url) => (
                        <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="block">
                          <img
                            src={url}
                            alt="برگه کارشناسی"
                            className="h-28 w-28 object-cover rounded-xl border border-card-border bg-white"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                  {itemGroups.map(([group, items]) => (
                    <div key={group}>
                      <h4 className="text-xs font-bold text-primary mb-2">{group}</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[480px]">
                          <thead>
                            <tr className="border-b bg-gray-50 text-black-opacity-60">
                              <th className="text-right p-2 font-medium">آیتم</th>
                              <th className="text-right p-2 font-medium">وضعیت</th>
                              <th className="text-right p-2 font-medium">یادداشت</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((item, index) => {
                              const status = ITEM_STATUS[item.status] ?? {
                                label: String(item.status),
                                className: 'bg-gray-100 text-gray-600',
                              };
                              return (
                                <tr key={`${itemLabel(item)}-${index}`} className="border-b border-card-border">
                                  <td className="p-2">{itemLabel(item)}</td>
                                  <td className="p-2">
                                    <Pill className={status.className}>{status.label}</Pill>
                                  </td>
                                  <td className="p-2 text-black-opacity-70">{item.note || item.description || '—'}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                  {zoneGroups.map(([group, zones]) => (
                    <div key={group}>
                      <h4 className="text-xs font-bold text-primary mb-2">{group}</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[480px]">
                          <thead>
                            <tr className="border-b bg-gray-50 text-black-opacity-60">
                              <th className="text-right p-2 font-medium">قطعه</th>
                              <th className="text-right p-2 font-medium">وضعیت</th>
                              <th className="text-right p-2 font-medium">یادداشت</th>
                            </tr>
                          </thead>
                          <tbody>
                            {zones.map((zone, index) => {
                              const status = ZONE_STATUS[zone.status] ?? {
                                label: String(zone.status),
                                className: 'bg-gray-100 text-gray-600',
                              };
                              return (
                                <tr key={`${zone.code || zoneLabel(zone)}-${index}`} className="border-b border-card-border">
                                  <td className="p-2">{zoneLabel(zone)}</td>
                                  <td className="p-2">
                                    <Pill className={status.className}>{status.label}</Pill>
                                  </td>
                                  <td className="p-2 text-black-opacity-70">{zone.note || '—'}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </>
        )}
      </div>

      <div className="shrink-0 bg-white border-t border-card-border px-4 py-3">
        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto sm:min-w-[140px] min-h-[44px] px-4 rounded-xl bg-white text-primary border border-card-border text-sm font-medium"
        >
          بستن
        </button>
      </div>
    </Dialog>
  );
};

export default OrderByUserDetail;
