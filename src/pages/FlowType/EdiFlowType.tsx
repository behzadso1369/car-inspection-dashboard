import React, { useEffect, useRef, useState } from 'react';

import { Dialog, DialogTitle, Switch } from '@mui/material';

import { useForm } from 'react-hook-form';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import Input from '../../libs/input/input';
import Datepicker from '../../libs/datepicker/datepicker';
import Dropdown from '../../libs/dropdown/dropdown';
import TextArea from '../../libs/text-area/text-area';
import Button, { PrimaryButton, SecondaryButton } from '../../libs/button/button';
import { Link } from 'react-router-dom';
import { Image } from 'antd';

const label = { inputProps: { 'aria-label': 'Switch demo' } };





interface EditPieceProps extends React.PropsWithChildren {
  showEditModal: boolean;
  secretOfOurServiceQualityId:number;
  secretOfOurServiceQualityName:string;



  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditFlowType: React.FunctionComponent<
EditPieceProps
> = ({ showEditModal, setShowEditModal,secretOfOurServiceQualityId,secretOfOurServiceQualityName }) => {
  const { register, control,getValues,reset} = useForm({});
  const onSubmit = () => {
    const formData = new FormData();
    formData.append("title",getValues()["title"])
    formData.append("name",getValues()["name"])
  instance.put(ApiHelper.get("EditFlowType")+ "?id=" + secretOfOurServiceQualityId,formData).then((res:any) => {
    if(res.data) {
        setShowEditModal(false);
    }
  })
  };

  const  getBlogTagById = () => {
    instance.get(ApiHelper.get("GetFlowType"),{params:{id:secretOfOurServiceQualityId}}).then((res:any) => {
        reset({
          title:res.data.resultObject.title,
          name:res.data.resultObject.name
        })
    })
  }
  useEffect(() => {
    getBlogTagById();
  },[])
  return (
    <Dialog
      className="w-full  "
      onClose={() => setShowEditModal(false)}
      open={showEditModal}
      maxWidth={false}
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{
        '& .MuiPaper-elevation': {
        
          width: "80% "
        },
      }}
    >
       <DialogTitle className="w-full flex items-center gap-3 border-b !pb-6">
        <span> ویرایش    راز کیفیت خدمات ما </span>
        <span> </span>
        <span>{secretOfOurServiceQualityName}</span>
        
      </DialogTitle>
      <div className="grid grid-cols-4 gap-3 !py-3 px-4">
      <Input
  placeholder='نام'
  type="text"
  register={register}
  control={control}
  title="name"
  label='نام'
  width="w-full"
/>
  
  <Input
  placeholder='عنوان'
  type="text"
  register={register}
  control={control}
  title="title"
  label='عنوان'
  width="w-full"
/>
       
    
     
   <div className='col-span-4 flex justify-end mt-8'>
              <Button
              title='لغو'
              active={true}
              style={SecondaryButton}
              onClick={() =>setShowEditModal(false)}
            />
              <Button
              title='ویرایش'
              active={true}
              style={PrimaryButton}
              onClick={onSubmit}
            />
            
              </div>
</div>
    
   
    </Dialog>
  );
};

export default EditFlowType;
