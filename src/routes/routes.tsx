

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
import BlogRoute from '../pages/Blog/BlogRoute';
import CarInspectionService from '../pages/CarInspectionService/CarInspectionService';
import SecretOfOurServiceQuality from '../pages/SecretOfOurServiceQuality/SecretOfOurServiceQuality';


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
   {
    path: 'blog',
    component: BlogRoute,
    ID: 3,
    permission: ['admin', 'superAdmin' ,'customer'],
    title: "بلاگ",
    icon: faTruckRampBox,
    children: [
      {
        path: 'blog/posts',
        permission: ['admin', 'superAdmin' ,'customer'],
        ID: 1,
        title: "پست های بلاگ",
      },
    
      {
        path: 'blog/blog-categories',
        permission: ['admin', 'superAdmin' ,'customer'],
        ID: 2,
        title: "دسته بندی بلاگ",
      },
      {
        path: 'blog/blog-comments',
        permission: ['admin', 'superAdmin' ,'customer'],
        ID: 3,
        title: "کامنت های بلاگ",
      },
      {
        path: 'blog/tags',
        permission: ['admin', 'superAdmin' ,'customer'],
        ID: 4,
        title: "تگ های بلاگ",
      },
      {
        path: 'blog/post-tag',
        permission: ['admin', 'superAdmin' ,'customer'],
        ID: 5,
        title: "تگ های پست بلاگ",
      },
      
    ],
  },
  {
    path: 'car-inspection-service/list',
    component: CarInspectionService,
    ID: 2,
    permission: ['admin', 'superAdmin'],
    title: "خدمات خودرویی",
    icon: faUser,

  },
  {
    path: 'secretOfOurServicequality/list',
    component: SecretOfOurServiceQuality,
    ID: 2,
    permission: ['admin', 'superAdmin'],
    title: "راز خدمات ما",
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
