import { Route, Routes } from 'react-router-dom';
import {
  RoutesData,
} from './UserRouteData';
import OrderLayout from './UserLayout';


const UserRoute: React.FunctionComponent = () => {
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

export default UserRoute;
