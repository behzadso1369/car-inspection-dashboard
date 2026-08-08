import React from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import Input from '../../../libs/input/input';
import TextArea from '../../../libs/text-area/text-area';
import Button, { PrimaryButton, SecondaryButton } from '../../../libs/button/button';
import { formatMoney } from '../expertFinance';

interface EditExpertEarningProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  earning: any;
}

const EditExpertEarning: React.FunctionComponent<EditExpertEarningProps> = ({
  showModal,
  setShowModal,
  earning,
}) => {
  const { register, control, getValues } = useForm({
    defaultValues: {
      finalAmount: earning?.finalAmount ?? earning?.calculatedAmount ?? '',
      note: earning?.adminNote ?? '',
    },
  });

  const onSubmit = () => {
    const values = getValues();
    instance
      .post(ApiHelper.get('EditExpertEarning'), {
        earningId: earning.id,
        finalAmount: Number(values.finalAmount),
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
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff', width: 'min(92vw, 520px)', m: 2 } }}
      sx={{ '& .MuiPaper-elevation': { width: 'auto' } }}
    >
      <DialogTitle className="w-full flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 border-b !py-3 px-4">
        <span>ویرایش مبلغ درآمد</span>
        <span className="text-sm text-slate-500 font-normal">
          سفارش #{earning?.orderId} — {earning?.expertName}
        </span>
      </DialogTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 !py-3 px-4">
        <div className="sm:col-span-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3">
          مبلغ محاسبه‌شده: {formatMoney(earning?.calculatedAmount)} ریال
        </div>
        <Input
          placeholder="1000000"
          type="text"
          register={register}
          control={control}
          title="finalAmount"
          label="مبلغ نهایی (ریال)"
          width="w-full"
        />
        <div className="sm:col-span-2">
          <TextArea
            register={register}
            control={control}
            title="note"
            label="یادداشت ادمین"
          />
        </div>
        <div className="sm:col-span-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-2">
          <Button
            title="لغو"
            active={true}
            style={SecondaryButton}
            onClick={() => setShowModal(false)}
          />
          <Button title="ذخیره" active={true} style={PrimaryButton} onClick={onSubmit} />
        </div>
      </div>
    </Dialog>
  );
};

export default EditExpertEarning;
