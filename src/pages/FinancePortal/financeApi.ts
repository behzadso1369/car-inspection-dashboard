import axios from 'axios';
import { API_ORIGIN } from '../../config/api/base-url';
import { AdminPayment } from '../../_models/response/payment/adminPayment';
import {
  FinanceOrderDetailResult,
  FinancePaymentRow,
} from '../../_models/response/payment/financePayment';
import financeInstance from '../../helper/financeInterceptor';
import { setFinanceAccessToken } from './financeAuth';

const envelope = <T>(data: any): T => {
  if (data?.isSuccess === false) {
    const err: Error & { statusMessage?: string } = new Error(
      data.statusMessage || 'عملیات ناموفق بود'
    );
    err.statusMessage = data.statusMessage;
    throw err;
  }
  return data?.resultObject as T;
};

export async function sendFinanceOtp(phoneNumber: string) {
  const res = await axios.post(`${API_ORIGIN}/api/Finance/Auth/SendOtp`, { phoneNumber });
  return envelope(res.data);
}

export async function verifyFinanceOtp(phoneNumber: string, code: string) {
  const res = await axios.post(`${API_ORIGIN}/api/Finance/Auth/VerifyOtp`, {
    phoneNumber,
    code,
  });
  const result = envelope<{ accessToken: string }>(res.data);
  if (result?.accessToken) setFinanceAccessToken(result.accessToken);
  return result;
}

export type FinancePaymentsQuery = {
  pageNumber?: number;
  pageSize?: number;
  gateway?: '' | 'Digipay' | 'Zibal';
  trackId?: string;
  status?: number | '';
  from?: string;
  to?: string;
  orderId?: number | '';
};

export async function fetchFinancePayments(params: FinancePaymentsQuery) {
  const clean: Record<string, string | number> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value === '' || value == null) return;
    clean[key] = value as string | number;
  });
  const res = await financeInstance.get('Payments', { params: clean });
  return {
    rows: (res.data?.resultObject ?? []) as FinancePaymentRow[],
    count: Number(res.data?.countData ?? res.data?.count ?? 0),
  };
}

export async function fetchFinanceOrderDetail(orderId: number, vehicleKind: number) {
  const res = await financeInstance.get('OrderDetail', {
    params: { orderId, vehicleKind },
  });
  return envelope<FinanceOrderDetailResult>(res.data);
}

export async function fetchFinanceOrderDetailByCode(code: string) {
  const res = await financeInstance.get('OrderDetailByCode', { params: { code } });
  return envelope<FinanceOrderDetailResult>(res.data);
}

/** Map ledger row to payment card shape (read-only). */
export function financeRowToPayment(row: FinancePaymentRow): AdminPayment {
  return {
    id: row.paymentId,
    amount: row.amount,
    baseAmount: row.baseAmount,
    surchargePercent: row.surchargePercent,
    surchargeAmount: row.surchargeAmount,
    gateway: row.gateway,
    gatewayTitle: row.gatewayTitle,
    trackId: row.trackId,
    refId: null,
    cardNumber: null,
    status: row.status,
    statusTitle: row.statusTitle,
    paymentUrl: null,
    paidAt: row.paidAt,
    paidAtPersian: row.paidAtPersian,
    orderId: row.orderId,
    providerId: row.providerId,
    ticket: row.ticket,
    ticketType: row.ticketType,
    ticketTypeTitle: row.ticketTypeTitle as AdminPayment['ticketTypeTitle'],
    isCredit: row.isCredit,
    fpCode: row.fpCode,
    fpName: row.fpName,
    prepaymentAmount: row.prepaymentAmount,
    cashAmount: row.cashAmount,
    creditAmount: row.creditAmount,
    deliveredAt: row.deliveredAt,
    needsDelivery: row.needsDelivery,
    canRefund: false,
    canReverse: false,
  };
}

export function financeApiError(err: unknown): string {
  const e = err as {
    statusMessage?: string;
    response?: { data?: { statusMessage?: string; message?: string } };
    message?: string;
  };
  return (
    e?.statusMessage ||
    e?.response?.data?.statusMessage ||
    e?.response?.data?.message ||
    e?.message ||
    'خطا در ارتباط با سرور'
  );
}
