import React, { ComponentPropsWithoutRef, FC, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Controller } from 'react-hook-form';
type InputProps = ComponentPropsWithoutRef<'input'> & {
  label?: string;
  placeholder?: string;
  width?: string;
  error?: boolean;
  title: string;
  register: any;
  control: any;
};

const PasswordInput: FC<InputProps> = ({
  label,
  placeholder,
  register,
  title,
  control,
  width,
  error,
  ...props
}) => {
  const [focused, setFocused] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');

  return (
    <div className="w-full">
      <label className="text-black-opacity-60 text-sm my-2" htmlFor="username">
        پسورد
      </label>
      <div
        className="bg-white flex items-center rounded-lg w-full mt-2 "
        style={{
          boxShadow:
            focused && input
              ? '0px 0px 0px 1px rgba(134, 143, 160, 0.16), 0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 0px 0px 3px rgba(178, 231, 253, 0.50)'
              : '0px 0px 0px 1px rgba(134, 143, 160, 0.16), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)',
          direction: "rtl"
        }}
      >
                <Controller
          {...register(title)}
          control={control}
          render={({ field: { ref, ...field } }) => {
            const { value } = field;
            return (
              <>
                 <input
                    {...field}
                    {...register(title)}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none h-8 w-full text-primary placeholder-black-opacity-40 leading-tight focus:outline-none focus:shadow-outline text-sm rounded-lg py-3 px-3"
                  id={title}
          type={showPassword ? 'text' : 'password'}
          placeholder="پسورد"
       
        />
        {input && (
          <div
            onClick={() => {
              setShowPassword(!showPassword);
              setFocused(false);
            }}
          >
            {showPassword ? (
              <FontAwesomeIcon
                icon={faEyeSlash}
                className="text-black-opacity-40 text-sm mx-3 cursor-pointer"
              />
            ) : (
              <FontAwesomeIcon
                icon={faEye}
                className="text-black-opacity-40 text-sm mx-3 cursor-pointer"
              />
            )}
          </div>
        )}
              </>
            )
          }}
          />
     
        
      </div>
    </div>
  );
};

export default PasswordInput;
