import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';


import { Button, PrimaryButton, SecondaryButton } from '../../../../libs/button/button';


import Datepicker from '../../../../libs/datepicker/datepicker';
import instance from '../../../../helper/interceptor';
import { ApiHelper } from '../../../../helper/api-request';



interface EditPieceProps extends React.PropsWithChildren {
    showPlanTimes: boolean;
    setShowPlanTimes: any;
    detailData:any;
    updateTime:boolean;
    setUpdateTime:any;
    workflowVersionId:number;
 

}

const PlanTimes: React.FunctionComponent<
EditPieceProps
> = ({ showPlanTimes, setShowPlanTimes,detailData,workflowVersionId,updateTime,setUpdateTime}) => {
  debugger
  


  
  const { register, control,getValues } = useForm();
  const [dates,setDates] = useState<any>([]);
  const onSubmit = () => {

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
    const data = {
        "orderEquipPartId": detailData.id,
        stepTimes: stepTimes
    }
    instance.post(ApiHelper.get("setEquipPartStepTimes"),data).then((res:any) => {
        if(res.data.success) {
          setShowPlanTimes(false);
          setUpdateTime(!updateTime);
        }

    })
   
   
    
   
  };
  useEffect(() => {
    instance.get(ApiHelper.get("getFlowStepsByWorkflowVersionId"),{params: {workflowVersionId:workflowVersionId}}).then((res:any) => {
      setDates(res?.data?.data);
    
    })
   

  },[])
  return (
    <Dialog
      className="w-full  !overflow-hidden"
      onClose={() => setShowPlanTimes(false)}
      open={showPlanTimes}
   
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
        {/* <span className="text-sm font-bold text-primary">
                {data.eqParts.filter((item:any) => item.orderEquipPartId === equipId)[0].equipPartTitle}
        </span> */}
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
              onClick={() =>setShowPlanTimes(false)}
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

export default PlanTimes;
