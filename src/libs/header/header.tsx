import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import { Badge, IconButton, SwipeableDrawer } from '@mui/material';
import { AvatarMenu } from '../avatar-menu/avatar-menu';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { NavMenu } from '../nav-menu/NavMenu';
import { useLocation } from 'react-router-dom';

type Anchor = 'right';

export interface HeaderProps {
  avatarMenuData: any[];
  routesData: any;
  icon: any;
}

function resolvePageTitle(routesData: any[], pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (!segments.length) return 'داشبورد';

  for (const route of routesData) {
    const root = route.path?.split('/')[0];
    if (root && segments[0] === root) {
      if (route.children?.length) {
        const child = route.children.find(
          (c: any) => pathname === `/${c.path}` || pathname.startsWith(`/${c.path}`)
        );
        if (child?.title) return child.title;
      }
      return route.title || 'داشبورد';
    }
  }
  return 'داشبورد';
}

export function Header({ avatarMenuData, icon, routesData }: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profile, setProfile] = useState<any>();
  const open = Boolean(anchorEl);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();
  const pageTitle = resolvePageTitle(routesData, pathname);

  const toggleDrawer =
    (openDrawer: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setDrawerOpen(openDrawer);
    };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getProfile = () => {
    instance.get(ApiHelper.get('Profile')).then((res: any) => {
      setProfile(res?.data);
    });
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <header className="sticky top-0 z-40">
      <div className="h-[3px] w-full bg-gradient-to-l from-brand via-brand to-brand-dark" />
      <div className="bg-white/90 backdrop-blur-md border-b border-card-border px-3 sm:px-5 py-2.5 flex justify-between items-center gap-3 shadow-[0_4px_24px_rgba(2,55,254,0.04)]">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <IconButton
            className="!text-brand lg:!hidden"
            color="inherit"
            aria-label="باز کردن منو"
            onClick={toggleDrawer(true)}
            edge="start"
            size="large"
            sx={{ minWidth: 44, minHeight: 44 }}
          >
            <MenuIcon />
          </IconButton>

          <div className="flex items-center gap-2.5 min-w-0">
            <div className="lg:hidden flex items-center min-w-0">
              {icon && (
                <img className="h-8 w-auto shrink-0 object-contain" src={icon} alt="کارماچک" />
              )}
            </div>
            <div className="hidden lg:flex items-center gap-3 min-w-0">
              {icon && (
                <img className="h-8 w-auto shrink-0 object-contain" src={icon} alt="کارماچک" />
              )}
              <h1 className="text-sm sm:text-base font-bold text-primary truncate !font-peydaBold">
                {pageTitle}
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            className="relative hidden sm:flex w-10 h-10 items-center justify-center rounded-xl border border-card-border bg-surface hover:bg-brand-soft hover:border-brand/20 transition-colors"
            aria-label="اعلان‌ها"
          >
            <Badge
              badgeContent={3}
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#0237fe',
                  color: '#fff',
                  fontSize: 10,
                },
              }}
            >
              <FontAwesomeIcon className="text-primary text-sm" icon={faBell} />
            </Badge>
          </button>

          <button
            type="button"
            className="flex items-center gap-2.5 rounded-2xl border border-card-border bg-white hover:border-brand/25 hover:shadow-[0_4px_16px_rgba(2,55,254,0.1)] transition-all pl-2 pr-1 py-1 cursor-pointer"
            onClick={handleClick as any}
            aria-label="منوی کاربر"
          >
            <span className="hidden sm:flex flex-col items-end max-w-[130px]">
              <span className="text-xs font-medium text-primary truncate w-full text-left">
                {profile?.full_name || profile?.fullName || 'کاربر'}
              </span>
              <span className="text-[10px] text-black-opacity-50">مدیر سیستم</span>
            </span>
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center shrink-0 overflow-hidden shadow-[0_4px_12px_rgba(2,55,254,0.35)]">
              {profile?.avatar ? (
                <img
                  src={profile?.avatar}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <FontAwesomeIcon size="sm" className="text-white" icon={faUser} />
              )}
            </span>
          </button>
          <AvatarMenu
            avatarMenuData={avatarMenuData}
            open={open}
            anchorEl={anchorEl}
            handleClose={handleClose}
          />
        </div>
      </div>

      <SwipeableDrawer
        anchor={'right' as Anchor}
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        PaperProps={{
          sx: {
            width: 'min(88vw, 320px)',
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
            background: '#fff',
          },
        }}
      >
        <div className="p-4 bg-white h-full overflow-y-auto flex flex-col" dir="rtl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-card-border">
            <div className="flex items-center">
              {icon && (
                <img className="h-10 w-auto object-contain" src={icon} alt="کارماچک" />
              )}
            </div>
            <IconButton
              aria-label="بستن منو"
              onClick={toggleDrawer(false)}
              size="large"
              sx={{ minWidth: 44, minHeight: 44, color: '#0237fe' }}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <NavMenu
            routesData={routesData}
            openMenu
            onNavigate={() => setDrawerOpen(false)}
          />
        </div>
      </SwipeableDrawer>
    </header>
  );
}

export default Header;
