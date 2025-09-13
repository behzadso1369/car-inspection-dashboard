import React from 'react';

import { Outlet, useNavigate } from 'react-router-dom';
// import imageUrl from '../../assets/images/fms-logo.svg';
// import imageUrl from '../../assets/images/14021221-FMS Service-Logo-Re2 (2)-1.png'
import imageUrl from '../../assets/images/JB Logo 2.png'

import { RoutesData } from '../../routes/routes';
import {
  faGear,
  faRightFromBracket,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
// import Breadcrumbs from '../../libs/breadcrumbs/breadcrumbs';
import Sidebar from '../../libs/sidebar/sidebar';
import Header from '../../libs/header/header';

const Layout: React.FunctionComponent = () => {

  const navigate = useNavigate();

  const userProfile = () => {
    navigate('/profile');
  };
  const settings = () => {
    navigate('/setting');
  };
  const logout = () => {
    navigate('/login');
    localStorage.removeItem('userId');
    localStorage.removeItem('language');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
  };

  const avatarMenuData = [
    { icon: faUser, title: 'پروفایل کاربری', func: userProfile, id: 1 },
    { icon: faGear, title: 'تنظیمات', func: settings, id: 1 },
    { icon: faRightFromBracket, title: 'خروج', func: logout, id: 1 },
  ];
  const Icon = imageUrl;

  return (
    <div className="flex" style={{ background: '#F9F9F9' }}>
      <div className='hidden lg:block xl:block'>
        <Sidebar
         
          routesData={RoutesData}
          icon={Icon}
        />
      </div>
      <div className="w-full h-screen overflow-auto relative">
        <Header  routesData={RoutesData} icon={Icon} avatarMenuData={avatarMenuData} />
        <div className="px-4 pt-2">
          {/* <Breadcrumbs projectName="ds" routesData={RoutesData} /> */}
        </div>
        <div
          className="relative px-4 pt-1"
          style={{
            minHeight: `calc(100% - ${'140px'})`,
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default Layout;
