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

const label = { inputProps: { 'aria-label': 'Switch demo' } };





interface EditPieceProps extends React.PropsWithChildren {
  showAddUserModal: boolean;



  setShowAddUserModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateWhyWe: React.FunctionComponent<
EditPieceProps
> = ({ showAddUserModal, setShowAddUserModal }) => {
 
  const inputImageRef = useRef<any>(null);

  const { register, control,getValues} = useForm({});



    const [fileId,setFileId] = useState<any>(null);
    const [files,setFiles] = useState<any>([]);
    const [image,setImage] = useState<any>(null);
  
    const [progressImageBar,setProgressImageBar] = useState<boolean>(false);
  const onSubmit = () => {
    const formData = new FormData();
    formData.append("t1Title",getValues()["t1Title"])
    formData.append("t1Desc",getValues()["t1Desc"])
    formData.append("t2Title",getValues()["t2Title"])
    formData.append("t2Desc",getValues()["t2Desc"])
    formData.append("t3Title",getValues()["t3Title"])
    formData.append("t3Desc",getValues()["t3Desc"])
    formData.append("t4Title",getValues()["t4Title"])
    formData.append("t4Desc",getValues()["t4Desc"])
    formData.append("image",image);
  instance.post(ApiHelper.get("CreateWhyWe"),formData).then((res:any) => {
    if(res.data) {
        setShowAddUserModal(false);
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
      onClose={() => setShowAddUserModal(false)}
      open={showAddUserModal}
      maxWidth={false}
    
      
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{
        '& .MuiPaper-elevation': {
        
          width: "80% "
        },
      }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !py-3 px-4">
        <span>اضافه کردن    راز  جدید </span>
        
      </DialogTitle>
      <div className="grid grid-cols-4 gap-3 !py-3 px-4">
  
  <Input
  placeholder='عنوان قسمت اول'
  type="text"
  register={register}
  control={control}
  title="t1Title"
  label='عنوان قسمت اول'
  width="w-full"
/>
 
         
     <TextArea
      register={register}
      control={control}
      title="t1Desc"
      label='توضیحات قسمت اول'

    />
  <Input
  placeholder='عنوان قسمت دوم'
  type="text"
  register={register}
  control={control}
  title="t2Title"
  label='عنوان قسمت دوم'
  width="w-full"
/>
 
         
     <TextArea
      register={register}
      control={control}
      title="t2Desc"
      label='توضیحات قسمت دوم'

    />
  <Input
  placeholder='عنوان قسمت سوم'
  type="text"
  register={register}
  control={control}
  title="t3title"
  label='عنوان قسمت سوم'
  width="w-full"
/>
 
         
     <TextArea
      register={register}
      control={control}
      title="t3Desc"
      label='توضیحات قسمت سوم'

    />
  <Input
  placeholder='عنوان قسمت چهارم'
  type="text"
  register={register}
  control={control}
  title="t4Tit"
  label='عنوان قسمت چهارم'
  width="w-full"
/>
 
         
     <TextArea
      register={register}
      control={control}
      title="t5Desc"
      label='توضیحات قسمت چهارم'

    />
        <div className='mt-8 col-span-2 flex'>
   <div className="flex ">

<div className='w-1/2'>
 <label
   htmlFor="Image"
   className=" rounded-md px-3 py-1 text-sm bg-gray-700 text-white hover:bg-blue-700 focus:bg-blue-opacity-90 focus:shadow-primary-focus whitespace-nowrap cursor-pointer"
 >
   آپلود عکس   
 </label>
 <input
   name="Image"
   id="Image"
   type="file"
   ref={inputImageRef}
   onInput={uploadImageFile}
   style={{ visibility: 'hidden' }}
 />

</div>
{progressImageBar ? <span>فایل عکس در حال آپلود است</span> : <div>
{image &&  <div className='w-auto relative p-2 border-2 border-slate-400 flex flex-col items-center'><img width="50px" height="50px" src={image.image}/></div>}
</div>}




{/* <Button
 title={'ذخیره   '}
 active={true}
 style={PrimaryButton}
 onClick={uploadFile}
>
 {' '}
 ذخیره
</Button> */}
<div className="flex "></div>
   </div>
 
   </div>
    


        
     
   <div className='col-span-4 flex justify-end mt-8'>
              <Button
              title='لغو'
              active={true}
              style={SecondaryButton}
              onClick={() =>setShowAddUserModal(false)}
            />
              <Button
              title='اضافه کردن'
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

export default CreateWhyWe;
