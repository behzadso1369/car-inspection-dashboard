import { Route, Routes } from 'react-router-dom';
import { RoutesData } from './FAQRouteData';
import FAQLayout from './FAQLayout';

const FAQRoute: React.FunctionComponent = () => {
  return (
    <Routes>
      {RoutesData.map((item: any) => (
        <Route
          key={item.ID}
          path={item.path}
          element={
            <FAQLayout>
              <item.component />
            </FAQLayout>
          }
        />
      ))}
    </Routes>
  );
};

export default FAQRoute;
