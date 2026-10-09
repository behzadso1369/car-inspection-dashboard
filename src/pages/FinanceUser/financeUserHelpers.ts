import moment from 'jalali-moment';

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

export const normalizePhone = (value: unknown) =>
  String(value ?? '')
    .trim()
    .replace(/[۰-۹]/g, (digit) => String(FA_DIGITS.indexOf(digit)))
    .replace(/[\s-]/g, '');

export const isValidMobile = (value: string) => /^09\d{9}$/.test(value);

export const formatCreatedOn = (value?: string | null) => {
  if (!value) return '—';
  const date = moment(value);
  if (!date.isValid()) return value;
  return date.locale('fa').format('YYYY/MM/DD HH:mm');
};
