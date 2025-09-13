import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';


import { Button, PrimaryButton, SecondaryButton } from '../../../libs/button/button';


import Datepicker from '../../../libs/datepicker/datepicker';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';



interface EditPieceProps extends React.PropsWithChildren {
  showDeleteModal: boolean;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  data:any;
  setData:any;
  equipId:number;

}

const EditPiece: React.FunctionComponent<
EditPieceProps
> = ({ showDeleteModal, setShowDeleteModal,data,equipId,setData}) => {


  
  const { register, control,getValues,reset } = useForm();
  const [dates,setDates] = useState<any>([]);
  const onSubmit = () => {
    console.log(equipId);

    const stepTimes =
     Object.keys( getValues()).map((key:any) => {
         const filterData = dates.filter((item:any) => {
        
          return item.stepTitle === key;
      })
      return {
        workflowStepId: filterData[0].id,
        doneEstimateDate: getValues()[filterData[0].stepTitle]
      }
    })
    console.log(equipId)
    const rowIndex = data.eqParts.indexOf( data.eqParts.filter((item:any) => item.orderEquipPartId === equipId)[0]);
    data.eqParts[rowIndex].stepTimes = stepTimes; 

    console.log(data)
    setData(data);
    setShowDeleteModal(false);
    // instance.get(ApiHelper.get("getFlowStepsByOrderTypeId"),{params: {orderTypeId:2}}).then((res:any) => {
    //   data[equipId] = 
    // })
   
    
   
  };
  useEffect(() => {
    instance.get(ApiHelper.get("getFlowStepsByWorkflowVersionId"),{params: {workflowVersionId:data.workflowVersionId}}).then((res:any) => {
      setDates(res?.data?.data);
      const formValue:any = {
        
      };
     const filteredData = data.eqParts.filter((item:any) => item.orderEquipPartId === equipId)[0];
   
      res?.data?.data.map((item:any) => {

        if(item.needEstimate) {
          // setValue(item.stepTitle,moment(filteredData.stepTimes.filter((dt:any) => item.id === dt.workflowStepId)[0].doneEstimateDate).locale("fa").format("YYYY-MM-DD"))
          formValue[item.stepTitle] = filteredData.stepTimes.filter((dt:any) => item.id === dt.workflowStepId)[0].doneEstimateDate
        }
        return

     
      })
     

      reset(formValue)
      console.log(getValues())
    })
   

  },[])
  return (
    <Dialog
      className="w-full  !overflow-hidden"
      onClose={() => setShowDeleteModal(false)}
      open={showDeleteModal}
      key={equipId}
      maxWidth="md"
     
      
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff',width:"90rem" } }}
      sx={{
        '& .MuiPaper-elevation': {
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !pb-6">
        
        <span className="text-sm font-bold text-primary">
                  زمانبندی قطعه
        </span>
        {/* <span> </span> */}
        <span className="text-sm font-bold text-primary">
                {data.eqParts.filter((item:any) => item.orderEquipPartId === equipId)[0].equipPartTitle}
        </span>
      </DialogTitle>
      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
     
      <div className="grid gap-3 grid-cols-3 px-2 py-5">
                {dates.map((item:any) => (
                  item.needEstimate ? 
               
                    <Datepicker
                    label={item.stepTitle}
                    register={register}
                    control={control}
                    
                    title={item.stepTitle}
                  />: null
                  
                 
                    
                )) }
                
       
               
            
        
          
         
              <div className='mt-5 col-span-3 flex justify-end  '>
              <Button
              title='لغو'
              active={true}
              style={SecondaryButton}
              onClick={() =>setShowDeleteModal(false)}
            />
              <Button
              title='ثبت زمانبندی'
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

export default EditPiece;
