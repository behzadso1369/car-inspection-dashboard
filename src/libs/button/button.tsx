import React, { useMemo } from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const PrimaryButton =
  'bg-buttonBackground ml-2 text-white hover:bg-[#416CEA] focus:bg-primary-opacity-90 focus:shadow-primary-focus whitespace-nowrap';

export const SecondaryButton =
  'bg-white ml-2 text-[#464F60] shadow-secondary hover:text-[#171C26] focus:!shadow-mid-blue-focus duration-100 whitespace-nowrap';
  export const SuccessButton =
  'bg-green-700 ml-2 text-white shadow-secondary hover:text-white focus:!shadow-mid-blue-focus duration-100 whitespace-nowrap';
  export const WarningButton =
  'bg-yellow-300 ml-2 text-[#464F60] shadow-secondary hover:text-[#171C26] focus:!shadow-mid-blue-focus duration-100 whitespace-nowrap';
  export const DangerButton =
  'bg-red-600 ml-2 text-[#FFFFFF]  hover:text-[#FFFFFF]  duration-100 whitespace-nowrap';
  export const BlueButton =
  'bg-blue-700 ml-2 text-[#FFFFFF] shadow-secondary hover:text-[#FFFFFF]] focus:!shadow-mid-blue-focus duration-100 whitespace-nowrap';

export const DisabledPrimaryButton = 'bg-primary-opacity-40 text-[#EBEDEF]';

export const DisabledSecondaryButton =
  'bg-[#F7F9FC] text-[#868FA0] shadow-disable whitespace-nowrap';

interface ButtonProps extends React.PropsWithChildren {
  title: string;
  active: boolean;
  style: string;
  disableStyle?: string;
  icon?: IconDefinition;
  iconStyle?: string;
  onClick?: () => void;
}

export const Button: React.FunctionComponent<ButtonProps> = ({
  title,
  icon,
  active,
  style,
  disableStyle,
  iconStyle,
  onClick,
}) => {
  const overallStyle = useMemo(() => {
    return active ? style : disableStyle;
  }, [active]);

  return (
    <button
      className={`${overallStyle} rounded-md px-3 py-1 text-sm flex items-center gap-2`}
      onClick={onClick}
      disabled={!active}
    >
      {icon ? (
        <FontAwesomeIcon className={`${iconStyle}`} icon={icon} size="xs" />
      ) : null}
      {title}
    </button>
  );
};

export default Button;
