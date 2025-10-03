import { Route, Routes } from 'react-router-dom';
import {
  RoutesData,
} from './CaRouteData';
import CarLayout from './CarLayout';


const CarRoute: React.FunctionComponent = () => {
  return (
    <Routes>
      {RoutesData.map((item: any) => (
        <Route
          key={item.ID}
          path={item.path}
          element={
            <CarLayout>
              <item.component />
            </CarLayout>
          }
        />
      ))}
    
    </Routes>
  );
};

export default CarRoute;
