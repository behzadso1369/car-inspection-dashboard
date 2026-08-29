import { Route, Routes } from 'react-router-dom';
import { RoutesData } from './ExpertRouteData';
import ExpertLayout from './ExpertLayout';
import { getTokenRoles } from '../../utils/auth-role';

const ExpertRoute: React.FunctionComponent = () => {
  const roles = getTokenRoles();
  const visibleRoutes = roles.includes('expert')
    ? RoutesData.filter((item) => item.permission?.includes('expert'))
    : RoutesData;

  return (
    <Routes>
      {visibleRoutes.map((item: any) => (
        <Route
          key={item.ID}
          path={item.path}
          element={
            <ExpertLayout>
              <item.component />
            </ExpertLayout>
          }
        />
      ))}
    </Routes>
  );
};

export default ExpertRoute;
