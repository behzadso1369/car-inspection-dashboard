/** E_ExpertPayoutType */
export const EXPERT_PAYOUT_TYPE = {
  Percentage: 1,
  FixedPerOrder: 2,
} as const;

/** E_ExpertEarningStatus */
export const EXPERT_EARNING_STATUS = {
  PendingSettlement: 0,
  Settled: 1,
  Rejected: 2,
} as const;

export const payoutTypeOptions = [
  { id: EXPERT_PAYOUT_TYPE.Percentage, title: 'درصدی' },
  { id: EXPERT_PAYOUT_TYPE.FixedPerOrder, title: 'مبلغ ثابت هر سفارش' },
];

export const earningStatusOptions = [
  { id: -1, title: 'همه وضعیت‌ها' },
  { id: EXPERT_EARNING_STATUS.PendingSettlement, title: 'در انتظار تسویه' },
  { id: EXPERT_EARNING_STATUS.Settled, title: 'تسویه‌شده' },
  { id: EXPERT_EARNING_STATUS.Rejected, title: 'رد شده' },
];

export const payoutTypeLabel = (type?: number | null) => {
  if (type === EXPERT_PAYOUT_TYPE.Percentage) return 'درصدی';
  if (type === EXPERT_PAYOUT_TYPE.FixedPerOrder) return 'مبلغ ثابت';
  return '—';
};

export const earningStatusLabel = (status?: number | null) => {
  if (status === EXPERT_EARNING_STATUS.PendingSettlement) return 'در انتظار تسویه';
  if (status === EXPERT_EARNING_STATUS.Settled) return 'تسویه‌شده';
  if (status === EXPERT_EARNING_STATUS.Rejected) return 'رد شده';
  return '—';
};

export const earningStatusTone = (
  status?: number | null
): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
  if (status === EXPERT_EARNING_STATUS.PendingSettlement) return 'warning';
  if (status === EXPERT_EARNING_STATUS.Settled) return 'success';
  if (status === EXPERT_EARNING_STATUS.Rejected) return 'danger';
  return 'default';
};

export const formatMoney = (value?: number | null) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  return Number(value).toLocaleString('fa-IR');
};
