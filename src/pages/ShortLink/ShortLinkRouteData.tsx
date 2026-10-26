import ShortLinkList from './ShortLinkList';
import ShortLinkCreate from './ShortLinkCreate';
import ShortLinkBulk from './ShortLinkBulk';
import ShortLinkCampaigns from './ShortLinkCampaigns';
import ShortLinkFlow from './ShortLinkFlow';

export const RoutesData = [
  {
    path: 'list',
    component: ShortLinkList,
    ID: 1,
    permission: ['admin', 'superAdmin', 'marketing'],
  },
  {
    path: 'create',
    component: ShortLinkCreate,
    ID: 2,
    permission: ['admin', 'superAdmin', 'marketing'],
  },
  {
    path: 'bulk',
    component: ShortLinkBulk,
    ID: 3,
    permission: ['admin', 'superAdmin', 'marketing'],
  },
  {
    path: 'campaigns',
    component: ShortLinkCampaigns,
    ID: 4,
    permission: ['admin', 'superAdmin', 'marketing'],
  },
  {
    path: 'flow',
    component: ShortLinkFlow,
    ID: 5,
    permission: ['admin', 'superAdmin', 'marketing'],
  },
];
