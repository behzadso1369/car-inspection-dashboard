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
  showAddUserModal: boolean;



  setShowAddUserModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateBlogPost: React.FunctionComponent<
EditPieceProps
> = ({ showAddUserModal, setShowAddUserModal }) => {
 
  const inputImageRef = useRef<any>(null);

  const { register, control,getValues} = useForm({});
  const [blogCategories,setBlogCategories] = useState<any>([])



    const [fileId,setFileId] = useState<any>(null);
    const [files,setFiles] = useState<any>([]);
    const [image,setImage] = useState<any>(null);
  
    const [progressImageBar,setProgressImageBar] = useState<boolean>(false);
  const onSubmit = () => {

  instance.post(ApiHelper.get("CreateBlogPost"),getValues()).then((res:any) => {
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
  const getBlogCategories = () => {
    instance.get(ApiHelper.get("BlogCategoriesList"),{params: {pageNumber:0,pageSize:10000}}).then((res:any) => {
      setBlogCategories(res.data.resultObject);

    })
  }
  useEffect(() => {
    getBlogCategories();
  
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
        <span>اضافه کردن  اسلاید </span>
        
      </DialogTitle>
      <div className="grid grid-cols-4 gap-3 !py-3 px-4">
  
  <Input
  placeholder='عنوان'
  type="text"
  register={register}
  control={control}
  title="Title"
  label='عنوان'
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
  <Input
      
         type="text"
         register={register}
         control={control}
         title="Excerpt"
         label='گزیده'
         width="w-full"
       />
             <div className='flex justify-between items-center'>
                    <span>پابلیش شود؟</span>
                    <Switch {...register("IsPublished")} {...label} defaultChecked={false}  />

                  </div>
             <div className='flex justify-between items-center'>
                    <span>صفحه اول  باشئ؟</span>
                    <Switch {...register("IsFirstPage")} {...label} defaultChecked={false}  />

                  </div>
     <TextArea
      register={register}
      control={control}
      title="Content"
      label='متن'
    />
      <Dropdown
                  register={register}
                  control={control}
                  title="bank"
                  label='بانک'
                  option={blogCategories?.map((item:any) => {
                    console.log(item);
                    
                    return {
                      id: item?.id,
                      title:item?.name
                    }
                  })}
                  fullWidth={true}
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

export default CreateBlogPost;
