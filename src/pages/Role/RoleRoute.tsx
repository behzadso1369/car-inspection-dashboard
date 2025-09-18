import { Route, Routes } from 'react-router-dom';
import {
    RoleRoutesData,
} from './RoleRouteData';
import RoleLayout from './RoleLayout';


const RoleRoute: React.FunctionComponent = () => {
  return (
    <Routes>
      {RoleRoutesData.map((item: any) => (
        <Route
          key={item.ID}
          path={item.path}
          element={
            <RoleLayout>
              <item.component />
            </RoleLayout>
          }
        />
      ))}
    
    </Routes>
  );
};

export default RoleRoute;
