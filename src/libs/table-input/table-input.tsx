import React, { useState } from 'react';
import { Controller } from 'react-hook-form';

interface TableInputProps extends React.PropsWithChildren {
  register: any;
  control: any;
  title: string;
  disabled: boolean;
  min?: string;
  max?: string;
  placeholder: string;
  onChange?: any;
}

export const TableInput: React.FunctionComponent<TableInputProps> = ({
  register,
  control,
  title,
  disabled,
  min,
  max,
  placeholder,
  onChange,
}) => {
  const [focused, setFocused] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-3">
      <div
        className={`bg-white flex items-center rounded-lg `}
        style={{
          boxShadow: focused
            ? '0px 0px 0px 1px rgba(134, 143, 160, 0.16), 0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 0px 0px 3px rgba(178, 231, 253, 0.50)'
            : '0px 0px 0px 1px rgba(134, 143, 160, 0.16), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)',
        }}
      >
        <Controller
          {...register(title)}
          control={control}
          render={({ field: { ref, ...field } }) => {
            return (
              <input
                {...field}
                {...register(title)}
                className="appearance-none w-[3.2rem] text-primary placeholder-black-opacity-40 leading-tight focus:outline-none focus:shadow-outline text-[12px] rounded-lg py-3 px-3"
                type="text"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                id={title}
                disabled={disabled}
                min={min}
                max={max}
                placeholder={placeholder}
                maxLength={4}
                onChange={onChange}
              />
            );
          }}
        />
      </div>
    </div>
  );
};

export default TableInput;
