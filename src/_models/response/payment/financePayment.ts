import { AdminPayment, PaymentGateway } from './adminPayment';

export interface FinancePaymentRow {
  paymentId: number;
  vehicleKind: 1 | 2;
  vehicleKindTitle: string;
  orderId: number;
  orderCode: string | null;
  amount: number;
  baseAmount?: number | null;
  surchargePercent?: number | null;
  surchargeAmount?: number | null;
  gateway: PaymentGateway;
  gatewayTitle: string;
  trackId: string | null;
  providerId: string | null;
  ticket: string | null;
  ticketType: number | null;
  ticketTypeTitle: string | null;
  isCredit: boolean | null;
  fpCode: string | null;
  fpName: string | null;
  prepaymentAmount: number | null;
  cashAmount: number | null;
  creditAmount: number | null;
  deliveredAt: string | null;
  needsDelivery: boolean | null;
  status: number;
  statusTitle: string;
  paidAt: string | null;
  paidAtPersian?: string | null;
  userFullName: string | null;
  userPhone: string | null;
}

export interface FinanceOrderDetailResult {
  order?: Record<string, unknown> | null;
  vehicleKind?: number | null;
  vehicleKindTitle?: string | null;
  user?: {
    userId?: string;
    userName?: string;
    userPhone?: string;
  } | null;
  payments?: AdminPayment[];
}
