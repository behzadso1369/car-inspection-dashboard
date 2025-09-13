import { Route, Routes } from 'react-router-dom';
import { RoutesData } from './ComplaintRouteData';
import ComplaintLayout from './ComplaintLayout';



const ComplaintRoute: React.FunctionComponent = () => {
  return (
    <Routes>
      {RoutesData.map((item: any) => (
        <Route
          key={item.ID}
          path={item.path}
          element={
            <ComplaintLayout>
              <item.component />
            </ComplaintLayout>
          }
        />
      ))}
    
    </Routes>
  );
};

export default ComplaintRoute;
