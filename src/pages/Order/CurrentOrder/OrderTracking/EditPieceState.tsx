import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Dialog, DialogTitle, MenuItem, Select } from '@mui/material';
import { Input } from '../../../../libs/input/input';
import { Controller, useForm } from 'react-hook-form';

import { Button, PrimaryButton, SecondaryButton } from '../../../../libs/button/button';

import Datepicker from '../../../../libs/datepicker/datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import moment from "jalali-moment";
import instance from '../../../../helper/interceptor';
import { ApiHelper } from '../../../../helper/api-request';



interface EditPieceProps extends React.PropsWithChildren {
  showDeleteModal: boolean;
  showStateModal: boolean;
  label: any;
  orderEquipPartId:number;
  equipSteps:any;
  fromStepId:number;
  pieceName:string;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowStateModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditPieceState: React.FunctionComponent<
EditPieceProps
> = ({ showDeleteModal, setShowDeleteModal,label,pieceName,fromStepId,orderEquipPartId,equipSteps,setShowStateModal}) => {

  const { register, control,getValues } = useForm({
    defaultValues: {
      toStepId: fromStepId + 1,
      qty:0,
      actionDate:new Date()
    },
  });
  const onSubmit = () => {
  
    const sendData = {
      toStepId: getValues().toStepId,
  actionDate: moment(getValues().actionDate).format("YYYY-MM-DD"),
  qty: Number(getValues().qty),
  
      fromStepId: fromStepId,
      orderEquipPartId:orderEquipPartId

    }
    console.log(sendData);
    instance.post(ApiHelper.get("changeRequestState"),sendData).then((res:any) => {
      if(res) {
        setShowDeleteModal(false);
        setShowStateModal(false);
      }
    })
    
   
  };
  return (
    <Dialog
      className="w-full  !overflow-hidden"
      onClose={() => setShowDeleteModal(false)}
      open={showDeleteModal}
     
      maxWidth="lg"
      
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{
        '& .MuiPaper-elevation': {
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !pb-6">
        
        <span className="text-sm font-bold text-primary">
                ویرایش  {pieceName}
        </span>
      </DialogTitle>
      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
      <div className="grid gap-4 grid-cols-4 px-8 py-10 ">
        <div>
        {/* <span>تعداد</span> */}
        <Input
              
              type="number"
              register={register}
              control={control}
              title="qty"
              label='تعداد'
            
            />
        </div>
       
       
            <div className='mt-7 text-center'>
           
              <span className='text-xs'>از وضعیت</span>
            <span className='text-blue-600 text-xs'> {label}</span>
         
            
              </div>
              <div className='flex flex-col'>
              <label
        className=' text-xs mb-3  text-black-opacity-40 text-black-opacity-60'
        
      >
      به وضعیت
      </label>
      <Controller
        {...register("toStepId")}
        control={control}
        render={({ field: { ref, ...field } }) => (
          <Select
            {...field}
            sx={{
              boxShadow:
                '0px 0px 0px 1px rgba(134, 143, 160, 0.16), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)',
              '.MuiOutlinedInput-notchedOutline': { border: 0 },
              borderRadius: 2,
              fontSize: 12,
              height: '2rem',
              background: 'white',
            }}
            displayEmpty
            IconComponent={({ className }: any) => {
              return (
                <>
                  {className.split(' ')[2] === 'MuiSelect-iconOpen' ? (
                    <FontAwesomeIcon
                      className="pointer-events-none px-2"
                      icon={faAngleUp}
                    />
                  ) : (
                    <FontAwesomeIcon
                      className="pointer-events-none px-2"
                      icon={faAngleDown}
                    />
                  )}
                </>
              );
            }}
           
          
          >
            {equipSteps && equipSteps.map((item: any) => (
              <MenuItem value={item.workflowStepId}>{item.workflowSteptitle}</MenuItem>
            ))}
          
          </Select>
        )}
      />
              </div>
              <div className="flex flex-col gap-6">
                <Datepicker
                  label={'در تاریخ'}
                  register={register}
                  control={control}
                  title="actionDate"
                />
              </div>
            
           
         
                 
               
            
        
          
         
              <div className='col-span-10 flex justify-end mt-8'>
              <Button
              title='لغو'
              active={true}
              style={SecondaryButton}
              onClick={() =>setShowDeleteModal(false)}
            />
              <Button
              title='تغییر وضعیت'
              active={true}
              style={PrimaryButton}
              onClick={onSubmit}
            />
            
              </div>
            
           
         
    
        </div>
     
      {/* </form> */}
    
   
    </Dialog>
  );
};

export default EditPieceState;
