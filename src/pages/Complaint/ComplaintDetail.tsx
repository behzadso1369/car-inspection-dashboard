import React, { useEffect } from 'react';
import { Dropdown } from '../../libs/dropdown/dropdown';

import { useForm } from 'react-hook-form';
import { Button, PrimaryButton } from '../../libs/button/button';
import { useNavigate, useParams } from 'react-router-dom';
import { complaintData } from '../../data/data';

const ComplaintDetail: React.FunctionComponent = () => {
  const {id} = useParams();
  const orderDetail = complaintData.filter((item:any) => item.id === Number(id))[0];
  const { register, control,reset, handleSubmit } = useForm({
    defaultValues: {
      complaintType: '0',
      complaintTitle: '0',
    },
  });
  const navigate = useNavigate();

  useEffect(()=>{
  
    
    reset(orderDetail)
  },[

  ])

  const submitHandler = () => {
   
  };

  return (
    <div>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="flex gap-6">
        <Dropdown
            register={register}
            control={control}
            title="complaintType"
            label={'نوع شکایت'}
            option={[
              { title: 'سفارش ناقص', value: 'سفارش ناقص' },
              { title: 'خرابی دستگاه', value: 'خرابی دستگاه' },
            
            ]}
            fullWidth={false}
          />
          <Dropdown
            register={register}
            control={control}
            title="complaintTitle"
            label={'عنوان شکایت'}
            option={[
              { title: 'خرابی دستگاه حین عملیات', value: 'خرابی دستگاه حین عملیات' },
              { title: 'خرابی دستگاه حین کار', value: 'خرابی دستگاه حین کار' },
            ]}
            fullWidth={false}
          />
        </div>
        <div className="mt-4 w-[55rem]" style={{ direction: 'ltr' }}>
          {/* <Editor
            toolbar={{
              options: [
                'inline',
                'fontFamily',
                'fontSize',
                'list',
                'textAlign',
                'link',
              ],
              inline: {
                options: ['bold', 'italic', 'underline'],
              },
              list: {
                options: ['unordered', 'ordered'],
              },
              fontSize: {
                options: [
                  8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96,
                ],
              },
              fontFamily: {
                options: ['IRANYekan', 'IRANSans'],
              },
            }}
            editorState={editorState}
            toolbarStyle={{ border: '1px solid #f3f3f3' }}
            editorStyle={{
              height: '300px',
              border: '1px solid #f3f3f3',
              padding: '10px',
              lineHeight: '1.0',
              backgroundColor: '#FEFEFE',
              fontFamily: 'IRANYekan',
            }}
            onEditorStateChange={onEditorStateChange}
          /> */}
          <div className="mt-4">
            <Button
              title={'ارسال'}
              active={true}
              style={PrimaryButton}
              onClick={() => {
                navigate('/support/ticket/main');
              }}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ComplaintDetail;
