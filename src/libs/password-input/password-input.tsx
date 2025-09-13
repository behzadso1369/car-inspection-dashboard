import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const PasswordInput: React.FunctionComponent = () => {
  const [focused, setFocused] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');

  return (
    <div className="w-full">
      <label className="text-black-opacity-60 text-sm my-2" htmlFor="username">
        پسورد
      </label>
      <div
        className="bg-white flex items-center rounded-lg w-80 mt-2 "
        style={{
          boxShadow:
            focused && input
              ? '0px 0px 0px 1px rgba(134, 143, 160, 0.16), 0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 0px 0px 3px rgba(178, 231, 253, 0.50)'
              : '0px 0px 0px 1px rgba(134, 143, 160, 0.16), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)',
          direction: !focused && !input ? 'rtl' : 'ltr',
        }}
      >
        <input
          className={`appearance-none w-full text-black-opacity-40 placeholder-black-opacity-40 leading-tight focus:outline-none focus:shadow-outline text-base p-3 rounded-lg`}
          id="username"
          type={showPassword ? 'text' : 'password'}
          placeholder="پسورد"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => setInput(e.target.value)}
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
      </div>
    </div>
  );
};

export default PasswordInput;
