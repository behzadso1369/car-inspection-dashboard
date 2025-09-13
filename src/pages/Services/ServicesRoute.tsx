import { Route, Routes } from 'react-router-dom';
import {
  RoutesData,
} from './ServceisRouteData';
import ServiceLayout from './ServiceLayout';



const ServicesRoute: React.FunctionComponent = () => {
  return (
    <Routes>
      {RoutesData.map((item: any) => (
        <Route
          key={item.ID}
          path={item.path}
          element={
            <ServiceLayout>
              <item.component />
            </ServiceLayout>
          }
        />
      ))}
    
    </Routes>
  );
};

export default ServicesRoute;
