import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Dialog, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Button, SecondaryButton } from '../../libs/button/button';
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
      className="w-full"
      onClose={() => setChangePass(false)}
      open={changePass}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: '16px', background: '#fff', margin: '16px', width: 'calc(100% - 32px)' } }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !py-4 px-4">
        <FontAwesomeIcon className="text-brand" size="sm" icon={faLock} />
        <span className="text-sm font-bold text-primary">تغییر رمز ورود کاربری</span>
      </DialogTitle>

      <form onSubmit={handleSubmit(submitHandler)} className="px-4 pb-4">
        <div className="flex flex-col gap-4 py-6">
          <Input
            placeholder="رمز قبلی خود را وارد کنید"
            label="پسورد قبلی"
            type="password"
            register={register}
            control={control}
            title="prevPass"
            width="w-full"
          />
          <Input
            placeholder="رمز جدید خود را وارد کنید"
            label="پسورد جدید"
            type="password"
            register={register}
            control={control}
            title="newPass"
            width="w-full"
          />
          <Input
            placeholder="تکرار رمز جدید خود را وارد کنید"
            label="تکرار پسورد جدید"
            type="password"
            register={register}
            control={control}
            title="repeatNewPass"
            width="w-full"
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end border-t border-card-border pt-4">
          <Button
            title="انصراف"
            active={true}
            style={SecondaryButton}
            onClick={() => setChangePass(false)}
          />
          <button
            type="submit"
            className="w-full sm:w-auto min-h-[44px] px-6 rounded-xl bg-brand text-white text-sm font-medium"
            onClick={() => setChangePass(false)}
          >
            تایید
          </button>
        </div>
      </form>

      <button
        type="button"
        className="absolute top-4 left-4 rounded-full w-9 h-9 cursor-pointer flex items-center justify-center bg-white shadow-md"
        onClick={() => setChangePass(false)}
        aria-label="بستن"
      >
        <FontAwesomeIcon icon={faXmark} className="text-gray-600" />
      </button>
    </Dialog>
  );
};

export default ChangePass;
