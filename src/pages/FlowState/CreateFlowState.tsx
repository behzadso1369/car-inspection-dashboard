import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogTitle, Switch } from '@mui/material';
import { useForm } from 'react-hook-form';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import Input from '../../libs/input/input';
import Button, { PrimaryButton, SecondaryButton } from '../../libs/button/button';
import Dropdown from '../../libs/dropdown/dropdown';
interface EditPieceProps extends React.PropsWithChildren {
  showAddUserModal: boolean;
  setShowAddUserModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const CreateFlowState: React.FunctionComponent<
EditPieceProps
> = ({ showAddUserModal, setShowAddUserModal }) => {
  const [flowTypes,setFlowTypes] = useState<any>([]);
  const getFlowTypes = () => {
    instance.get(ApiHelper.get("FlowTypeList"),{params:{skip:0,take:100000}}).then((res:any) => {
      setFlowTypes(res.data.resultObject)
    })
  }
  const { register, control,getValues} = useForm({});
  const onSubmit = () => {
    const formData = new FormData();
    formData.append("title",getValues()["title"])
    formData.append("name",getValues()["name"])
    formData.append("flowTypeId",getValues()["flowTypeId"])
    formData.append("flowTypeName",flowTypes.filter((item:any) => item.id === getValues()["flowTypeId"])[0].name)
  instance.post(ApiHelper.get("CreateFlowState"),formData).then((res:any) => {
    if(res.data) {
        setShowAddUserModal(false);
    }
  })
  };
  useEffect(() => {
    getFlowTypes();
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
        <span>اضافه کردن    مرحله فرآیند </span>
        
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
              onClick={() =>setShowAddUserModal(false)}
            />
              <Button
              title='اضافه کردن'
              active={true}
              style={PrimaryButton}
              onClick={onSubmit}
            />
            
              </div>

</div>
    
   
    </Dialog>
  );
};

export default CreateFlowState;
