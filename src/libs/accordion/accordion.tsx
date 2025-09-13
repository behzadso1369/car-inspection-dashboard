import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { NavLink, useLocation } from 'react-router-dom';
import {

  Menu,
 
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';


/* eslint-disable-next-line */
export interface AccordionProps {
  title: string;
  child: [];
  icon: any;
  expanded: string;
  setExpanded: React.Dispatch<React.SetStateAction<string>>;
  openMenu: boolean;
  path: string;
}

export function SideBarAccordion({
  title,
  child,
  icon,
  expanded,
  setExpanded,
  openMenu,
  path,

}: AccordionProps) {


  const { pathname } = useLocation();
  console.log(pathname);
  console.log(child);
  console.log(path)
  const [pathName, setPathName] = useState<string>(path);
 
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<any>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };


  const handleClose = () => {
    // if (anchorRef.current && anchorRef.current.contains(event.target)) {
    //   return;
    // }

    setOpen(false);
  };

  // function handleListKeyDown(event: any) {
  //   if (event.key === 'Tab') {
  //     event.preventDefault();
  //     setOpen(false);
  //   } else if (event.key === 'Escape') {
  //     setOpen(false);
  //   }
  // }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    // if (prevOpen.current === true && open === false) {
    //   anchorRef.current.focus();
    // }

    prevOpen.current = open;
  }, [open]);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      console.log(event)

      setExpanded(newExpanded ? panel : '');
      if (pathname.split('/')[1] === pathName.split('/')[0]) {
        setPathName('');
      } else {
        setPathName(path);
      }
    };

  // const closeSidebarHandler = () => {
  //   setShowLinks(true);
  // };

  // const userProfile = () => {};
  // const settings = () => {};
  // const logout = () => {};
 

  return (
    <Accordion
      expanded={
        (openMenu && expanded === title) ||
        pathname.split('/')[1] === pathName.split('/')[0]
      }
      onChange={handleChange(title)}
      defaultExpanded={false}
      className="!shadow-none !relative"
      style={{ direction: 'rtl' }}
    >
      <AccordionSummary
        expandIcon={
          openMenu && (
            <FontAwesomeIcon
              icon={faAngleDown}
              className={`${
                pathname.split('/')[1] === path.split('/')[0]
                  ? 'text-primary'
                  : 'text-black-opacity-60'
              }`}
              size="sm"
            />
          )
        }
        aria-controls="panel1d-content"
        id="panel1d-header"
        // !py-1
        className={`!px-3 !py-0.5 !rounded-md ${
          pathname.split('/')[1] === path.split('/')[0] &&
          '!bg-secondary-opacity-20'
        }`}
      >
        <div className="!p-0 w-full">
          {openMenu ? (
            <div className="flex items-center gap-2 w-full">
              <div>
                <FontAwesomeIcon
                  className={`${
                    pathname.split('/')[1] === path.split('/')[0]
                      ? 'text-primary'
                      : 'text-black-opacity-60'
                  }`}
                  icon={icon}
                  size="sm"
                />
              </div>

              <div className="flex w-full justify-between items-center">
                <span
                  className={`${
                    pathname.split('/')[1] === path.split('/')[0]
                      ? 'font-bold'
                      : 'text-black-opacity-70'
                  } text-sm pr-2`}
                  style={{ fontFamily: 'IRANSans' }}
                >
                  {title}
                </span>
                {/* <>
                  {path === 'order' ? (
                    <Badge
                      className="ml-6"
                      badgeContent={2}
                      color="primary"
                    ></Badge>
                  ) : (
                    ''
                  )}
                </> */}
              </div>
            </div>
          ) : (
            <>
              {/* <Tooltip
                title={title}
                placement="left"
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: '#1B263B',
                      fontSize: '12px',
                      fontFamily: 'IRANSans',
                    },
                  },
                }}
              > */}
              <div
                className="flex justify-center items-center"
                ref={anchorRef}
                onClick={handleToggle}
              >
                <FontAwesomeIcon
                  className={`${
                    pathname.split('/')[1] === path.split('/')[0]
                      ? 'text-primary'
                      : 'text-black-opacity-60'
                  }`}
                  icon={icon}
                  size="sm"
                />
              </div>
              {/* </Tooltip> */}

              <Menu
                id="basic-menu"
                anchorEl={anchorRef.current}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
                sx={{
                  '& .MuiMenu-paper': {
                    height: 'auto !important',
                  },
                  '& .MuiMenuItem-gutters': {
                    paddingRight: '1rem',
                    paddingLeft: '1rem',
                  },
                  '& .MuiPaper-elevation': {
                    borderRadius: '8px !important',
                  },
                  '& .MuiMenu-list': {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    paddingX: '.7rem',
                  },
                }}
                transformOrigin={{
                  vertical: 'center',
                  horizontal: 'right',
                }}
              >
                {child.map((item: any) => (
                  <NavLink
                    to={item.path}
                    className={`w-full flex justify-end  ${
                      pathname === "/" + item.path
                        ? 'bg-red-700'
                        : null
                    } `}
                    // className="!p-0 rounded-md text-xs text-black-opacity-70"
                    key={item.ID}
                  >
                    {({ isActive }) => (
                      <>
                        <p
                          className={
                            `px-1 ${
                              isActive
                                ? 'text-primary bg-red-500'
                                : 'text-black-opacity-70 bg-red-300'
                            }` + 'w-full flex justify-center items-center'
                          }
                          style={{
                            fontFamily: isActive ? 'IRANYekanExtraBold' : '',
                          }}
                        >
                          {item.title}
                        </p>
                      </>
                    )}
                  </NavLink>
                ))}
              </Menu>

              {/* <>
                <Tooltip
                  title={title}
                  placement="left"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: '#1B263B',
                        fontSize: '12px',
                        fontFamily: 'IRANSans',
                      },
                    },
                  }}
                >
                  <div className="flex justify-center items-center">
                    <FontAwesomeIcon
                      className={`${
                        pathname.split('/')[1] === path.split('/')[0]
                          ? 'text-primary'
                          : 'text-black-opacity-60'
                      }`}
                      icon={icon}
                      size="sm"
                      onClick={closeSidebarHandler}
                    />
                  </div>
                </Tooltip>
                <AvatarMenu
                  avatarMenuData={[]}
                  open={true}
                  anchorEl={anchorEl}
                  handleClose={() => console.log('GH')}
                />
              </> */}
            </>
          )}
        </div>
      </AccordionSummary>
      {openMenu && (
        <AccordionDetails className="flex flex-col gap-1 !p-0 mr-5 accordionn">
          {child.map((item: any) => (
         
     <NavLink
              to={item.path}
              className={`px-4 py-2 rounded-md text-sm text-black-opacity-70   ${
                pathname === "/" + item.path
                  ? 'font-extrabold'
                  : null
              } `}
              // className="px-4 py-2 rounded-md text-sm text-black-opacity-70 "
              key={item.ID}
            >
              {({ isActive }) => (
                <>
                  <div className=" border-r-[1.5px] border-b-[1.5px] w-3 h-3 rounded-br-lg relative top-3 right-[-16px]"></div>
                  <p
                    className={
                      `px-1 ${
                        isActive ? 'text-primary' : 'text-black-opacity-70'
                      }` + 'w-full flex justify-between items-center'
                    }
                    style={{ fontFamily: isActive ? 'IRANYekanExtraBold' : '' }}
                  >
                    {item.title}
                    {/* <>
                      {item.path.split('/')[1] === 'selling-without-price' ? (
                        <Badge
                          badgeContent={awaitingConfirmationData.length}
                          color="primary"
                        ></Badge>
                      ) : (
                        ''
                      )}
                    </> */}
                  </p>
                </>
              )}
            </NavLink>
            
            
       
          ))}
        </AccordionDetails>
      )}
    </Accordion>
  );
}

export default SideBarAccordion;
