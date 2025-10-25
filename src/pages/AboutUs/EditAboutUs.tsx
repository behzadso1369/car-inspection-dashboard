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
import TextEditor from '../../libs/text-editor/text-editor';

const label = { inputProps: { 'aria-label': 'Switch demo' } };





interface EditPieceProps extends React.PropsWithChildren {
  showEditModal: boolean;
  secretOfOurServiceQualityId:number;
  secretOfOurServiceQualityName:string;



  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditAboutUs: React.FunctionComponent<
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
    formData.append("t1Title",getValues()["t1Title"])
    formData.append("t1Desc",getValues()["t1Desc"])
    formData.append("t2Title",getValues()["t2Title"])
    formData.append("t2Desc",getValues()["t2Desc"])
    formData.append("t3Title",getValues()["t3Title"])
    formData.append("t3Desc",getValues()["t3Desc"])
    formData.append("t4Title",getValues()["t4Title"])
    formData.append("t4Desc",getValues()["t4Desc"])
    formData.append("image",image);
  instance.put(ApiHelper.get("GetAboutUs")+ "?id=" + secretOfOurServiceQualityId,formData).then((res:any) => {
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
    instance.get(ApiHelper.get("GetWhyWe"),{params:{id:secretOfOurServiceQualityId}}).then((res:any) => {
        reset({
          t1Title:res.data.resultObject.t1Title,
          t1Desc:res.data.resultObject.t1Desc,
          t2Title:res.data.resultObject.t2Title,
          t2Desc:res.data.resultObject.t2Desc,
          t3Title:res.data.resultObject.t3Title,
          t3Desc:res.data.resultObject.t3Desc,
          t4Title:res.data.resultObject.t4Title,
          t4Desc:res.data.resultObject.t4Desc
         
       
        })
        setFiles("https://api.carmacheck.com/" + res.data.resultObject.imagePath)
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
