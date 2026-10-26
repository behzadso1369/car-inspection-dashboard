export interface OrderByUserPick {
  userId: string;
  fullName: string;
  phoneNumber: string;
  orderCount: number;
}

export interface OrderByUserProfile {
  userId: string;
  fullName: string;
  phoneNumber: string;
  email: string | null;
  userType: string;
  phoneNumberConfirmed: boolean;
  createdOn: string;
  createdOnPersian: string;
}

export interface OrderByUserWalletTx {
  id?: number;
  type: number;
  typeTitle: string;
  amount: number;
  balanceAfter: number;
  orderId?: number | null;
  description?: string | null;
  createdOn?: string | null;
  createdOnPersian?: string | null;
}

export interface OrderByUserWallet {
  balance: number;
  hasWallet: boolean;
  transactions: OrderByUserWalletTx[];
}

export interface OrderByUserAddress {
  addressId?: number;
  title?: string | null;
  city?: string | null;
  street?: string | null;
  plaque?: string | null;
  lat?: number | null;
  lng?: number | null;
  text?: string | null;
}

export interface OrderByUserLocation {
  carInspectionLocationTypeId?: number;
  name?: string | null;
  description?: string | null;
  isOnSite?: boolean;
  additionalCost?: number | null;
  address?: OrderByUserAddress | null;
  displayAddress?: string | null;
}

export interface OrderByUserPayment {
  id: number;
  amount: number;
  gateway?: string | null;
  trackId?: string | null;
  refId?: string | null;
  cardNumber?: string | null;
  status: number;
  statusTitle?: string | null;
  paymentUrl?: string | null;
  paidAtPersian?: string | null;
}

export interface OrderByUserReportItem {
  status: number;
  title?: string | null;
  name?: string | null;
  nameFa?: string | null;
  question?: string | null;
  featureName?: string | null;
  groupName?: string | null;
  groupTitle?: string | null;
  note?: string | null;
  description?: string | null;
  code?: string | null;
}

export interface OrderByUserBodyZone {
  id?: number;
  code?: string | null;
  name?: string | null;
  nameFa?: string | null;
  status: number;
  viewGroup?: string | null;
  note?: string | null;
}

export interface OrderByUserReport {
  status?: string | null;
  imagePath?: string | null;
  inspectionSheetImagePath?: string | null;
  items?: OrderByUserReportItem[] | null;
  bodyZones?: OrderByUserBodyZone[] | null;
  summaryNote?: string | null;
}

export interface OrderByUserExpertAssignment {
  status: number;
  statusText: string;
  expertName?: string | null;
  expertPhone?: string | null;
}

export interface OrderByUserOrder {
  id: number;
  code?: string | null;
  createdOnPersian?: string | null;
  vehicleKind?: number | null;
  vehicleKindTitle?: string | null;
  carName?: string | null;
  motorcycleGroup?: {
    name?: string | null;
    imagePath?: string | null;
    motorcycleBrand?: { name?: string | null; imagePath?: string | null } | null;
  } | null;
  motorcycleInspectionType?: { name?: string | null } | string | null;
  inspectionType?: string | null;
  finalPrice?: number | null;
  price?: number | null;
  discount?: number | null;
  paymentStatusTitle?: string | null;
  flowStateTitle?: string | null;
  isComplete?: boolean;
  scheduledTime?: string | null;
  scheduledDate?: string | null;
  scheduledDatePersian?: string | null;
  location?: OrderByUserLocation | null;
  payments?: OrderByUserPayment[] | null;
  walletTransactions?: OrderByUserWalletTx[] | null;
  report?: OrderByUserReport | null;
  expertAssignment?: OrderByUserExpertAssignment | null;
}

export interface OrderByUserResult {
  needsUserPick: boolean;
  users?: OrderByUserPick[];
  user?: OrderByUserProfile | null;
  wallet?: OrderByUserWallet | null;
  orders?: OrderByUserOrder[];
  motorcycleOrders?: OrderByUserOrder[];
  motorcycleOrderCount?: number;
}
