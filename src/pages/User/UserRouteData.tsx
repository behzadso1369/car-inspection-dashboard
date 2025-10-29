
import SiteUser from "./SiteUser";
import User from "./User";
import UserDetail from "./UserDetail";

export const RoutesData = [
  {
    path: 'list',
    component: User,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
  {
    path: 'site-users/list',
    component: SiteUser,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
 
  {
    path: 'detail/:id',
    component: UserDetail,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
  
];
