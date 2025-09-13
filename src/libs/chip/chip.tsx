import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface ChipProps extends React.PropsWithChildren {
  title: string;
  clickHandler: () => void;
}

export const Chip: React.FunctionComponent<ChipProps> = ({
  title,
  clickHandler,
}) => {
  return (
    <div className="border border-primary px-4 flex items-center gap-3 rounded-2xl text-xs h-8 text-primary">
      {title}
      <FontAwesomeIcon
        icon={faXmark}
        className="text-xs cursor-pointer"
        onClick={clickHandler}
      />
    </div>
  );
};

export default Chip;
