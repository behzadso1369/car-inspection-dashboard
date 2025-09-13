import React, { useEffect, useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Dialog, DialogTitle } from '@mui/material';

import { useForm } from 'react-hook-form';


import { Button, PrimaryButton, SecondaryButton } from '../../../../libs/button/button';
import instance from '../../../../helper/interceptor';
import { ApiHelper } from '../../../../helper/api-request';
import Input from '../../../../libs/input/input';
import Datepicker from '../../../../libs/datepicker/datepicker';
import Dropdown from '../../../../libs/dropdown/dropdown';
import moment from 'jalali-moment';
import TextArea from '../../../../libs/text-area/text-area';



interface EditPieceProps extends React.PropsWithChildren {
  showEditRequestInfomation: boolean;

  showActionButton:boolean;
  detailData:any
  setShowEditRequestModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditRequestInformation: React.FunctionComponent<
EditPieceProps
> = ({ showEditRequestInfomation, setShowEditRequestModal,detailData,showActionButton }) => {
  debugger

    const { register, control,getValues,setValue,watch} = useForm({defaultValues:{
        "requrstId": detailData.requestId,
  "refCode": detailData.refCode,
  "userId": detailData.userId,
  "inquestNumber": detailData.inquestNumber,
  "inquestDate":moment(new Date()).locale("en").format("YYYY-MM-DD"),
  "inquestDeliveryDate": moment(new Date()).locale("en").format("YYYY-MM-DD"),
  "customerProductNo": detailData.customerId,
  "announceDate": moment(new Date()).locale("en").format("YYYY-MM-DD"),
  "description": detailData.description
    }});

  const [customer,setCustomer] = useState<any>([]);
 
  const [user,setUser] = useState<any>([]);
  const watchCustomer = watch("customerProductNo");
  useEffect(() => {
    console.log(getValues());
   
      instance.get(ApiHelper.get('getCustomers')).then((res:any) => {
          setCustomer(res.data);
          const user = res.data?.data.filter((item:any) => item.id === getValues().customerProductNo)[0].users;
    
          setValue("userId",user[0].id);
         
          setUser(user);
        })

   
  }, [watchCustomer]);
  const onSubmit = () => {
    console.log(getValues());
   instance.put(ApiHelper.get("editRequest"),{...getValues(),customerProductNo:"string"}).then((res:any) => {
    if(res.data.success) {
        setShowEditRequestModal(false);
    }
   })
    
   
  };
  return (
    <Dialog
      className="w-full  !overflow-hidden"
      onClose={() => setShowEditRequestModal(false)}
      open={showEditRequestInfomation}
     
      maxWidth="xl"
      
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{
        '& .MuiPaper-elevation': {
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !pb-6">
        <span>جزییات سفارش شماره </span>
        
        <span className="text-sm font-bold text-blue-700">
                   {detailData.requestId}
        </span>
      </DialogTitle>
      <div className="grid grid-cols-3 gap-3 pb-8 px-10 py-5">
      
                  <Dropdown
                  register={register}
                  control={control}
                  title="customerProductNo"
                  label='مشتری'
                  option={customer?.data}
                  disabled={showActionButton}
                
                  fullWidth={true}
                />
                 <Dropdown
                  register={register}
                  control={control}
                  title="userId"
                  label='کارشناس مشتری'
                  disabled={showActionButton}
                  option={user}
                  fullWidth={true}
                />
                  <Input
              placeholder='شماره استعلام'
              type="text"
              register={register}
              control={control}
              disabled={showActionButton}
              title="inquestNumber"
              label='شماره استعلام'
              width="w-full"
            />
         
              <Datepicker
                  label='تاریخ استعلام'
                  register={register}
                  disabled={showActionButton}
                  control={control}
                  title="inquestDate"
                  
                  
                />
             <Datepicker
                  label='تاریخ تحویل مندرج در  استعلام'
                  register={register}
                  control={control}
                  disabled={showActionButton}
                  title="inquestDeliveryDate"
                />
           
         
          
               <Input
              placeholder='کد  ارجاع'
              type="text"
              register={register}
              control={control}
              disabled={showActionButton}
              title="refCode"
              label='کد  ارجاع'
              width="w-full"
            />
             <Datepicker
                    label={"تاریخ ابلاغ"}
                    register={register}
                    disabled={showActionButton}
                    control={control}
                    
                    title={"announceDate"}
                  />
            
                 <div className="col-span-3 p-0">
                <TextArea
        control={control}
        disabled={showActionButton}
        title='description'
        register={register}
        label='توضیحات سفارش'
        
        />
                </div>
            
              
            {!showActionButton && <div className='col-span-3 flex justify-end mt-8'>
                <Button
              title='لغو'
              active={true}
              style={SecondaryButton}
              onClick={() =>setShowEditRequestModal(false)}
            />
              <Button
              title='ویرایش'
              active={true}
              style={PrimaryButton}
              onClick={onSubmit}
            /></div>}
             
            
        
            </div>
    
   
    </Dialog>
  );
};

export default EditRequestInformation;
