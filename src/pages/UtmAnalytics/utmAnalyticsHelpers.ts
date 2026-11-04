import { UtmQueryFilters } from '../../_models/response/utm/utmAnalytics.response';
import { UtmFilterFormValues } from './UtmAnalyticsFilters';

export const EMPTY_GROUP_LABEL = '(بدون مقدار)';

export function toIsoDate(value: unknown) {
  if (value == null || value === '') return undefined;
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString().slice(0, 10);
}

export function formatCount(value?: number | null) {
  return (value ?? 0).toLocaleString('fa-IR');
}

export function formatPercent(value?: number | null) {
  return `${(value ?? 0).toLocaleString('fa-IR', { maximumFractionDigits: 1 })}٪`;
}

export function formatDateFa(value?: string | null) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('fa-IR');
}

export function formatDateTimeFa(value?: string | null) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function displayGroupKey(key?: string | null) {
  const trimmed = (key ?? '').trim();
  return trimmed ? trimmed : EMPTY_GROUP_LABEL;
}

export function filtersFromForm(values: UtmFilterFormValues): UtmQueryFilters {
  return {
    from: toIsoDate(values.fromDate),
    to: toIsoDate(values.toDate),
    source: values.source.trim() || undefined,
    medium: values.medium.trim() || undefined,
    campaign: values.campaign.trim() || undefined,
    content: values.content.trim() || undefined,
    eventType: values.eventType.trim() || undefined,
    path: values.path.trim() || undefined,
    shortCode: values.shortCode.trim() || undefined,
    ref: values.ref.trim() || undefined,
    includeBots: values.includeBots,
  };
}

const KIND_STYLES: Record<string, string> = {
  short_click: 'bg-teal-100 text-teal-800 border-teal-200',
  landing_inspection: 'bg-sky-100 text-sky-800 border-sky-200',
  landing_motorcycle: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  order_flow: 'bg-brand/10 text-brand border-brand/25',
  motorcycle_flow: 'bg-violet-100 text-violet-800 border-violet-200',
  payment: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  wallet: 'bg-amber-100 text-amber-900 border-amber-200',
  content: 'bg-slate-100 text-slate-700 border-slate-200',
  api: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  other: 'bg-gray-100 text-gray-700 border-gray-200',
};

export function kindChipClass(kind?: string | null) {
  return KIND_STYLES[kind ?? ''] ?? KIND_STYLES.other;
}

export const EVENT_TYPE_LABELS: Record<string, string> = {
  short_click: 'کلیک لینک کوتاه',
  hit: 'بازدید با UTM',
};
