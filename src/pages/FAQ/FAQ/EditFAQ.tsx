import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import Input from '../../../libs/input/input';
import TextArea from '../../../libs/text-area/text-area';
import Dropdown from '../../../libs/dropdown/dropdown';
import Button, { PrimaryButton, SecondaryButton } from '../../../libs/button/button';

interface EditFAQProps extends React.PropsWithChildren {
  showEditModal: boolean;
  faqId: number;
  faqQuestion: string;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditFAQ: React.FunctionComponent<EditFAQProps> = ({
  showEditModal,
  setShowEditModal,
  faqId,
  faqQuestion,
}) => {
  const { register, control, getValues, reset } = useForm({});
  const [categories, setCategories] = useState<any>([]);

  const onSubmit = () => {
    instance.put(ApiHelper.get('EditFAQ') + '?id=' + faqId, getValues()).then((res: any) => {
      if (res.data) {
        setShowEditModal(false);
      }
    });
  };

  const getCategories = () => {
    instance
      .get(ApiHelper.get('FAQCategoriesList'), { params: { pageNumber: 1, pageSize: 100000 } })
      .then((res: any) => {
        if (res.data) {
          setCategories(res.data.resultObject);
        }
      });
  };

  const getFAQById = () => {
    instance.get(ApiHelper.get('getFAQById'), { params: { id: faqId } }).then((res: any) => {
      reset({
        question: res.data.resultObject.question,
        answer: res.data.resultObject.answer,
        categoryId: res.data.resultObject.categoryId,
      });
    });
  };

  useEffect(() => {
    getCategories();
    getFAQById();
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
        <span>ویرایش سوال متداول</span>
        <span>{faqQuestion}</span>
      </DialogTitle>
      <div className="grid grid-cols-4 gap-3 !py-3 px-4">
        <Input
          placeholder="سوال"
          type="text"
          register={register}
          control={control}
          title="question"
          label="سوال"
          width="w-full"
        />
        <Dropdown
          optionTitle="name"
          register={register}
          control={control}
          title="categoryId"
          label="دسته بندی"
          option={categories}
          fullWidth={true}
        />
        <TextArea register={register} control={control} title="answer" label="پاسخ" />
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

export default EditFAQ;
