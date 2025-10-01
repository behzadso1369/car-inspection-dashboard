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

const CreateCarInspectionLocation: React.FunctionComponent<
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
    formData.append("name",getValues()["name"])
    formData.append("locationTypeDescription",getValues()["locationTypeDescription"])
  instance.post(ApiHelper.get("CreateCarInspectionLocation"),formData).then((res:any) => {
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
        <span>اضافه کردن      محل کارشناسی خودرو جدید </span>
        
      </DialogTitle>
      <div className="grid grid-cols-4 gap-3 !py-3 px-4">
  
  <Input
  placeholder='نام'
  type="text"
  register={register}
  control={control}
  title="name"
  label='نام'
  width="w-full"
/>
 
         
     <TextArea
      register={register}
      control={control}
      title="locationTypeDescription"
      label='توضیحات'

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

export default CreateCarInspectionLocation;
