import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogTitle, Switch } from '@mui/material';
import { useForm } from 'react-hook-form';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import Input from '../../libs/input/input';
import Button, { PrimaryButton, SecondaryButton } from '../../libs/button/button';
const label = { inputProps: { 'aria-label': 'Switch demo' } };
interface EditPieceProps extends React.PropsWithChildren {
  showAddUserModal: boolean;
  setShowAddUserModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const CreateFlowType: React.FunctionComponent<
EditPieceProps
> = ({ showAddUserModal, setShowAddUserModal }) => {
  const { register, control,getValues} = useForm({});
  const onSubmit = () => {
    const formData = new FormData();
    formData.append("title",getValues()["title"])
    formData.append("name",getValues()["name"])
 
  instance.post(ApiHelper.get("CreateFlowType"),formData).then((res:any) => {
    if(res.data) {
        setShowAddUserModal(false);
    }
  })
  };
  return (
    <Dialog
      className="w-full  "
      onClose={() => setShowAddUserModal(false)}
      open={showAddUserModal}
      maxWidth={false}
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{
        '& .MuiPaper-elevation': {
        
          width: "80% "
        },
      }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !py-3 px-4">
        <span>اضافه کردن      نوع فرآیند </span>
        
      </DialogTitle>
      <div className="grid grid-cols-4 gap-3 !py-3 px-4">
  
  <Input
  placeholder='نام'
  type="text"
  register={register}
  control={control}
  title="name"
  label='نام'
  width="w-full"
/>
  
  <Input
  placeholder='عنوان'
  type="text"
  register={register}
  control={control}
  title="title"
  label='عنوان'
  width="w-full"
/>
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

export default CreateFlowType;
