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

const CreateCarInspection: React.FunctionComponent<
EditPieceProps
> = ({ showAddUserModal, setShowAddUserModal }) => {
 
  const inputImageRef = useRef<any>(null);

  const { register, control,getValues} = useForm({
    values: {
      marketPrice:"0",
    ourPrice:"0",
    carGroupId:"0",
    carInspectionTypeId:"0"
    }
  });



    const [fileId,setFileId] = useState<any>(null);
    const [files,setFiles] = useState<any>([]);
    const [groups,setGroups] = useState<any>([]);
    const [types,setTypes] = useState<any>([]);
    const [image,setImage] = useState<any>(null);
  
    const [progressImageBar,setProgressImageBar] = useState<boolean>(false);
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
  const onSubmit = () => {
    const formData = new FormData();
    formData.append("marketPrice",getValues()["marketPrice"])
    formData.append("ourPrice",getValues()["ourPrice"])
    formData.append("carGroupId",getValues()["carGroupId"])
    formData.append("carInspectionTypeId",getValues()["carInspectionTypeId"])

  instance.post(ApiHelper.get("CreateCarInspection"),formData).then((res:any) => {
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
    getGroups();
    getTypes();
  
  },[])
  return (
    <Dialog
      className="w-full  "
      onClose={() => setShowAddUserModal(false)}
      open={showAddUserModal}
      maxWidth="xl"
    
      
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
    
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !py-3 px-4">
        <span>اضافه کردن کارشناسی جدید      </span>
        
      </DialogTitle>
      <div className="grid grid-cols-4 gap-3 !py-3 px-4">
  
  <Input
  placeholder='قیمت بازار'
  type="number"
  register={register}
  control={control}
  title="marketPrice"
  label='قیمت بازار'
  width="w-full"
/>
  <Input
  placeholder='قیمت ما'
  type="number"
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
                   register={register}
                   control={control}
                   title="carInspectionTypeId"
                   label='نوع کارشناسی خودرو'
                   option={types}
                         optionTitle='name'
                 
                   fullWidth={true}
                 />
   
    


        
     
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

export default CreateCarInspection;
