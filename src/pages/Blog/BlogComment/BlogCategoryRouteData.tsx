
import BlogCategories from "./BlogComment";

export const RoutesData = [
  {
    path: 'list',
    component: BlogCategories,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  }
];
