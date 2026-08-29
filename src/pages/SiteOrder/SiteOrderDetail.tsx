import React, { useEffect, useMemo, useState } from 'react';
import { CircularProgress, Dialog, DialogTitle, IconButton, useMediaQuery, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import moment from 'jalali-moment';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import { OrderDetailResponse } from '../../_models/response/order/orderDetail.response';

const IMAGE_BASE = 'https://api.carmacheck.com/';

interface SiteOrderDetailProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  orderId: number;
  initialOrder?: OrderDetailResponse | null;
}

const dash = 'ثبت نشده است';

const toImageUrl = (path?: string | null) =>
  path ? `${IMAGE_BASE}${path.replace(/\\/g, '/')}` : null;

const formatMoney = (value?: number | null) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return dash;
  return `${Number(value).toLocaleString('fa-IR')} تومان`;
};

const formatDateTime = (value?: string | null) =>
  value ? moment(value).locale('fa').format('YYYY/MM/DD ساعت HH:mm') : dash;

const formatDate = (value?: string | null) =>
  value ? moment(value).locale('fa').format('YYYY/MM/DD') : dash;

const formatTime = (value?: string | null) => {
  if (!value) return dash;
  return value.length >= 5 ? value.slice(0, 5) : value;
};

const hasCoords = (lat?: number | null, lng?: number | null) =>
  lat != null &&
  lng != null &&
  !Number.isNaN(Number(lat)) &&
  !Number.isNaN(Number(lng));

const paymentTone = (title?: string | null) => {
  if (!title) return 'bg-gray-100 text-gray-700';
  if (title.includes('پرداخت شده') || title.includes('تایید')) {
    return 'bg-emerald-50 text-mid-green';
  }
  if (title.includes('ناموفق') || title.includes('لغو')) {
    return 'bg-red-50 text-mid-red';
  }
  return 'bg-amber-50 text-amber-700';
};

const Field: React.FC<{ label: string; value?: React.ReactNode; className?: string }> = ({
  label,
  value,
  className = '',
}) => (
  <div
    className={`flex flex-col gap-1 rounded-xl bg-[#FCFCFC] p-3 border border-card-border min-w-0 ${className}`}
  >
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

const GoogleMapEmbed: React.FC<{
  lat: number;
  lng: number;
  title: string;
  caption?: string;
}> = ({ lat, lng, title, caption }) => {
  const embedSrc = `https://maps.google.com/maps?q=${lat},${lng}&hl=fa&z=16&output=embed`;
  const openSrc = `https://www.google.com/maps?q=${lat},${lng}`;
  const dirSrc = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="mt-3">
      {caption && (
        <p className="text-xs text-black-opacity-50 mb-2">{caption}</p>
      )}
      <div className="relative w-full overflow-hidden rounded-xl border border-card-border bg-surface">
        <iframe
          title={title}
          src={embedSrc}
          className="block w-full h-52 sm:h-64 md:h-80 border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div className="mt-2 flex flex-col sm:flex-row gap-2">
        <a
          href={openSrc}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-h-[44px] inline-flex items-center justify-center rounded-xl bg-brand text-white text-sm font-medium"
        >
          مشاهده در گوگل‌مپ
        </a>
        <a
          href={dirSrc}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-h-[44px] inline-flex items-center justify-center rounded-xl bg-white text-primary border border-card-border text-sm font-medium"
        >
          مسیریابی
        </a>
      </div>
      <p className="mt-2 text-[11px] text-black-opacity-50 text-left" style={{ direction: 'ltr' }}>
        {Number(lat).toFixed(6)}, {Number(lng).toFixed(6)}
      </p>
    </div>
  );
};

const SiteOrderDetail: React.FunctionComponent<SiteOrderDetailProps> = ({
  showModal,
  setShowModal,
  orderId,
  initialOrder,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [detail, setDetail] = useState<OrderDetailResponse | null>(initialOrder ?? null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!showModal || !orderId) return;

    setDetail(initialOrder ?? null);
    setLoading(!initialOrder);
    instance
      .get(ApiHelper.get('GetOrder'), { params: { id: orderId } })
      .then((res: any) => {
        const payload = res?.data?.resultObject ?? res?.data;
        const looksLikeOrder =
          payload &&
          (payload.address || payload.carGroup || payload.flowState || payload.userId);
        if (looksLikeOrder) setDetail(payload);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [showModal, orderId, initialOrder]);

  const payable = useMemo(() => {
    if (detail?.price == null) return null;
    return Number(detail.price) - Number(detail.discount ?? 0);
  }, [detail]);

  const carName = [
    detail?.carGroup?.carBrand?.name,
    detail?.carGroup?.name,
  ]
    .filter(Boolean)
    .join(' ');

  const carImage = toImageUrl(
    detail?.carGroup?.imagePath || detail?.carGroup?.carBrand?.imagePath || detail?.imagePath
  );

  const address = detail?.address;
  const expert = detail?.expert;
  const close = () => setShowModal(false);

  return (
    <Dialog
      open={showModal}
      onClose={close}
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
              جزئیات سفارش {detail?.id ? `#${detail.id}` : ''}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {detail?.code && (
                <span className="text-xs text-black-opacity-50">کد {detail.code}</span>
              )}
              {detail?.paymentStatusTitle && (
                <span
                  className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${paymentTone(
                    detail.paymentStatusTitle
                  )}`}
                >
                  {detail.paymentStatusTitle}
                </span>
              )}
              {detail?.flowState?.title && (
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-brand-soft text-brand font-medium">
                  {detail.flowState.title}
                </span>
              )}
            </div>
          </div>
          <IconButton onClick={close} aria-label="بستن" className="shrink-0" size="small">
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {loading && !detail ? (
          <div className="flex justify-center py-16">
            <CircularProgress sx={{ color: '#0237fe' }} />
          </div>
        ) : !detail ? (
          <p className="text-center text-black-opacity-50 py-12">اطلاعاتی یافت نشد.</p>
        ) : (
          <>
            <Section title="خلاصه سفارش">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                <Field label="کاربر" value={detail.userId} />
                <Field label="نوع فرآیند" value={detail.flowState?.flowType?.title} />
                <Field label="مرحله سفارش" value={detail.flowState?.title} />
                <Field label="تاریخ ثبت" value={formatDateTime(detail.createdOn)} />
                <Field label="آخرین بروزرسانی" value={formatDateTime(detail.updatedOn)} />
                <Field label="کد تخفیف" value={detail.code} />
              </div>
            </Section>

            <Section title="مالی">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <Field label="قیمت سفارش" value={formatMoney(detail.price)} />
                <Field label="تخفیف" value={formatMoney(detail.discount)} />
                <Field
                  label="مبلغ قابل پرداخت"
                  value={
                    <span className="font-bold text-brand">{formatMoney(payable)}</span>
                  }
                />
              </div>
            </Section>

            <Section title="خودرو">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                {carImage && (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border border-card-border bg-white flex items-center justify-center p-2 shrink-0">
                    <img src={carImage} alt={carName || 'خودرو'} className="max-w-full max-h-full object-contain" />
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 flex-1 min-w-0">
                  <Field label="برند" value={detail.carGroup?.carBrand?.name} />
                  <Field label="مدل" value={detail.carGroup?.name} />
                </div>
              </div>
            </Section>

            <Section title="کارشناسی">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                <Field label="نوع کارشناسی" value={detail.carInspectionType?.name} />
                <Field label="زمان کارشناسی" value={detail.carInspectionDateType?.name} />
                <Field label="محل کارشناسی" value={detail.carInspectionLocationType?.name} />
                <Field
                  label="توضیح محل"
                  value={detail.carInspectionLocationType?.locationTypeDescription}
                />
                <Field label="تاریخ برنامه‌ریزی" value={formatDate(detail.scheduledDate)} />
                <Field label="ساعت برنامه‌ریزی" value={formatTime(detail.scheduledTime)} />
                <Field
                  label="قیمت کارشناسی ما"
                  value={formatMoney(detail.carInspection?.ourPrice)}
                />
                <Field
                  label="قیمت بازار"
                  value={formatMoney(detail.carInspection?.marketPrice)}
                />
              </div>
            </Section>

            <Section title="آدرس سفارش">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <Field label="عنوان آدرس" value={address?.title} />
                <Field label="شهر" value={address?.city} />
                <Field label="پلاک" value={address?.plaque} />
                <Field
                  label="آدرس کامل"
                  value={address?.street}
                  className="sm:col-span-2"
                />
              </div>
              {hasCoords(address?.lat, address?.lng) ? (
                <GoogleMapEmbed
                  lat={Number(address?.lat)}
                  lng={Number(address?.lng)}
                  title="موقعیت آدرس سفارش روی گوگل‌مپ"
                  caption="موقعیت آدرس سفارش"
                />
              ) : (
                <p className="mt-3 text-sm text-black-opacity-50">مختصات آدرس ثبت نشده است.</p>
              )}
            </Section>

            <Section title="کارشناس">
              {expert ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                    <Field label="نام کارشناس" value={expert.fullName} />
                    <Field
                      label="موبایل"
                      value={
                        expert.phoneNumber ? (
                          <a href={`tel:${expert.phoneNumber}`} className="text-brand">
                            {expert.phoneNumber}
                          </a>
                        ) : (
                          dash
                        )
                      }
                    />
                    <Field label="شهر پایه" value={expert.baseCity} />
                    <Field label="وضعیت" value={expert.isActive ? 'فعال' : 'غیرفعال'} />
                    <Field
                      label="زمان تخصیص"
                      value={formatDateTime(detail.expertAssignedAt)}
                    />
                  </div>
                  {hasCoords(expert.baseLat, expert.baseLng) && (
                    <GoogleMapEmbed
                      lat={Number(expert.baseLat)}
                      lng={Number(expert.baseLng)}
                      title="موقعیت کارشناس روی گوگل‌مپ"
                      caption="موقعیت پایه کارشناس"
                    />
                  )}
                </>
              ) : (
                <p className="text-sm text-black-opacity-50">کارشناسی به این سفارش تخصیص داده نشده است.</p>
              )}
            </Section>
          </>
        )}
      </div>

      <div className="shrink-0 bg-white border-t border-card-border px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={close}
          className="w-full sm:w-auto sm:min-w-[140px] min-h-[44px] px-4 rounded-xl bg-white text-primary border border-card-border text-sm font-medium"
        >
          بستن
        </button>
      </div>
    </Dialog>
  );
};

export default SiteOrderDetail;
