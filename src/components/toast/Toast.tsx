import React, { useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faCircleInfo,
  faCircleXmark,
  faExclamationCircle,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

interface ToastProps extends React.PropsWithChildren {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  status: 'warning' | 'success' | 'error' | 'info';
}
const Toast: React.FunctionComponent<ToastProps> = ({
  open,
  setOpen,
  status,
}) => {
  const statusHandler: any = useCallback(() => {
    switch (status) {
      case 'warning':
        return {
          icon: faExclamationCircle,
          color: '#FFB23E',
        };
      case 'error':
        return {
          icon: faCircleXmark,
          color: '#FF3E3E',
        };
      case 'success':
        return {
          icon: faCircleCheck,
          color: '#07A433',
        };
      case 'info':
        return {
          icon: faCircleInfo,
          color: '#1B263B',
        };
      default: {
        return;
      }
    }
  }, [status]);

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      autoHideDuration={6000}
      onClose={() => setOpen(false)}
      sx={{
        '& .MuiPaper-elevation': {
          background: '#EBEDEF !important',
          boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.10)',
          paddingTop: '1rem !important',
          paddingBottom: '1rem !important',
          paddingRight: '1.2rem !important',
          paddingLeft: '1rem !important',
        },
        '& .MuiSnackbarContent-action': {
          padding: '0 !important',
        },
      }}
      action={
        <div className="flex items-center gap-4">
          <FontAwesomeIcon
            className={`text-[${statusHandler().color}]`}
            size="lg"
            icon={statusHandler().icon}
          />
          <span className="text-[#2C3C51] text-sm">پیام اخطار</span>

          <div className="flex gap-4 justify-end items-center w-44">
            <span className="text-[#065ABC] text-[10px] font-bold cursor-pointer pt-0.5">
              تلاش مجدد
            </span>
            <FontAwesomeIcon
              className="text-[#2c3c51b3] font-bold cursor-pointer"
              size="lg"
              icon={faXmark}
              onClick={() => setOpen(false)}
            />
          </div>
        </div>
      }
    />
  );
};
export default Toast;
