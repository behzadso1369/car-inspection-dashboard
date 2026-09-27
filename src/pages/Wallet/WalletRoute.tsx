import { Route, Routes } from 'react-router-dom';
import { RoutesData } from './WalletRouteData';
import WalletLayout from './WalletLayout';

const WalletRoute: React.FunctionComponent = () => {
  return (
    <Routes>
      {RoutesData.map((item: any) => (
        <Route
          key={item.ID}
          path={item.path}
          element={
            <WalletLayout>
              <item.component />
            </WalletLayout>
          }
        />
      ))}
    </Routes>
  );
};

export default WalletRoute;
