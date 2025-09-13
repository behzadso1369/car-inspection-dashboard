
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, MenuItem } from '@mui/material';

/* eslint-disable-next-line */
export interface AvatarMenuProps {
  avatarMenuData: any[];
  open: boolean;
  anchorEl: HTMLElement | null;
  handleClose: () => void;
}

export function AvatarMenu({
  avatarMenuData,
  open,
  anchorEl,
  handleClose,
}: AvatarMenuProps) {
  return (
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
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
          borderRadius: '10px !important',
        },
      }}
    >
      {avatarMenuData.map((el) => (
        <MenuItem
          className="flex gap-3 items-center cursor-pointer !py-2"
          onClick={el.func}
        >
          <FontAwesomeIcon
            className="text-black-opacity-70 text-xs"
            icon={el.icon}
          />
          <span className="text-black-opacity-70 text-xs">{el.title}</span>
        </MenuItem>
      ))}
    </Menu>
  );
}

export default AvatarMenu;
