export interface WalletSettings {
  id: number;
  giftAmountPerOrder: number;
  isGiftEnabled: boolean;
  allowWalletPayment: boolean;
  createdOn?: string | null;
  updatedOn?: string | null;
  isDeleted?: boolean;
}

export interface WalletSettingsUpdate {
  giftAmountPerOrder: number;
  isGiftEnabled: boolean;
  allowWalletPayment: boolean;
}

export interface WalletBalance {
  userId: string;
  balance: number;
  walletId: number;
}

export interface WalletTransaction {
  id: number;
  type: 1 | 2 | 3 | 4 | 5;
  typeTitle: string;
  amount: number;
  balanceAfter: number;
  orderId: number | null;
  description: string | null;
  createdOn: string;
}

export interface WalletChargePlan {
  id: number;
  title: string;
  description: string | null;
  payAmount: number;
  creditAmount: number;
  sortOrder: number;
  isActive: boolean;
}

export interface WalletChargePlanPayload {
  title: string;
  description: string | null;
  payAmount: number;
  creditAmount: number;
  sortOrder: number;
  isActive: boolean;
}

export interface WalletAdjustPayload {
  userId: string;
  amount: number;
  description: string;
}
