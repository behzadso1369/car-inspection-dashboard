import React from 'react';

const NotificationDetail: React.FunctionComponent = () => {
  return (
    <div className="w-full pb-6 max-w-full overflow-x-hidden space-y-4">
      <div className="bg-white rounded-2xl border border-card-border shadow-card overflow-hidden">
        <h1 className="text-primary text-base sm:text-lg font-bold text-center p-4 border-b border-card-border">
          جزئیات اعلان
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
          <div className="flex flex-col gap-1 rounded-xl bg-[#FCFCFC] p-3 border border-card-border">
            <h3 className="text-primary font-bold text-xs">موضوع</h3>
            <span className="text-primary text-sm">اینترنت</span>
          </div>
          <div className="flex flex-col gap-1 rounded-xl bg-[#FCFCFC] p-3 border border-card-border">
            <h3 className="text-primary font-bold text-xs">دپارتمان</h3>
            <span className="text-primary text-sm">IT</span>
          </div>
          <div className="flex flex-col gap-1 rounded-xl bg-[#FCFCFC] p-3 border border-card-border">
            <h3 className="text-primary font-bold text-xs">تاریخ</h3>
            <span className="text-primary text-sm">1402/08/08</span>
          </div>
          <div className="flex flex-col gap-1 rounded-xl bg-[#FCFCFC] p-3 border border-card-border">
            <h3 className="text-primary font-bold text-xs">ساعت</h3>
            <span className="text-primary text-sm">22:48</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-card-border shadow-card p-4 min-h-[200px] sm:min-h-[280px]">
        <h2 className="text-sm font-bold text-primary mb-3">متن اعلان</h2>
        <p className="text-sm text-black-opacity-60 leading-relaxed">
          محتوای اعلان در این بخش نمایش داده می‌شود.
        </p>
      </div>
    </div>
  );
};

export default NotificationDetail;
