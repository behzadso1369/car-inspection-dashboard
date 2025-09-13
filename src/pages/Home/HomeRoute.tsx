import { Route, Routes } from 'react-router-dom';
import { RoutesData } from './HomeRouteData';

const HomeMainPage: React.FunctionComponent = () => {
  return (
    <div className="">
      <Routes>
        {RoutesData.map((item: any) => (
          <Route key={item.ID} path={item.path} element={<item.component />} />
        ))}
      </Routes>
    </div>
  );
};

export default HomeMainPage;
