import React from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import Button, { PrimaryButton, SecondaryButton } from '../../../libs/button/button';

interface DeleteExpertProps extends React.PropsWithChildren {
  showDeleteModal: boolean;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  expertId: number;
  expertName: string;
}

const DeleteExpert: React.FunctionComponent<DeleteExpertProps> = ({
  showDeleteModal,
  setShowDeleteModal,
  expertId,
  expertName,
}) => {
  const onSubmit = () => {
    instance.delete(ApiHelper.get('DeleteExpert') + '?id=' + expertId).then((res: any) => {
      if (res.data) {
        setShowDeleteModal(false);
      }
    });
  };

  return (
    <Dialog
      className="w-full"
      onClose={() => setShowDeleteModal(false)}
      open={showDeleteModal}
      maxWidth={false}
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{ '& .MuiPaper-elevation': { width: '40%' } }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !py-3 px-4">
        <span>حذف کارشناس</span>
      </DialogTitle>
      <div className="p-4">
        <p className="text-sm text-gray-700 mb-6">
          آیا از حذف کارشناس <strong>{expertName}</strong> اطمینان دارید؟
        </p>
        <div className="flex justify-end">
          <Button
            title="لغو"
            active={true}
            style={SecondaryButton}
            onClick={() => setShowDeleteModal(false)}
          />
          <Button title="حذف" active={true} style={PrimaryButton} onClick={onSubmit} />
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteExpert;
