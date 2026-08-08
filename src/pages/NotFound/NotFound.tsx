import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FunctionComponent = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full px-4 sm:px-8 min-h-[70vh] flex items-center justify-center">
      <div className="bg-white border border-card-border flex flex-col items-center justify-center gap-4 px-6 sm:px-10 py-10 rounded-2xl shadow-card w-full max-w-md text-center">
        <p
          data-testid="title"
          className="text-5xl sm:text-6xl font-bold tracking-wider text-brand/20"
        >
          404
        </p>
        <p
          data-testid="text"
          className="text-lg sm:text-xl font-bold text-primary leading-relaxed"
        >
          صفحه مورد نظر یافت نشد
        </p>
        <p className="text-sm text-black-opacity-60">
          آدرس وارد شده وجود ندارد یا حذف شده است.
        </p>
        <button
          type="button"
          className="w-full sm:w-auto min-h-[44px] px-8 rounded-xl bg-brand text-white text-sm font-medium mt-2"
          onClick={() => navigate('/home')}
        >
          بازگشت به خانه
        </button>
      </div>
    </div>
  );
};

export default NotFound;
