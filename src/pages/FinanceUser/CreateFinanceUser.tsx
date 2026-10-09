import React, { useState } from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import Input from '../../libs/input/input';
import Button, { PrimaryButton, SecondaryButton } from '../../libs/button/button';
import WalletSwitchField from '../Wallet/WalletSwitchField';
import { isValidMobile, normalizePhone } from './financeUserHelpers';

interface CreateFinanceUserProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateFinanceUser: React.FunctionComponent<CreateFinanceUserProps> = ({
  showAddModal,
  setShowAddModal,
}) => {
  const [formError, setFormError] = useState('');
  const { register, control, getValues } = useForm({
    defaultValues: {
      phoneNumber: '',
      fullName: '',
      isActive: true,
    },
  });

  const onSubmit = () => {
    const values = getValues();
    const phoneNumber = normalizePhone(values.phoneNumber);
    const fullName = String(values.fullName ?? '').trim();
    if (!isValidMobile(phoneNumber)) {
      setFormError('شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.');
      return;
    }
    if (!fullName) {
      setFormError('نام و نام خانوادگی را وارد کنید.');
      return;
    }
    setFormError('');
    instance
      .post(ApiHelper.get('FinanceUserCreate'), {
        phoneNumber,
        fullName,
        isActive: !!values.isActive,
      })
      .then((res: any) => {
        if (res.data?.isSuccess) {
          setShowAddModal(false);
        }
      })
      .catch(() => undefined);
  };

  return (
    <Dialog
      className="w-full"
      onClose={() => setShowAddModal(false)}
      open={showAddModal}
      maxWidth={false}
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{
        '& .MuiPaper-elevation': {
          width: '80%',
        },
      }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !py-3 px-4">
        <span>افزودن کاربر مالی</span>
      </DialogTitle>
      <div className="grid grid-cols-4 gap-3 !py-3 px-4">
        <p className="col-span-4 text-xs text-black-opacity-50 leading-6">
          پرتال مالی جدا از این پنل است. کاربر رمز عبور ندارد و بعد از ساخت، با همین شماره و کد یک‌بارمصرف وارد می‌شود.
        </p>
        <Input
          placeholder="09121234567"
          type="text"
          register={register}
          control={control}
          title="phoneNumber"
          label="موبایل"
          width="w-full"
        />
        <Input
          placeholder="علی رضایی"
          type="text"
          register={register}
          control={control}
          title="fullName"
          label="نام و نام خانوادگی"
          width="w-full"
        />
        <WalletSwitchField name="isActive" control={control} label="فعال" hint="اگر خاموش باشد ورود با OTP بسته است" />
        {formError ? <p className="col-span-4 text-xs text-red-500">{formError}</p> : null}
        <div className="col-span-4 flex justify-end mt-8">
          <Button title="لغو" active={true} style={SecondaryButton} onClick={() => setShowAddModal(false)} />
          <Button title="افزودن" active={true} style={PrimaryButton} onClick={onSubmit} />
        </div>
      </div>
    </Dialog>
  );
};

export default CreateFinanceUser;
