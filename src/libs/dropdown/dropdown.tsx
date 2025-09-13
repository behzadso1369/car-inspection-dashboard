import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MenuItem, Select } from '@mui/material';
import { Controller } from 'react-hook-form';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

interface DropdownProps extends React.PropsWithChildren {
  label?: string;
  option: any[];
  control: any;
  register: any;
  title: string;
  fullWidth: boolean;
  disabled?: boolean;
  width?: string;
}

export const Dropdown: React.FunctionComponent<DropdownProps> = ({
  label,
  option,
  control,
  register,
  title,
  fullWidth,
  disabled,
  
  width,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <label
        className={` text-xs ${
          disabled ? '!text-black' : 'text-black-opacity-80'
        }`}
      >
        {label}
      </label>
      <Controller
        {...register(title)}
        control={control}
        render={({ field: { ref, ...field } }) => (
          <Select
            {...field}
            sx={{
              boxShadow:
                '0px 0px 0px 1px rgba(134, 143, 160, 0.16), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)',
              '.MuiOutlinedInput-notchedOutline': { border: 0 },
              borderRadius: 2,
              fontSize: 12,
              width: width
                ? width
                : fullWidth
                ? '100%'
                : {
                    xl: '15rem',
                    lg: '12rem',
                    md: '10rem',
                    sm: '7rem',
                  },
              height: '2rem',
              background: 'white',
            }}
            displayEmpty
            IconComponent={({ className }: any) => {
              return (
                <>
                  {className.split(' ')[2] === 'MuiSelect-iconOpen' ? (
                    <FontAwesomeIcon
                      className="pointer-events-none px-2"
                      icon={faAngleUp}
                    />
                  ) : (
                    <FontAwesomeIcon
                      className="pointer-events-none px-2"
                      icon={faAngleDown}
                    />
                  )}
                </>
              );
            }}
            disabled={disabled}
           
          
          
          >
            {option && option.map((item: any) => (
              <MenuItem value={item.id}>{title === "user" ? item.username : item.title}</MenuItem>
            ))}
          
          </Select>
        )}
      />
    </div>
  );
};

export default Dropdown;
