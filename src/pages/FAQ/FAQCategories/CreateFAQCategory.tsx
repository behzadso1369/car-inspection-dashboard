import React from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import Input from '../../../libs/input/input';
import Button, { PrimaryButton, SecondaryButton } from '../../../libs/button/button';

interface CreateFAQCategoryProps extends React.PropsWithChildren {
  showAddUserModal: boolean;
  setShowAddUserModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateFAQCategory: React.FunctionComponent<CreateFAQCategoryProps> = ({
  showAddUserModal,
  setShowAddUserModal,
}) => {
  const { register, control, getValues } = useForm({});

  const onSubmit = () => {
    instance.post(ApiHelper.get('CreateFAQCategories'), getValues()).then((res: any) => {
      if (res.data) {
        setShowAddUserModal(false);
      }
    });
  };

  return (
    <Dialog
      className="w-full"
      onClose={() => setShowAddUserModal(false)}
      open={showAddUserModal}
      maxWidth={false}
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{
        '& .MuiPaper-elevation': {
          width: '80% ',
        },
      }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !py-3 px-4">
        <span>اضافه کردن دسته بندی سوالات متداول</span>
      </DialogTitle>
      <div className="grid grid-cols-4 gap-3 !py-3 px-4">
        <Input
          placeholder="نام"
          type="text"
          register={register}
          control={control}
          title="name"
          label="نام"
          width="w-full"
        />
        <div className="col-span-4 flex justify-end mt-8">
          <Button
            title="لغو"
            active={true}
            style={SecondaryButton}
            onClick={() => setShowAddUserModal(false)}
          />
          <Button title="اضافه کردن" active={true} style={PrimaryButton} onClick={onSubmit} />
        </div>
      </div>
    </Dialog>
  );
};

export default CreateFAQCategory;
