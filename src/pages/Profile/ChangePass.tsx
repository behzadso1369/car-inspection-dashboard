import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Dialog, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Button, PrimaryButton, SecondaryButton } from '../../libs/button/button';
import { Input } from '../../libs/input/input';


interface ChangePassProps extends React.PropsWithChildren {
  changePass: boolean;
  setChangePass: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChangePass: React.FunctionComponent<ChangePassProps> = ({
  changePass,
  setChangePass,
}) => {

  const { register, control, handleSubmit } = useForm();

  const submitHandler = () => {
    console.log('test');
  };

  return (
    <Dialog
      className="w-full relative !overflow-hidden"
      onClose={() => setChangePass(false)}
      open={changePass}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{
        '& .MuiPaper-elevation': {
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !pb-6">
        <FontAwesomeIcon className="text-primary" size="sm" icon={faLock} />
        <span className="text-sm font-bold text-primary">
          تغییر رمز ورود کاربری
        </span>
      </DialogTitle>

      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="flex flex-col justify-center items-center gap-6 py-8">
          <Input
            placeholder={'رمز قبلی خود را وارد کنید'}
            label={'پسورد قبلی'}
            type="text"
            register={register}
            control={control}
            title="prevPass"
            width="w-80"
          />
          <Input
            placeholder={'رمز جدید خود را وارد کنید'}
            label={'پسورد جدید'}
            type="text"
            register={register}
            control={control}
            title="newPass"
            width="w-80"
          />
          <Input
            placeholder={'تکرار رمز جدید خود را وارد کنید'}
            label={'تکرار پسورد جدید'}
            type="text"
            register={register}
            control={control}
            title="repeatNewPass"
            width="w-80"
          />
        </div>

        <div className="flex justify-end gap-3 px-6 py-4">
          <Button
            title={'common.dissuasion'}
            active={true}
            style={SecondaryButton}
            onClick={() => setChangePass(false)}
          />
          <Button
            title={'تایید'}
            active={true}
            style={PrimaryButton}
            onClick={() => setChangePass(false)}
          />
        </div>
      </form>

      <div
        className="absolute top-4 left-4 rounded-full w-8 h-8 cursor-pointer bg-red flex items-center justify-center bg-white"
        style={{ boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.15)' }}
        onClick={() => setChangePass(false)}
      >
        <FontAwesomeIcon className="top-2 left-4" icon={faXmark} />
      </div>
    </Dialog>
  );
};

export default ChangePass;
