import React, { useEffect, useState } from 'react';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import OrderChart from './OrderChart';
import UserChart from './UserChart';
import OrderPattern from './OrderPattern';
import OtpSends from './OtpSends';
import { KpiCard } from '../../components/dashboard/DashboardCard';

const HomePage: React.FunctionComponent = () => {
  const [data, setData] = useState<any>(null);

  const getAllUser = () => {
    instance.get(ApiHelper.get('GetChart')).then((res: any) => {
      setData(res?.data?.resultObject);
    });
  };

  useEffect(() => {
    getAllUser();
  }, []);

  const allOrders = data?.AllOrders?.[0]?.Count ?? '—';
  const completed = data?.OrdersCompleted?.[0]?.Count ?? '—';
  const notCompleted = data?.OrdersNotCompleted?.[0]?.Count ?? '—';
  const usersCount =
    data?.UsersSite?.reduce?.(
      (sum: number, item: any) => sum + (Number(item?.Data) || 0),
      0
    ) ?? '—';

  const today = new Date().toLocaleDateString('fa-IR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="w-full space-y-4 sm:space-y-5">
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-brand/15 bg-gradient-to-l from-brand via-brand to-brand-dark text-white p-5 sm:p-7 shadow-[0_12px_40px_rgba(2,55,254,0.22)]">
        <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -right-8 bottom-0 w-32 h-32 rounded-full bg-white/5 blur-xl pointer-events-none" />
        <div className="relative z-10">
          <p className="text-xs sm:text-sm text-white/70 mb-1">{today}</p>
          <h1 className="text-xl sm:text-2xl font-bold !font-peydaExtraBold leading-relaxed">
            داشبورد کارماچک
          </h1>
          <p className="text-xs sm:text-sm text-white/75 mt-1.5 max-w-xl leading-6">
            خلاصه وضعیت سفارشات، کاربران و عملکرد روزانه تیم کارشناسی
          </p>
        </div>
      </section>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="کل سفارشات" value={allOrders} tone="brand" />
        <KpiCard label="تکمیل‌شده" value={completed} tone="success" />
        <KpiCard label="ناتمام" value={notCompleted} tone="warning" />
        <KpiCard label="کاربران سایت" value={usersCount} tone="neutral" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <UserChart piceName={'کاربران'} allData={data?.UsersSite} />
        <OrderChart piceName={'سفارشات'} allData={data} />
        <OtpSends piceName={'پیام های ارسال شده'} allData={data} />
        <OrderPattern piceName={'روند سفارشات'} allData={data?.Orders} />
      </div>
    </div>
  );
};

export default HomePage;
