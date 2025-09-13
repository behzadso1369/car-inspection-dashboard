import CompalaintMain from "./Complaint";
import ComplaintDetail from "./ComplaintDetail";
import CreateComplaint from "./CreateComplaint";

export const RoutesData = [
  {
    path: '',
    component: CompalaintMain,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
  {
    path: 'complaint-list',
    component: CompalaintMain,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
  {
    path: 'complaint-list/:id',
    component: ComplaintDetail,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
  {
    path: 'create-complaint',
    component: CreateComplaint,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
  {
    path: ':id',
    component: ComplaintDetail,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
 
];
