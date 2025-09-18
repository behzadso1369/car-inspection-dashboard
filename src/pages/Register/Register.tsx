import React, { useEffect, useState } from 'react';
import {  NavLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Input } from '../../libs/input/input';
import { Button, PrimaryButton } from '../../libs/button/button';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import loginLargeUrl from '../../assets/images/login-back2.jpg'
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import PasswordInput from '../../libs/password-input/password-input';
const Register: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, control,getValues,reset } = useForm();
  const onSubmit = () => {
    instance.post(ApiHelper.get("register"),getValues()).then(res => {
      reset();
    })
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token) {
      navigate('/home');
    }
  },[])
  return (
      <div
      style={{
        direction: 'rtl',
        background: ` url(${loginLargeUrl})`,
        backgroundSize: '100%',
        backgroundRepeat: 'repeat-y',
        position: 'relative',
        backgroundPosition: 'center',
      }}
      className="login__main px-4 lg:px-0 xl:px-0 flex items-center justify-center  xl:grid lg:grid xl:grid-cols-2 lg:grid-cols-2 h-screen "
    >
       <div className="h-auto w-full lg:w-full xl:w-full mt-20 lg:mt-0 xl:mt-0 col-span-2 lg:col-span-1 xl:col-span-1 login-form   lg:py-10 xl:py-10 xl:h-full lg:h-full bg-white xl:px-40 lg:px-40 ">
        <h1 className=" font-bold text-3xl text-center my-20"> ورود به داشبورد  کارچک</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" py-8 border border-[##f7f7f7] rounded-xl px-8"
        >
          <div className='mb-8'>
           <Input
              placeholder="لطفا  نام کاربری خود را وارد نمایید"
              type="text"
              register={register}
              title="UserName"
              control={control}
              label="نام کاربری"
              width="w-full lg:w-full xl:w-full"
            />
          </div>
          <div className="mb-8">
          <Input
            placeholder={'ایمیل'}
            label={'ایمیل'}
            type="text"
            register={register}
            control={control}
            title="Email"
         
          />
          </div>
          <div className='mb-8'>
          <PasswordInput
         placeholder="لطفا   رمز عبور  خود را وارد نمایید"
         register={register}
         title="Password"
         control={control}
         label="رمز عبور"
         width="w-full lg:w-full xl:w-full"
            />
          </div>
          <div className="flex w-full justify-center items-center mt-3 ">
            <Button
            title='ورود'
              active={true}
              icon={faArrowLeft}
              style={PrimaryButton + "w-3/5 flex justify-center h-10 lg:w-full xl:w-full"}
            />
          </div>
          <div className=" w-full flex justify-center my-4">
          <NavLink className="text-blue-600" to={"/login"}>رفتن به صفحه لاگین</NavLink>
        </div>
        </form>
       
      </div>
    </div>
  );
};
export default Register;
