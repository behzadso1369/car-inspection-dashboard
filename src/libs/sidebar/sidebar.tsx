import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { NavMenu } from '../nav-menu/NavMenu';
import './sidebar.module.scss';

export interface SidebarProps {
  routesData: any[];
  icon?: string;
  title?: string;
}

export function Sidebar({ routesData, icon }: SidebarProps) {
  const [openMenu, setOpenMenu] = useState<boolean>(true);

  return (
    <div className="relative h-screen sticky top-0">
      <button
        type="button"
        aria-label={openMenu ? 'بستن منو' : 'باز کردن منو'}
        className="absolute top-7 -left-3 rounded-full w-6 h-6 !z-50 cursor-pointer bg-white border border-card-border flex justify-center items-center shadow-card hover:border-brand/30"
        onClick={() => setOpenMenu(!openMenu)}
      >
        <FontAwesomeIcon
          icon={openMenu ? faAngleRight : faAngleLeft}
          className="text-brand"
          size="sm"
        />
      </button>
      <aside
        className={`${
          openMenu ? 'w-64' : 'w-[4.5rem]'
        } p-3 bg-white sidebar h-screen overflow-y-auto overflow-x-hidden duration-300 border-l border-card-border shadow-[4px_0_24px_rgba(2,55,254,0.04)]`}
      >
        <div
          className={`py-3 mb-3 flex items-center px-2 rounded-2xl bg-brand-soft border border-brand/10 ${
            openMenu ? 'justify-center' : 'justify-center'
          }`}
        >
          {icon && (
            <img
              className={`${openMenu ? 'h-11' : 'h-8'} w-auto shrink-0 object-contain`}
              src={icon}
              alt="کارماچک"
            />
          )}
        </div>
        <NavMenu routesData={routesData} openMenu={openMenu} />
      </aside>
    </div>
  );
}

export default Sidebar;
