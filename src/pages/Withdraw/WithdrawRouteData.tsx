import WithDrawDetail from "./WithDrawDetail";
import Withdraw from "./Withdraw";



export const RoutesData = [
  {
    path: '',
    component: Withdraw,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
  {
    path: 'detail/:id',
    component: WithDrawDetail,
    ID: 2,
    permission: ['MANAGER', 'SUPERVISE'],
  },
 
];
