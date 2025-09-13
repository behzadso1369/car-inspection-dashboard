import React from 'react';

import { Dialog, DialogTitle } from '@mui/material';

import { useForm } from 'react-hook-form';


import { Button, PrimaryButton, SecondaryButton } from '../../libs/button/button';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import Input from '../../libs/input/input';
import TextArea from '../../libs/text-area/text-area';





interface EditPieceProps extends React.PropsWithChildren {
  showAddUserModal: boolean;



  setShowAddUserModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddCustomer: React.FunctionComponent<
EditPieceProps
> = ({ showAddUserModal, setShowAddUserModal }) => {
  

    const { register, control,getValues} = useForm({
        defaultValues: {
            "customerId": 1,
            "username": "",
            "password": "",
            "firstName": "",
            "lastName": "",
            "nationalCode": "",
            "mobile": "",
            "birthDate": "",
            "roleId":1
        }
    });

  const onSubmit = () => {
    const data:any = getValues();
    delete data["roleId"];
  const finalData = {
    ...data,
    roles: [
        {"roleId":getValues().roleId}
    ]
    
  }
  instance.post(ApiHelper.get("addCustomer"),finalData).then((res:any) => {
    if(res.data.success) {
        setShowAddUserModal(false);
    }
  })

    
   
  };
 
  return (
    <Dialog
      className="w-full  !overflow-hidden"
      onClose={() => setShowAddUserModal(false)}
      open={showAddUserModal}
     
      maxWidth="xl"
      
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{
        '& .MuiPaper-elevation': {
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !pb-6">
        <span>اضافه کردن  مشتری </span>
        
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

export default AddCustomer;
