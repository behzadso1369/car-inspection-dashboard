import OrderReport from "./OrderReport";
import CreateOrderReport from "./CreateOrderReport";
import EditOrderReport from "./EditOrderReport";

export const RoutesData = [
  {
    path: 'list',
    component: OrderReport,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
  {
    path: 'create',
    component: CreateOrderReport,
    ID: 2,
    permission: ['MANAGER', 'SUPERVISE'],
  },
  {
    path: 'edit',
    component: EditOrderReport,
    ID: 3,
    permission: ['MANAGER', 'SUPERVISE'],
  },
];

