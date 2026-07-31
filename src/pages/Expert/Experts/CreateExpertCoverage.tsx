import React from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import Input from '../../../libs/input/input';
import Button, { PrimaryButton, SecondaryButton } from '../../../libs/button/button';

interface CreateExpertCoverageProps extends React.PropsWithChildren {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  expertId: number;
  expertName: string;
}

const CreateExpertCoverage: React.FunctionComponent<CreateExpertCoverageProps> = ({
  showModal,
  setShowModal,
  expertId,
  expertName,
}) => {
  const { register, control, getValues } = useForm({
    defaultValues: {
      city: '',
      centerLat: '',
      centerLng: '',
      radiusKm: '',
    },
  });

  const onSubmit = () => {
    const values = getValues();
    instance
      .post(ApiHelper.get('CreateExpertCoverageArea'), {
        expertId,
        city: values.city,
        centerLat: parseFloat(values.centerLat as unknown as string),
        centerLng: parseFloat(values.centerLng as unknown as string),
        radiusKm: parseFloat(values.radiusKm as unknown as string),
      })
      .then((res: any) => {
        if (res.data) {
          setShowModal(false);
        }
      });
  };

  return (
    <Dialog
      className="w-full"
      onClose={() => setShowModal(false)}
      open={showModal}
      maxWidth={false}
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{ '& .MuiPaper-elevation': { width: '60%' } }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !py-3 px-4">
        <span>افزودن محدوده پوشش — {expertName}</span>
      </DialogTitle>
      <div className="grid grid-cols-4 gap-3 !py-3 px-4">
        <Input
          placeholder="تهران"
          type="text"
          register={register}
          control={control}
          title="city"
          label="شهر"
          width="w-full"
        />
        <Input
          placeholder="35.6892"
          type="text"
          register={register}
          control={control}
          title="centerLat"
          label="عرض جغرافیایی مرکز"
          width="w-full"
        />
        <Input
          placeholder="51.3890"
          type="text"
          register={register}
          control={control}
          title="centerLng"
          label="طول جغرافیایی مرکز"
          width="w-full"
        />
        <Input
          placeholder="25"
          type="text"
          register={register}
          control={control}
          title="radiusKm"
          label="شعاع (کیلومتر)"
          width="w-full"
        />
        <div className="col-span-4 flex justify-end mt-8">
          <Button
            title="لغو"
            active={true}
            style={SecondaryButton}
            onClick={() => setShowModal(false)}
          />
          <Button title="اضافه کردن" active={true} style={PrimaryButton} onClick={onSubmit} />
        </div>
      </div>
    </Dialog>
  );
};

export default CreateExpertCoverage;
