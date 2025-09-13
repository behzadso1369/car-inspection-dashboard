import React, { useEffect, useRef, useState } from 'react';

import { Dialog, DialogTitle, Switch } from '@mui/material';

import { useForm } from 'react-hook-form';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import Input from '../../libs/input/input';

import Dropdown from '../../libs/dropdown/dropdown';

import Button, { PrimaryButton, SecondaryButton } from '../../libs/button/button';

const label = { inputProps: { 'aria-label': 'Switch demo' } };





interface EditPieceProps extends React.PropsWithChildren {
  showAddUserModal: boolean;



  setShowAddUserModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddBankAccount: React.FunctionComponent<
EditPieceProps
> = ({ showAddUserModal, setShowAddUserModal }) => {

  const [userList, setUserList] = useState<any>([]);
  const [bankNames, setBankNames] = useState<any>([]);

  const { register, control,getValues} = useForm({
    defaultValues: {
        "user_full_name": "",
        "bank_name": "",
        "shaba": "",
        "card": "",
        "status": "",
        "status_detail": "",
        "is_default": true,
        "published": "",
        "bank": 0,
        "user": 0

    }
  });
    const onSubmit = () => {
  instance.post(ApiHelper.get("BankAccounts"),getValues()).then((res:any) => {
    if(res.data) {
        setShowAddUserModal(false);
    }
  })

    
   
  };
  const getUserList = () => {
    instance.get(ApiHelper.get("User"),{params: {
      status: "",
      page: 1,
      count: 100000000000
    }}).then((res:any) => {
      setUserList(res?.data?.results)
    })
  }
  const getBankNames = () => {
    instance.get(ApiHelper.get("BankList")).then(res => {
      setBankNames(res?.data)

    })
  }
  useEffect(() => {
    // getBankList();
    getUserList();
    getBankNames();
  
  },[])
  return (
    <Dialog
      className="w-full  "
      onClose={() => setShowAddUserModal(false)}
      open={showAddUserModal}
      maxWidth={false}
    
      
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{
        '& .MuiPaper-elevation': {
        
          width: "40% "
        },
      }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !py-3 px-4">
        <span>اضافه کردن  حساب بانکی </span>
        
      </DialogTitle>
      <div className="grid grid-cols-3 gap-3 py-8 px-3">
  
 
      <Input
       
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
            <div className='col-span-3 flex justify-end mt-8'>
              <Button
              title='لغو'
              active={true}
              style={SecondaryButton}
              onClick={() =>setShowAddUserModal(false)}
            />
              <Button
              title='اضافه کردن'
              active={true}
              style={PrimaryButton}
              onClick={onSubmit}
            />
            
              </div>
          
            
           

</div>
   
    </Dialog>
  );
};

export default AddBankAccount;
