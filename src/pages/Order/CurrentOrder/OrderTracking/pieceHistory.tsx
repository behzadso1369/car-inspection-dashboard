import React, { useEffect, useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Dialog, DialogTitle } from '@mui/material';

import { useForm } from 'react-hook-form';


import { Button, PrimaryButton } from '../../../../libs/button/button';
import instance from '../../../../helper/interceptor';
import { ApiHelper } from '../../../../helper/api-request';



interface EditPieceProps extends React.PropsWithChildren {
  showHistoryModal: boolean;
  label: any;
  pieceName:string;
  equipPartId:number;
  setShowHistoryModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const PieceHistory: React.FunctionComponent<
EditPieceProps
> = ({ showHistoryModal, setShowHistoryModal,pieceName,equipPartId }) => {
  const [message,setMessage] = useState<any>([])

  const {handleSubmit,getValues } = useForm({
    defaultValues: {
      pieceNumber: '0',
    },
  });
  useEffect(() => {
    instance.get(ApiHelper.get("getOrderEquipPartStages"),{params: {OrderEquipPartId:equipPartId}}).then((res:any) => {
      if(res?.data?.success) {
        setMessage(res?.data?.data);
      }
    })
  },[])
  const onSubmit = () => {
    setShowHistoryModal(false)
    console.log(getValues());
    
   
  };
  return (
    <Dialog
      className="w-full  !overflow-hidden"
      onClose={() => setShowHistoryModal(false)}
      open={showHistoryModal}
     
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
                تاریخچه سفارش  {pieceName}
        </span>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-1 grid-cols-1  px-7 py-2">
        {message.map((item:any) => 
        <div className='mt-4 border-b-2 pb-3 mb-3 border-slate-100'>{item.message}</div>
        
        )}
  
      
            
           
         
                 
               
            
        
          
         
              <div className='col-span-1 flex justify-end'>
              <Button
              title='متوجه شدم'
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

export default PieceHistory;
