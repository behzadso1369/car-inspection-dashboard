import React from 'react';
import { Dialog, DialogTitle } from '@mui/material';

import { useForm } from 'react-hook-form';


import { Button, PrimaryButton } from '../../../libs/button/button';
import TextArea from '../../../libs/text-area/text-area';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';






interface EditPieceProps extends React.PropsWithChildren {
  showRejectModal: boolean;
  setShowRejectModal: React.Dispatch<React.SetStateAction<boolean>>;
 params:any;
}

const RejectRequest: React.FunctionComponent<
EditPieceProps
> = ({ showRejectModal, setShowRejectModal,params}) => {

  
  const { register, control, handleSubmit,getValues } = useForm();
  const onSubmit = () => {
    const rejectData = {
        ...getValues(),
        requestId: params.data.requestId
    }
    instance.post(ApiHelper.get("rejectRequest"),rejectData).then((res:any) => {
        console.log(res);
        setShowRejectModal(false);
    })

   
    
   
  };
 
  return (
    <Dialog
      className="w-full  !overflow-hidden px-56"
      onClose={() => setShowRejectModal(false)}
      open={showRejectModal}
     
      fullWidth
      
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{
        '& .MuiPaper-elevation': {
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !pb-6">
        
        <span className="text-sm font-bold text-primary">
             رد کردن سفارش شماره
        </span>
        <span> {params.data.requestId}</span>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
     
      <div className="grid gap-1 grid-cols-1 px-2 py-5">
      <div className='mt-5 col-span-1  flex justify-end px-4'>
      <TextArea
        control={control}
        title='rejectDescription'
        register={register}
        label='دلیل رد سفارش'
        
        />
      </div>
       
               
                
       
               
            
        
          
         
              <div className='mt-5  flex justify-end'>
              <Button
              title='رد سفارش'
              active={true}
              style={PrimaryButton}
              onClick={onSubmit}
            />
              </div>
            
           
         
    
        </div>
     
      </form>
    
   
    </Dialog>
  );
};

export default RejectRequest;
