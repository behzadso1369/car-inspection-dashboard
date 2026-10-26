import { BULK_PHONE_LIMIT, UTM_CAMPAIGN_PATTERN } from './shortLinkConstants';

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

export function toEnglishDigits(value: string) {
  return value
    .split('')
    .map((ch) => {
      const p = PERSIAN_DIGITS.indexOf(ch);
      if (p >= 0) return String(p);
      const a = ARABIC_DIGITS.indexOf(ch);
      if (a >= 0) return String(a);
      return ch;
    })
    .join('');
}

export function normalizeCampaignInput(raw: string) {
  return raw.trim().toLowerCase().replace(/\s+/g, '_');
}

export function validateCampaign(campaign: string): string | null {
  const normalized = normalizeCampaignInput(campaign);
  if (!normalized) return 'نام کمپین الزامی است';
  if (!UTM_CAMPAIGN_PATTERN.test(normalized)) {
    return 'نام کمپین فقط حروف کوچک انگلیسی، عدد و _ (مثل aban_takhfif)';
  }
  return null;
}

export function normalizeTargetPath(raw: string) {
  const trimmed = raw.trim() || '/';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const url = new URL(trimmed);
      return url.pathname + url.search + url.hash || '/';
    } catch {
      return trimmed;
    }
  }
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

export function parsePhoneLines(text: string): { phones: string[]; invalid: string[] } {
  const lines = text
    .split(/\r?\n/)
    .map((line) => toEnglishDigits(line.trim().replace(/\s/g, '')))
    .filter(Boolean);

  const invalid: string[] = [];
  const valid: string[] = [];
  const seen = new Set<string>();

  for (const line of lines) {
    if (!/^09\d{9}$/.test(line)) {
      invalid.push(line);
      continue;
    }
    if (!seen.has(line)) {
      seen.add(line);
      valid.push(line);
    }
  }

  return { phones: valid, invalid };
}

export function validateBulkPhones(phones: string[]): string | null {
  if (phones.length === 0) return 'لیست شماره خالی است';
  if (phones.length > BULK_PHONE_LIMIT) {
    return `حداکثر ${BULK_PHONE_LIMIT} شماره در هر درخواست مجاز است`;
  }
  return null;
}

export async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

export function formatPercent(value?: number | null) {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return '۰٪';
  return `${n.toLocaleString('fa-IR', { maximumFractionDigits: 2 })}٪`;
}
