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

const EditCarInspection: React.FunctionComponent<
EditPieceProps
> = ({ showEditModal, setShowEditModal,secretOfOurServiceQualityId,secretOfOurServiceQualityName }) => {
 
  const inputImageRef = useRef<any>(null);

  const { register, control,getValues,reset} = useForm({
    values: {
      marketPrice:"0",
    ourPrice:"0",
    carGroupId:"0",
    carInspectionTypeId:"0"
    }
  });
      const [groups,setGroups] = useState<any>([]);
    const [types,setTypes] = useState<any>([]);



    const [fileId,setFileId] = useState<any>(null);
    const [files,setFiles] = useState<any>([]);
    const [image,setImage] = useState<any>(null);
  
    const [progressImageBar,setProgressImageBar] = useState<boolean>(false);
  const onSubmit = () => {
    const formData = new FormData();
    formData.append("marketPrice",getValues()["marketPrice"])
    formData.append("ourPrice",getValues()["ourPrice"])
    formData.append("carGroupId",getValues()["carGroupId"])
    formData.append("carInspectionTypeId",getValues()["carInspectionTypeId"])
  
  instance.put(ApiHelper.get("EditCarInspection")+ "?id=" + secretOfOurServiceQualityId,formData).then((res:any) => {
    if(res.data) {
        setShowEditModal(false);
    }
  })

    
   
  };
        const getGroups = () => {
          instance.get(ApiHelper.get("CarGroupList"),{params: {skip:0,take:100000}}).then((res:any) => {
        if(res.data) {
            setGroups(res.data.resultObject);
        }
      })
      }
        const getTypes = () => {
      instance.get(ApiHelper.get("CarInspectionTypeList"),{params: {skip:0,take:100000}}).then((res:any) => {
    if(res.data) {
        setTypes(res.data.resultObject);
    }
  })
  }
  const uploadImageFile = async () => {
    console.log(fileId);
    const file = inputImageRef.current?.files[0];
    setImage(file);

  };
  const  getBlogTagById = () => {
    instance.get(ApiHelper.get("GetCarInspection"),{params:{id:secretOfOurServiceQualityId}}).then((res:any) => {
        reset({
          marketPrice:res.data.resultObject.marketPrice,
          ourPrice:res.data.resultObject.ourPrice,
          carGroupId:res.data.resultObject.carGroupId,
          carInspectionTypeId:res.data.resultObject.carInspectionTypeId,
        })
     
    })
  }
  useEffect(() => {
    getBlogTagById();
        getGroups();
    getTypes();
  },[])
  return (
    <Dialog
      className="w-full  "
      onClose={() => setShowEditModal(false)}
      open={showEditModal}
        maxWidth="xl"
    
      
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
     
    >
       <DialogTitle className="w-full flex items-center gap-3 border-b !pb-6">
        <span> ویرایش    راز کیفیت خدمات ما </span>
        <span> </span>
        <span>{secretOfOurServiceQualityName}</span>
        
      </DialogTitle>
      <div className="grid grid-cols-4 gap-3 !py-3 px-4">
   
   <Input
   placeholder='قیمت بازار'
   type="text"
   register={register}
   control={control}
   title="marketPrice"
   label='قیمت بازار'
   width="w-full"
 />
   <Input
   placeholder='قیمت ما'
   type="text"
   register={register}
   control={control}
   title="ourPrice"
   label='قیمت ما'
   width="w-full"
 />
  
          
     <Dropdown
                    register={register}
                    control={control}
                    title="carGroupId"
                    label='گروه خودرو'
                    option={groups}
                    optionTitle='name'
                  
                    fullWidth={true}
                  />
                      <Dropdown
                         optionTitle='name'
                    register={register}
                    control={control}
                    title="carInspectionTypeId"
                    label='نوع کارشناسی خودرو'
                    option={types}
                  
                    fullWidth={true}
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

export default EditCarInspection;
