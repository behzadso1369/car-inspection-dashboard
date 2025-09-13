import React, { useEffect, useRef, useState } from 'react';
import { Input } from '../../libs/input/input';
import { useForm } from 'react-hook-form';
import { Dropdown } from '../../libs/dropdown/dropdown';


import { Button, PrimaryButton, SecondaryButton } from '../../libs/button/button';





import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';

import { useNavigate, useParams } from 'react-router-dom';


import { Switch } from '@mui/material';
const label = { inputProps: { 'aria-label': 'Switch demo' } };

const OrderDetail: React.FunctionComponent = () => {
    const {id} = useParams();
  const navigate = useNavigate();




 
  const [bankAccounts,setBankAccounts] = useState<any>(null);  
  const [userList, setUserList] = useState<any>([]);
  const [tranactionsList, setTransactionList] = useState<any>([]);



  
  const { register, control,reset} = useForm({
    defaultValues: {
      "user_full_name": "",
      "destination_name": "",
      "source_name": "",
      "source_amount": 3,
      "destination_amount": 7,
      "gas": 0,
      "result": "",
      "service_result": "",
      "order_data": "",
      "is_schedule": true,
      "is_finished": true,
      "is_manual": true,
      "type": "",
      "change": "",
      "published": "",
      "status": "",
      "status_details": "",
      "source_asset": 0,
      "destination_asset": 0,
      "bank_account": 0,
      "account": 0,
      "transaction": 0

    }
  });
  const getUserList = () => {
    instance.get(ApiHelper.get("User"),{params: {
      status: "",
      page: 1,
      count: 100000000000
    }}).then((res:any) => {
      setUserList(res?.data?.results)
    })
  }
  const getTransactions = () => {
    instance.get(ApiHelper.get("Transaction"),{params: {
      status: "",
      page: 1,
      count: 100000000000
    }}).then((res:any) => {
      tranactionsList(res?.data?.results)
    })
  }
 

 
  
  useEffect(() => {
    getUserList();
    getTransactions();
    getBankAccounts();
    instance.get(ApiHelper.get("Order") + "/" + id).then(res => {
        
        reset(res?.data);
    })
  

   
  }, []);
  const getBankAccounts = () => {
    instance.get(ApiHelper.get("BankAccounts"),{params: {
      status: "",
      page: 1,
      count: 100000000
    }}).then((res:any) => {
      setBankAccounts(res?.data?.results)
    })
  }
 


 

  const onSubmit = () => {
    const finalData = {};

    instance.post(ApiHelper.get("AddRequest"),finalData).then((res:any) => {
      if(res?.data?.success) {
        navigate('/order/receive-order');

      }
    })

    
    
   
  };

  return (
    <div className="pb-20">
      <div className="bg-white border border-[#2c3c511a] rounded-xl flex justify-between p-4 mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-primary">ویرایش سفارش</h3>
        </div>
      </div>

    
      
    <div className="grid  grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-3 pb-8">
  
       <Input
       placeholder='نام و نام خانوادگی'
       type="text"
       register={register}
       control={control}
       title="user_full_name"
       disabled
       label='نام و نام خانوادگی'
       width="w-full"
     />
       <Input
              placeholder='شماره تماس'
           
              type="text"
              register={register}
              control={control}
              title="mobile"
              disabled
              label='شماره تماس'
              width="w-full"
            />
               {/* <Input
           
           type="text"
           register={register}
           control={control}
           title="father_name"
           label='نام پدر'
           width="w-full"
         /> */}
          <Input
                 placeholder='تاریخ ثبت'
           
           type="text"
           register={register}
           control={control}
           disabled
           title="published"
           label=' تاریخ ثبت'
           width="w-full"
         />
          <Input
          placeholder='مقدار دریافتی'
          disabled
           
           type="text"
           register={register}
           control={control}
           title="source_amount"
           label='مقدار دریافتی'
           width="w-full"
         />
          {/* <Input
                 placeholder=' مقدار تحویلی  '
           
           type="text"
           register={register}
           control={control}

           title="email"
           label='destination_amount'
           width="w-full"
         /> */}
            <Dropdown
                  register={register}
                  control={control}
                  title="source_asset"
                  label='ارز مبدا'
                  disabled
                  option={[
                    {id:3,title: "طلا"},
                    {id:7,title: "تومان"},
                  ]}
                  fullWidth={true}
                />
                  <Dropdown
                  disabled
                  register={register}
                  control={control}
                  title="destination_asset"
                  label='ارز مقصد'
                  option={[
                    {id:3,title: "طلا"},
                    {id:7,title: "تومان"},
                   
                  ]}
                  fullWidth={true}
                />
                 <Input
                 placeholder='کارمزد'
           
           type="number"
           disabled
           register={register}
           control={control}
           title="gas"
           label='کارمزد'
           width="w-full"
         />
          {/* <Dropdown
                  register={register}
                  control={control}
                  title="bank_account"
                  label='حساب بانکی'
                  option={bankAccounts?.map((item:any) => {
                    return {
                      title: item?.bank_name,
                      id:item?.id
                      
                    }
                  })}
                  fullWidth={true}
                />
          <Dropdown
                  register={register}
                  control={control}
                  title="account"
                  label='کاربر'
                  option={userList?.map((item:any) => {
                    return {
                      title: item?.user_full_name,
                      id:item?.id
                      
                    }
                  })}
                  fullWidth={true}
                />
          <Dropdown
                  register={register}
                  control={control}
                  title="transaction"
                  label='تراکنش'
                  option={userList?.map((item:any) => {
                    return {
                      title: item?.id,
                      id:item?.id
                      
                    }
                  })}
                  fullWidth={true}
                /> */}
          <Dropdown
                  register={register}
                  control={control}
                  title="type"
                  label=' نوع'
                  disabled
                  option={[
                    {id:"sell",title: "خرید"},
                    {id:"purchase",title: "فروش"},
                    {id:"swap",title: "تبدیل"},
                  ]}
                  fullWidth={true}
                />
          {/* <Dropdown
                  register={register}
                  control={control}
                  title="change"
                  label='change'
                  option={[
                    {id:"source",title: "source"},
                    {id:"destination",title: "destination"},
          
                  ]}
                  fullWidth={true}
                /> */}
          <Dropdown
                  register={register}
                  control={control}
                  title="status"
                  label='وضعیت'
                  disabled
                  option={[
                    {id:"deposit",title: "واریز شده"},
                    {id:"pending",title: "در حال بررسی"},
                    {id:"unpaid",title: "پرداخت نشده"},
                    {id:"accepted",title: "ثبت شده"},
                    {id:"delivered",title: "تحویل گردیده"},
                    {id:"suspended",title: "معلق"},
                    {id:"canceled",title: "کنسل شده"},
                    {id:"deposit",title: "در انتظار واریز"},
                    {id:"deposited",title: "واریز شده"},
                
                  ]}
                  fullWidth={true}
                />
            
               
                    <Input
                    placeholder='اطلاعات تکمیلی'
                    disabled
           
           type="text"
           register={register}
           control={control}
           title="status_details"
           label='اطلاعات تکمیلی'
           width="w-full"
         />
          

         

                  {/* <div className='flex justify-between items-center'>
                    <span>آیا سفارش با قیمت مشخص است ؟</span>
                    <Switch {...register("is_schedule")} {...label} defaultChecked={false}  />

                  </div>
                  <div className='flex justify-between items-center'>
                    <span> سفارش با موفقیت تحویل گردید ؟</span>
                    <Switch {...register("is_finished")} {...label} defaultChecked={false}  />

                  </div>
                  <div className='flex justify-between items-center'>
                    <span>     سفارش دستی می باشد ؟ </span>
                    <Switch {...register("is_manual")} {...label} defaultChecked={false}  />

                  </div> */}
                 
                

    </div>
    {/* <div className='col-span-3 flex justify-end mt-8'>
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
            
              </div> */}
    </div>
  );
};

export default OrderDetail;
