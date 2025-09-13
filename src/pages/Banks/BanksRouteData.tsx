import BankAccountDetail from "./BankAccountDetail";
import BankAccounts from "./BankAccounts";

export const RoutesData = [
  {
    path: '',
    component: BankAccounts,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
  {
    path: 'detail/:id',
    component: BankAccountDetail,
    ID: 2,
    permission: ['MANAGER', 'SUPERVISE'],
  },
 
];
