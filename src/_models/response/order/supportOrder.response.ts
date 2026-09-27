export interface SupportOrderCreated {
  orderId: number;
  userId: string;
  fullName: string;
  phoneNumber: string;
}

export interface SupportMoveResult {
  isEndFlow: boolean;
  orderId: number;
  discountCode: string | null;
  price: number;
  discount: number;
  finalPrice: number;
  paymentUrl: string | null;
  trackId: number | null;
  paymentId: number | null;
  requiresPayment: boolean;
  paidFullyByWallet: boolean;
  walletAmountUsed: number;
  gatewayAmount: number;
  smsSent: boolean;
}

export interface CarSearchHit {
  id: number;
  name: string;
  image: string;
  isBrand: boolean;
}

export interface CarGroupOption {
  id: number;
  name: string;
  image: string;
}

export interface InspectionOption {
  id: number;
  typeId: number;
  name: string;
  price: number;
  features: string[];
}

export interface LocationOption {
  id: number;
  name: string;
  description: string;
  onSite: boolean;
}

export interface DateTypeOption {
  id: number;
  name: string;
  description: string;
  extraCost: number;
  maxMinutes: number | null;
}

export interface HourOption {
  display: string;
  disabled: boolean;
  extraCost: number;
}

export interface DayOption {
  id: number;
  title: string;
  date: string;
  closed: boolean;
  holidayTitle: string;
  hours: HourOption[];
}
