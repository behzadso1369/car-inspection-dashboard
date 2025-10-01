import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogTitle, Switch } from '@mui/material';
import { useForm } from 'react-hook-form';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import Input from '../../libs/input/input';
import Button, { PrimaryButton, SecondaryButton } from '../../libs/button/button';
import Dropdown from '../../libs/dropdown/dropdown';
interface EditPieceProps extends React.PropsWithChildren {
    showEditModal: boolean;
    setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
    roleName:string;
    userId:any;
}
const EditUserRole: React.FunctionComponent<
EditPieceProps
> = ({ showEditModal, setShowEditModal,roleName,userId }) => {
      const { register, control,getValues} = useForm({ 
    values: {
        roleName:roleName
    }
   });
  const [roles,setRoles] = useState<any[]>([]);
  const onSubmit = () => {
  instance.post(ApiHelper.get("AssignRole"),{roleName:getValues().roleName,userId:userId}).then((res:any) => {
    if(res.data) {
        setShowEditModal(false);
    }
  })
  };
  useEffect(() => {
    instance.get(ApiHelper.get("GetAllRolse"), {params:{pageNumber:1,pageSize:100000}}).then((res:any) => {
        setRoles(res?.data?.resultObject)
      })

  },[])
  return (
    <Dialog
      className="w-full  "
      onClose={() => setShowEditModal(false)}
      open={showEditModal}
       maxWidth="xl"
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{
        '& .MuiPaper-elevation': {
          width: "30% "
        },
      }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !py-3 px-4">
        <span>اضافه کردن  نقش </span>
      </DialogTitle>
      <div className="!py-3 px-4">
      <Dropdown
                  register={register}
                  control={control}
                  title="roleName"
                  label='نقش'
                  optionTitle='name'
                  option={roles?.map((item:any) => {
                    return {
                      id: item?.Name,
                      title:item?.Name
                    }
                  })}
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

export default EditUserRole;
