import { Navigate, Route, Routes } from 'react-router-dom';
import { RoutesData } from './ShortLinkRouteData';
import ShortLinkLayout from './ShortLinkLayout';

const ShortLinkRoute: React.FunctionComponent = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="list" replace />} />
      {RoutesData.map((item: any) => (
        <Route
          key={item.ID}
          path={item.path}
          element={
            <ShortLinkLayout>
              <item.component />
            </ShortLinkLayout>
          }
        />
      ))}
    </Routes>
  );
};

export default ShortLinkRoute;
