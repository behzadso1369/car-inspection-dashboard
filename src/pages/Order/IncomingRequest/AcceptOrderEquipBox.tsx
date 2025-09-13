import React, { useEffect, useState } from 'react';
import { Box, Step, StepLabel, Stepper } from '@mui/material';
import { BlueButton, Button,DangerButton,DisabledPrimaryButton, SuccessButton } from '../../../libs/button/button';
import EditPiece from './EditPiece';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import moment from 'jalali-moment';
import Input from '../../../libs/input/input';
import { useForm } from 'react-hook-form';
import Dropdown from '../../../libs/dropdown/dropdown';
import EditEquipPartInformation from '../CurrentOrder/OrderTracking/EditEquipPartInformation';
import File from '../CurrentOrder/OrderTracking/File';



interface StatusBarProps extends React.PropsWithChildren {

  equipId:number;
  setData: any;
  equipName:string;
  qty:number;
  data:any;
  detailData:any;
  showEditEquipPartModal:boolean;
  setShowEditEquipPartModal:any;

}

const AcceptOrderEquipBox: React.FunctionComponent<StatusBarProps> = ({
  setData,
  equipName,
  qty,
  detailData,
  showEditEquipPartModal,
  setShowEditEquipPartModal,
  data,
  equipId
}) => {

  const { register, control,getValues,watch } = useForm({
    defaultValues: {
      price:  data.eqParts.filter((item:any) => item.orderEquipPartId === equipId)[0].price,
      priceUnitId: 1
    }
  });

  const [steps,setSteps] = useState<any>([]);
  const [showModal,setShowModal] = useState<any>(false);
  const [priceUnits,setPriceUnits] = useState<any>([]);
  const [totalPrice,setTotalPrice] = useState<string>("");
  const [showFiles,setShowFiles] = useState<boolean>(false);
  const finalData = detailData?.orderEquipParts?.filter((item:any) => item.id === equipId)[0];
  const watchPrice = watch("price");
  const watchPriceUnitId = watch("priceUnitId");
  useEffect(()=> {
    const rowIndex = data.eqParts.indexOf( data.eqParts.filter((item:any) => item.orderEquipPartId === equipId)[0]);
    data.eqParts[rowIndex].priceUnitId = getValues().priceUnitId;
    data.eqParts[rowIndex].price = Number(getValues().price);
    setData(data);

    instance.get(ApiHelper.get("getPriceUnits")).then((res:any) => {
      if(res.data.success) {
        
        setPriceUnits(res.data.data);
        setTotalPrice(qty * Number(getValues().price) + " " +  res.data.data.filter((item:any) => item.id === getValues().priceUnitId)[0].title)
      }
    })
    
    instance.get(ApiHelper.get("getFlowStepsByWorkflowVersionId"),{params: {workflowVersionId:data.workflowVersionId}}).then((res:any) => {
      const dt = data.eqParts.filter((item:any) => item.orderEquipPartId === equipId);
      const needData = res.data.data.filter((item:any) => item.needEstimate === true);
   
      const steps = needData.map((item:any) => {
        const filteredData =  dt[0].stepTimes.filter((fil:any) => fil.workflowStepId === item.id);
        
            return {
              stepTitle:  item.stepTitle,
              estimateDate: filteredData[0].doneEstimateDate ? moment(filteredData[0].doneEstimateDate).locale("fa").format("YYYY-MM-DD"):undefined
            }
        
      })
   
      setSteps(steps);

    })
  },[showModal,data,watchPrice,watchPriceUnitId])
  // const setPrice = (event:any) => {
  //   const rowIndex = data.eqParts.indexOf( data.eqParts.filter((item:any) => item.orderEquipPartId === equipId)[0]);
  //   data.eqParts[rowIndex].price = Number(event.target.value);
  //   setData(data);

  // }
  // const setPriceUnit = (event:any) => {
  //   const rowIndex = data.eqParts.indexOf( data.eqParts.filter((item:any) => item.orderEquipPartId === equipId)[0]);
  //   data.eqParts[rowIndex].priceUnitId = getValues().priceUnitId;
  //   setData(data);

  // }


 


  return (
       <div className="w-full text-sm border border-[#BDBDBD] rounded-lg mb-4 flex flex-wrap justify-center items-center p-4 gap-10">
        {/* <h3 className='w-full text-center'>{equipName}</h3> */}
        <h3 className='w-full text-center'>{finalData?.equipTitle +  " - " + equipName}</h3>
        <div className='flex justify-between w-full'>
        <div>
        <span className='w-full text-center'>تعداد کل : </span>
        <span className='w-full text-center text-blue-700'>{qty}</span>
        </div>
       
          <div>
          <span className='w-full text-center'> نام تجهیز : </span>
        <span className='w-full text-center text-blue-700'>{finalData?.equipPartTitle}</span>
          </div>
          <div>
          <span className='w-full text-center'> کد قطعه : </span>
        <span className='w-full text-center text-blue-700'>{finalData?.eqPartCode}</span>
          </div>
          <div>
          <span className='w-full text-center'>پلاک تجهیز : </span>
        <span className='w-full text-center text-blue-700'>{finalData?.equipmentPlaque}</span>
          </div>
          <div>
          <span className='w-full text-center'>شماره سریال : </span>
        <span className='w-full text-center text-blue-700'>{finalData?.serialNumber}</span>
          </div>
          <div>
          <span className='w-full text-center'>  قیمت کل : </span>
        <span className='w-full text-center text-blue-700'>{totalPrice}</span>
          </div>
         
    
        </div>
      
     
      <Box className="w-full" dir='ltr'>
        <div className='w-full flex  mb-10' dir='rtl'>
        
        <Input
             
              type="number"
              register={register}
              control={control}
              title="price"
              label='قیمت (برای وارد کردن قیمت کیبورد باید انگلیسی باشد) '
              width="w-80"
          
            
              
      
            />
            <div className="mr-2">
            <Dropdown
                 register={register}
                 control={control}
                 title="priceUnitId"
                 label='واحد قیمت'
                 option={priceUnits}
                 fullWidth={true}
               />
            </div>
             
        </div>
     
      <Stepper  alternativeLabel className='paperRoot'>
          {steps.length > 0 ? steps.map((item:any) => {
            const stepProps: { completed?: boolean } = {
              completed: item.estimateDate,
              
            };
            const labelProps: { optional?: React.ReactNode } = {};
          
            
            return (
              <Step  {...stepProps}>
                <StepLabel  {...labelProps}>
                  <div className='text-xs mb-2'>{item.stepTitle}</div>
              
                {/* <span>{item.needEstimate}</span> */}
                
                  <div className='mt-2'>
                  <span>تاریخ تکمیل  :</span>
                  <span> </span>
                  
                  <div className='text-blue-700 mt-2'>{item.estimateDate}</div>
                </div>
                
               
               
                    
                   
          
                    </StepLabel>
              </Step>
            );
           
          }): <>هنوز هیج برنامه زمانبندی برای این قطعه ثبت نشده است</>}
         
        </Stepper>
        <div className='mt-3 flex'>
          
            <Button
              title={'زمانبندی'}
              active={true}
              style={SuccessButton}
              disableStyle={DisabledPrimaryButton}
              onClick={() => setShowModal(true)}
            />
             <Button
            title={' سایر اطلاعات قطعه'}
            active={true}
            style={BlueButton}
            disableStyle={DisabledPrimaryButton}
            onClick={() => setShowEditEquipPartModal(true)}
          />
             <Button
            title={'مشاهده فایل ها'}
            active={true}
            style={DangerButton}
            disableStyle={DisabledPrimaryButton}
            onClick={() => setShowFiles(true)}
          />
          </div>
      </Box>
      
       
    
        {showModal && (
             <EditPiece key={equipId} setData={setData} data={data} showDeleteModal={showModal} setShowDeleteModal={setShowModal} equipId={equipId} />
            )}
                              {showEditEquipPartModal && <EditEquipPartInformation showAction={true} setShowEditEquipPartInformation={setShowEditEquipPartModal} showEditEquipPartInfomation={showEditEquipPartModal} detailData={finalData}/>}
                              {showFiles && <File showFileModal={showFiles} setShowFileModal={setShowFiles} detailData={finalData}/>}
            
      
      
    </div>
  
  
 
    

   
  );
};

export default AcceptOrderEquipBox;
