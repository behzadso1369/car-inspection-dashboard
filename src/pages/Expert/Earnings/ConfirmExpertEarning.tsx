import React from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import Button, { PrimaryButton, SecondaryButton } from '../../../libs/button/button';
import { formatMoney } from '../expertFinance';

interface ConfirmExpertEarningProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  earning: any;
}

const ConfirmExpertEarning: React.FunctionComponent<ConfirmExpertEarningProps> = ({
  showModal,
  setShowModal,
  earning,
}) => {
  const onSubmit = () => {
    instance
      .post(ApiHelper.get('ConfirmExpertEarning'), { earningId: earning.id })
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
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff', width: 'min(92vw, 440px)', m: 2 } }}
      sx={{ '& .MuiPaper-elevation': { width: 'auto' } }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !py-3 px-4">
        <span>تایید تسویه درآمد</span>
      </DialogTitle>
      <div className="p-4">
        <p className="text-sm text-gray-700 mb-2">
          آیا از تایید تسویه درآمد کارشناس <strong>{earning?.expertName}</strong> برای سفارش{' '}
          <strong>#{earning?.orderId}</strong> اطمینان دارید؟
        </p>
        <p className="text-sm text-slate-600 mb-6">
          مبلغ نهایی: <strong>{formatMoney(earning?.finalAmount)}</strong> ریال
        </p>
        <div className="flex justify-end">
          <Button
            title="لغو"
            active={true}
            style={SecondaryButton}
            onClick={() => setShowModal(false)}
          />
          <Button title="تایید تسویه" active={true} style={PrimaryButton} onClick={onSubmit} />
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmExpertEarning;
