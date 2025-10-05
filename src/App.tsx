import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Layout from './components/layout';
import { RoutesData } from './routes/routes';
import NotFound from './pages/NotFound/NotFound';

import Profile from './pages/Profile/Profile';
import ProfileOperation from './pages/Profile/ProfileOperation';
import { AxiosInterceptor } from './helper/interceptor';
import Notification from './pages/Notification/Notification';
import NotificationDetail from './pages/Notification/NotificationDetail';
import './styles.scss'
import Auth from './utils/Auth';
import Setting from './pages/Setting/Setting';
import Register from './pages/Register/Register';


const App: React.FunctionComponent = () => {
  const Login = React.lazy(() => import('./pages/Login/Login'));


  const lazyRoutes = RoutesData.map((item: any) => {
    return (
      <Route
        path={`${item.path}/*`}
        key={item.ID}
        element={
          <React.Suspense fallback={<>...</>}>
            <item.component />
          </React.Suspense>
        }
      />
    );
  });

  return (

      <BrowserRouter>
        <AxiosInterceptor>
          <Routes>
            <Route
              path="login"
              element={
                <React.Suspense
                  fallback={
                    <div className="flex justify-center items-center h-screen">
                      ...
                    </div>
                  }
                >
                  <Login />
                </React.Suspense>
              }
            />
                 <Route
              path="register"
              element={
                <React.Suspense
                  fallback={
                    <div className="flex justify-center items-center h-screen">
                      ...
                    </div>
                  }
                >
                  <Register />
                </React.Suspense>
              }
            />
            <Route
              path="/"
              element={
                <Auth>
                    <Layout />
                 </Auth>
              
           
             
              }
            >
              {lazyRoutes}
              {/* <Route path="" element={<Navigate to="/home" />} /> */}
              <Route path="profile" element={<Profile />} />
              <Route path='setting' element={<Setting />} />
           
              <Route path="profile/operation" element={<ProfileOperation />} />
              <Route path="notification" element={<Notification />} />
              <Route path="notification/:id" element={<NotificationDetail />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AxiosInterceptor>
      </BrowserRouter>
 
  );
};


export default App;
