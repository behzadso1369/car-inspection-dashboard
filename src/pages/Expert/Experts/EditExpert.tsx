import React, { useEffect } from 'react';
import { Dialog, DialogTitle, Switch } from '@mui/material';
import { useForm } from 'react-hook-form';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import Input from '../../../libs/input/input';
import Button, { PrimaryButton, SecondaryButton } from '../../../libs/button/button';
import Dropdown from '../../../libs/dropdown/dropdown';
import { EXPERT_PAYOUT_TYPE, payoutTypeOptions } from '../expertFinance';

const switchLabel = { inputProps: { 'aria-label': 'Switch demo' } };

interface EditExpertProps extends React.PropsWithChildren {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  expertId: number;
  expertName: string;
}

const EditExpert: React.FunctionComponent<EditExpertProps> = ({
  showEditModal,
  setShowEditModal,
  expertId,
  expertName,
}) => {
  const { register, control, getValues, reset, watch } = useForm({
    defaultValues: {
      PhoneNumber: '',
      FullName: '',
      NationalCode: '',
      BaseCity: '',
      BaseLat: '',
      BaseLng: '',
      IsActive: true,
      PayoutType: EXPERT_PAYOUT_TYPE.Percentage,
      CommissionPercent: '',
      FixedAmountPerOrder: '',
    },
  });

  const payoutType = Number(watch('PayoutType'));

  const onSubmit = () => {
    const values = getValues();
    const type = Number(values.PayoutType);
    instance
      .put(ApiHelper.get('EditExpert') + '?id=' + expertId, {
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
          setShowEditModal(false);
        }
      });
  };

  const getExpertById = () => {
    instance.get(ApiHelper.get('GetExpert'), { params: { id: expertId } }).then((res: any) => {
      const expert = res.data.resultObject;
      reset({
        PhoneNumber: expert.phoneNumber,
        FullName: expert.fullName,
        NationalCode: expert.nationalCode,
        BaseCity: expert.baseCity,
        BaseLat: expert.baseLat,
        BaseLng: expert.baseLng,
        IsActive: expert.isActive,
        PayoutType: expert.payoutType ?? EXPERT_PAYOUT_TYPE.Percentage,
        CommissionPercent:
          expert.commissionPercent !== null && expert.commissionPercent !== undefined
            ? String(expert.commissionPercent)
            : '',
        FixedAmountPerOrder:
          expert.fixedAmountPerOrder !== null && expert.fixedAmountPerOrder !== undefined
            ? String(expert.fixedAmountPerOrder)
            : '',
      });
    });
  };

  useEffect(() => {
    getExpertById();
  }, [expertId]);

  return (
    <Dialog
      className="w-full"
      onClose={() => setShowEditModal(false)}
      open={showEditModal}
      maxWidth={false}
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{ '& .MuiPaper-elevation': { width: '80%' } }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !pb-6">
        <span>ویرایش کارشناس</span>
        <span>{expertName}</span>
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
          <Switch {...register('IsActive')} {...switchLabel} />
        </div>
        <div className="col-span-4 flex justify-end mt-8">
          <Button
            title="لغو"
            active={true}
            style={SecondaryButton}
            onClick={() => setShowEditModal(false)}
          />
          <Button title="ویرایش" active={true} style={PrimaryButton} onClick={onSubmit} />
        </div>
      </div>
    </Dialog>
  );
};

export default EditExpert;
