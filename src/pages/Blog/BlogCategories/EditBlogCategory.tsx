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
 
  const inputImageRef = useRef<any>(null);

  const { register, control,getValues} = useForm({});



    const [fileId,setFileId] = useState<any>(null);
    const [files,setFiles] = useState<any>([]);
    const [image,setImage] = useState<any>(null);
  
    const [progressImageBar,setProgressImageBar] = useState<boolean>(false);
  const onSubmit = () => {
    const formData = new FormData();
    formData.append("Text",getValues()["Text"])
    formData.append("Link",getValues()["Link"])
    formData.append("DurationTime",getValues()["DurationTime"])
    formData.append("Image",image);
    debugger
    // for (const key in getValues()) {
    //     formData.append(key,getValues()[key])
    
    // }
  instance.post(ApiHelper.get("CreateSliderWithFile"),formData).then((res:any) => {
    if(res.data) {
        setShowEditModal(false);
    }
  })

    
   
  };
  const uploadImageFile = async () => {
    console.log(fileId);
    const file = inputImageRef.current?.files[0];
    setImage(file);

  };
  useEffect(() => {
  
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
  title="Name"
  label='نام'
  width="w-full"
/>
  <Input
      
         type="text"
         register={register}
         control={control}
         title="Slug"
         label='Slug'
          
         width="w-full"
       />
         
     <TextArea
      register={register}
      control={control}
      title="Description"
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
    
   


      {/* <div className='col-span-3 mt-6'>
      <Uploader  />
      </div> */}
    
 
   


           
        

     
       
      
    


        
     
</div>
    
   
    </Dialog>
  );
};

export default EditBlogCategory;
