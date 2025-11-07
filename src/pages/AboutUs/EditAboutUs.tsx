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
import { Link, useParams } from 'react-router-dom';
import { Image } from 'antd';
import TextEditor from '../../libs/text-editor/text-editor';

const label = { inputProps: { 'aria-label': 'Switch demo' } };







const EditAboutUs: React.FunctionComponent<
any
> = () => {
  const {id} = useParams();
 
  const inputImageRef = useRef<any>(null);

  const { register, control,getValues,reset} = useForm({});



    const [fileId,setFileId] = useState<any>(null);
    const [files,setFiles] = useState<any>([]);
    const [image,setImage] = useState<any>(null);
  
    const [progressImageBar,setProgressImageBar] = useState<boolean>(false);
  const onSubmit = () => {

  instance.put(ApiHelper.get("EdtiAboutUs")+ "?id=" + id,getValues()).then((res:any) => {
    if(res.data) {
       
    }
  })

    
   
  };
  const uploadImageFile = async () => {
    console.log(fileId);
    const file = inputImageRef.current?.files[0];
    setImage(file);

  };
  const  getBlogTagById = () => {
    instance.get(ApiHelper.get("GetAboutUs") + "?id=" + id).then((res:any) => {
        reset({
          content: res?.data?.resultObject?.content
      
         
       
        })
        debugger
  
    })
  }
  useEffect(() => {
    getBlogTagById();
  },[])
  return (
    // <Dialog
    //   className="w-full  "
    //   onClose={() => setShowEditModal(false)}
    //   open={showEditModal}
    //   maxWidth={false}
    
      
    //   PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
    //   sx={{
    //     '& .MuiPaper-elevation': {
        
    //       width: "80% "
    //     },
    //   }}
    // >
    //    <DialogTitle className="w-full flex items-center gap-3 border-b !pb-6">
    //     <span> ویرایش    راز کیفیت خدمات ما </span>
    //     <span> </span>
    //     <span>{secretOfOurServiceQualityName}</span>
        
    //   </DialogTitle>
      <div className="grid grid-cols-4 gap-3 !py-3 px-4">
  
  <div className="col-span-4">
    <TextEditor 
    baseUrl='https://api.carmacheck.com' 
    register={register}
      control={control}
      title="content"
      className="w-full"
      label='متن' />
    </div>
     
   <div className='col-span-4 flex justify-end mt-8'>
              <Button
              title='لغو'
              active={true}
              style={SecondaryButton}
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
    
   
    // </Dialog>
  );
};

export default EditAboutUs;
