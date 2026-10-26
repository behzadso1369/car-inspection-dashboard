export interface FunnelStage {
  title: string;
  orderCount: number;
  uniqueUserCount: number;
  percentOfTotal: number;
}

export interface FunnelNamedCount {
  id: number | null;
  name: string;
  count: number;
  percentOfStage: number;
}

export interface PaymentFunnel {
  gatewayVisits: number;
  uniqueUsersAtGateway: number;
  percentOfTotal: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
}

export interface OrderFunnelReport {
  fromDate: string | null;
  toDate: string | null;
  totalOrders: number;
  carOrderCount?: number;
  motorcycleOrderCount?: number;
  uniqueUsers: number;
  stage1_SelectVehicle: FunnelStage;
  topVehicles: FunnelNamedCount[];
  stage2_InspectionType: FunnelStage;
  topInspectionTypes: FunnelNamedCount[];
  stage3_Location: FunnelStage;
  topLocations: FunnelNamedCount[];
  stage4_Schedule: FunnelStage;
  topHours: FunnelNamedCount[];
  leastHours: FunnelNamedCount[];
  stage5_Finalize: FunnelStage;
  payment: PaymentFunnel;
}

export interface FunnelDisplayStep {
  key: string;
  step: number;
  title: string;
  criterion: string;
  orderCount: number;
  uniqueUserCount?: number;
  percentOfTotal: number;
}
