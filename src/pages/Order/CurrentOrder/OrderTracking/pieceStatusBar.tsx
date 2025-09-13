import React, { useState } from 'react';
import { Box, Step, StepLabel, Stepper } from '@mui/material';

import { BlueButton, Button, DangerButton, DisabledPrimaryButton, PrimaryButton, SuccessButton } from '../../../../libs/button/button';

import { ShowForPermission } from '../../../../utils/permission-wrapper/permission-wrapper';
import EditPieceState from './EditPieceState';
import PieceHistory from './pieceHistory';
import EditEquipPartInformation from './EditEquipPartInformation';
import PlanTimes from './PlanTimes';
import File from './File';

interface StatusBarProps extends React.PropsWithChildren {

  pieceName: string;
  pieceTotal: number;
  equipPartId: number;
  showStateModal:boolean;
  showEditEquipPartModal:boolean;
  setShowStateModal:any;
  setShowEditEquipPartModal:any;
  equipSteps:any;
  updateTime:boolean;
  setUpdateTime:any;

  equipDetailData:any;
  workflowVersionId:number;
}

const PieceStatusBar: React.FunctionComponent<StatusBarProps> = ({
  pieceName,
  showStateModal,
  setShowStateModal,
  showEditEquipPartModal,
  setShowEditEquipPartModal,
  equipPartId,
  updateTime,
  setUpdateTime,
  pieceTotal,
  equipSteps,
  equipDetailData,
  workflowVersionId
}) => {
  const [showPlanTimes,setShowPlanTimes] = useState<boolean>(false);

  const [showModal,setShowModal] = useState<any>(showStateModal);

  const [showHistoryModal,setShowHistoryModal] = useState<boolean>(false);
  const [showFiles,setShowFiles] = useState<boolean>(false);
  const [label,setLabel] = useState<string>("");
  const [orderEquipPartId,setOrderEquipPartId] = useState<number>(0);

  const [fromStepId,setFromStepId] = useState<number>(0);
  const openDialog = (label:string,orderEquipPartId:number,fromStepId:number) => {
    
    setLabel(label);
    setFromStepId(fromStepId);
    setOrderEquipPartId(orderEquipPartId);
    setShowStateModal(true);
    setShowModal(true);
 

  }
 
 


  const getSteps= () => {
    return equipSteps;
//     if(orderTypeId === 1) {
//       return [
//         {
//           state: 'دریافت درخواست',
//           number: 2
//       },
//       {
//         state:  'ارسال پیش فاکتور',
//         number: 3
//     },
//     {
//       state: 'دریافت پیش پرداخت',
//       number: 4
//   },
//   {
//     state:   'خرید مواد اولیه ',
//     number: 5
// },
// {
//   state:   '  ساخت ',
//   number: 5
// },
// {
//   state:  ' کنترل کیفیت',
//   number: 0
// },
// {state: ' ارسال سفارش',
// number: 0},

// {state: 'پایان سفارش',
// number:0} ,


       
       
       
      
       
       
        

       
       
       
        
       
         
     
   
       
      
      
      
        
       
//       ];
//     }else {
//       return [
//         'پایان سفارش' ,
//         ' ارسال گزارش',
//         'اعزام کارشناس',
//         'تایید پیش پرداخت',
//         'ارسال پیش فاکتور',
//         'دریافت درخواست',
      
      
     
      
        
        
//       ];
//     }
  
  };
  const steps:any = getSteps();


  return (
       <div className="w-full border border-[#BDBDBD] rounded-lg mb-4 flex flex-wrap justify-center items-center p-4 gap-10">
        <h3 className='w-full text-center'>{equipDetailData.equipTitle +  " - " + pieceName}</h3>
        <div className='flex justify-between w-full text-sm'>
          <div>
          <span className='w-full text-center'>تعداد کل : </span>
        <span className='w-full text-center text-blue-700'>{pieceTotal}</span>
          </div>
          {/* <div>
          <span className='w-full text-center'> نام تجهیز : </span>
        <span className='w-full text-center text-blue-700'>{equipDetailData.equipPartTitle}</span>
          </div> */}
          <div>
          <span className='w-full text-center'> کد قطعه : </span>
        <span className='w-full text-center text-blue-700'>{equipDetailData.eqPartCode}</span>
          </div>
          <div>
          <span className='w-full text-center'>پلاک تجهیز : </span>
        <span className='w-full text-center text-blue-700'>{equipDetailData.equipmentPlaque}</span>
          </div>
          <div>
          <span className='w-full text-center'>شماره سریال : </span>
        <span className='w-full text-center text-blue-700'>{equipDetailData.serialNumber}</span>
          </div>
          <div>
          <span className='w-full text-center'> قیمت : </span>
        <span className='w-full text-center text-blue-700'>{equipDetailData.price + " " + equipDetailData.priceUnitTitle}</span>
          </div>
         
    
        </div>
     
      <Box className="w-full" dir='ltr'>
        <Stepper  alternativeLabel className='paperRoot'>
          {steps.map((item:any) => {
            const stepProps: { completed?: boolean } = {
              completed:   item.needEstimate ? ((item.allAddedQty >= pieceTotal) && item.qty === 0) : item.allAddedQty >= pieceTotal
              
            };
            const labelProps: { optional?: React.ReactNode } = {};
            
            return (
              <Step  {...stepProps}>
                <StepLabel  {...labelProps}>
                  <div className='text-xs mb-2'>{item.workflowSteptitle}</div>
              
                <span>تعداد:</span>
                <span> </span>
                <span className='text-blue-700'>{item.qty}</span>
                 <>
                  <div className='mt-2'>
                  <span>تاریخ تکمیل  برنامه:</span>
                  <span> </span>
                  
                  <div className='text-blue-700 mt-2'>{item.estimateDate ? item.estimateDate : "تکمیل نشده"}</div>
                </div>
                <ShowForPermission role={["admin", "superAdmin"]}>
                <div className='mt-2'>
                  <span>تاریخ تکمیل  واقعی:</span>
                  <span> </span>
                  <div className='text-blue-700 mt-2'>{item.doneDate ? item.doneDate: "تکمیل نشده"}</div>
                </div>
                <div className='mt-2'>
                  <span>تاخیر این مرحله:</span>
                  <span> </span>
                  <div className='text-blue-700 mt-2'>{item.delayTime}</div>
                </div>
              
               
                {item.qty > 0   ?       <button className='bg-blue-600 mt-2 mr-4 text-white h-8 px-3 rounded-lg flex items-center' onClick={() => openDialog(item.workflowSteptitle,item.orderEquipPartId,item.workflowStepId)}>تغییر وضعیت</button>: <></>}
           

                </ShowForPermission>
                </>
               
               
                    
                   
          
                    </StepLabel>
              </Step>
            );
           
          })}
         
        </Stepper>
        <ShowForPermission role={["admin", "superAdmin"]}>
        <div className='mt-8 flex'>
          
          <Button
            title={'  تاریخچه وضعیت '}
            active={true}
            style={PrimaryButton}
            disableStyle={DisabledPrimaryButton}
            onClick={() => setShowHistoryModal(true)}
          />
          <Button
          title={' سایر اطلاعات قطعه'}
            active={true}
            style={BlueButton}
            disableStyle={DisabledPrimaryButton}
            onClick={() => setShowEditEquipPartModal(true)}
          />
           <Button
            title={'زمانبندی'}
            active={true}
            style={SuccessButton}
            disableStyle={DisabledPrimaryButton}
            onClick={() => setShowPlanTimes(true)}
          />
            <Button
            title={'مشاهده فایل ها'}
            active={true}
            style={DangerButton}
            disableStyle={DisabledPrimaryButton}
            onClick={() => setShowFiles(true)}
          />
        </div>
        </ShowForPermission>
       
      </Box>
      
       
    
        {showModal && (
              <EditPieceState
              equipSteps={equipSteps}
              showStateModal={showStateModal}
              setShowStateModal={setShowStateModal}
              orderEquipPartId={orderEquipPartId}
              fromStepId={fromStepId}
              pieceName={pieceName}
              label={label}
                showDeleteModal={showModal}
                setShowDeleteModal={setShowModal}
              />
            )}
             {showHistoryModal && (
              <PieceHistory
              pieceName={pieceName}
              label={label}
              equipPartId={equipPartId}
               showHistoryModal={showHistoryModal}
               setShowHistoryModal={setShowHistoryModal}
              />
            )}
                  {showEditEquipPartModal && <EditEquipPartInformation showAction={false} setShowEditEquipPartInformation={setShowEditEquipPartModal} showEditEquipPartInfomation={showEditEquipPartModal} detailData={equipDetailData}/>}
                  {showPlanTimes && <PlanTimes updateTime={updateTime} setUpdateTime={setUpdateTime} setShowPlanTimes={setShowPlanTimes} showPlanTimes={showPlanTimes} detailData={equipDetailData} workflowVersionId={workflowVersionId}/>}
                  {showFiles && <File showFileModal={showFiles} setShowFileModal={setShowFiles} detailData={equipDetailData}/>}
      
      
    </div>
  
  
 
    

   
  );
};

export default PieceStatusBar;
