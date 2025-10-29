import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogTitle, Switch, useMediaQuery, useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import Input from '../../libs/input/input';
import Button, { PrimaryButton, SecondaryButton } from '../../libs/button/button';
interface EditPieceProps extends React.PropsWithChildren {
  showAddUserModal: boolean;
  setShowAddUserModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const Register: React.FunctionComponent<
EditPieceProps
> = ({ showAddUserModal, setShowAddUserModal }) => {
    const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { register, control,getValues} = useForm({ });
  const onSubmit = () => {
  instance.post(ApiHelper.get("register"),getValues()).then((res:any) => {
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
          width: isMobile ? "90%" : "30%"
        },
      }}
      
      
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !py-3 px-4">
        <span>ثبت نام کاربر</span>
      </DialogTitle>
      <div className="!py-3 px-4">
  <Input
  placeholder=''
  type="text"
  register={register}
  control={control}
  title="userName"
  label='نام کاربری'
  width="w-full"
/>
  <Input
  placeholder='ایمیل'
  type="text"
  register={register}
  control={control}
  title="email"
  label='نام'
  width="w-full"
/>
  <Input
  placeholder='رمز عبور'
  type="text"
  register={register}
  control={control}
  title="password"
  label='رمز عبور'
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

export default Register;
