import React, { useEffect } from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import Input from '../../../libs/input/input';
import Button, { PrimaryButton, SecondaryButton } from '../../../libs/button/button';

interface EditFAQCategoryProps extends React.PropsWithChildren {
  showEditModal: boolean;
  categoryId: number;
  categoryName: string;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditFAQCategory: React.FunctionComponent<EditFAQCategoryProps> = ({
  showEditModal,
  setShowEditModal,
  categoryId,
  categoryName,
}) => {
  const { register, control, getValues, reset } = useForm({});

  const onSubmit = () => {
    instance
      .put(ApiHelper.get('EditFAQCategories') + '?id=' + categoryId, getValues())
      .then((res: any) => {
        if (res.data) {
          setShowEditModal(false);
        }
      });
  };

  const getCategoryById = () => {
    instance.get(ApiHelper.get('getFAQCategoriesById'), { params: { id: categoryId } }).then((res: any) => {
      reset({
        name: res.data.resultObject.name,
      });
    });
  };

  useEffect(() => {
    getCategoryById();
  }, []);

  return (
    <Dialog
      className="w-full"
      onClose={() => setShowEditModal(false)}
      open={showEditModal}
      maxWidth={false}
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{
        '& .MuiPaper-elevation': {
          width: '80% ',
        },
      }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !pb-6">
        <span>ویرایش دسته بندی سوالات متداول</span>
        <span>{categoryName}</span>
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
            onClick={() => setShowEditModal(false)}
          />
          <Button title="ویرایش" active={true} style={PrimaryButton} onClick={onSubmit} />
        </div>
      </div>
    </Dialog>
  );
};

export default EditFAQCategory;
