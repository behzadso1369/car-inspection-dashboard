import Transaction from "./Transaction";
import TransactionDetail from "./TransactionDetail";


export const RoutesData = [
  {
    path: '',
    component: Transaction,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
  {
    path: 'detail/:id',
    component: TransactionDetail,
    ID: 2,
    permission: ['MANAGER', 'SUPERVISE'],
  },
 
];
