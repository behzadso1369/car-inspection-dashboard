import ServiceDetail from "./ServiceDetail";
import SystemService from "./ServiceSystem";
import Services from "./Services";

export const RoutesData = [
  {
    path: 'list',
    component: Services,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
  {
    path: 'system',
    component: SystemService,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
  {
    path: 'detail/:id',
    component: ServiceDetail,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
 
];
