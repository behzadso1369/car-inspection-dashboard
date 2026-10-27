import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { SellerUserInfoItem } from '../../_models/response/sellerUserInfo/sellerUserInfo.response';
import { errorText, getSellerUserInfo } from './sellerUserInfoApi';
import {
  formatMileage,
  formatSellerDateTime,
  formatSellerPrice,
  salesSmsBadgeClass,
  salesSmsBadgeTone,
  salesSmsStatusLabel,
  sellerDisplayTitle,
} from './sellerUserInfoHelpers';
import { copyText } from '../ShortLink/shortLinkHelpers';
import Button, { SecondaryButton } from '../../libs/button/button';

const Field: React.FC<{ label: string; value: React.ReactNode; ltr?: boolean }> = ({
  label,
  value,
  ltr,
}) => (
  <div className="flex flex-col gap-1 rounded-xl bg-[#FCFCFC] p-3 border border-card-border min-w-0">
    <h3 className="text-primary font-bold text-xs">{label}</h3>
    <span className={`text-primary text-sm break-words ${ltr ? 'dir-ltr text-left' : ''}`}>
      {value}
    </span>
  </div>
);

const SellerUserInfoDetail: React.FunctionComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const numericId = Number(id);
  const [detail, setDetail] = useState<SellerUserInfoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!Number.isFinite(numericId) || numericId <= 0) {
      setError('شناسه نامعتبر است');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    getSellerUserInfo(numericId)
      .then(setDetail)
      .catch((err) => setError(errorText(err)))
      .finally(() => setLoading(false));
  }, [numericId]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <CircularProgress />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="w-full pb-6 space-y-4">
        <div className="bg-white rounded-2xl border border-card-border shadow-card p-6 text-center">
          <p className="text-red-700 text-sm mb-4">{error || 'رکورد یافت نشد'}</p>
          <Button title="بازگشت به لیست" active style={SecondaryButton} onClick={() => navigate('/divar-sellers/list')} />
        </div>
      </div>
    );
  }

  const smsTone = salesSmsBadgeTone(detail.salesSmsStatus);

  return (
    <div className="w-full pb-6 max-w-full overflow-x-hidden space-y-4">
      <div className="bg-white border border-card-border rounded-2xl p-4 shadow-card relative overflow-hidden">
        <span className="absolute top-0 right-0 w-1.5 h-full bg-brand" />
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pr-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-primary text-lg font-bold !font-peydaBold">
                {sellerDisplayTitle(detail)}
              </h1>
              {detail.isDealer ? (
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  نمایشگاه
                </span>
              ) : null}
            </div>
            <p className="text-xs text-black-opacity-60">
              شناسه {detail.id.toLocaleString('fa-IR')}
              {detail.rowNumber != null ? ` · ردیف اکسل ${detail.rowNumber.toLocaleString('fa-IR')}` : ''}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            {detail.adUrl ? (
              <a href={detail.adUrl} target="_blank" rel="noopener noreferrer">
                <Button title="آگهی در دیوار" active style={SecondaryButton} />
              </a>
            ) : null}
            <Link to="/divar-sellers/list">
              <Button title="لیست" active style={SecondaryButton} />
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-card-border shadow-card p-4">
        <h2 className="text-sm font-bold text-primary mb-3 border-b border-card-border pb-2">
          خودرو و آگهی
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Field label="قیمت" value={formatSellerPrice(detail.price)} />
          <Field label="مدل / سال" value={detail.model || '—'} />
          <Field label="کارکرد" value={formatMileage(detail.mileage)} />
          <Field label="محله" value={detail.neighborhood || '—'} />
          <Field
            label="شماره تماس"
            value={
              detail.phone ? (
                <span className="inline-flex items-center gap-2">
                  {detail.phone}
                  <button
                    type="button"
                    className="text-brand text-xs"
                    onClick={() => copyText(detail.phone!).catch(() => alert('کپی نشد'))}
                  >
                    کپی
                  </button>
                </span>
              ) : (
                '—'
              )
            }
            ltr={!!detail.phone}
          />
          <Field label="لینک آگهی" value={detail.adUrl || '—'} ltr={!!detail.adUrl} />
        </div>
        {detail.description ? (
          <div className="mt-3">
            <Field label="توضیحات" value={detail.description} />
          </div>
        ) : null}
      </div>

      <div className="bg-white rounded-2xl border border-card-border shadow-card p-4">
        <h2 className="text-sm font-bold text-primary mb-3 border-b border-card-border pb-2">
          پشتیبانی و پیامک
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="نتیجه تماس" value={detail.callResult || '—'} />
          <Field
            label="وضعیت پیامک کارشناسی فروش"
            value={
              <span
                className={`inline-flex text-xs px-2 py-0.5 rounded-full border ${salesSmsBadgeClass(smsTone)}`}
                title={detail.salesSmsError || undefined}
              >
                {salesSmsStatusLabel(detail.salesSmsStatus)}
              </span>
            }
          />
          <Field label="زمان ارسال پیامک" value={formatSellerDateTime(detail.salesSmsSentAt)} />
          <Field label="دلیل skip / خطا" value={detail.salesSmsError || '—'} />
        </div>
        <p className="text-xs text-black-opacity-50 mt-3">
          تنظیم سوییچ و متن پیامک:{' '}
          <Link to="/utm/seller-sales-sms" className="text-brand underline">
            پیامک کارشناسی فروش
          </Link>
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-card-border shadow-card p-4">
        <h2 className="text-sm font-bold text-primary mb-3 border-b border-card-border pb-2">زمان‌ها</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="تاریخ درج" value={formatSellerDateTime(detail.createdOn)} />
          <Field label="آخرین ویرایش" value={formatSellerDateTime(detail.updatedOn)} />
        </div>
      </div>
    </div>
  );
};

export default SellerUserInfoDetail;
