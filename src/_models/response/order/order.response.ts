export interface OrderResponse {
  id: number;
  vendorId: number;
  storeId: number;
  stateEnumId: number;
  customerFullName: string;
  customerPhoneNumber: string;
  customerUniqueCode: string;
  customerAddress: string;
  hastiOrderCode: string;
  vendorOrderCode: string;
  vendorTotalPrice: number;
  vendorTotalDiscount: number;
  vendorOrderDate: string;
  typeEnumId: number;
  vendorComment: string;
  pdasocketSent: boolean;
  dspanelSocketSent: boolean;
  createdAt: string;
  lastModifiedAt: null;
  orderItemHots: [];
}
