import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface FilterProps extends React.PropsWithChildren {
  children: any;
  setFilter: React.Dispatch<React.SetStateAction<boolean>>;
}

const Filter = ({ children, setFilter }: FilterProps) => {
  return (
    <div className="bg-secondary-opacity-10 border-[1.5px] rounded-md  mt-3 relative pr-8 pl-3 pt-6 pb-3 min-h-[16rem]">
      <div
        className="rounded-full w-6 h-6 flex justify-center items-center bg-white absolute left-2.5 top-2.5  cursor-pointer"
        style={{ boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.15)" }}
        onClick={() => setFilter(false)}
      >
        <FontAwesomeIcon className="text-primary" icon={faXmark} size="sm" />
      </div>
      {/* flex 2xl:gap-20 xl:gap-16 gap-4 h-full */}
      <div className="h-full">{children}</div>
    </div>
  );
};

export default Filter;
