export type PaymentGateway = 'Digipay' | 'Zibal' | string;

export type TicketTypeTitle = 'IPG' | 'CREDIT' | 'WALLET' | 'BNPL' | 'CREDIT-CARD' | string;

export interface AdminPayment {
  id: number;
  amount: number;
  baseAmount?: number | null;
  surchargePercent?: number | null;
  surchargeAmount?: number | null;
  gateway?: PaymentGateway | null;
  gatewayTitle?: string | null;
  trackId?: string | null;
  refId?: string | null;
  cardNumber?: string | null;
  description?: string | null;
  status: number;
  statusTitle?: string | null;
  paymentUrl?: string | null;
  paidAt?: string | null;
  paidAtPersian?: string | null;
  verifiedAt?: string | null;
  createdOn?: string | null;
  type?: number | null;
  motorcycleOrderId?: number | null;
  orderId?: number | null;
  providerId?: string | null;
  ticket?: string | null;
  ticketType?: number | null;
  ticketTypeTitle?: TicketTypeTitle | null;
  isCredit?: boolean | null;
  fpCode?: string | null;
  fpName?: string | null;
  prepaymentAmount?: number | null;
  cashAmount?: number | null;
  creditAmount?: number | null;
  deliveredAt?: string | null;
  needsDelivery?: boolean | null;
  canRefund?: boolean | null;
  canReverse?: boolean | null;
}
