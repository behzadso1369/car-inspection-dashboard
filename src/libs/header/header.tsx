import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faEnvelope,
  faHeadset,
  faUserNinja,
} from '@fortawesome/free-solid-svg-icons';
import { Badge, IconButton, SwipeableDrawer } from '@mui/material';
import { useState } from 'react';
import { AvatarMenu } from '../../libs/avatar-menu/avatar-menu';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from '../sidebar/sidebar';
import { NavLink, useLocation } from 'react-router-dom';
import SideBarAccordion from '../accordion/accordion';
type Anchor =  'right';

/* eslint-disable-next-line */
export interface HeaderProps {
  avatarMenuData: any[];
  routesData:any;
  icon:any;
}
const buttonLink =
'p-3 flex items-center gap-3 rounded-md duration-200 min-h-[3rem]';

export function Header({ avatarMenuData,icon,routesData }: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profile,setProfile] = useState<any>()
  const open = Boolean(anchorEl);
  const [openMenu, setOpenMenu] = useState<boolean>(true);
  const [expanded, setExpanded] = useState<string>('');
  const { pathname } = useLocation();
  const path = pathname.split('/')[1];
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };
  const handleClick: any = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const getProfile = () => {
    instance.get(ApiHelper.get("Profile")).then((res:any) => {
     setProfile(res?.data)
    })
  }
  useEffect(() => {
    getProfile()
  },[])

  return (
    <div className=" text-white px-6 py-2 flex justify-between lg:justify-end xl:justify-end items-center header relative" style={{ background: '#ffffff' }}>
       <IconButton
    className=' lg:!hidden xl:!hidden text-3xl'
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer("right", true)}
            edge="start"
            sx={[
              open && { display: 'none' },
            ]}
          >
            <MenuIcon className='text-black ' />
          </IconButton>
      <div className="flex items-center gap-12">
        <div className="flex gap-7">
          <FontAwesomeIcon
            className="text-[#0047bc] text-base"
            icon={faHeadset}
          />
          <FontAwesomeIcon
            className="text-[#0047bc] text-base"
            icon={faEnvelope}
          />
          <Badge badgeContent={3} color="primary">
            <FontAwesomeIcon
       
              className="text-[#0047bc] text-base cursor-pointer"
              icon={faBell}
            />
          </Badge>
        </div>
     
        <div className='flex flex-col items-center'>
        <div
          className="bg-[#fcd435] cursor-pointer w-10 h-10 rounded-full flex justify-center items-center"
          onClick={handleClick}
        >
          {profile?.avatar ? (<img src={profile?.avatar} />) : (  <FontAwesomeIcon
            size="lg"
            className="text-primary"
            icon={faUserNinja}
          />)}
        
        </div>
        <div className='col-span-1'>
          <span className='text-xs text-black'>{profile?.full_name}</span>
        </div>
        <AvatarMenu
          avatarMenuData={avatarMenuData}
          open={open}
          anchorEl={anchorEl}
          handleClose={handleClose}
        />
        
        </div>
       
      </div>
     
      <SwipeableDrawer
            anchor={"right"}
            open={state["right"]}
            onClose={toggleDrawer("right", false)}
            onOpen={toggleDrawer("right", true)}
          >
             
        <div
        className={`${
          openMenu ? 'w-64' : 'w-20'
        } p-4 bg-white sidebar h-screen overflow-y-auto  duration-300 border-l-[1.5px] border-black-opacity-10 relative`}
        style={{ whiteSpace: 'nowrap' }}
      >
        <div className="py-2 flex justify-start items-center">
          {openMenu && (
            <span className="text-base font-medium pt-1 mx-3 text-[#0047bc] !font-peydaExtraBold">کار چک</span>
          )}
          <img
            className="h-10 mx-2"
            src={icon}
            alt="logo"
          />
         
        </div>
        {routesData.map((item: any) => {
          return (
            <div key={item.ID}>
           
              <div className="w-full mb-2 duration-200">
                  {item.children ? (
                    <div className="w-full sidebar-accordion">
                      <SideBarAccordion
                        title={item.title}
                        icon={item.icon}
                        child={item.children}
                        expanded={expanded}
                        setExpanded={setExpanded}
                        openMenu={openMenu}
                        path={item.path}
                      />
                    </div>
                  ) : (
                    <NavLink
                      className={`w-full flex justify-start ${buttonLink} ${
                        path === item.path.split('/')[0]
                          ? 'bg-secondary-opacity-20'
                          : null
                      } ${!openMenu ? 'justify-center' : null}`}
                      to={item.path}
                      onClick={toggleDrawer("right", false)}
                    >
                      {({ isActive }) => (
                        <div>
                          {openMenu ? (
                            <div className="flex gap-3 items-center">
                                <div
                                className={`${
                                  isActive
                                    ? 'text-primary'
                                    : 'text-black-opacity-60'
                                } text-lg`}
                              >
                                <FontAwesomeIcon icon={item.icon} size="sm" />
                              </div>
                              <span
                                className={`${
                                  isActive
                                    ? 'text-primary font-bold'
                                    : 'text-black-opacity-70'
                                } text-sm`}
                              >
                                {item.title}
                              </span>
                            
                            </div>
                          ) : (
                            // <Tooltip
                            //   title={item.title}
                            //   placement="left"
                            //   componentsProps={{
                            //     tooltip: {
                            //       sx: {
                            //         bgcolor: '#1B263B',
                            //         fontSize: '12px',
                            //       },
                            //     },
                            //   }}
                            // >
                            <div
                              className={`${
                                isActive
                                  ? 'text-primary'
                                  : 'text-black-opacity-60'
                              } text-lg`}
                            >
                              <FontAwesomeIcon icon={item.icon} size="sm" />
                            </div>
                            // </Tooltip>
                          )}
                        </div>
                      )}
                    </NavLink>
                  )}
                </div>
       
           
           
            </div>
          );
        })}
      </div>
            
          </SwipeableDrawer>
    </div>
  );
}

export default Header;
