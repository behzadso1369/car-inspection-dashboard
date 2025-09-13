import React, { useEffect } from 'react';
import { Dropdown } from '../../libs/dropdown/dropdown';
import { Input } from '../../libs/input/input';
import { useForm } from 'react-hook-form';
import { Button, PrimaryButton } from '../../libs/button/button';
import { useNavigate } from 'react-router-dom';

import Datepicker from '../../libs/datepicker/datepicker';

const CreateComplaint: React.FunctionComponent = () => {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      complaintType: 'تلفنی',
    },
  });
  const navigate = useNavigate();

  useEffect(()=>{
 
  },[

  ])

  const submitHandler = () => {
    console.log('test');
  };

  return (
    <div>
      <form onSubmit={handleSubmit(submitHandler)}>
      <div className="grid gap-6 grid-cols-3">
        
        <Dropdown
            register={register}
            control={control}
            title="complaintType"
            label={'نوع شکایت'}
            option={[
              { title: 'تلفنی', value: 'تلفنی' },
              { title: 'شفاهی', value: 'شفاهی' },
              { title: 'حضوری', value: 'حضوری' },
            
            
            ]}
            fullWidth={false}
          />
          <Input
              placeholder='موضوع شکایت'
              type="text"
              register={register}
              control={control}
              title="complainTitle"
              label='موضوع شکایت'
              width="w-80"
            />
              <Input
              placeholder='وضعیت شکایت'
              type="text"
              register={register}
              control={control}
              title="complaintState"
              label='وضعیت شکایت'
              width="w-80"
            />
              <Input
              placeholder='نام گارشناس مشتری '
              type="text"
              register={register}
              control={control}
              title="companyName"
              label='نام گارشناس مشتری '
              width="w-80"
            />
              <Input
              placeholder='واحد مشتری'
              type="text"
              register={register}
              control={control}
              title="customerUnit"
              label='واحد مشتری'
              width="w-80"
            />
              <Datepicker
                  label='تاریخ ثیت'
                  register={register}
                  control={control}
                  title="modifiedDate"
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

export default CreateComplaint;
