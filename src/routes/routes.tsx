

import HomeMainPage from '../pages/Home/HomeRoute';

import OrderRoute from '../pages/Order/OrderRoute';

import {
  faHouse,
  faCartArrowDown,
  faUser,
  faWallet,
  faCreditCard,
  faTruckRampBox
 

} from '@fortawesome/free-solid-svg-icons';
import UserRoute from '../pages/User/UserRoute';

import ServicesRoute from '../pages/Services/ServicesRoute';
import BankRoute from '../pages/Banks/BankRoutes';

import TransactionRoute from '../pages/Transactions/TransactionRoute';
import WithdrawRoute from '../pages/Withdraw/WithdrawRoute';
import RoleRoute from '../pages/Role/RoleRoute';
import Role from '../pages/Role/Role';
import Slider from '../pages/Slider/Slider';


export const RoutesData = [
  {
    path: 'home',
    component: HomeMainPage,
    ID: 1,
    permission: ['admin', 'superAdmin','customer'],
    title: "داشبورد",
    icon: faHouse,
  },
  {
    path: 'users',
    component: UserRoute,
    ID: 2,
    permission: ['admin', 'superAdmin'],
    title: "کاربران",
    icon: faUser,
    
    children: [
      
        {
          path: 'users/list',
          permission: ['admin', 'superAdmin' ,'customer'],
          ID: 1,
          title: "کاربران ادمین",
        },
        {
          path: 'site-users/list',
          permission: ['admin', 'superAdmin' ,'customer'],
          ID: 2,
          title: "کاربران سایت",
        },
        
    ],

  },
  {
    path: 'roles/list',
    component: Role,
    ID: 2,
    permission: ['admin', 'superAdmin'],
    title: "نقش ها",
    icon: faUser,

  },
  {
    path: 'slides/list',
    component: Slider,
    ID: 2,
    permission: ['admin', 'superAdmin'],
    title: "اسلایدها",
    icon: faUser,

  },
  // {
  //   path: 'services',
  //   component: ServicesRoute,
  //   ID: 3,
  //   permission: ['admin', 'superAdmin' ,'customer'],
  //   title: "سرویس ها",
  //   icon: faTruckRampBox,
  //   children: [
  //     {
  //       path: 'services/list',
  //       permission: ['admin', 'superAdmin' ,'customer'],
  //       ID: 1,
  //       title: "لیست سرویس ها",
  //     }
  //   ],
  // },
  
  // {
  //   path: 'order',
  //   component: OrderRoute,
  //   ID: 4,
  //   permission: ['admin', 'superAdmin' ,'customer'],
  //   title: "سفارشات",
  //   icon: faCartArrowDown,
  //   children: [
     
  //     {
  //       path: 'order/list',
  //       permission: ['admin', 'superAdmin' ,'customer'],
  //       ID: 1,
  //       title: "کل سفارشات ",
  //     },
  //     {
  //       path: 'order/sell',
  //       permission: ['admin', 'superAdmin' ,'customer'],
  //       ID: 1,
  //       title: "سفارشات فروش",
  //     },
  //     {
  //       path: 'order/buy',
  //       permission: ['admin', 'superAdmin' ,'customer'],
  //       ID: 1,
  //       title: "سفارشات خرید",
  //     },
      
      
  //   ],
  // },
  // {
  //   path: 'transactions',
  //   component: TransactionRoute,
  //   ID: 5,
  //   permission: ['admin', 'superAdmin' ,'customer'],
  //   title: "تراکنش ها",
  //   icon: faWallet
  // },
  // {
  //   path: 'withdraw',
  //   component: WithdrawRoute,
  //   ID: 6,
  //   permission: ['admin', 'superAdmin' ,'customer'],
  //   title: "درخواست برداشت",
  //   icon: faWallet
  // },
  // {
  //   path: 'bank',
  //   component: BankRoute,
  //   ID: 7,
  //   permission: ['admin', 'superAdmin' ,'customer'],
  //   title: "حساب های بانکی",
  //   icon: faCreditCard
  // }
];
