import React, { useEffect, useState } from 'react';
import { Input } from '../../libs/input/input';
import { useForm } from 'react-hook-form';
import { Dropdown } from '../../libs/dropdown/dropdown';


import { Button, PrimaryButton, SecondaryButton } from '../../libs/button/button';




import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';

import {  useParams } from 'react-router-dom';


import { Switch } from '@mui/material';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const BankAccountDetail: React.FunctionComponent = () => {
    const {id} = useParams();
  const [bankList, setBankList] = useState<any>([]);
  const [userList, setUserList] = useState<any>([]);
  const [bankNames, setBankNames] = useState<any>([]);


 

  
  const { register, control,getValues,reset} = useForm({
    defaultValues: {
        "user_full_name": "",
        "published": "2024-06-29T08:15:10.104964Z",
        "bank_name": "",
        "shaba": "",
        "card": "",
        "status": "",
        "status_detail": "",
        "is_default": true,
        "bank": 0,
        "user": 0

    }
  });

 
  
  useEffect(() => {
    console.log(bankList);
    instance.get(ApiHelper.get("BankAccounts") + "/" + id).then(res => {
      
        
        reset({
          "user_full_name":  res?.data?.user_full_name,
          "bank_name": res?.data?.bank_name,
          "shaba": res?.data?.shaba,
          "card": res?.data?.card,
          "status": res?.data?.status,
          "status_detail": res?.data?.status_detail,
          "is_default": res?.data?.is_default,
          "bank": res?.data?.bank,
          "user": res?.data?.user,
          "published": "2024-06-29T08:15:10.104964Z",
        });
    })
    getBankList();
    getUserList();
    getBankNames();
  

   
  }, []);
  const getBankList = () => {
    instance.get(ApiHelper.get("BankList")).then((res:any) => {
      setBankList(res?.data?.results)
    })
  }

  const getUserList = () => {
    instance.get(ApiHelper.get("User"),{params: {
      status: "",
      page: 1,
      count: 100000000000
    }}).then((res:any) => {
      setUserList(res?.data?.results)
    })
  }
 




  const onSubmit = () => {
    instance.put(ApiHelper.get("BankAccounts") + "/" + id + "/" , getValues()).then((res:any) => {
      setBankList(res?.data?.results)
    })
   
   

    
    
   
  };
  const getBankNames = () => {
    instance.get(ApiHelper.get("BankList")).then(res => {
      setBankNames(res?.data)

    })
  }

  return (
    <div className="pb-20">
      <div className="bg-white border border-[#2c3c511a] rounded-xl flex justify-between p-4 mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-primary">ویرایش حساب بانکی</h3>
        </div>
      </div>

    
      
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-3 pb-8">
  
       <Input
       disabled
       placeholder='نام و نام خانوادگی'
       type="text"
       register={register}
       control={control}
       title="user_full_name"
       label='نام و نام خانوادگی'
       width="w-full"
     />
   
               {/* <Datepicker
                    label={"تاریخ ثبت"}
                    register={register}
                    control={control}
                    
                    title={"created"}
                  /> */}
                     <Input
              placeholder='شماره شبا'
           
              type="text"
              register={register}
              control={control}
              title="shaba"
              label='شماره شبا'
              width="w-full"
            />
             <Input
              placeholder='شماره کارت'
           
              type="text"
              register={register}
              control={control}
              title="card"
              label='شماره کارت'
              width="w-full"
            />
              
              <Dropdown
                  register={register}
                  control={control}
                  title="bank"
                  label='بانک'
                  option={bankNames?.map((item:any) => {
                    console.log(item);
                    
                    return {
                      id: item?.id,
                      title:item?.name
                    }
                  })}
                  fullWidth={true}
                />
          <Dropdown
                  register={register}
                  control={control}
                  title="user"
                  label='کاربر'
                  option={userList}
                  fullWidth={true}
                />
                <Dropdown
                  register={register}
                  control={control}
                  title="status"
                  label='وضعیت'
                  option={[
                    {id:"confirmed",title: "تایید شده"},
                    {id:"pending",title: "در حال بررسی"},
                    {id:"unverified",title: "تایید نشده"},
                  ]}
                  fullWidth={true}
                />
                <Input
              placeholder='اطلاعات تکمیلی'
           
              type="text"
              register={register}
              control={control}
              title="status_detail"
              label='اطلاعات تکمیلی'
              width="w-full"
            />
                 
          

         

                  <div className='flex justify-between items-center'>
                    <span>پیش فرض باشد؟</span>
                    <Switch {...register("is_default")} {...label} defaultChecked={false}  />

                  </div>
                
                 
                

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

export default BankAccountDetail;
