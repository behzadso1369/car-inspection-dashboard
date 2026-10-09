import React from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import Button, { PrimaryButton, SecondaryButton } from '../../libs/button/button';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';

interface DeleteFinanceUserProps {
  showDeleteModal: boolean;
  userId: number;
  userName: string;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteFinanceUser: React.FunctionComponent<DeleteFinanceUserProps> = ({
  showDeleteModal,
  setShowDeleteModal,
  userName,
  userId,
}) => {
  const onSubmit = () => {
    instance
      .delete(ApiHelper.get('FinanceUserDelete') + '?id=' + userId)
      .then((res: any) => {
        if (res.data?.isSuccess) {
          setShowDeleteModal(false);
        }
      })
      .catch(() => undefined);
  };

  return (
    <Dialog
      className="w-full !overflow-hidden"
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
        <span>حذف کاربر مالی</span>
      </DialogTitle>
      <div className="grid grid-cols-3 gap-3 pb-8 px-10 py-5">
        <div className="col-span-3 leading-7">
          <span>کاربر </span>
          <span className="text-blue-500">{userName}</span>
          <span> حذف نرم می‌شود و از این لیست خارج می‌گردد. این کار قابل بازگشت از همین صفحه نیست.</span>
          <p className="text-xs text-black-opacity-50 mt-2">
            اگر فقط می‌خواهید ورود را ببندید، به‌جای حذف کاربر را غیرفعال کنید.
          </p>
        </div>
        <div className="col-span-3 flex justify-end mt-8">
          <Button title="خیر" active={true} style={SecondaryButton} onClick={() => setShowDeleteModal(false)} />
          <Button title="حذف" active={true} style={PrimaryButton} onClick={onSubmit} />
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteFinanceUser;
