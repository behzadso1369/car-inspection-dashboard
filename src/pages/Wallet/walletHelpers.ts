export const WALLET_TX_TYPE = {
  OrderGift: 1,
  Charge: 2,
  OrderPayment: 3,
  OrderRefund: 4,
  AdminAdjust: 5,
} as const;

export const formatToman = (value?: number | null) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  return `${Number(value).toLocaleString('fa-IR')} تومان`;
};

export const toNumber = (value: unknown) => {
  const n = Number(String(value ?? '').replace(/,/g, '').trim());
  return Number.isNaN(n) ? 0 : n;
};

export const txAmountClass = (amount?: number | null) => {
  const n = Number(amount ?? 0);
  if (n > 0) return 'text-emerald-600';
  if (n < 0) return 'text-red-600';
  return 'text-primary';
};

export const formatSignedToman = (amount?: number | null) => {
  const n = Number(amount ?? 0);
  const abs = formatToman(Math.abs(n));
  if (n > 0) return `+${abs}`;
  if (n < 0) return `−${abs}`;
  return abs;
};
