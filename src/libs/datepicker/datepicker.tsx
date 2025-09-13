import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import {
  faCalendarDays,
  faAngleLeft,
  faAngleRight,
  faCaretDown,
} from '@fortawesome/free-solid-svg-icons';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'jalali-moment';

interface DatepickerProps extends React.PropsWithChildren {
  label: string;
  register: any;
  control: any;
  disabled?:boolean;
  title: string | number;
}

export const Datepicker: React.FunctionComponent<DatepickerProps> = ({
  label,
  register,
  control,
  disabled,
  title,
}) => {

  // MuiTypography-root MuiTypography-caption MuiDayCalendar-weekDayLabel css-8yp75v-MuiTypography-root-MuiDayCalendar-weekDayLabel


  // MuiTypography-root MuiTypography-caption MuiDayCalendar-weekDayLabel css-8yp75v-MuiTypography-root-MuiDayCalendar-weekDayLabel
  return (
    <div className="flex flex-col gap-3 h-full">
      <label className="text-black-opacity-60 text-xs">{label}</label>
      <Controller
        {...register(title)}
        control={control}
        render={({ field: { ref, ...field } }) => (
          <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
            <DatePicker
              className="date-picker bg-white"
              sx={{
               
                width: '100%'
              }}
              dayOfWeekFormatter={(day) =>
                `${
                  day === 'ش'
                    ? 'ش'
                    : day === '1ش'
                    ? 'ی'
                    : day === '2ش'
                    ? 'د'
                    : day === '3ش'
                    ? 'س'
                    : day === '4ش'
                    ? 'چ'
                    : day === '5ش'
                    ? 'پ'
                    : 'ج'
                }`
              }
              onChange={(date: any) => {
                field.onChange(moment(date).locale("en").format("YYYY-MM-DD"));
            
              }}
              disabled={disabled}
              // defaultValue={new Date()}
              slots={{
                openPickerIcon: () => (
                  <FontAwesomeIcon
                    className="text-primary text-lg"
                    icon={faCalendarDays}
                  />
                ),
                leftArrowIcon: () => (
                  <FontAwesomeIcon
                    className="text-primary text-lg"
                    icon={faAngleLeft}
                  />
                ),
                rightArrowIcon: () => (
                  <FontAwesomeIcon
                    className="text-primary text-lg"
                    icon={faAngleRight}
                  />
                ),
                switchViewIcon: () => (
                  <FontAwesomeIcon
                    className="text-primary text-lg"
                    icon={faCaretDown}
                  />
                ),
              }}
              format="yyyy-MM-dd"
            />
          </LocalizationProvider>
        )}
      />
    </div>
  );
};

export default Datepicker;
