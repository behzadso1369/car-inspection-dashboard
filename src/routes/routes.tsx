

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
    path: 'secretOfOurServicequality/list',
    component: SecretOfOurServiceQuality,
    ID: 2,
    permission: ['admin', 'superAdmin'],
    title: "راز خدمات ما",
    icon: faUser,

  },
  {
    path: 'ٌwhy-we/list',
    component: WhyWe,
    ID: 2,
    permission: ['admin', 'superAdmin'],
    title: "چرا ما",
    icon: faUser,

  },
  {
    path: 'MasterSiteDetail/list',
    component: MasterSiteDetail,
    ID: 2,
    permission: ['admin', 'superAdmin'],
    title: "اطلاعات سایت",
    icon: faUser,

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
    path: 'CarGroup/list',
    component: CarGroup,
    ID: 2,
    permission: ['admin', 'superAdmin'],
    title: "گروه خودرو",
    icon: faUser,

  },
  {
    path: 'CarBrand/list',
    component: CarBrand,
    ID: 2,
    permission: ['admin', 'superAdmin'],
    title: "برند خودرو",
    icon: faUser,

  },
  {
    path: 'CarInspection/list',
    component: CarInspection,
    ID: 2,
    permission: ['admin', 'superAdmin'],
    title: "کارشناسی خودرو",
    icon: faUser,

  },
  {
    path: 'CarInspectionDateType/list',
    component: CarInspectionDateType,
    ID: 2,
    permission: ['admin', 'superAdmin'],
    title: "نوع تاریخ کارشناسی",
    icon: faUser,

  },
  {
    path: 'CarInspectionFeature/list',
    component: CarInspectionFeature,
    ID: 2,
    permission: ['admin', 'superAdmin'],
    title: "ویژگیهای کارشناسی",
    icon: faUser,

  },
  {
    path: 'CarInspectionLocation/list',
    component: CarInspectionLocation,
    ID: 2,
    permission: ['admin', 'superAdmin'],
    title: "مکان کارشناسی",
    icon: faUser,

  },
  {
    path: 'CarInspectionType/list',
    component: CarInspectionType,
    ID: 2,
    permission: ['admin', 'superAdmin'],
    title: "نوع کارشناسی",
    icon: faUser,

  },
  {
    path: 'CarInspectionLocation/list',
    component: CarInspectionLocation,
    ID: 2,
    permission: ['admin', 'superAdmin'],
    title: "مکان کارشناسی",
    icon: faUser,

  },
  {
    path: 'DateAndTime/list',
    component: DateAndTime,
    ID: 2,
    permission: ['admin', 'superAdmin'],
    title: "تاریخ و زمان",
    icon: faUser,

  },
  {
    path: 'FlowType/list',
    component: FlowType,
    ID: 2,
    permission: ['admin', 'superAdmin'],
    title: "نوع چرخه",
    icon: faUser,

  },
  {
    path: 'FlowState/list',
    component: FlowState,
    ID: 2,
    permission: ['admin', 'superAdmin'],
    title: "وضعیت چرخه",
    icon: faUser,

  },
  {
    path: 'FlowLifeCycle/list',
    component: FlowLifeCycle,
    ID: 2,
    permission: ['admin', 'superAdmin'],
    title: "چرخه فرآیند",
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
