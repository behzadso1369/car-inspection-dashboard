import { Route, Routes } from 'react-router-dom';
import {
  RoutesData,
} from './OrderRouteData';
import OrderLayout from './OrderLayout';


const OrderRoute: React.FunctionComponent = () => {
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

export default OrderRoute;
