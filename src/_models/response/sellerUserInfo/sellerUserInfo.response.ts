export type SalesSmsStatus = 'sent' | 'skipped' | 'failed' | null | string;

export interface SellerUserInfoItem {
  id: number;
  rowNumber?: number | null;
  car?: string | null;
  price?: number | null;
  mileage?: number | null;
  model?: string | null;
  neighborhood?: string | null;
  phone?: string | null;
  adUrl?: string | null;
  description?: string | null;
  callResult?: string | null;
  isDealer: boolean;
  salesSmsStatus?: SalesSmsStatus;
  salesSmsSentAt?: string | null;
  salesSmsError?: string | null;
  createdOn: string;
  updatedOn?: string | null;
}

export interface SellerUserInfoUpsertBody {
  rowNumber?: number | null;
  car?: string | null;
  price?: number | null;
  mileage?: number | null;
  model?: string | null;
  neighborhood?: string | null;
  phone?: string | null;
  adUrl?: string | null;
  description?: string | null;
  callResult?: string | null;
  isDealer?: boolean;
}

export interface SellerUserInfoUpsertResult {
  inserted: number;
  updated: number;
  items: SellerUserInfoItem[];
}
