import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SideBarAccordion } from '../accordion/accordion';
import { useState } from 'react';

export interface NavMenuProps {
  routesData: any[];
  openMenu?: boolean;
  onNavigate?: () => void;
  align?: 'start' | 'end';
}

const buttonLink =
  'px-3 py-2.5 flex items-center gap-3 rounded-xl duration-200 min-h-[48px] w-full';

export function NavMenu({
  routesData,
  openMenu = true,
  onNavigate,
}: NavMenuProps) {
  const [expanded, setExpanded] = useState<string>('');
  const { pathname } = useLocation();
  const path = pathname.split('/')[1];

  return (
    <nav className="w-full flex flex-col gap-0.5">
      {routesData.map((item: any) => (
        <div key={item.path} className="w-full">
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
                onNavigate={onNavigate}
              />
            </div>
          ) : (
            <NavLink
              className={`${buttonLink} ${
                path === item.path.split('/')[0]
                  ? 'bg-brand-soft text-brand'
                  : 'hover:bg-brand-soft/60'
              } ${!openMenu ? 'justify-center px-0' : ''}`}
              to={item.path}
              onClick={onNavigate}
            >
              {({ isActive }) =>
                openMenu ? (
                  <div className="flex items-center gap-3 w-full">
                    <FontAwesomeIcon
                      icon={item.icon}
                      size="sm"
                      className={
                        isActive ? 'text-brand shrink-0' : 'text-black-opacity-60 shrink-0'
                      }
                    />
                    <span
                      className={`text-sm truncate ${
                        isActive ? 'text-brand font-bold' : 'text-black-opacity-70'
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>
                ) : (
                  <FontAwesomeIcon
                    icon={item.icon}
                    size="sm"
                    className={isActive ? 'text-brand' : 'text-black-opacity-60'}
                  />
                )
              }
            </NavLink>
          )}
        </div>
      ))}
    </nav>
  );
}

export default NavMenu;
