import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

export interface AccordionProps {
  title: string;
  child: any[];
  icon: any;
  expanded: string;
  setExpanded: React.Dispatch<React.SetStateAction<string>>;
  openMenu: boolean;
  path: string;
  onNavigate?: () => void;
}

export function SideBarAccordion({
  title,
  child,
  icon,
  expanded,
  setExpanded,
  openMenu,
  path,
  onNavigate,
}: AccordionProps) {
  const { pathname } = useLocation();
  const isSectionActive = pathname.split('/')[1] === path.split('/')[0];
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<any>(null);

  const handleToggle = () => setOpen((prev) => !prev);
  const handleClose = () => setOpen(false);

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : '');
    };

  return (
    <Accordion
      expanded={(openMenu && expanded === title) || isSectionActive}
      onChange={handleChange(title)}
      disableGutters
      elevation={0}
      className="!shadow-none !bg-transparent before:!hidden"
      sx={{
        direction: 'rtl',
        '&:before': { display: 'none' },
        '&.Mui-expanded': { margin: 0 },
      }}
    >
      <AccordionSummary
        expandIcon={
          openMenu ? (
            <FontAwesomeIcon
              icon={faAngleDown}
              className={isSectionActive ? 'text-brand' : 'text-black-opacity-60'}
              size="sm"
            />
          ) : undefined
        }
        aria-controls={`${path}-content`}
        id={`${path}-header`}
        className={`!px-3 !min-h-[48px] !rounded-xl ${
          isSectionActive ? '!bg-brand-soft' : 'hover:!bg-brand-soft/50'
        }`}
        sx={{
          flexDirection: 'row',
          '& .MuiAccordionSummary-content': {
            margin: '0 !important',
            alignItems: 'center',
          },
          '& .MuiAccordionSummary-expandIconWrapper': {
            marginRight: 0,
            marginLeft: '4px',
          },
        }}
      >
        {openMenu ? (
          <div className="flex items-center gap-3 w-full min-w-0">
            <FontAwesomeIcon
              className={`shrink-0 ${
                isSectionActive ? 'text-brand' : 'text-black-opacity-60'
              }`}
              icon={icon}
              size="sm"
            />
            <span
              className={`text-sm truncate ${
                isSectionActive ? 'font-bold text-brand' : 'text-black-opacity-70'
              }`}
            >
              {title}
            </span>
          </div>
        ) : (
          <>
            <div
              className="flex justify-center items-center w-full"
              ref={anchorRef}
              onClick={handleToggle}
            >
              <FontAwesomeIcon
                className={isSectionActive ? 'text-brand' : 'text-black-opacity-60'}
                icon={icon}
                size="sm"
              />
            </div>
            <Menu
              id={`${path}-menu`}
              anchorEl={anchorRef.current}
              open={open}
              onClose={handleClose}
              MenuListProps={{ 'aria-labelledby': 'basic-button' }}
              sx={{
                '& .MuiMenu-paper': { height: 'auto !important', borderRadius: '8px' },
                '& .MuiMenu-list': {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  padding: '0.5rem',
                },
              }}
              transformOrigin={{ vertical: 'center', horizontal: 'right' }}
            >
              {child.map((item: any) => (
                <NavLink
                  to={item.path}
                  key={item.path}
                  onClick={handleClose}
                  className="w-full px-3 py-2 rounded-md text-sm"
                >
                  {({ isActive }) => (
                    <span className={isActive ? 'text-primary font-bold' : 'text-black-opacity-70'}>
                      {item.title}
                    </span>
                  )}
                </NavLink>
              ))}
            </Menu>
          </>
        )}
      </AccordionSummary>
      {openMenu && (
        <AccordionDetails className="flex flex-col gap-0.5 !p-0 !pr-2 !pb-1 accordionn relative">
          {child.map((item: any) => (
            <NavLink
              to={item.path}
              onClick={onNavigate}
              key={item.path}
              className="pr-4 pl-2 py-2.5 rounded-md text-sm min-h-[44px] flex items-center hover:bg-surface"
            >
              {({ isActive }) => (
                <>
                  <div className="border-r-[1.5px] border-b-[1.5px] border-card-border w-2.5 h-2.5 rounded-br-md shrink-0 relative top-0.5 -mr-0.5 ml-2" />
                  <span
                    className={`text-sm leading-5 ${
                      isActive ? 'text-brand font-bold' : 'text-black-opacity-70'
                    }`}
                  >
                    {item.title}
                  </span>
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
