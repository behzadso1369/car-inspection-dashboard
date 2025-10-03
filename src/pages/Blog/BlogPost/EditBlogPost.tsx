import React, { useEffect, useRef, useState } from 'react';

import { Dialog, DialogTitle, Switch } from '@mui/material';

import { useForm } from 'react-hook-form';



import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import Input from '../../../libs/input/input';
import Datepicker from '../../../libs/datepicker/datepicker';
import Dropdown from '../../../libs/dropdown/dropdown';
import TextEditor from '../../../libs/text-editor/text-editor';
import Button, { PrimaryButton, SecondaryButton } from '../../../libs/button/button';
const label = { inputProps: { 'aria-label': 'Switch demo' } };





interface EditPieceProps extends React.PropsWithChildren {
  showEditModal: boolean;
  blogCatId:number;
  blogCatName:string;



  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditBlogPost: React.FunctionComponent<
EditPieceProps
> = ({ showEditModal, setShowEditModal,blogCatId,blogCatName }) => {
  const inputImageRef = useRef<any>(null);
  const [blogCategories,setBlogCategories] = useState<any>([]);
  const [fileId,setFileId] = useState<any>(null);
  const [files,setFiles] = useState<any>([]);
  const [image,setImage] = useState<any>(null);

  const [progressImageBar,setProgressImageBar] = useState<boolean>(false);
    const { register, control,reset,getValues} = useForm({
      values: {
        CategoryId: "0",
        Excerpt: "",
        Slug: "",
        Title: "",
        IsFirstPage:"",
        IsPublished:"",
        Content:""
        
      }
        
    });
    const onSubmit = () => {
      const formData = new FormData();
      formData.append("Title",getValues("Title"));
      formData.append("CategoryId",getValues("CategoryId"));
      formData.append("Content",getValues("Content"));
      formData.append("IsPublished",getValues("IsPublished"));
      formData.append("IsFirstPage",getValues("IsFirstPage"));
      formData.append("Slug",getValues("Slug"));
      formData.append("CoverImage",image);
      formData.append("Title",getValues("Title"));
      
  instance.put(ApiHelper.get("EditBlogPost") + "?id=" + blogCatId,formData).then((res:any) => {
    if(res.data) {
        setShowEditModal(false);
    }
  })

    
   
  };
    const getBlogCategories = () => {
      instance.get(ApiHelper.get("BlogCategoriesList"),{params: {skip:0,take:10000}}).then((res:any) => {
        setBlogCategories(res.data.resultObject);
  
      })
    }
    const  getBlogPostById = () => { 
      instance.get(ApiHelper.get("getBlogPostById"),{params:{id:blogCatId}}).then((res:any) => {
  
        
        
          reset({
            CategoryId: res.data.resultObject.categoryId,
            Excerpt: res.data.resultObject.excerpt,
            Slug: res.data.resultObject.slug,
            Title: res.data.resultObject.title,
            IsFirstPage:res.data.resultObject.isFirstPage,
            IsPublished:res.data.resultObject.isPublished,
            Content:res.data.resultObject.content
          })
          debugger
     
      })
    }
    const uploadImageFile = async () => {
      console.log(fileId);
      const file = inputImageRef.current?.files[0];
      setImage(file);
  
    };
    useEffect(() => {
      getBlogPostById();
      getBlogCategories();
    
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
        <span> ویرایش  کاربر </span>
        <span> </span>
        <span>{blogCatName}</span>
        
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
           <Dropdown
      optionTitle='name'
                  register={register}
                  control={control}
                  title="CategoryId"
                  label='دسته بندی'
                  option={blogCategories}
                  fullWidth={true}
                />
                            <div className="col-span-4">
    <TextEditor 
    baseUrl='' 
    register={register}
      control={control}
      title="Content"
      className="w-full"
      label='متن' />
    </div>
             <div className='flex justify-between items-center'>
                    <span>پابلیش شود؟</span>
                    <Switch {...register("IsPublished")} {...label}  />

                  </div>
             <div className='flex justify-between items-center'>
                    <span>صفحه اول  باشئ؟</span>
                    <Switch {...register("IsFirstPage")} {...label}  />

                  </div>

  
  
  
      

    


        
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
              onClick={() =>setShowEditModal(false)}
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

export default EditBlogPost;
