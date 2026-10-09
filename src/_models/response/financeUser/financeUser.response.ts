export interface FinanceUser {
  id: number;
  phoneNumber: string;
  fullName: string;
  isActive: boolean;
  isPhoneVerified: boolean;
  createdOn: string;
  updatedOn: string | null;
  isDeleted: boolean;
}
