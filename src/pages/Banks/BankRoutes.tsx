import { Route, Routes } from 'react-router-dom';
import {
  RoutesData,
} from './BanksRouteData';
import BankLayout from './BankLayout';
BankLayout


const BankRoute: React.FunctionComponent = () => {
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

export default BankRoute;
