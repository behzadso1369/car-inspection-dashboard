
import BuyOrder from './BuyOrder';
import CreateOrder from './CreateOrder/CreateOrder';
import Order from './IncomingRequest/RecieveOrder';
import OrderDetail from './OrderDetail';
import PendingOrder from './PendingOrder';
import SellOrder from './SellOrder';
import SuspendedOrder from './SuspendedOrder';




export const RoutesData = [
  {
    path: 'create-order',
    component: CreateOrder,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
  {
    path: 'detail/:id',
    component: OrderDetail,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
  {
    path: 'pending-payment',
    component: PendingOrder,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
  {
    path: 'suspended',
    component: SuspendedOrder,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
  {
    path: 'list',
    component: Order,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
  {
    path: 'sell',
    component: SellOrder,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
  {
    path: 'buy',
    component: BuyOrder,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
 
];
