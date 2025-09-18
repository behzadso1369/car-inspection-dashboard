import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogTitle, Switch } from '@mui/material';
import { useForm } from 'react-hook-form';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import Input from '../../libs/input/input';
import Button, { PrimaryButton, SecondaryButton } from '../../libs/button/button';
interface EditPieceProps extends React.PropsWithChildren {
  showAddUserModal: boolean;
  setShowAddUserModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const AddRole: React.FunctionComponent<
EditPieceProps
> = ({ showAddUserModal, setShowAddUserModal }) => {
  const { register, control,getValues} = useForm({ });
  const onSubmit = () => {
  instance.post(ApiHelper.get("createRole"),getValues()).then((res:any) => {
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
       maxWidth="xl"
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{
        '& .MuiPaper-elevation': {
          width: "30% "
        },
      }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !py-3 px-4">
        <span>اضافه کردن  نقش </span>
      </DialogTitle>
      <div className="!py-3 px-4">
  <Input
  placeholder='نام نقش'
  type="text"
  register={register}
  control={control}
  title="roleName"
  label='نام'
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

export default AddRole;
