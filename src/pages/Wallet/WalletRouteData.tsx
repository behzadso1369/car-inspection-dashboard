import WalletSettingsPage from './Settings/WalletSettings';
import WalletChargePlans from './Plans/WalletChargePlans';
import WalletUser from './Users/WalletUser';
import WalletTransactions from './Transactions/WalletTransactions';

export const RoutesData = [
  {
    path: 'settings',
    component: WalletSettingsPage,
    ID: 1,
    permission: ['admin', 'superAdmin'],
  },
  {
    path: 'plans',
    component: WalletChargePlans,
    ID: 2,
    permission: ['admin', 'superAdmin'],
  },
  {
    path: 'users',
    component: WalletUser,
    ID: 3,
    permission: ['admin', 'superAdmin'],
  },
  {
    path: 'transactions',
    component: WalletTransactions,
    ID: 4,
    permission: ['admin', 'superAdmin'],
  },
];
