import { Route, Routes } from 'react-router-dom';
import {
  RoutesData,
} from './SliderRouteData';
import SliderLayout from './SliderLayout';


const SliderRout: React.FunctionComponent = () => {
  return (
    <Routes>
      {RoutesData.map((item: any) => (
        <Route
          key={item.ID}
          path={item.path}
          element={
            <SliderLayout>
              <item.component />
            </SliderLayout>
          }
        />
      ))}
    
    </Routes>
  );
};

export default SliderRout;
