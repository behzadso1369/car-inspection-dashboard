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

const EdiFlowType: React.FunctionComponent<
EditPieceProps
> = ({ showEditModal, setShowEditModal,secretOfOurServiceQualityId,secretOfOurServiceQualityName }) => {
 
  const inputImageRef = useRef<any>(null);

  const { register, control,getValues,reset} = useForm({});



    const [fileId,setFileId] = useState<any>(null);
    const [files,setFiles] = useState<any>([]);
    const [image,setImage] = useState<any>(null);
  
    const [progressImageBar,setProgressImageBar] = useState<boolean>(false);
  const onSubmit = () => {
    const formData = new FormData();
    formData.append("Title",getValues()["Title"])
    formData.append("MoreDescription",getValues()["MoreDescription"])
    formData.append("Image",image);
  instance.put(ApiHelper.get("EditSecretOfOurServiceQuality")+ "?id=" + secretOfOurServiceQualityId,formData).then((res:any) => {
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
    instance.get(ApiHelper.get("GetSecretOfOurServiceQuality"),{params:{id:secretOfOurServiceQualityId}}).then((res:any) => {
        reset({
          Title:res.data.resultObject.title,
          MoreDescription:res.data.resultObject.moreDescription,
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
  placeholder='عنوان'
  type="text"
  register={register}
  control={control}
  title="Title"
  label='عنوان'
  width="w-full"
/>

         
     <TextArea
      register={register}
      control={control}
      title="MoreDescription"
      label='توضیحات'

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
<div className="flex items-center py-2">
                         <Image
                    style={{width: "100px",height: "70px",borderRadius: "7px",objectFit: "cover" }}
                    src={files}
                    />
                    </div>
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

export default EdiFlowType;
