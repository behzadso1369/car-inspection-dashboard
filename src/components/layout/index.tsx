import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import imageUrl from '../../assets/images/carmacheck-logo.png';
import { RoutesData } from '../../routes/routes';
import {
  faGear,
  faRightFromBracket,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
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
    <div className="flex min-h-screen bg-surface overflow-x-hidden">
      <div className="hidden lg:block shrink-0">
        <Sidebar routesData={RoutesData} icon={Icon} />
      </div>
      <div className="w-full min-w-0 h-screen overflow-y-auto overflow-x-hidden relative flex flex-col bg-surface">
        <Header
          routesData={RoutesData}
          icon={Icon}
          avatarMenuData={avatarMenuData}
        />
        <main className="relative px-3 sm:px-5 pt-4 pb-4 lg:pb-24 flex-1 min-h-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
