import React, { useEffect, useState } from 'react';

import { Dialog, DialogTitle } from '@mui/material';

import { useForm } from 'react-hook-form';



import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import Input from '../../libs/input/input';
import Datepicker from '../../libs/datepicker/datepicker';
import Dropdown from '../../libs/dropdown/dropdown';





interface EditPieceProps extends React.PropsWithChildren {
  showEditUserModal: boolean;
  userId:number;
  userName:string;



  setShowEditUserModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditUser: React.FunctionComponent<
EditPieceProps
> = ({ showEditUserModal, setShowEditUserModal,userId,userName }) => {
    const [userData,setUserData] = useState<any>({});
    const [customer,setCustomer] = useState<any>([]);

    const { register, control,reset} = useForm({
        defaultValues: {
            "id": userData.id,
            "customerId": 1,
            "username": userData.username,
            "password": userData.password,
            "firstName": userData.firstName,
            "lastName": userData.lastName,
            "nationalCode": userData.nationalCode,
            "mobile": userData.mobile,
            "birthDate": userData.birthDate,
            "roleId":1
        }
    });

    const [roles,setRoles] = useState<any>([]);


 
  useEffect(() => {
    instance.get(ApiHelper.get('getCustomers')).then((res:any) => {
      setCustomer(res.data);
     
    })
    instance.get(ApiHelper.get("getRoles")).then((res:any) => {
        if(res.data.success) {
            setRoles(res.data.data);
        }
    })
    instance.get(ApiHelper.get("getUserById"),{params: {UserId:userId}}).then((res:any) => {
        if(res.data.success) {
          setUserData(res.data.data);
          // reset(res.data.data);
         
           
          

            reset({
            "id": res?.data?.data.id,
            "customerId": 1,
            "username": res.data.data.username,
            "password": res.data.data.password,
            "firstName": res.data.data.firstName,
            "lastName": res.data.data.lastName,
            "nationalCode": res.data.data.nationalCode,
            "mobile": res.data.data.mobile,
            "birthDate": res.data.data.birthDate,
            "roleId":res.data.data.roles[0].id
            });
        }
    })
  },[])
  return (
    <Dialog
      className="w-full  !overflow-hidden"
      onClose={() => setShowEditUserModal(false)}
      open={showEditUserModal}
     
      maxWidth="xl"
      
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{
        '& .MuiPaper-elevation': {
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !pb-6">
        <span> ویرایش  کاربر </span>
        <span> </span>
        <span>{userName}</span>
        
      </DialogTitle>
      <div className="grid grid-cols-3 gap-3 pb-8 px-10 py-5">
      
{/*               
    <Dropdown
                  register={register}
                  control={control}
                  title="equipId"
                  label='نام تجهیز'
                  option={equip?.data}
                  fullWidth={true}
                />
                  <Dropdown
                register={register}
                control={control}
                title="equipPartId"
                
                label='نام قطعه'
                option={equipPart?.data}
             
                fullWidth={true}
               
              />  */}
               <Dropdown
               optionTitle='name'
                  register={register}
                  control={control}
                  title="customerId"
                  label='مشتری'
                  option={customer?.data}
                
                  fullWidth={true}
                />
               <Input
       
       placeholder=' نام کاربری'
       type="text"
       register={register}
       control={control}
       title="username"
       label='نام کاربری'
       width="w-full"
     />
      <Input

       type="password"
       register={register}
       control={control}
       title="password"
       label='پسورد'
       width="w-full"
     />
       <Input
       placeholder='نام'
       type="text"
       register={register}
       control={control}
       title="firstName"
       label='نام'
       width="w-full"
     />
       <Input
           
              type="text"
              register={register}
              control={control}
              title="lastName"
              label='نام خانوادگی'
              width="w-full"
            />
       <Input
           
              type="text"
              register={register}
              control={control}
              title="nationalCode"
              label='کد ملی'
              width="w-full"
            />
       <Input
           
              type="text"
              register={register}
              control={control}
              title="mobile"
              label='موبایل'
              width="w-full"
            />
            
               <Datepicker
                    label={"تاریخ تولد"}
                    register={register}
                    control={control}
                    
                    title={"birthDate"}
                  />
                    <Dropdown
                    optionTitle='name'
                  register={register}
                  control={control}
                  title="roleId"
                  label='نام نقش'
                  option={roles}
                  fullWidth={true}
                />
                     
            </div>
    
   
    </Dialog>
  );
};

export default EditUser;
