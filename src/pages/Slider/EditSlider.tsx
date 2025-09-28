import React, { useEffect, useRef, useState } from 'react';

import { Dialog, DialogTitle } from '@mui/material';

import { useForm } from 'react-hook-form';



import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import Input from '../../libs/input/input';
import Datepicker from '../../libs/datepicker/datepicker';
import Dropdown from '../../libs/dropdown/dropdown';





interface EditPieceProps extends React.PropsWithChildren {
  showEditModal: boolean;
  slideId:number;
  slideName:string;



  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditSlider: React.FunctionComponent<
EditPieceProps
> = ({ showEditModal, setShowEditModal,slideId,slideName }) => {
   
  const inputImageRef = useRef<any>(null);

  const { register, control,getValues,reset} = useForm({});



    const [fileId,setFileId] = useState<any>(null);
    const [files,setFiles] = useState<any>([]);
    const [image,setImage] = useState<any>(null);
  
    const [progressImageBar,setProgressImageBar] = useState<boolean>(false);
  const onSubmit = () => {
    const formData = new FormData();
    formData.append("text",getValues()["text"])
    formData.append("link",getValues()["link"])
    formData.append("durrationTime",getValues()["durrationTime"])
    formData.append("image",image);
  instance.put(ApiHelper.get("EditSecretOfOurServiceQuality")+ "?id=" + slideId,formData).then((res:any) => {
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
  const  getBlogTagById = () => {
    instance.get(ApiHelper.get("GetSecretOfOurServiceQuality"),{params:{id:slideId}}).then((res:any) => {
        reset({
          Title:res.data.resultObject.title,
          DurationTime:res.data.resultObject.durationTime,
          Link:res.data.resultObject.link,
          imagePath:res.data.resultObject.imagePath
        })
        setFiles("http://45.139.11.225:5533/" + res.data.resultObject.imagePath)
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
        <span> ویرایش  اسلاید </span>
        <span> </span>
        <span>{slideName}</span>
        
      </DialogTitle>
      <div className="grid grid-cols-3 gap-3 pb-8 px-10 py-5">
      
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
      title="Link"
      label='لینک'
       
      width="w-full"
    />
  <Input
      
         type="text"
         register={register}
         control={control}
         title="DurationTime"
         label='مدت زمان اسلایدر'
          
         width="w-full"
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
                     
            </div>
    
   
    </Dialog>
  );
};

export default EditSlider;
