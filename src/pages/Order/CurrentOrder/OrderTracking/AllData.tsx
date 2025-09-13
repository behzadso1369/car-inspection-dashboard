

import React from 'react';



import EditRequestInformation from './EditRequestInformation';
import Button, { PrimaryButton } from '../../../../libs/button/button';


interface AllDataProps extends React.PropsWithChildren {
  orderDetailData: any;
  showEditRequestModal?:boolean;
  setShowEditRequestModal?:any;
  showActionButton:boolean;
  // step: any;
}

const AllData: React.FunctionComponent<AllDataProps> = ({
  orderDetailData,
  showEditRequestModal,
  setShowEditRequestModal,
  showActionButton

  // step,
}) => {



  
  

  const {
    orderTypeTitle,
    refCode,
    userFirstName,
    userLastName,
    customerName,
    inquestDate,
    inquestDeliveryDate,
    inquestNumber,
    requestStatus,
    rejectDescription

  } = orderDetailData;
 


  return (
    <div className="bg-white rounded-xl w-full px-3 py-4 mb-4">
      <div className="flex justify-between gap-10">
        <div className="flex flex-col gap-6 w-1/4">
          <div className="flex gap-2">
            <h4
              style={{ whiteSpace: 'nowrap' }}
              className="text-sm font-semibold"
            >
             نوع سفارش
            </h4>
            <span className="text-[#1B263B] text-sm">{orderTypeTitle}</span>
          </div>
          <div className="flex gap-2">
            <h4
              style={{ whiteSpace: 'nowrap' }}
              className="text-sm font-semibold"
            >
            کد ارجاع سفارش
            </h4>
            <span className="text-[#1B263B] text-sm">{refCode}</span>
          </div>
          <div className="flex gap-2">
            <h4
              style={{ whiteSpace: 'nowrap' }}
              className="text-sm font-semibold"
            >
             نام کارشناس مشتری
            </h4>
            <span className="text-[#1B263B] text-sm">{customerName}</span>
          </div>
          <div className="flex gap-2">
            <h4
              style={{ whiteSpace: 'nowrap' }}
              className="text-sm font-semibold"
            >
             نام  مشتری
            </h4>
            <span className="text-[#1B263B] text-sm">{userFirstName}</span>
            <span className="text-[#1B263B] text-sm"> </span>
            <span className="text-[#1B263B] text-sm">{userLastName}</span>
          </div>
          <div className="flex gap-2">
            <h4
              style={{ whiteSpace: 'nowrap' }}
              className="text-sm font-semibold"
            >
           وضعیت سفارش
            </h4>
            <span className="text-[#1B263B] text-sm">{requestStatus}</span>
          </div>
          
        </div>

        <div className="flex flex-col gap-6 w-1/4">
          <div className="flex gap-2">
            <h4
              style={{ whiteSpace: 'nowrap' }}
              className="text-sm font-semibold"
            >
              تاریخ استعلام
            </h4>
            <span className="text-[#1B263B] text-sm">{inquestDate}</span>
          </div>
          <div className="flex gap-2">
            <h4
              style={{ whiteSpace: 'nowrap' }}
              className="text-sm font-semibold"
            >
              تاریخ تحویل مندرج در استعلام
            </h4>
            <span className="text-[#1B263B] text-sm">{inquestDeliveryDate}</span>
          </div>
          <div className="flex gap-2">
            <h4
              style={{ whiteSpace: 'nowrap' }}
              className="text-sm font-semibold"
            >
          شماره استعلام
            </h4>
            <span className="text-[#1B263B] text-sm">{inquestNumber}</span>
          </div>
          {requestStatus === "رد شده" &&  <div className="flex gap-2">
            <h4
              style={{ whiteSpace: 'nowrap' }}
              className="text-sm font-semibold"
            >
            دلیل رد سفارش
            </h4>
            <span className="text-[#1B263B] text-sm">{rejectDescription}</span>
          </div>}
   
        <div className="flex gap-3">
         
          
         <Button
           title={'جزییات سفارش'}
           active={true}
           style={PrimaryButton}
           onClick={() => setShowEditRequestModal(true)}
         />
       </div>
       
  
        
         
          {/* {step !== 2 && (
            <div className="flex gap-2">
              <h4
                style={{ whiteSpace: 'nowrap' }}
                className="text-sm font-semibold"
              >
                نام جمع آوری کننده:
              </h4>
              <span className="text-[#1B263B] text-sm">جلال جلالی</span>
            </div>
          )} */}
        </div>

  
      </div>
      {showEditRequestModal && <EditRequestInformation showEditRequestInfomation={showEditRequestModal} setShowEditRequestModal={setShowEditRequestModal} detailData={orderDetailData} showActionButton={showActionButton}/>}
    </div>
  );
};

export default AllData;
