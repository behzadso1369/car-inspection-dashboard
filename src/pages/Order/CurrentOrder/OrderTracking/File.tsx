import React, { useEffect, useState } from 'react';

import { Dialog, DialogTitle } from '@mui/material';
import imageUrl from '../../../../assets/images/pdf-logo.png';



import { Button, SecondaryButton } from '../../../../libs/button/button';
import instance from '../../../../helper/interceptor';
import { ApiHelper } from '../../../../helper/api-request';






interface EditPieceProps extends React.PropsWithChildren {
  showFileModal: boolean;

  detailData:any;



  setShowFileModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const File: React.FunctionComponent<
EditPieceProps
> = ({ showFileModal, setShowFileModal,detailData }) => {
    debugger
    const [image,setImage] = useState<any>(null);
    const [pdf,setPDF] = useState<any>(null);
    useEffect(() => {
        detailData.orderEquipPartFileQueryResponse.map((item:any) => {
            if(item.fileTypeId === 1) {
                instance.get(ApiHelper.get("getFileBase64") + "/" + item.fileId).then((res:any) => {
                    const byteCharacters = atob(res.data.base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            
            let image = new Blob([byteArray], { type: 'image/jpeg' });
            let imageUrl = URL.createObjectURL(image);
            setImage({image: imageUrl});
                
            
        
                
                
                })
            }else {
          setPDF(item.fileId);
            }
        })
      
    },[])
    const downloadPdfFile = async () => {
        await instance.get(ApiHelper.get("getFiles") + "/" +  pdf).then((response:any) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
    
    
        link.setAttribute('download', 'file.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
    
        });
     
       
      };



 
 
  return (
    <Dialog
      className="w-full  !overflow-hidden"
      onClose={() => setShowFileModal(false)}
      open={showFileModal}
     
      maxWidth="xl"
      
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{
        '& .MuiPaper-elevation': {
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !pb-6">
        <span>فایل ها</span>
        
      </DialogTitle>
      {detailData.orderEquipPartFileQueryResponse.length === 0 ? <div className="grid grid-cols-3 gap-3 pb-8 px-10 py-5">فایلی وجود ندارد</div> :    <div className="grid grid-cols-3 gap-3 pb-8 px-10 py-5">
       
       <div >
       {image && <div className='w-auto relative p-2 border-2 border-slate-400 flex flex-col items-center'><img width="50px" height="50px" src={image.image}/></div>}
     

       </div>
      <div>
      {pdf && 
           <div className='w-auto relative p-2 border-2 border-slate-400 flex flex-wrap justify-center'><div className='w-full flex justify-center'><img width="50px" height="150px" src={imageUrl}/></div>
           <div className="w-full flex justify-center">
                         
           <button className='mt-2 bg-black text-white px-2 rounded-md text-sm' onClick={() => downloadPdfFile()}>دانلود pdf</button>
           </div>
           </div>}
      </div>
       <div className='col-span-3 flex justify-end mt-8'>
             <Button
             title='بستن'
             active={true}
             style={SecondaryButton}
             onClick={() =>setShowFileModal(false)}
           />
          
           
             </div>
           </div>}
   
    
   
    </Dialog>
  );
};

export default File;
