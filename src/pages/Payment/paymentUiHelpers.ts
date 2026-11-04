import { AdminPayment } from '../../_models/response/payment/adminPayment';

export const TICKET_TYPE_CREDIT = 5;
export const TICKET_TYPE_BNPL = 13;

export const isDigipayGateway = (gateway?: string | null) =>
  (gateway ?? '').toLowerCase() === 'digipay';

export const isZibalGateway = (payment: Pick<AdminPayment, 'gateway' | 'paymentUrl'>) => {
  const g = (payment.gateway ?? '').toLowerCase();
  if (g === 'zibal') return true;
  if (!g && payment.paymentUrl) return true;
  return false;
};

export const gatewayLabel = (payment: Pick<AdminPayment, 'gateway' | 'gatewayTitle'>) =>
  payment.gatewayTitle ||
  (isDigipayGateway(payment.gateway) ? 'دیجی‌پی' : payment.gateway || 'زیبال');

export const gatewayChipClass = (gateway?: string | null) => {
  if (isDigipayGateway(gateway)) return 'bg-teal-50 text-teal-800 border border-teal-200';
  return 'bg-gray-100 text-gray-700 border border-gray-200';
};

export const showsInstallmentBlock = (payment: AdminPayment) =>
  !!payment.isCredit ||
  payment.ticketType === TICKET_TYPE_CREDIT ||
  payment.ticketType === TICKET_TYPE_BNPL;

export const paymentStatusClass = (status?: number, title?: string | null) => {
  if (status === 15 || title?.includes('استرداد')) return 'bg-purple-50 text-purple-800';
  if (status === 16) return 'bg-amber-50 text-amber-700';
  if (status === 18 || title?.includes('ریورس')) return 'bg-orange-50 text-orange-800';
  if (status === 1) return 'bg-emerald-50 text-mid-green';
  if (status === 2) return 'bg-amber-50 text-amber-700';
  if (status === 3) return 'bg-red-50 text-mid-red';
  return 'bg-gray-100 text-gray-700';
};

export const copyText = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
};
