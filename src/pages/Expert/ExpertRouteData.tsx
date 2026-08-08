import Experts from './Experts/Experts';
import UnassignedOrders from './Assignment/UnassignedOrders';
import ExpertEarnings from './Earnings/ExpertEarnings';

export const RoutesData = [
  {
    path: 'list',
    component: Experts,
    ID: 1,
    permission: ['admin', 'superAdmin'],
  },
  {
    path: 'assignment',
    component: UnassignedOrders,
    ID: 2,
    permission: ['admin', 'superAdmin'],
  },
  {
    path: 'earnings',
    component: ExpertEarnings,
    ID: 3,
    permission: ['admin', 'superAdmin'],
  },
];
