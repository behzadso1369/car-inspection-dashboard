import { Route, Routes } from 'react-router-dom';
import {
  AboutUsRouteData,
} from './AboutUsRouteData';
import AboutUsLayout from './AboutUsLayout';


const AboutUsRoute: React.FunctionComponent = () => {
  return (
    <Routes>
      {AboutUsRouteData.map((item: any) => (
        <Route
          key={item.ID}
          path={item.path}
          element={
            <AboutUsLayout>
              <item.component />
            </AboutUsLayout>
          }
        />
      ))}
    
    </Routes>
  );
};

export default AboutUsRoute;
