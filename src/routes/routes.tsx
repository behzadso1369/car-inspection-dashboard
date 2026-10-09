

import HomeMainPage from '../pages/Home/HomeRoute';



import {
  faHouse,
  faCartArrowDown,
  faUser,
  faWallet,
  faCreditCard,
  faTruckRampBox,
  faUserTie,
  faFilter,
  faHeadset,

} from '@fortawesome/free-solid-svg-icons';
import UserRoute from '../pages/User/UserRoute';
import Role from '../pages/Role/Role';
import Slider from '../pages/Slider/Slider';
import BlogRoute from '../pages/Blog/BlogRoute';
import OrderReportRoute from '../pages/OrderReport/OrderRoute';
import CarInspectionService from '../pages/CarInspectionService/CarInspectionService';
import SecretOfOurServiceQuality from '../pages/SecretOfOurServiceQuality/SecretOfOurServiceQuality';
import WhyWe from '../pages/WhyWe/WhyWe';
import MasterSiteDetail from '../pages/MasterSiteDetail/MasterSiteDetail';
import FlowType from '../pages/FlowType/FlowType';
import FlowState from '../pages/FlowState/FlowState';
import FlowLifeCycle from '../pages/FlowLifeCycle/FlowLifeCycle';
import CarGroup from '../pages/CarGroup/CarGroup';
import CarBrand from '../pages/CarBrand/CarBrand';
import CarInspection from '../pages/CarInspection/CarInspection';
import CarInspectionDateType from '../pages/CarInspectionDateType/CarInspectionDateType';
import CarInspectionFeature from '../pages/CarInspectionFeature/CarInspectionFeature';
import CarInspectionLocation from '../pages/CarInspectionLocation/CarInspectionLocation';
import CarInspectionType from '../pages/CarInspectionType/CarInspectionType';
import DateAndTime from '../pages/DateAndTime/DateAndTime';
import { Children } from 'react';
import CarRoute from '../pages/Car/CarRoute';
import AboutUs from '../pages/AboutUs/AboutUs';
import AboutUsRoute from '../pages/AboutUs/AboutUsRoute';
import FinancialExpenditure from '../pages/FinancialExpenditure/FinancialExpenditure';
import FinanceUser from '../pages/FinanceUser/FinanceUser';
import Order from '../pages/Order/Order';
import SupportOrder from '../pages/SupportOrder/SupportOrder';
import SiteOrder from '../pages/SiteOrder/SiteOrder';
import OrderFunnel from '../pages/OrderFunnel/OrderFunnel';
import FAQRoute from '../pages/FAQ/FAQRoute';
import ExpertRoute from '../pages/Expert/ExpertRoute';
import WalletRoute from '../pages/Wallet/WalletRoute';


export const RoutesData = [
  {
    path: 'home',
    component: HomeMainPage,
    ID: 1,
    permission: ['admin', 'superAdmin', 'customer', 'marketing'],
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
          path: 'users/site-users/list',
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
    permission: ['admin', 'superAdmin', 'marketing'],
    title: "اسلایدها",
    icon: faUser,

  },
   {
    path: 'blog',
    component: BlogRoute,
    ID: 3,
    permission: ['admin', 'superAdmin', 'customer', 'marketing'],
    title: "بلاگ",
    icon: faTruckRampBox,
    children: [
      {
        path: 'blog/posts',
        permission: ['admin', 'superAdmin', 'customer', 'marketing'],
        ID: 1,
        title: "پست های بلاگ",
      },
    
      {
        path: 'blog/blog-categories',
        permission: ['admin', 'superAdmin', 'customer', 'marketing'],
        ID: 2,
        title: "دسته بندی بلاگ",
      },
      // {
      //   path: 'blog/blog-comments',
      //   permission: ['admin', 'superAdmin' ,'customer'],
      //   ID: 3,
      //   title: "کامنت های بلاگ",
      // },
      {
        path: 'blog/tags',
        permission: ['admin', 'superAdmin', 'customer', 'marketing'],
        ID: 4,
        title: "تگ های بلاگ",
      },
      {
        path: 'blog/post-tag',
        permission: ['admin', 'superAdmin', 'customer', 'marketing'],
        ID: 5,
        title: "تگ های پست بلاگ",
      },
      
    ],
  },
  {
    path: 'order-report',
    component: OrderReportRoute,
    ID: 4,
    permission: ['admin', 'superAdmin', 'customer', 'marketing'],
    title: "گزارش کارشناسی",
    icon: faTruckRampBox,
    children: [
      {
        path: 'order-report/list',
        permission: ['admin', 'superAdmin', 'customer', 'marketing'],
        ID: 1,
        title: "گزارش کارشناسی",
      },
    ],
  },
  {
  path: 'car-inspection',
  component: CarRoute,
  ID: 3,
  permission: ['admin', 'superAdmin', 'customer', 'marketing'],
  title: "کارشناسی خودرو",
  icon: faTruckRampBox,
  children: [
    {
      path: 'car-inspection/car-inspection-service/list',
      ID: 1,
      permission: ['admin', 'superAdmin', 'marketing'],
      title: "خدمات خودرویی",

  
    },
    {
      path: 'car-inspection/CarGroup/list',
      ID: 2,
      permission: ['admin', 'superAdmin', 'marketing'],
      title: "گروه خودرو",

  
    },
    {
      path: 'car-inspection/CarBrand/list',
      ID: 3,
      permission: ['admin', 'superAdmin', 'marketing'],
      title: "برند خودرو",

  
    },
    {
      path: 'car-inspection/CarInspection/list',
      ID: 4,
      permission: ['admin', 'superAdmin', 'marketing'],
      title: "کارشناسی خودرو",
  
    },
    {
      path: 'car-inspection/CarInspectionDateType/list',
      ID: 5,
      permission: ['admin', 'superAdmin', 'marketing'],
      title: "نوع تاریخ کارشناسی",
  
    },
    {
      path: 'car-inspection/CarInspectionFeature/list',
      ID: 6,
      permission: ['admin', 'superAdmin', 'marketing'],
      title: "ویژگیهای کارشناسی",
  
    },
    {
      path: 'car-inspection/CarInspectionType/list',
      ID: 8,
      permission: ['admin', 'superAdmin', 'marketing'],
      title: "نوع کارشناسی",
  
    },
    {
      path: 'car-inspection/CarInspectionLocation/list',
      ID: 9,
      permission: ['admin', 'superAdmin', 'marketing'],
      title: "مکان کارشناسی",
  
    },
  ]

},
  {
    path: 'expert',
    component: ExpertRoute,
    ID: 6,
    permission: ['admin', 'superAdmin', 'expert', 'marketing'],
    title: 'کارشناسان',
    icon: faUserTie,
    children: [
      {
        path: 'expert/list',
        permission: ['admin', 'superAdmin', 'expert', 'marketing'],
        ID: 1,
        title: 'تعریف کارشناسان',
      },
      {
        path: 'expert/assignment',
        permission: ['admin', 'superAdmin', 'expert', 'marketing'],
        ID: 2,
        title: 'تخصیص کارشناس',
      },
      {
        path: 'expert/earnings',
        permission: ['admin', 'superAdmin', 'marketing'],
        ID: 3,
        title: 'درآمد کارشناسان',
      },
    ],
  },

  {
    path: 'secretOfOurServicequality/list',
    component: SecretOfOurServiceQuality,
    ID: 2,
    permission: ['admin', 'superAdmin', 'marketing'],
    title: "راز خدمات ما",
    icon: faUser,

  },
  {
    path: 'ٌwhy-we/list',
    component: WhyWe,
    ID: 2,
    permission: ['admin', 'superAdmin', 'marketing'],
    title: "چرا ما",
    icon: faUser,

  },
 
  {
    path: 'about-us',
    component: AboutUsRoute,
    ID: 2,
    permission: ['admin', 'superAdmin', 'marketing'],
    title: "درباره ما",
    icon: faUser

  },
  {
    path: 'MasterSiteDetail/list',
    component: MasterSiteDetail,
    ID: 2,
    permission: ['admin', 'superAdmin', 'marketing'],
    title: "اطلاعات سایت",
    icon: faUser,

  },
  {
    path: 'support-order',
    component: SupportOrder,
    ID: 21,
    permission: ['admin', 'superAdmin'],
    title: 'سفارش تلفنی پشتیبانی',
    icon: faHeadset,
  },
  {
    path: 'Order/list',
    component: Order,
    ID: 2,
    permission: ['admin', 'superAdmin'],
    title: 'سفارشات پشتیبان',
    icon: faUser,

  },
  {
    path: 'SiteOrder/list',
    component: SiteOrder,
    ID: 2,
    permission: ['admin', 'superAdmin', 'marketing'],
    title: "سفارش   های سایت",
    icon: faUser,

  },
  {
    path: 'order-funnel',
    component: OrderFunnel,
    ID: 8,
    permission: ['admin', 'superAdmin', 'marketing'],
    title: 'گزارش قیف سفارش',
    icon: faFilter,
  },
  {
    path: 'wallet',
    component: WalletRoute,
    ID: 9,
    permission: ['admin', 'superAdmin'],
    title: 'کیف‌پول',
    icon: faWallet,
    children: [
      {
        path: 'wallet/settings',
        permission: ['admin', 'superAdmin'],
        ID: 1,
        title: 'تنظیمات هدیه',
      },
      {
        path: 'wallet/plans',
        permission: ['admin', 'superAdmin'],
        ID: 2,
        title: 'پلن‌های شارژ',
      },
      {
        path: 'wallet/users',
        permission: ['admin', 'superAdmin'],
        ID: 3,
        title: 'موجودی کاربر',
      },
      {
        path: 'wallet/transactions',
        permission: ['admin', 'superAdmin'],
        ID: 4,
        title: 'تراکنش‌ها',
      },
    ],
  },
 
    

  {
    path: 'faq',
    component: FAQRoute,
    ID: 5,
    permission: ['admin', 'superAdmin', 'marketing'],
    title: 'سوالات متداول',
    icon: faUser,
    children: [
      {
        path: 'faq/categories',
        permission: ['admin', 'superAdmin', 'marketing'],
        ID: 1,
        title: 'دسته بندی سوالات',
      },
      {
        path: 'faq/list',
        permission: ['admin', 'superAdmin', 'marketing'],
        ID: 2,
        title: 'سوالات متداول',
      },
    ],
  },
  {
    path: 'FlowType/list',
    component: FlowType,
    ID: 2,
    permission: ['admin', 'superAdmin'],
    title: "نوع فرآیند",
    icon: faUser,

  },
  {
    path: 'FlowState/list',
    component: FlowState,
    ID: 2,
    permission: ['admin', 'superAdmin'],
    title: "مرحله فرآیند",
    icon: faUser,

  },
  {
    path: 'FlowLifeCycle/list',
    component: FlowLifeCycle,
    ID: 2,
    permission: ['admin', 'superAdmin'],
    title: "چرخه فرآیند ساز",
    icon: faUser,

  },
  {
    path: 'FinancialExpenditure/list',
    component: FinancialExpenditure,
    ID: 3,
    permission: ['admin', 'superAdmin'],
    title: "خرجکرد مالی",
    icon: faUser,

  },
  {
    path: 'FinanceUser/list',
    component: FinanceUser,
    ID: 12,
    permission: ['admin', 'superAdmin'],
    title: 'کاربران مالی',
    icon: faCreditCard,
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
