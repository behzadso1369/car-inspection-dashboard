import React, {  useEffect, useState } from 'react';
import {  useParams } from 'react-router-dom';
import AllData from './AllData';
import PieceStatusBar from './pieceStatusBar';
import instance from '../../../../helper/interceptor';
import { ApiHelper } from '../../../../helper/api-request';
const OrderTracking: React.FunctionComponent = () => {
  const [orderTrackingData,setOrderTrackingData] = useState<any>([]);
  const [showModal,setShowModal] = useState<boolean>(false);
  const [detailData,setDetailData] = useState<any>({});
  const [showEditRequestModal,setShowEditRequestModal] = useState<boolean>(false);
  const [showEditEquipPartModal,setShowEditEquipPartModal] = useState<boolean>(false);
  const [updateTime,setUpdateTime] = useState<boolean>(false);
  
const { id } = useParams();
  useEffect(() => {
    instance.get(ApiHelper.get("getRequestDetail"),{params:{requestId:id}}).then((res:any) => {
      if(res) {
      
        setOrderTrackingData(res?.data);
        setDetailData(res?.data?.data);
     

      }



    })
  },[showModal,showEditRequestModal,showEditEquipPartModal,updateTime])
  return (
  
    <div>
          <div className="bg-white border border-[#2c3c511a] rounded-xl flex justify-between p-4 mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-primary"> پیگیری سفارش شماره :  </h3>
          <span className='text-blue-500'>{id}</span>
        </div>
      </div>
      <AllData showEditRequestModal={showEditRequestModal}setShowEditRequestModal={setShowEditRequestModal}  orderDetailData={detailData} showActionButton={false} />
    
      {/* <StatusBar  state={0} activeStep={activeStep} handleNext={handleNext}   /> */}
      {/* <div className="flex flex-wrap "> */}
      {orderTrackingData && orderTrackingData?.data?.orderEquipParts.map((item:any) => 
   
                  <PieceStatusBar updateTime={updateTime} setUpdateTime={setUpdateTime}  showEditEquipPartModal={showEditEquipPartModal} setShowEditEquipPartModal={setShowEditEquipPartModal}  showStateModal={showModal} setShowStateModal={setShowModal}   pieceName={item?.equipPartTitle}  pieceTotal={item?.qty} equipSteps={item.orderEquipPartSteps} equipPartId={item.id} equipDetailData={item} workflowVersionId={detailData.workflowVersionId}    / >
       
   
      )}

      {/* </div> */}
     
      
     
    

     
    </div>
  )
};

export default OrderTracking;
