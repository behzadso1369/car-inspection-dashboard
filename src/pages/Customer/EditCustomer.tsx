import React, { useEffect, useState } from 'react';

import { Dialog, DialogTitle, Switch } from '@mui/material';

import { useForm } from 'react-hook-form';


import { Button, PrimaryButton, SecondaryButton } from '../../libs/button/button';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import Input from '../../libs/input/input';

import TextArea from '../../libs/text-area/text-area';

const label = { inputProps: { 'aria-label': 'Switch demo' } };





interface EditPieceProps extends React.PropsWithChildren {
  showEditUserModal: boolean;
  customerId:number;
  userName:string;



  setShowEditUserModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditCustomer: React.FunctionComponent<
EditPieceProps
> = ({ showEditUserModal, setShowEditUserModal,customerId,userName }) => {
    const [isActive,setIsActive] = useState<boolean>(true)

    const { register, control,getValues,reset} = useForm();

 


  const onSubmit = () => {
    const data:any = getValues();
    delete data["roleId"];
  const finalData = {
   id:customerId,
   title: getValues().title,
   address: getValues().address,
   description: getValues().description,
   isActive: isActive
    
  }
  instance.put(ApiHelper.get("editCustomer"),finalData).then((res:any) => {
    if(res.data.success) {
        setShowEditUserModal(false);
    }
  })

    
   
  };
  useEffect(() => {
    instance.get(ApiHelper.get('getCustomerById') , {params: {customerId:customerId}}).then((res:any) => {
      reset(res.data.data);
     
    })
  
  },[])
  return (
    <Dialog
      className="w-full  !overflow-hidden"
      onClose={() => setShowEditUserModal(false)}
      open={showEditUserModal}
     
      maxWidth="xl"
      
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{
        '& .MuiPaper-elevation': {
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle className="w-full  flex items-center gap-3 border-b !pb-6">
        <span className='text-sm'> ویرایش  مشتری</span>
     
        <span className='text-sm text-blue-600'>{userName}</span>
        
      </DialogTitle>
      <div className="grid grid-cols-4 gap-8 px-10   pb-8 py-5">
        <div className='col-span-3'>
        <Input

type="text"
register={register}
control={control}
title="title"
label='عنوان مشتری'
width="w-full"
/>
<div className='mt-4'>
  <div className='mt-3'>وضعیت مشتری</div>
  <span>{isActive ? "فعال" : "غیر فعال"}</span>
  <Switch {...label} defaultChecked={true} onChange={(e:any) => setIsActive(e.target.checked)} />
</div>

        </div>
        <div className='col-span-2'>
        <TextArea
    control={control}
    title='address'
    register={register}
    label='آدرس مشتری'
    
    />
        </div>
        <div className='col-span-2'>
        <TextArea
    control={control}
    title='description'
    register={register}
    label='توضیحات'
    
    />
        </div>
      
     
      
     
        
 
 
    
     
       
      
      
        <div className='col-span-4 flex justify-end mt-8'>
              <Button
              title='لغو'
              active={true}
              style={SecondaryButton}
              onClick={() =>setShowEditUserModal(false)}
            />
              <Button
              title='ویرایش'
              active={true}
              style={PrimaryButton}
              onClick={onSubmit}
            />
            
              </div>
            </div>
    
   
    </Dialog>
  );
};

export default EditCustomer;
