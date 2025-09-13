import { Route, Routes } from 'react-router-dom';
import {
  RoutesData,
} from './TransctionRouteData';
import BankLayout from './TransactionLayout';
BankLayout


const TransactionRoute: React.FunctionComponent = () => {
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

export default TransactionRoute;
