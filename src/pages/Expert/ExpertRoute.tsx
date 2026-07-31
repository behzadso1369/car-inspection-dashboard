import { Route, Routes } from 'react-router-dom';
import { RoutesData } from './ExpertRouteData';
import ExpertLayout from './ExpertLayout';

const ExpertRoute: React.FunctionComponent = () => {
  return (
    <Routes>
      {RoutesData.map((item: any) => (
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
