import moment from 'jalali-moment';
import { SalesSmsStatus, SellerUserInfoItem } from '../../_models/response/sellerUserInfo/sellerUserInfo.response';
import { formatToman } from '../SupportOrder/supportOrderApi';

export function formatSellerDateTime(value?: string | null) {
  if (!value) return '—';
  return moment(value).locale('fa').format('YYYY/MM/DD ساعت HH:mm');
}

export function formatMileage(value?: number | null) {
  if (value == null || !Number.isFinite(value)) return '—';
  return `${value.toLocaleString('fa-IR')} کیلومتر`;
}

export function salesSmsStatusLabel(status?: SalesSmsStatus) {
  if (!status) return '—';
  switch (status) {
    case 'sent':
      return 'ارسال شده';
    case 'skipped':
      return 'رد شده';
    case 'failed':
      return 'ناموفق';
    default:
      return String(status);
  }
}

export type SmsBadgeTone = 'success' | 'muted' | 'danger' | 'default';

export function salesSmsBadgeTone(status?: SalesSmsStatus): SmsBadgeTone {
  switch (status) {
    case 'sent':
      return 'success';
    case 'skipped':
      return 'muted';
    case 'failed':
      return 'danger';
    default:
      return 'default';
  }
}

export function salesSmsBadgeClass(tone: SmsBadgeTone) {
  switch (tone) {
    case 'success':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'muted':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'danger':
      return 'bg-red-50 text-red-800 border-red-200';
    default:
      return 'bg-[#FCFCFC] text-black-opacity-50 border-card-border';
  }
}

export function sellerDisplayTitle(row: Pick<SellerUserInfoItem, 'car' | 'model' | 'id'>) {
  const car = row.car?.trim();
  if (car) return car;
  if (row.model) return `مدل ${row.model}`;
  return `#${row.id}`;
}

export function formatSellerPrice(value?: number | null) {
  if (value == null) return '—';
  return formatToman(value);
}

export function hasUpsertPayload(body: Record<string, unknown>) {
  return Object.values(body).some((v) => {
    if (v == null) return false;
    if (typeof v === 'string') return v.trim().length > 0;
    if (typeof v === 'number') return Number.isFinite(v);
    if (typeof v === 'boolean') return true;
    return false;
  });
}
