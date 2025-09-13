import React, { useEffect, useRef, useState } from 'react';
import { Input } from '../../libs/input/input';
import { useForm } from 'react-hook-form';
import { Dropdown } from '../../libs/dropdown/dropdown';


import { Button, PrimaryButton, SecondaryButton } from '../../libs/button/button';

import Datepicker from '../../libs/datepicker/datepicker';



import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import { useNavigate, useParams } from 'react-router-dom';

import TextArea from '../../libs/text-area/text-area';
import { Switch } from '@mui/material';
const label = { inputProps: { 'aria-label': 'Switch demo' } };

const UserDetail: React.FunctionComponent = () => {
    const {id} = useParams();
  const navigate = useNavigate();

  const inputImageRef = useRef<any>(null);


  const [files,setFiles] = useState<any>([]);
  const [image,setImage] = useState<any>(null);

  const [progressImageBar,setProgressImageBar] = useState<boolean>(false);

  
  const { register, control,getValues,reset} = useForm({
    defaultValues: {
        "id": 0,
        "user_full_name": "",
        "password": "",
        "last_login": "2024-09-17T16:45:51.356Z",
        "is_superuser": true,
        "username": "",
        "first_name": "",
        "last_name": "",
        "father_name": "",
        "phone": "",
        "mobile": "",
        "email": "",
        "address": "",
        "post_code": "",
        "birthday": "",
        "avatar": "",
        "received_blog_email": true,
        "received_new_feature_email": true,
        "received_newslater_email": true,
        "login_alert_email": true,
        "order_alert_email": true,
        "notification_order_accept": true,
        "notification_order_canceled": true,
        "notification_email": true,
        "notification_sms": true,
        "parent": "",
        "refal": 0,
        "referral_balance": 0,
        "referral_order_count": 0,
        "referral_rank": "bronze",
        "is_phone_accepted": true,
        "is_mobile_accepted": true,
        "is_email_accepted": true,
        "is_night": true,
        "save_log": true,
        "is_admin": true,
        "is_staff": true,
        "is_active": true,
        "is_2fa": true,
        "choices_2fa": "",
        "is_2fa_active": true,
        "code_2fa": "",
        "token_2fa": "",
        "try_count_2fa": 0,
        "base32_2fa": "",
        "last_create_2fa": "",
        "national_id": "",
        "birth_certificate_id": 0,
        "scan_type": "",
        "status": "",
        "detail": "",
        "authentication_track_id": "",
        "published": "",
        "created": "",
        "update": "",
        "recovery": true,
        "scan_front": "",
        "scan_back": "",
        "trade_rank": 0,
        "groups": [
          0
        ],
        "user_permissions": [
          0
        ],
        "scans": [
          ""
        ]

    }
  });

 
  
  useEffect(() => {
    instance.get(ApiHelper.get("User")  + id).then(res => {
        debugger
        reset(res?.data);
    })
  

   
  }, []);
 


  // const onRowClicked = (params:any) => {
  //   console.log(params);
  //   setOneRow(params.data);

  // }


  
  const uploadImageFile = async () => {
    setProgressImageBar(true);
   
    const file = inputImageRef.current?.files[0];
    setFiles(file);
    setProgressImageBar(false);
    if (file) {

      setFiles(file);

      // Create a preview URL
      const imageUrl = URL.createObjectURL(file);

      setImage(imageUrl);
      setTimeout(() => {
        setProgressImageBar(false);
      },1000)
      
    }

    // setFiles(file);
    

    // const formData = new FormData();
    // formData.append('files', file);
    // // setImage({image: imageUrl});

    // console.log(formData);
    // setProgressImageBar(true);
  };


  const onSubmit = () => {
    // const finalData = {}; 
    const formData = new FormData();
    formData.append('avatar', files);
    const values:any = getValues();

    // Append each form field to FormData
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    instance.patch(ApiHelper.get("User")  + id + "/",formData,{
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }).then((res:any) => {
      if(res?.data) {
        navigate('/users/list');

      }
    })

    
    
   
  };

  return (
    <div className="pb-20">
      <div className="bg-white border border-[#2c3c511a] rounded-xl flex justify-between p-4 mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-primary">ویرایش کاربر</h3>
        </div>
      </div>

    
      
    <div className="grid  grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 pb-8">
  
       <Input
       placeholder='نام'
       type="text"
       register={register}
       control={control}
       title="first_name"
       label='نام'
       width="w-full"
     />
       <Input
           
              type="text"
              register={register}
              control={control}
              title="last_name"
              label='نام خانوادگی'
              width="w-full"
            />
               <Input
           
           type="text"
           register={register}
           control={control}
           title="father_name"
           label='نام پدر'
           width="w-full"
         />
          <Input
           
           type="text"
           register={register}
           control={control}
           title="phone"
           label='تلفن ثابت'
           width="w-full"
         />
          <Input
           
           type="text"
           register={register}
           control={control}
           title="mobile"
           label='تلفن همراه'
           width="w-full"
         />
          <Input
           
           type="text"
           register={register}
           control={control}
           title="email"
           label='ایمیل'
           width="w-full"
         />
          <Input
           
           type="text"
           register={register}
           control={control}
           title="post_code"
           label='کدپستی'
           width="w-full"
         />
          
            
               <Datepicker
                    label={"تاریخ تولد"}
                    register={register}
                    control={control}
                    
                    title={"birthDate"}
                  />
                    <Input
           
           type="number"
           register={register}
           control={control}
           title="parent"
           label='Parent'
           width="w-full"
         />
           <Input
           
           type="number"
           register={register}
           control={control}
           title="refal"
           label='Refal'
           width="w-full"
         />
           <Input
           
           type="number"
           register={register}
           control={control}
           title="referral_balance"
           label='Referral balance'
           width="w-full"
         />
           <Input
           
           type="number"
           register={register}
           control={control}
           title="Referral order count"
           label='referral_order_count'
           width="w-full"
         />
            <Dropdown
                  register={register}
                  control={control}
                  title="referral_rank"
                  label='Referral rank'
                  option={[
                    {id:0,title: "طلایی"},
                    {id:1,title: "نقره ای"},
                    {id:2,title: "برنزی"},
                  ]}
                  fullWidth={true}
                />
                 <Input
           
           type="text"
           register={register}
           control={control}
           title="national_id"
           label='شماره کارت ملی'
           width="w-full"
         />
          <Dropdown
                  register={register}
                  control={control}
                  title="scan_type"
                  label='نوع مدرک'
                  option={[
                    {id:0,title: "کارت ملی"},
                    {id:1,title: "پاسپورت"},
                    {id:2,title: "گواهینامه"},
                  ]}
                  fullWidth={true}
                />
                 <Dropdown
                  register={register}
                  control={control}
                  title="scan_front"
                  label='اسکن رو'
                  option={[]}
                  fullWidth={true}
                />
                 <Dropdown
                  register={register}
                  control={control}
                  title="scan_back"
                  label='اسکن پشت'
                  option={[]}
                  fullWidth={true}
                />
                    <Input
           
           type="text"
           register={register}
           control={control}
           title="scans"
           label='فایل های دیگر'
           width="w-full"
         />
           <Dropdown
                  register={register}
                  control={control}
                  title="status"
                  label='وضعیت احراز هویت'
                  option={[
                    {id:0,title: "در انتظار تایید"},
                    {id:1,title: "منتظر ارسال مدرک"},
                    {id:2,title: "تایید شده"},
                    {id:3,title: "رد شده"},
                  ]}
                  fullWidth={true}
                />
                 <Input
           
           type="text"
           register={register}
           control={control}
           title="detail"
           label='دلیل احراز هویت'
           width="w-full"
         />
            <Dropdown
                  register={register}
                  control={control}
                  title="trade_rank"
                  label='سطح معامله'
                  option={[
                    {id:0,title: "طلایی"},
                    {id:1,title: "نقره ای"},
                    {id:2,title: "برنزی"},
                  ]}
                  fullWidth={true}
                />

         

                  <div className='flex justify-between items-center'>
                    <span>دریافت ایمیل بلاگ</span>
                    <Switch {...register("received_blog_email")} {...label} defaultChecked={false}  />

                  </div>
                  <div className='flex justify-between items-center'>
                    <span>دریافت ایمیل بروزرسانی ها</span>
                    <Switch {...register("received_new_feature_email")}  {...label} defaultChecked={false}  />

                  </div>
                  <div className='flex justify-between items-center'>
                    <span>دریافت ایمیل خبرنامه</span>
                    <Switch {...register("received_newslater_email")}  {...label} defaultChecked={false}  />

                  </div>
                  <div className='flex justify-between items-center'>
                    <span>اطلاعیه ورود به حساب کاربری</span>
                    <Switch {...register("login_alert_email")}  {...label} defaultChecked={false}  />

                  </div>
                  <div className='flex justify-between items-center'>
                    <span>اطلاعیه سفارش جدید</span>
                    <Switch {...register("order_alert_email")}  {...label} defaultChecked={false}  />

                  </div>
                  <div className='flex justify-between items-center'>
                    <span>دریافت تائید برای ثبت سفارش</span>
                    <Switch {...register("notification_order_accept")}  {...label} defaultChecked={false}  />

                  </div>
                  <div className='flex justify-between items-center'>
                    <span>دریافت تائید برای لغو سفارش</span>
                    <Switch {...register("notification_order_canceled")}  {...label} defaultChecked={false}  />

                  </div>
                  <div className='flex justify-between items-center'>
                    <span>اطلاع رسانی با ایمیل</span>
                    <Switch {...register("notification_email")}  {...label} defaultChecked={false}  />

                  </div>
                  <div className='flex justify-between items-center'>
                    <span>اطلاع رسانی با پیامک</span>
                    <Switch {...register("notification_sms")}  {...label} defaultChecked={false}  />

                  </div>
                  <div className='flex justify-between items-center'>
                    <span>تلفن ثابت تایید شده است</span>
                    <Switch {...register("is_phone_accepted")}  {...label} defaultChecked={false}  />

                  </div>
                  <div className='flex justify-between items-center'>
                    <span>تلفن همراه تایید شده است</span>
                    <Switch {...register("is_mobile_accepted")}  {...label} defaultChecked={false}  />

                  </div>
                  <div className='flex justify-between items-center'>
                    <span>ایمیل تایید شده است</span>
                    <Switch {...register("is_email_accepted")}  {...label} defaultChecked={false}  />

                  </div>
                  <div className='flex justify-between items-center'>
                    <span>Is night</span>
                    <Switch {...register("is_night")}  {...label} defaultChecked={false}  />

                  </div>
                  <div className='flex justify-between items-center'>
                    <span>Save log</span>
                    <Switch {...register("save_log")}  {...label} defaultChecked={false}  />

                  </div>
                  <div className='flex justify-between items-center'>
                    <span>Is admin</span>
                    <Switch {...register("is_admin")}  {...label} defaultChecked={false}  />

                  </div>
                  <div className='flex justify-between items-center'>
                    <span>Is staff</span>
                    <Switch {...register("is_staff")}  {...label} defaultChecked={false}  />

                  </div>
                  <div className='flex justify-between items-center'>
                    <span>Is active</span>
                    <Switch {...register("is_active")}  {...label} defaultChecked={false}  />

                  </div>
                  <div className='flex justify-between items-center'>
                    <span>Is 2fa</span>
                    <Switch {...register("is_2fa")}  {...label} defaultChecked={false}  />

                  </div>
                
       
               
                
            
         
            <div className="col-span-3 p-0">
                <TextArea
        control={control}
        title='address'
        register={register}
        label='آدرس'
        
        />
                </div>



             
              <div className='mt-8 col-span-2 flex'>
        <div className="flex ">
    
    <div className='w-1/2'>
      <label
        htmlFor="imageFile"
        className=" rounded-md px-3 py-1 text-sm bg-gray-700 text-white hover:bg-blue-700 focus:bg-blue-opacity-90 focus:shadow-primary-focus whitespace-nowrap cursor-pointer"
      >
        آپلود عکس   
      </label>
      <input
        name="imageFile"
        id="imageFile"
        type="file"
        ref={inputImageRef}
        onInput={uploadImageFile}
        style={{ visibility: 'hidden' }}
      />

    </div>
    {progressImageBar ? <span>فایل عکس در حال آپلود است</span> : <div>
    {image &&  <div className='w-auto relative p-2 border-2 border-slate-400 flex flex-col items-center'><img width="50px" height="50px" src={image}/></div>}
    </div>}

  
  

    {/* <Button
      title={'ذخیره   '}
      active={true}
      style={PrimaryButton}
      onClick={uploadFile}
    >
      {' '}
      ذخیره
    </Button> */}
    <div className="flex "></div>
        </div>
      
        </div>
         
        
  
     
           {/* <div className='col-span-3 mt-6'>
           <Uploader  />
           </div> */}
         
      
        


                
             

          
            
           
         


             
          
    </div>
    <div className='col-span-3 flex justify-end mt-8'>
              <Button
              title='لغو'
              active={true}
              style={SecondaryButton}
            />
              <Button
              title='ویرایش'
              active={true}
              style={PrimaryButton}
              onClick={onSubmit}
            />
            
              </div>
    </div>
  );
};

export default UserDetail;
