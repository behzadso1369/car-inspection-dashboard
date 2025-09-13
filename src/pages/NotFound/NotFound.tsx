import { Button, PrimaryButton } from '../../libs/button/button';
import React from 'react';

import { useNavigate } from 'react-router-dom';

const NotFound: React.FunctionComponent = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full px-16 md:px-0 h-[80vh] flex items-center justify-center ">
      <div className="bg-white border border-gray-200 flex flex-col items-center justify-center gap-2 px-4 md:px-8 lg:px-24 py-8 rounded-lg shadow-2xl">
        <p
          data-testid="title"
          className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-wider text-gray-300"
        >
          404
        </p>
        <p
          data-testid="text"
          className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider text-gray-500 mt-4 pb-4 border-b-2 text-center"
        >
          {'ds.routes.notFound.title'}
        </p>

        <div className="mt-5">
          <Button
            active={true}
            title="خانه"
            style={PrimaryButton}
            onClick={() => {
              navigate('/home');
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
