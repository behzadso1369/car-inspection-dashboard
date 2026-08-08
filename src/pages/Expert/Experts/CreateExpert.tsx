import React from 'react';
import { Dialog, DialogTitle, Switch } from '@mui/material';
import { useForm } from 'react-hook-form';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import Input from '../../../libs/input/input';
import Button, { PrimaryButton, SecondaryButton } from '../../../libs/button/button';
import Dropdown from '../../../libs/dropdown/dropdown';
import { EXPERT_PAYOUT_TYPE, payoutTypeOptions } from '../expertFinance';

const switchLabel = { inputProps: { 'aria-label': 'Switch demo' } };

interface CreateExpertProps extends React.PropsWithChildren {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateExpert: React.FunctionComponent<CreateExpertProps> = ({
  showAddModal,
  setShowAddModal,
}) => {
  const { register, control, getValues, watch } = useForm({
    defaultValues: {
      PhoneNumber: '',
      FullName: '',
      NationalCode: '',
      BaseCity: '',
      BaseLat: '',
      BaseLng: '',
      IsActive: true,
      PayoutType: EXPERT_PAYOUT_TYPE.Percentage,
      CommissionPercent: '30',
      FixedAmountPerOrder: '',
    },
  });

  const payoutType = Number(watch('PayoutType'));

  const onSubmit = () => {
    const values = getValues();
    const type = Number(values.PayoutType);
    instance
      .post(ApiHelper.get('CreateExpert'), {
        phoneNumber: values.PhoneNumber,
        fullName: values.FullName,
        nationalCode: values.NationalCode,
        baseCity: values.BaseCity,
        baseLat: parseFloat(values.BaseLat as unknown as string),
        baseLng: parseFloat(values.BaseLng as unknown as string),
        isActive: !!values.IsActive,
        payoutType: type,
        commissionPercent:
          type === EXPERT_PAYOUT_TYPE.Percentage
            ? Number(values.CommissionPercent) || null
            : null,
        fixedAmountPerOrder:
          type === EXPERT_PAYOUT_TYPE.FixedPerOrder
            ? Number(values.FixedAmountPerOrder) || null
            : null,
      })
      .then((res: any) => {
        if (res.data) {
          setShowAddModal(false);
        }
      });
  };

  return (
    <Dialog
      className="w-full"
      onClose={() => setShowAddModal(false)}
      open={showAddModal}
      maxWidth={false}
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{ '& .MuiPaper-elevation': { width: '80%' } }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !py-3 px-4">
        <span>اضافه کردن کارشناس</span>
      </DialogTitle>
      <div className="grid grid-cols-4 gap-3 !py-3 px-4">
        <Input
          placeholder="09120000000"
          type="text"
          register={register}
          control={control}
          title="PhoneNumber"
          label="شماره موبایل"
          width="w-full"
        />
        <Input
          placeholder="علی محمدی"
          type="text"
          register={register}
          control={control}
          title="FullName"
          label="نام کامل"
          width="w-full"
        />
        <Input
          placeholder="0012345678"
          type="text"
          register={register}
          control={control}
          title="NationalCode"
          label="کد ملی"
          width="w-full"
        />
        <Input
          placeholder="تهران"
          type="text"
          register={register}
          control={control}
          title="BaseCity"
          label="شهر پایگاه"
          width="w-full"
        />
        <Input
          placeholder="35.6892"
          type="text"
          register={register}
          control={control}
          title="BaseLat"
          label="عرض جغرافیایی"
          width="w-full"
        />
        <Input
          placeholder="51.3890"
          type="text"
          register={register}
          control={control}
          title="BaseLng"
          label="طول جغرافیایی"
          width="w-full"
        />
        <Dropdown
          optionTitle="title"
          register={register}
          control={control}
          title="PayoutType"
          label="نوع قرارداد مالی"
          option={payoutTypeOptions}
          fullWidth={true}
        />
        {payoutType === EXPERT_PAYOUT_TYPE.Percentage && (
          <Input
            placeholder="30"
            type="text"
            register={register}
            control={control}
            title="CommissionPercent"
            label="درصد کمیسیون"
            width="w-full"
          />
        )}
        {payoutType === EXPERT_PAYOUT_TYPE.FixedPerOrder && (
          <Input
            placeholder="850000"
            type="text"
            register={register}
            control={control}
            title="FixedAmountPerOrder"
            label="مبلغ ثابت هر سفارش (ریال)"
            width="w-full"
          />
        )}
        <div className="flex flex-col col-span-4 lg:col-span-1">
          <span className="text-[#464F60] text-xs font-normal mb-2">فعال</span>
          <Switch {...register('IsActive')} {...switchLabel} defaultChecked={true} />
        </div>
        <div className="col-span-4 rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600 leading-6">
          <div>فرمول: FinalPrice = Price − Discount · Tax = ۱۰٪ · CommissionBase = FinalPrice − Tax</div>
          <div>درصدی: Amount = CommissionBase × (درصد / ۱۰۰) · ثابت: Amount = مبلغ ثابت هر سفارش</div>
        </div>
        <div className="col-span-4 flex justify-end mt-4">
          <Button
            title="لغو"
            active={true}
            style={SecondaryButton}
            onClick={() => setShowAddModal(false)}
          />
          <Button title="اضافه کردن" active={true} style={PrimaryButton} onClick={onSubmit} />
        </div>
      </div>
    </Dialog>
  );
};

export default CreateExpert;
