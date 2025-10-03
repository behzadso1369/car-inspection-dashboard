import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogTitle, Switch } from '@mui/material';
import { useForm } from 'react-hook-form';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import Input from '../../libs/input/input';
import TextArea from '../../libs/text-area/text-area';
import Button, { PrimaryButton, SecondaryButton } from '../../libs/button/button';
import { Image } from 'antd';
import Dropdown from '../../libs/dropdown/dropdown';
interface EditPieceProps extends React.PropsWithChildren {
  showEditModal: boolean;
  secretOfOurServiceQualityId:number;
  secretOfOurServiceQualityName:string;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const EditFlowState: React.FunctionComponent<
EditPieceProps
> = ({ showEditModal, setShowEditModal,secretOfOurServiceQualityId,secretOfOurServiceQualityName }) => {
  const { register, control,getValues,reset} = useForm({
    values: {
      name:"",
      title:"",
      flowTypeId:"0"
    }
  });
  const [flowTypes,setFlowTypes] = useState<any>([])
  const getFlowTypes = () => {
    instance.get(ApiHelper.get("FlowTypeList"),{params:{skip:0,take:100000}}).then((res:any) => {
      setFlowTypes(res.data.resultObject)
    })
  }
  const onSubmit = () => {
    const formData = new FormData();
    formData.append("title",getValues()["title"])
    formData.append("name",getValues()["name"])
    formData.append("flowTypeId",getValues()["flowTypeId"])
    formData.append("flowTypeName",flowTypes.filter((item:any) => item.id === getValues()["flowTypeId"])[0].name)
  instance.put(ApiHelper.get("EditFlowState")+ "?id=" + secretOfOurServiceQualityId,formData).then((res:any) => {
    if(res.data) {
        setShowEditModal(false);
    }
  })

    
   
  };
 
  const  getBlogTagById = () => {
    instance.get(ApiHelper.get("GetFlowState"),{params:{id:secretOfOurServiceQualityId}}).then((res:any) => {
        reset({
          title:res.data.resultObject.title,
          name:res.data.resultObject.name,
          flowTypeId:res.data.resultObject.flowTypeId
        })
    })
  }
  useEffect(() => {
    getBlogTagById();
    getFlowTypes();
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
        <span> ویرایش    مرحله فرآیند </span>
        <span> </span>
        <span>{secretOfOurServiceQualityName}</span>
        
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
  
  <Input
  placeholder='عنوان'
  type="text"
  register={register}
  control={control}
  title="title"
  label='عنوان'
  width="w-full"
/>
<Dropdown
                    optionTitle='name'
                  register={register}
                  control={control}
                  title="flowTypeId"
                  label='نوع فرآیند'
                  option={flowTypes}
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

export default EditFlowState;
