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
import { faIR } from '@mui/x-date-pickers/locales';
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
          <LocalizationProvider
            dateAdapter={AdapterDateFnsJalali}
            localeText={faIR.components.MuiLocalizationProvider.defaultProps.localeText}
          >
            <DatePicker
              className="date-picker bg-white"
              sx={{
               
                width: '100%'
              }}
              value={
                field.value
                  ? moment(field.value, ['YYYY-MM-DD', moment.ISO_8601], true).isValid()
                    ? moment(field.value, ['YYYY-MM-DD', moment.ISO_8601]).toDate()
                    : null
                  : null
              }
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
              onChange={(date: Date | null) => {
                if (!date || !moment(date).isValid()) {
                  field.onChange('');
                  return;
                }
                field.onChange(moment(date).locale('en').format('YYYY-MM-DD'));
              }}
              disabled={disabled}
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
              format="yyyy/MM/dd"
            />
          </LocalizationProvider>
        )}
      />
    </div>
  );
};

export default Datepicker;
