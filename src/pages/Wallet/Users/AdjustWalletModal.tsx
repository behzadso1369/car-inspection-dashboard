import React from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import Input from '../../../libs/input/input';
import TextArea from '../../../libs/text-area/text-area';
import Button, { PrimaryButton, SecondaryButton } from '../../../libs/button/button';
import { toNumber } from '../walletHelpers';

interface AdjustWalletModalProps {
  open: boolean;
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const AdjustWalletModal: React.FunctionComponent<AdjustWalletModalProps> = ({
  open,
  userId,
  onClose,
  onSuccess,
}) => {
  const { register, control, getValues, reset } = useForm({
    defaultValues: {
      amount: '',
      description: 'تعدیل دستی ادمین',
    },
  });

  const onSubmit = () => {
    const values = getValues();
    instance
      .post(ApiHelper.get('WalletAdjust'), {
        userId,
        amount: toNumber(values.amount),
        description: values.description || 'تعدیل دستی ادمین',
      })
      .then((res: any) => {
        if (res?.data?.isSuccess !== false) {
          reset({ amount: '', description: 'تعدیل دستی ادمین' });
          onSuccess();
          onClose();
        }
      });
  };

  return (
    <Dialog
      className="w-full"
      onClose={onClose}
      open={open}
      maxWidth={false}
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{
        '& .MuiPaper-elevation': {
          width: '80% ',
        },
      }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !py-3 px-4">
        <span>تعدیل موجودی کیف‌پول</span>
      </DialogTitle>
      <div className="grid grid-cols-4 gap-3 !py-3 px-4">
        <Input
          placeholder="200000 یا -50000"
          type="number"
          register={register}
          control={control}
          title="amount"
          label="مبلغ (تومان) — منفی برای کسر"
          width="w-full"
        />
        <TextArea register={register} control={control} title="description" label="توضیحات" />
        <p className="col-span-4 text-xs text-black-opacity-60">
          مبلغ مثبت شارژ می‌کند و مبلغ منفی از موجودی کم می‌شود. اگر موجودی کافی نباشد عملیات رد می‌شود.
        </p>
        <div className="col-span-4 flex justify-end mt-4">
          <Button title="لغو" active={true} style={SecondaryButton} onClick={onClose} />
          <Button title="ثبت تعدیل" active={true} style={PrimaryButton} onClick={onSubmit} />
        </div>
      </div>
    </Dialog>
  );
};

export default AdjustWalletModal;
