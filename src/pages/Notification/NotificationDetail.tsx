import React from 'react';

const NotificationDetail: React.FunctionComponent = () => {
  return (
    <>
      <div className="bg-[#FCFCFC] rounded-xl border border-[#2c3c511a]">
        <h1 className="text-primary text-base font-bold flex justify-center items-center p-4 pb-4">
          جزئیات اعلان
        </h1>
        <div className="border border-[#00000005]"></div>
        <div className="flex justify-between flex-wrap gap-10 w-full py-8 p-4">
          <div className="flex gap-2">
            <h3 className="text-primary font-bold text-sm">موضوع: </h3>
            <span className="text-primary text-sm">اینترنت</span>
          </div>
          <div className="flex gap-2">
            <h3 className="text-primary font-bold text-sm">دپارتمان: </h3>
            <span className="text-primary text-sm">IT</span>
          </div>
          <div className="flex gap-2">
            <h3 className="text-primary font-bold text-sm">تاریخ: </h3>
            <span className="text-primary text-sm">1402/08/08</span>
          </div>
          <div className="flex gap-2">
            <h3 className="text-primary font-bold text-sm">ساعت: </h3>
            <span className="text-primary text-sm">22:48</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-[#2c3c511a] mt-8 px-10 py-7 h-96">
        <span className="text-sm font-normal text-black">متن اعلان</span>
      </div>
    </>
  );
};

export default NotificationDetail;
