import React, { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Input } from '../../libs/input/input';
import { Button, PrimaryButton } from '../../libs/button/button';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import loginLargeUrl from '../../assets/images/login-back2.jpg'

import "./Login.scss";

import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';

const Login: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [otpId,setOtpId] = useState<any>(null)
 
  
 
 
  const { register, handleSubmit, control,getValues,reset } = useForm();
 

  const onSubmit = () => {
    if(otpId ! == null) {
      instance.post(ApiHelper.get("otp"),getValues()).then(res => {
        setOtpId(res.data.id);
        reset();
    
      })

    }else {
      instance.post(ApiHelper.get("verifyOtp"), {id:otpId,...getValues()}).then(res => {
        localStorage.setItem("token",res.data.access);
        navigate('/home');
    
      })
    }
 
  
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
      {/* <img
      alt="logo"
      className="w-2/3 h-36 flex justify-center items-center"
      src={smallLargeUrl}
    /> */}
        <h1 className=" font-bold text-3xl text-center my-20"> ورود به داشبورد  کارچک</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" py-8 border border-[##f7f7f7] rounded-xl px-8"
        >
           <h3 className='mb-8'>شماره موبایل وارد شده باید به نام خودتان باشد.</h3>
          <div className='mb-8'>
            {otpId === null ? (  <Input
              placeholder="لطفا شماره موبایل خود را وارد نمایید"
              type="text"
              register={register}
              title="mobile"
              control={control}
              label="شماره موبایل"
              width="w-full lg:w-full xl:w-full"
            />) : (  <Input
              placeholder="کد ارسال شده را وارد نمایید"
              type="text"
           
              register={register}
              title="otp"
              control={control}
              label="کد تایید"
              width="w-80"
            />)}
          
          </div>

        

          <div className="flex w-full justify-center items-center mt-3 ">
         
          
            <Button
            
          
              title={otpId === null ? "شماره همراه" : "کد تایید"}
              active={true}
              icon={faArrowLeft}
              style={PrimaryButton + "w-3/5 flex justify-center h-10 lg:w-full xl:w-full"}
              onClick={() => {
                navigate("/home")
              }}
            />
          </div>
        </form>
      </div>
      <div className="hidden lg:col-span-1 xl:col-span-1 login-title lg:flex xl:flex flex-col justify-between">
     
        
         

        
       
      </div>
     
    </div>
       
 

  );
};

export default Login;
