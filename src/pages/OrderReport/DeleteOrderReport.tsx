import React from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import { Button, PrimaryButton, SecondaryButton } from '../../libs/button/button';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';

interface DeleteOrderReportProps extends React.PropsWithChildren {
  showDeleteModal: boolean;
  orderReportId: number;
  orderReportName: string;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteOrderReport: React.FunctionComponent<
  DeleteOrderReportProps
> = ({ showDeleteModal, setShowDeleteModal, orderReportName, orderReportId }) => {

  const onSubmit = () => {
    instance.delete(ApiHelper.get("DeleteOrderReport") + "?id=" + orderReportId).then((res: any) => {
      if (res) {
        setShowDeleteModal(false)
      }
    })
  };

  return (
    <Dialog
      className="w-full  !overflow-hidden"
      onClose={() => setShowDeleteModal(false)}
      open={showDeleteModal}
      maxWidth="xl"
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{
        '& .MuiPaper-elevation': {
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !pb-6">
        <span> حذف گزارش کارشناسی </span>
      </DialogTitle>
      <div className="grid grid-cols-3 gap-3 pb-8 px-10 py-5">
        <div className='col-span-3'>
          <span>آیا از حذف گزارش کارشناسی</span>
          <span className='text-blue-500'> {orderReportName} </span>
          <span> </span>
          <span>مطمئن هستید؟</span>
        </div>
        <div className='col-span-3 flex justify-end mt-8'>
          <Button
            title='خیر'
            active={true}
            style={SecondaryButton}
            onClick={() => setShowDeleteModal(false)}
          />
          <Button
            title='بله'
            active={true}
            style={PrimaryButton}
            onClick={onSubmit}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteOrderReport;

