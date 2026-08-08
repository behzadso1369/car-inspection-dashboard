import React from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import TextArea from '../../../libs/text-area/text-area';
import Button, { PrimaryButton, SecondaryButton } from '../../../libs/button/button';
import { formatMoney } from '../expertFinance';

interface RejectExpertEarningProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  earning: any;
}

const RejectExpertEarning: React.FunctionComponent<RejectExpertEarningProps> = ({
  showModal,
  setShowModal,
  earning,
}) => {
  const { register, control, getValues } = useForm({
    defaultValues: { note: '' },
  });

  const onSubmit = () => {
    const values = getValues();
    instance
      .post(ApiHelper.get('RejectExpertEarning'), {
        earningId: earning.id,
        note: values.note || null,
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
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff', width: 'min(92vw, 480px)', m: 2 } }}
      sx={{ '& .MuiPaper-elevation': { width: 'auto' } }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !py-3 px-4">
        <span>رد درآمد کارشناس</span>
      </DialogTitle>
      <div className="p-4">
        <p className="text-sm text-gray-700 mb-2">
          رد درآمد <strong>{earning?.expertName}</strong> برای سفارش{' '}
          <strong>#{earning?.orderId}</strong> ({formatMoney(earning?.finalAmount)} ریال)
        </p>
        <div className="mb-6">
          <TextArea register={register} control={control} title="note" label="دلیل رد" />
        </div>
        <div className="flex justify-end">
          <Button
            title="لغو"
            active={true}
            style={SecondaryButton}
            onClick={() => setShowModal(false)}
          />
          <Button title="رد درآمد" active={true} style={PrimaryButton} onClick={onSubmit} />
        </div>
      </div>
    </Dialog>
  );
};

export default RejectExpertEarning;
