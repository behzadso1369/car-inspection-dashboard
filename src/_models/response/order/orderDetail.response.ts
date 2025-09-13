export interface OrderDetailResponse {
  collectorFullName: string;
  createdAt: string;
  customerAddress: string;
  customerFullName: string;
  customerPhoneNumber: string;
  customerUniqueCode: string;
  dspanelSocketSent: boolean;
  hastiOrderCode: string;
  id: number;
  lastModifiedAt: string;
  orderItemHots: OrderItemHots[];
  pdasocketSent: boolean;
  stateEnumId: number;
  storeId: number;
  typeEnumId: number;
  vendorComment: string;
  vendorId: number;
  vendorOrderCode: string;
  vendorOrderDate: string;
  vendorTotalDiscount: number;
  vendorTotalPrice: number;
}

interface OrderItemHots {
  alternative: string;
  createdAt: string;
  id: number;
  itemStateEnumId: number;
  lastModifiedAt: string;
  masterBarcode: string;
  orderId: number;
  product: {
    id: number;
    isVisible: boolean;
    lastSynced: string;
    productName: string;
  };
  quantity: number;
  vendorDiscount: number;
  vendorUnitPrice: number;
  vendorVat: number;
}
