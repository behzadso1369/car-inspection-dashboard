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
import axios from 'axios';

const label = { inputProps: { 'aria-label': 'Switch demo' } };





interface EditPieceProps extends React.PropsWithChildren {
  showAddUserModal: boolean;



  setShowAddUserModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateOrder: React.FunctionComponent<
EditPieceProps
> = ({ showAddUserModal, setShowAddUserModal }) => {
  const { register, control,getValues} = useForm({});
   const [users,setUsers] = useState<any>([]);
   const [userAddress,setUserAddress] = useState<any>([]);
   const [flowStates,setFlowStates] = useState<any>([]);
   const [carGroups,setCarGroups] = useState<any>([]);
   const [carInspections,setCarInspections] = useState<any>([]);
   const [carInspectionTypes,setCarInspectionTypes] = useState<any>([]);
   const [carInspectionLocations,setCarInspectionLocations] = useState<any>([]);
  const onSubmit = () => {
    const formData = new FormData();
  
  instance.post(ApiHelper.get("CreateFinancialExpenditure"),getValues()).then((res:any) => {
    if(res.data) {
        setShowAddUserModal(false);
    }
  })

    
   
  };
    const getUsers = () => {
    instance.get(ApiHelper.get("GetSiteUserList"),{params: {skip:0,take:10000}}).then((res:any) => {
        const newUsers = res.data.resultObject.map((item:any) => {
          return {
                id: item.Id,
        FullName: item.FullName
          }
      })
      setUsers(newUsers);
      

    })
  }
  //   const getUserAdddress = () => {
  //   axios.get("https://api.carmacheck.com/api/User/getUserAddress",{
  //     headers: {Authorization: localStorage.getItem("accessToken")},
  //     params: {skip:0,take:10000}}).then((res:any) => {
  //     setUserAddress(res.data.data.resultObject);
      

  //   })
  // }
    const getFlowStates = () => {
    instance.get(ApiHelper.get("FlowStateList"),{params: {skip:0,take:10000}}).then((res:any) => {
      setFlowStates(res.data.resultObject);
      

    })
  }
    const getCarGroups = () => {
    instance.get(ApiHelper.get("CarGroupList"),{params: {skip:0,take:10000}}).then((res:any) => {
      setCarGroups(res.data.resultObject);
      

    })
  }
    const getCarInspections = () => {
    instance.get(ApiHelper.get("CarInspectionList"),{params: {skip:0,take:10000}}).then((res:any) => {
      const carInspections = res.data.resultObject.map((item:any) => {
          return {
                id: item.id,
        title: item.carGroup.name
          }
      })
      
      setCarInspections(carInspections);
      

    })
  }
    const getCarInspectionTypes = () => {
    instance.get(ApiHelper.get("CarInspectionTypeList"),{params: {skip:0,take:10000}}).then((res:any) => {
      setCarInspectionTypes(res.data.resultObject);
      

    })
  }
    const getCarrInspectionLocations = () => {
    instance.get(ApiHelper.get("CarInspectionLocationList"),{params: {skip:0,take:10000}}).then((res:any) => {
      setCarInspectionLocations(res.data.resultObject);
      

    })
  }

  useEffect(() => {
    getUsers();
    // getUserAdddress();
    getFlowStates();
    getCarGroups();
    getCarInspections();
    getCarInspectionTypes();
    getCarrInspectionLocations();
  
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
        <span>اضافه کردن      سفارش </span>
        
      </DialogTitle>
      <div className="grid grid-cols-4 gap-3 !py-3 px-4">
      <Dropdown
      optionTitle='FullName'
                  register={register}
                  control={control}
                  title="userId"
                  label='کاربر'
                  option={users}
                  fullWidth={true}
      
                />
      {/* <Dropdown
      optionTitle='name'
                  register={register}
                  control={control}
                  title="addressId"
                  label='آدرس کاربر'
                  option={users}
                  fullWidth={true}
                /> */}
      {/* <Dropdown
      optionTitle='title'
                  register={register}
                  control={control}
                  title="flowStateId"
                  label='مرحله سفارش'
                  option={flowStates}
                  fullWidth={true}
                /> */}
      <Dropdown
      optionTitle='name'
                  register={register}
                  control={control}
                  title="carGroupId"
                  label='گروه خودرو'
                  option={carGroups}
                  fullWidth={true}
                />
      <Dropdown
      optionTitle='title'
                  register={register}
                  control={control}
                  title="carInspectionId"
                  label='کارشناسی'
                  option={carInspections}
                  fullWidth={true}
                />
      <Dropdown
      optionTitle='name'
                  register={register}
                  control={control}
                  title="carInspectionTypeId"
                  label='نوع کارشناسی'
                  option={carInspectionTypes}
                  fullWidth={true}
                />
      <Dropdown
      optionTitle='name'
                  register={register}
                  control={control}
                  title="carInspectionLocationTypeId"
                  label='مکان کارشناسی'
                  option={carInspectionLocations}
                  fullWidth={true}
                />
                  <Datepicker
                                    label={"تاریخ برنامه ریزی شده"}
                                    register={register}
                                    control={control}
                                    
                                    
                                    title={"scheduledDate"}
                                  />
                                   <Input
  placeholder='زمان برنامه ریزی شده  '
  type="text"
  register={register}
  control={control}
  title="scheduledTime"
  label='زمان برنامه ریزی شده  '
  width="w-full"
/>
                                   <Input
  placeholder='قیمت'
  type="number"
  register={register}
  control={control}
  title="price"
  label='قیمت  '
  width="w-full"
/>
     
                                   {/* <Input
  placeholder='کد  '
  type="text"
  register={register}
  control={control}
  title="code"
  label='کد  '
  width="w-full"
/> */}
     
    


        
     
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

export default CreateOrder;
