import FAQCategories from './FAQCategories/FAQCategories';
import FAQ from './FAQ/FAQ';

export const RoutesData = [
  {
    path: 'categories',
    component: FAQCategories,
    ID: 1,
    permission: ['admin', 'superAdmin'],
  },
  {
    path: 'list',
    component: FAQ,
    ID: 2,
    permission: ['admin', 'superAdmin'],
  },
];
