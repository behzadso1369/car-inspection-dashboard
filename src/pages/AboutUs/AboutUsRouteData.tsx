import AboutUs from "./AboutUs";
import CreateAboutUs from "./CreateAboutUs";
import EditAboutUs from "./EditAboutUs";



export const AboutUsRouteData = [
  {
    path: '',
    component: AboutUs,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
  {
    path: 'create',
    component: CreateAboutUs,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
  {
    path: '/:id',
    component: EditAboutUs,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
 

];
