import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Input } from '../../libs/input/input';
import { Button, PrimaryButton } from '../../libs/button/button';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import loginLargeUrl from '../../assets/images/login-back2.jpg';
import logoUrl from '../../assets/images/carmacheck-logo.png';
import './Login.scss';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import PasswordInput from '../../libs/password-input/password-input';
import {
  getAccessToken,
  getDefaultPathForRole,
  persistRolesFromToken,
} from '../../utils/auth-role';

const Login: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, control, getValues, reset } = useForm();

  const onSubmit = () => {
    instance.post(ApiHelper.get('login'), getValues()).then((res) => {
      if (res.data) {
        const token = res.data.resultObject.accessToken;
        localStorage.setItem('accessToken', token);
        persistRolesFromToken(token);
        navigate(getDefaultPathForRole(token));
      }
      reset();
    });
  };

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      persistRolesFromToken(token);
      navigate(getDefaultPathForRole(token));
    }
  }, []);

  return (
    <div className="login-page min-h-screen min-h-[100dvh] flex flex-col lg:grid lg:grid-cols-2" dir="rtl">
      <div className="login-page__hero relative hidden lg:flex flex-col justify-between p-10 xl:p-14 text-white overflow-hidden">
        <div
          className="absolute inset-0 scale-105"
          style={{
            backgroundImage: `url(${loginLargeUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="login-page__hero-overlay absolute inset-0" />
        <div className="relative z-10">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/15">
            <img src={logoUrl} alt="کارماچک" className="h-12 w-auto object-contain brightness-0 invert" />
          </div>
        </div>
        <div className="relative z-10 max-w-lg login-page__fade-up">
          <p className="text-sm text-white/70 mb-3">پنل مدیریت یکپارچه</p>
          <h2 className="text-3xl xl:text-4xl font-bold !font-peydaExtraBold leading-relaxed">
            کارشناسی خودرو،
            <br />
            دقیق و حرفه‌ای
          </h2>
          <p className="mt-4 text-sm xl:text-base text-white/75 leading-7 max-w-md">
            مدیریت سفارش‌ها، کارشناسان، گزارش‌ها و مالی در یک داشبورد منسجم برای تیم عملیاتی شما.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-xs text-white/80">
            <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15">سفارشات</span>
            <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15">کارشناسان</span>
            <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15">گزارش‌ها</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-4 py-10 sm:px-8 lg:px-12 xl:px-20 relative login-page__form-side">
        <div className="absolute inset-0 lg:hidden pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `url(${loginLargeUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0237fe]/25 via-surface/90 to-surface" />
        </div>

        <div className="relative z-10 w-full max-w-md mx-auto login-page__fade-up">
          <div className="flex flex-col items-center mb-8 lg:items-start">
            <div className="lg:hidden mb-5">
              <img src={logoUrl} alt="کارماچک" className="h-14 w-auto object-contain drop-shadow-sm" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary text-center lg:text-right !font-peydaExtraBold">
              خوش آمدید
            </h1>
            <p className="text-sm text-black-opacity-60 mt-2 text-center lg:text-right leading-6">
              برای ورود به داشبورد کارماچک، اطلاعات حساب خود را وارد کنید
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white/95 backdrop-blur border border-card-border rounded-3xl p-5 sm:p-8 shadow-[0_12px_40px_rgba(2,55,254,0.08)]"
          >
            <div className="mb-5">
              <Input
                placeholder="نام کاربری خود را وارد نمایید"
                type="text"
                register={register}
                title="UserName"
                control={control}
                label="نام کاربری"
                width="w-full"
              />
            </div>
            <div className="mb-7">
              <PasswordInput
                placeholder="رمز عبور خود را وارد نمایید"
                register={register}
                title="Password"
                control={control}
                label="رمز عبور"
                width="w-full"
              />
            </div>
            <Button
              title="ورود به داشبورد"
              active={true}
              icon={faArrowLeft}
              style={
                PrimaryButton +
                ' !ml-0 w-full min-h-[56px] sm:min-h-[52px] flex justify-center items-center rounded-2xl !bg-brand hover:!bg-brand-dark text-base sm:text-[1.0625rem] shadow-[0_8px_24px_rgba(2,55,254,0.28)]'
              }
            />
          </form>

          <p className="mt-6 text-center text-[11px] text-black-opacity-40">
            © کارماچک — پنل مدیریت کارشناسی خودرو
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
