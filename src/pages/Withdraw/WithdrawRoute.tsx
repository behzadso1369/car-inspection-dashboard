import { Route, Routes } from 'react-router-dom';
import {
  RoutesData,
} from './WithdrawRouteData';
import BankLayout from './WithdrawLayout';
BankLayout


const WithdrawRoute: React.FunctionComponent = () => {
  return (
    <Routes>
      {RoutesData.map((item: any) => (
        <Route
          path={item.path}
          element={
            <BankLayout>
              <item.component />
            </BankLayout>
          }
        />
      ))}
    
    </Routes>
  );
};

export default WithdrawRoute;
