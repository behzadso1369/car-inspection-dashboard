import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import Input from '../../libs/input/input';
import Button, { PrimaryButton, SecondaryButton } from '../../libs/button/button';
import WalletSwitchField from '../Wallet/WalletSwitchField';
import { FinanceUser } from '../../_models/response/financeUser/financeUser.response';
import { isValidMobile, normalizePhone } from './financeUserHelpers';

interface EditFinanceUserProps {
  showEditModal: boolean;
  userId: number;
  userName: string;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditFinanceUser: React.FunctionComponent<EditFinanceUserProps> = ({
  showEditModal,
  setShowEditModal,
  userId,
  userName,
}) => {
  const [formError, setFormError] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const { register, control, getValues, reset } = useForm({
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
      .put(ApiHelper.get('FinanceUserUpdate') + '?id=' + userId, {
        phoneNumber,
        fullName,
        isActive: !!values.isActive,
      })
      .then((res: any) => {
        if (res.data?.isSuccess) {
          setShowEditModal(false);
        }
      })
      .catch(() => undefined);
  };

  useEffect(() => {
    instance.get(ApiHelper.get('FinanceUserGet'), { params: { id: userId } }).then((res: any) => {
      const user = res.data?.resultObject as FinanceUser | undefined;
      if (!user) return;
      setPhoneVerified(!!user.isPhoneVerified);
      reset({
        phoneNumber: user.phoneNumber ?? '',
        fullName: user.fullName ?? '',
        isActive: !!user.isActive,
      });
    });
  }, [reset, userId]);

  return (
    <Dialog
      className="w-full"
      onClose={() => setShowEditModal(false)}
      open={showEditModal}
      maxWidth={false}
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{
        '& .MuiPaper-elevation': {
          width: '80%',
        },
      }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !pb-6">
        <span>ویرایش کاربر مالی</span>
        <span>{userName}</span>
      </DialogTitle>
      <div className="grid grid-cols-4 gap-3 !py-3 px-4">
        <p className="col-span-4 text-xs text-black-opacity-50 leading-6">
          برای بستن ورود بدون حذف، سوییچ فعال را خاموش کنید. وضعیت تایید موبایل:{' '}
          {phoneVerified ? 'تایید شده' : 'هنوز با OTP وارد نشده'}
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
        <WalletSwitchField name="isActive" control={control} label="فعال" hint="خاموش یعنی ورود بسته است" />
        {formError ? <p className="col-span-4 text-xs text-red-500">{formError}</p> : null}
        <div className="col-span-4 flex justify-end mt-8">
          <Button title="لغو" active={true} style={SecondaryButton} onClick={() => setShowEditModal(false)} />
          <Button title="ذخیره" active={true} style={PrimaryButton} onClick={onSubmit} />
        </div>
      </div>
    </Dialog>
  );
};

export default EditFinanceUser;
