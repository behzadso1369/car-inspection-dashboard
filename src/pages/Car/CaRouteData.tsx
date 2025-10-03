import CarBrand from "../CarBrand/CarBrand";
import CarGroup from "../CarGroup/CarGroup";
import CarInspection from "../CarInspection/CarInspection";
import CarInspectionDateType from "../CarInspectionDateType/CarInspectionDateType";
import CarInspectionFeature from "../CarInspectionFeature/CarInspectionFeature";
import CarInspectionLocation from "../CarInspectionLocation/CarInspectionLocation";
import CarInspectionService from "../CarInspectionService/CarInspectionService";
import CarInspectionType from "../CarInspectionType/CarInspectionType";



export const RoutesData = [
  {
    path: 'car-inspection-service/list',
    component: CarInspectionService,
    ID: 2,
    permission: ['admin', 'superAdmin'],


  },
  {
    path: 'CarGroup/list',
    component: CarGroup,
    ID: 2,
    permission: ['admin', 'superAdmin'],
   

  },
  {
    path: 'CarBrand/list',
    component: CarBrand,
    ID: 2,
    permission: ['admin', 'superAdmin'],
 

  },
  {
    path: 'CarInspection/list',
    component: CarInspection,
    ID: 2,
    permission: ['admin', 'superAdmin'],

  },
  {
    path: 'CarInspectionDateType/list',
    component: CarInspectionDateType,
    ID: 2,
    permission: ['admin', 'superAdmin'],


  },
  {
    path: 'CarInspectionFeature/list',
    component: CarInspectionFeature,
    ID: 2,
    permission: ['admin', 'superAdmin'],


  },
  {
    path: 'CarInspectionLocation/list',
    component: CarInspectionLocation,
    ID: 2,
    permission: ['admin', 'superAdmin'],


  },
  {
    path: 'CarInspectionType/list',
    component: CarInspectionType,
    ID: 2,
    permission: ['admin', 'superAdmin'],


  },
  {
    path: 'CarInspectionLocation/list',
    component: CarInspectionLocation,
    ID: 2,
    permission: ['admin', 'superAdmin'],
  

  },
  

];
