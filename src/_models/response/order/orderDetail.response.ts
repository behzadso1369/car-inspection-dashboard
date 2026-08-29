export interface OrderDetailAddress {
  userId?: string;
  title?: string;
  city?: string;
  lat?: number | null;
  lng?: number | null;
  street?: string;
  plaque?: string;
  isActive?: boolean;
  id?: number;
}

export interface OrderDetailFlowType {
  name?: string;
  title?: string;
  id?: number;
}

export interface OrderDetailFlowState {
  flowTypeId?: number;
  flowTypeName?: string;
  flowType?: OrderDetailFlowType | null;
  name?: string;
  title?: string;
  id?: number;
}

export interface OrderDetailCarBrand {
  name?: string;
  englishName?: string;
  imagePath?: string | null;
  id?: number;
}

export interface OrderDetailCarGroup {
  carBrandId?: number;
  carBrand?: OrderDetailCarBrand | null;
  name?: string;
  englishName?: string;
  imagePath?: string | null;
  carModelId?: number;
  id?: number;
}

export interface OrderDetailInspectionType {
  name?: string;
  additionalCost?: number;
  inspectionTypeDescription?: string;
  id?: number;
}

export interface OrderDetailCarInspection {
  marketPrice?: number;
  ourPrice?: number;
  carGroupId?: number;
  carGroup?: OrderDetailCarGroup | null;
  carInspectionTypeId?: number;
  carInspectionType?: OrderDetailInspectionType | null;
  id?: number;
}

export interface OrderDetailDateType {
  name?: string;
  maxMinutes?: number | null;
  additionalCost?: number;
  inspectionTypeDescription?: string;
  id?: number;
}

export interface OrderDetailLocationType {
  name?: string;
  locationTypeDescription?: string;
  isOnSite?: boolean;
  additionalCost?: number;
  id?: number;
}

export interface OrderDetailExpert {
  phoneNumber?: string;
  fullName?: string;
  nationalCode?: string;
  avatarPath?: string | null;
  baseCity?: string;
  baseLat?: number | null;
  baseLng?: number | null;
  isActive?: boolean;
  isPhoneVerified?: boolean;
  dutyStatus?: number;
  avgRating?: number | null;
  payoutType?: number;
  commissionPercent?: number | null;
  fixedAmountPerOrder?: number | null;
  id?: number;
}

export interface OrderDetailResponse {
  userId?: string;
  addressId?: number;
  address?: OrderDetailAddress | null;
  flowStateId?: number;
  flowState?: OrderDetailFlowState | null;
  carGroupId?: number;
  carGroup?: OrderDetailCarGroup | null;
  carInspectionId?: number;
  carInspection?: OrderDetailCarInspection | null;
  carInspectionTypeId?: number;
  carInspectionType?: OrderDetailInspectionType | null;
  carInspectionDateTypeId?: number;
  carInspectionDateType?: OrderDetailDateType | null;
  carInspectionLocationTypeId?: number;
  carInspectionLocationType?: OrderDetailLocationType | null;
  scheduledDate?: string | null;
  scheduledTime?: string | null;
  price?: number | null;
  discount?: number | null;
  imagePath?: string | null;
  code?: string | null;
  isUsedCode?: boolean | null;
  discountId?: number | null;
  discountEntity?: unknown;
  paymentStatus?: number | null;
  paymentStatusTitle?: string | null;
  expertId?: number | null;
  expert?: OrderDetailExpert | null;
  expertAssignedAt?: string | null;
  id?: number;
  createdOn?: string | null;
  updatedOn?: string | null;
  isDeleted?: boolean;
}
