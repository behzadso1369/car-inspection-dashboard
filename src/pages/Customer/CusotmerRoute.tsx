import { Route, Routes } from 'react-router-dom';
import {
  RoutesData,
} from './CustomerRouteData';
import OrderLayout from './CustomerLayout';


const CusotmerRoute: React.FunctionComponent = () => {
  return (
    <Routes>
      {RoutesData.map((item: any) => (
        <Route
          key={item.ID}
          path={item.path}
          element={
            <OrderLayout>
              <item.component />
            </OrderLayout>
          }
        />
      ))}
    
    </Routes>
  );
};

export default CusotmerRoute;
