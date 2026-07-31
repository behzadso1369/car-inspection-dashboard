import React, { useEffect } from 'react';
import { Dialog, DialogTitle, Switch } from '@mui/material';
import { useForm } from 'react-hook-form';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import Input from '../../../libs/input/input';
import Button, { PrimaryButton, SecondaryButton } from '../../../libs/button/button';

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
  const { register, control, getValues, reset } = useForm({});

  const onSubmit = () => {
    const values = getValues();
    instance
      .put(ApiHelper.get('EditExpert') + '?id=' + expertId, {
        ...values,
        BaseLat: parseFloat(values.BaseLat),
        BaseLng: parseFloat(values.BaseLng),
        IsActive: !!values.IsActive,
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
