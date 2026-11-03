import React from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import logoUrl from '../../assets/images/carmacheck-logo.png';
import { clearFinanceAuth, isFinanceLoggedIn } from './financeAuth';

const FinanceLayout: React.FunctionComponent = () => {
  const navigate = useNavigate();

  if (!isFinanceLoggedIn()) {
    return <Navigate to="/finance/login" replace />;
  }

  const logout = () => {
    clearFinanceAuth();
    navigate('/finance/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface" dir="rtl">
      <header className="bg-white border-b border-card-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="" className="h-9" />
          <div>
            <p className="text-sm font-bold text-primary !font-peydaBold">پرتال مالی کارماچک</p>
            <p className="text-[11px] text-black-opacity-50">گزارش پرداخت — بدون اکشن دیجی‌پی</p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="min-h-[40px] px-4 rounded-xl border border-card-border text-sm text-primary"
        >
          خروج
        </button>
      </header>
      <main className="p-3 sm:p-5 max-w-[1400px] mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default FinanceLayout;
