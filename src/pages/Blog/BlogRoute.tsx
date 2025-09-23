import { Route, Routes } from 'react-router-dom';
import {
  RoutesData,
} from './BlogRouteData';
import BlogTagLayout from './BlogLayout';


const BlogRoute: React.FunctionComponent = () => {
  return (
    <Routes>
      {RoutesData.map((item: any) => (
        <Route
          key={item.ID}
          path={item.path}
          element={
            <BlogTagLayout>
              <item.component />
            </BlogTagLayout>
          }
        />
      ))}
    
    </Routes>
  );
};

export default BlogRoute;
