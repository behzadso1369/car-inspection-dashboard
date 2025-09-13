import { NavLink, useLocation } from 'react-router-dom';
import { SideBarAccordion } from '../../libs/accordion/accordion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import './sidebar.module.scss';

export interface SidebarProps {
  routesData: any[];

  icon?: string;
  title?: string;
}

export function Sidebar({
  routesData,

  icon,
  title,
}: SidebarProps) {
  const [openMenu, setOpenMenu] = useState<boolean>(true);
  const [expanded, setExpanded] = useState<string>('');
  const { pathname } = useLocation();
  const path = pathname.split('/')[1];




  

  const buttonLink =
    'p-3 flex items-center gap-3 rounded-md duration-200 min-h-[3rem]';
  return (
    <div className="relative" style={{ direction: 'ltr' }}>
      <div
        className=" absolute top-7 -left-3 rounded-full w-6 h-6 !z-50 cursor-pointer bg-white"
        style={{ boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.15)' }}
        onClick={() => setOpenMenu(!openMenu)}
      >
        {openMenu ? (
          <div className="flex justify-center items-center h-6">
            <FontAwesomeIcon
              icon={faAngleRight}
              className="text-primary"
              size="sm"
            />
          </div>
        ) : (
          <div className="flex justify-center items-center h-6">
            <FontAwesomeIcon
              icon={faAngleLeft}
              className="text-primary"
              size="sm"
            />
          </div>
        )}
      </div>
      <div
        className={`${
          openMenu ? 'w-64' : 'w-20'
        } p-4 bg-white sidebar h-screen overflow-y-auto  duration-300 border-l-[1.5px] border-black-opacity-10 relative`}
        style={{ whiteSpace: 'nowrap' }}
      >
        <div className="py-2 flex justify-end items-center">
          {openMenu && (
            <span className="text-base font-medium pt-1 mx-3 text-[#0047bc] !font-peydaExtraBold">کار چک</span>
          )}
          <img
            className="h-10 mx-2"
            src={icon}
            alt="logo"
          />
          {openMenu && (
            <span className="text-base font-medium pt-1">{title}</span>
          )}
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
                      className={`w-full flex justify-end ${buttonLink} ${
                        path === item.path.split('/')[0]
                          ? 'bg-secondary-opacity-20'
                          : null
                      } ${!openMenu ? 'justify-center' : null}`}
                      to={item.path}
                    >
                      {({ isActive }) => (
                        <div>
                          {openMenu ? (
                            <div className="flex gap-3 items-center">
                              <span
                                className={`${
                                  isActive
                                    ? 'text-primary font-bold'
                                    : 'text-black-opacity-70'
                                } text-sm`}
                              >
                                {item.title}
                              </span>
                              <div
                                className={`${
                                  isActive
                                    ? 'text-primary'
                                    : 'text-black-opacity-60'
                                } text-lg`}
                              >
                                <FontAwesomeIcon icon={item.icon} size="sm" />
                              </div>
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
    </div>
  );
}

export default Sidebar;
