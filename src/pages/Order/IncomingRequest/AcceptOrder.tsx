import React, {  useEffect, useState } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import AcceptOrderEquipBox from './AcceptOrderEquipBox';
import Button, { DisabledPrimaryButton, PrimaryButton } from '../../../libs/button/button';
import Datepicker from '../../../libs/datepicker/datepicker';
import { useForm } from 'react-hook-form';
import AllData from '../CurrentOrder/OrderTracking/AllData';
const AcceptOrder: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { register, control,getValues } = useForm();
    const { id } = useParams();
    const [showEditRequestModal,setShowEditRequestModal] = useState<boolean>(false);
    const [showEditEquipPartModal,setShowEditEquipPartModal] = useState<boolean>(false);
  const [requestDataForAccepting,setRequestDataForAccepting] = useState<any>({
    "requestId": Number(id),
    "announceDate": "2024-03-28",
    "eqParts": [
      {
        "orderEquipPartId": 0,
        "price": 0,
        priceUnitId: 0,
        equipPartTitle: "",
      
        qty:0,
        "stepTimes": [
         
        ]
      }
    ]
  });
  const [detailData,setDetailData] = useState<any>({})
  const submit = () => {
    console.log(requestDataForAccepting);
    const finalData = requestDataForAccepting;
    delete finalData["workflowVersionId"]
    finalData["announceDate"] = getValues().announceDate
    finalData.eqParts.forEach((item:any) => {
      delete item["equipPartTitle"];
      delete item["qty"];
     
    } )
    console.log(requestDataForAccepting)
  
    instance.post(ApiHelper.get("acceptRequest"),finalData).then((res:any) => {
      if(res?.data?.success) {
        navigate("/order/current-order");
      }

    })

  }
 
  useEffect(() => {
    instance.get(ApiHelper.get("getRequestDetail"),{params:{requestId:id}}).then((res:any) => {
      if(res) {
        setDetailData(res?.data?.data);
        
    
        
        const data = res?.data?.data?.orderEquipParts.map((item:any) => {
   
            return {
                orderEquipPartId: item.id,
                price: item.price,
                priceUnitId: item.priceUnitId,
                equipPartTitle: item.equipPartTitle,
                // announceDate: getValues().announceDate,
                
                qty:item.qty,
                "stepTimes": [
                   
                  ]

            }

        })
   
        const finalData = {
          "requestId": Number(id),
          workflowVersionId:res?.data?.data.workflowVersionId,
          "announceDate": getValues().announceDate,
    "eqParts": data
            
        }
        
        console.log(finalData)
    
        setRequestDataForAccepting(finalData);
      }



    })
  },[])
  
  
  return (
    
  
    <div>
           <div className="bg-white border border-[#2c3c511a] rounded-xl flex justify-between p-4 mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-primary"> تایید درخواست شماره :  </h3>
          <span className='text-blue-500'>{id}</span>
        </div>
      </div>
       <AllData showEditRequestModal={showEditRequestModal}setShowEditRequestModal={setShowEditRequestModal}    orderDetailData={detailData} showActionButton={true} />
      <div className='my-5 w-1/4'>

      <Datepicker
                    label={"تاریخ ابلاغ"}
                    register={register}
                    control={control}
                    
                    title={"announceDate"}
                  />
      </div>
     

      {/* <div className="flex flex-wrap "> */}
      {requestDataForAccepting && requestDataForAccepting.eqParts.map((item:any) => 
      <AcceptOrderEquipBox showEditEquipPartModal={showEditEquipPartModal} setShowEditEquipPartModal={setShowEditEquipPartModal}   data={requestDataForAccepting} setData={setRequestDataForAccepting} equipName={item.equipPartTitle} qty={item.qty} equipId={item.orderEquipPartId} detailData={detailData}/>
      

   
          
       
   
      )}
        <div className='mt-3 mb-14 flex justify-end'>
          
          <Button
            title={'تایید سفارش'}
            active={true}
            style={PrimaryButton}
            disableStyle={DisabledPrimaryButton}
            onClick={submit}
          />
        </div>

      {/* </div> */}
     
      
     
    

     
    </div>
  )
};

export default AcceptOrder;
