import React from 'react';

import { Dialog, DialogTitle } from '@mui/material';



import { Button, PrimaryButton, SecondaryButton } from '../../libs/button/button';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';






interface EditPieceProps extends React.PropsWithChildren {
  showDeleteModal: boolean;
  userId:number;
  username:string;



  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteUser: React.FunctionComponent<
EditPieceProps
> = ({ showDeleteModal, setShowDeleteModal,username,userId }) => {



  const onSubmit = () => {
    instance.delete(ApiHelper.get("User")  + userId).then((res:any) => {
        if(res) {
          setShowDeleteModal(false)
    
        }
       })

    
   
  };
 
  return (
    <Dialog
      className="w-full  !overflow-hidden"
      onClose={() => setShowDeleteModal(false)}
      open={showDeleteModal}
     
      maxWidth="xl"
      
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{
        '& .MuiPaper-elevation': {
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !pb-6">
        <span> حذف  کاربر </span>
        
      </DialogTitle>
      <div className="grid grid-cols-3 gap-3 pb-8 px-10 py-5">
        <div className='col-span-3'>
            <span>آیا از حذف کاربر</span>
            <span className='text-blue-500'> {username} </span>
            <span> </span>
            <span>مطمئن هستید؟</span>
        </div>
        <div className='col-span-3 flex justify-end mt-8'>
              <Button
              title='خیر'
              active={true}
              style={SecondaryButton}
              onClick={() =>setShowDeleteModal(false)}
            />
              <Button
              title='بله'
              active={true}
              style={PrimaryButton}
              onClick={onSubmit}
            />
            
              </div>
            </div>
    
   
    </Dialog>
  );
};

export default DeleteUser;
