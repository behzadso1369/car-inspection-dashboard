import React, { useEffect, useRef, useState } from 'react';

import { Dialog, DialogTitle, Switch } from '@mui/material';

import { useForm } from 'react-hook-form';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import Input from '../../../libs/input/input';
import Datepicker from '../../../libs/datepicker/datepicker';
import Dropdown from '../../../libs/dropdown/dropdown';
import TextArea from '../../../libs/text-area/text-area';
import Button, { PrimaryButton, SecondaryButton } from '../../../libs/button/button';
import { Link } from 'react-router-dom';

const label = { inputProps: { 'aria-label': 'Switch demo' } };





interface EditPieceProps extends React.PropsWithChildren {
  showEditModal: boolean;
  blogCatId:number;
  blogCatName:string;



  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditBlogCategory: React.FunctionComponent<
EditPieceProps
> = ({ showEditModal, setShowEditModal,blogCatId,blogCatName }) => {
  const { register, control,getValues,reset} = useForm({});
  const onSubmit = () => {
  instance.put(ApiHelper.get("EditBlogCategories") + "?id=" + blogCatId,getValues()).then((res:any) => {
    if(res.data) {
        setShowEditModal(false);
    }
  })

    
   
  };
  const  getBlogCategoriesById = () => { 
    instance.get(ApiHelper.get("getBlogCategoriesById"),{params:{id:blogCatId}}).then((res:any) => {

      
      
        reset({
          name:res.data.resultObject.name,
          slug:res.data.resultObject.slug,
          description:res.data.resultObject.description,
        })
   
    })
  }
  useEffect(() => {
    getBlogCategoriesById();
  
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
        <span> ویرایش  دسته بندی بلاگ </span>
        <span> </span>
        <span>{blogCatName}</span>
        
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
         type="text"
         register={register}
         control={control}
         title="slug"
         label='slug'
          
         width="w-full"
       />
     <TextArea
      register={register}
      control={control}
      title="description"
      label='توضیحات'

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

export default EditBlogCategory;
