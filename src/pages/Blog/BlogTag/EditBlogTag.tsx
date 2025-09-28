import React, { useEffect, useState } from 'react';

import { Dialog, DialogTitle } from '@mui/material';

import { useForm } from 'react-hook-form';



import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import Input from '../../../libs/input/input';
import Datepicker from '../../../libs/datepicker/datepicker';
import Dropdown from '../../../libs/dropdown/dropdown';
import Button, { PrimaryButton, SecondaryButton } from '../../../libs/button/button';





interface EditPieceProps extends React.PropsWithChildren {
  showEditModal: boolean;
  blogTagName:string;
  blogTagId:number;



  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditBlogTag: React.FunctionComponent<
EditPieceProps
> = ({ showEditModal, setShowEditModal,blogTagId,blogTagName }) => {
    const { register, control,getValues,reset} = useForm({});
    const onSubmit = () => {
    instance.put(ApiHelper.get("EditBlogTag") + "?id=" + blogTagId ,getValues()).then((res:any) => {
      if(res.data) {
        setShowEditModal(false);
      }
    })
    };
    const  getBlogTagById = () => {
      instance.get(ApiHelper.get("GetBlogTagById"),{params:{id:blogTagId}}).then((res:any) => {
          reset({
            name:res.data.resultObject.name,
            slug:res.data.resultObject.slug,
          })
      })
    }
    useEffect(() => {
      getBlogTagById();
    },[])
  return (
    <Dialog
      className="w-full  !overflow-hidden"
      onClose={() => setShowEditModal(false)}
      open={showEditModal}
     
      maxWidth="xl"
      
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{
        '& .MuiPaper-elevation': {
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !pb-6">
        <span> ویرایش  تگ بلاگ </span>
        <span> </span>
        <span>{blogTagName}</span>
        
      </DialogTitle>
      <div className="grid grid-cols-3 gap-3 pb-8 px-10 py-5">
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
      
         type="text"
         register={register}
         control={control}
         title="slug"
         label='slug'
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

export default EditBlogTag;
