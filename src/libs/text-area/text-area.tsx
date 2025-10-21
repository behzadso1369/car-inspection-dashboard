import React, { ComponentPropsWithoutRef, FC, useState } from 'react';
import { Controller } from 'react-hook-form';

type TextAreaProps = ComponentPropsWithoutRef<'textarea'> & {
  label: string;
  control: any;
  title:string;
  register:any;
  disabled?:boolean;
  className?:string;
  // description: string;
  // setDescription: React.Dispatch<React.SetStateAction<string>>;
}

export const TextArea: FC<TextAreaProps> = ({
  label,
  control,
  title,
  disabled,
  register,
className
  // description,
  // setDescription,
}) => {
  const [focused, setFocused] = useState<boolean>(false);

  return (
    <div className={`flex flex-col w-full gap-3 ${className} col-span-4 lg:col-span-1`} >
      <label className="text-black-opacity-70 text-xs font-normal">
        {label}
      </label>
      <Controller
        {...register(title)}
        control={control}
        render={({ field }) => (
          <textarea
          
            {...field}
            className="w-full rounded-md outline-none p-2 h-32 text-sm text-primary"
            style={{
              boxShadow: focused
                ? '0px 0px 0px 1px rgba(134, 143, 160, 0.16), 0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 0px 0px 3px rgba(178, 231, 253, 0.50)'
                : '0px 0px 0px 1px rgba(134, 143, 160, 0.16), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)',
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            // value={description}
            // onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        )}
      />
    </div>
  );
};

export default TextArea;
