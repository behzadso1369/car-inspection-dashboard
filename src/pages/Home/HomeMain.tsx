import React, { useEffect, useState } from 'react';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import OrderChart from './OrderChart';
import UserChart from './UserChart';
import TransactionChart from './TransactionChart';
import OrderPattern from './OrderPattern';
import OtpSends from './OtpSends';


const HomePage: React.FunctionComponent = () => {
  
  const [data,setData] = useState<any>([])
  const getAllUser = () => {
    instance.get(ApiHelper.get("GetChart")).then((res:any) => {
      setData(res?.data?.resultObject)

      
    })
  }
  useEffect(() => {
    getAllUser();
 
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1  lg:grid-cols-2 xl:grid-cols-2">
        
        <UserChart piceName={'کاربران'} allData={data?.UsersSite} />
        <OrderChart piceName={'سفارشات'} allData={data}  />
        <OtpSends piceName={'پیام های ارسال شده'} allData={data} />
        <OrderPattern piceName={'روند سفارشات'} allData={data?.Orders}  />
     
       
      </div>
 {/* <div className="grid grid-cols-2 mt-7">
  <div className='col-span-2'>تعداد سفارشات هر قطعه</div>
    <OrderEquipMonthChart/>
   <OrderEquipSessionChart/>
   <OrderEquipYearChart/>
  
  </div>
  <div className="grid grid-cols-2 mt-7 ">
  <div className='col-span-2'>حجم فروش</div>
  <VolumeSellMonthChart/>
  <VolumeSellSessionChart/>
  <VolumeSellYearChart/>
  

  
  </div>
  <div className="grid grid-cols-2 mt-7 ">
  <div className='col-span-2'>تعداد کل سفارشات</div>
  <OrderNumberMonthChart/>
  <OrderNumberSessionChart/>
  <OrderNumberYearChart/>
   

  
  </div>
  <div className="grid grid-cols-2 mt-7 ">
  <div className='col-span-2'>حجم و تعداد فروش هر قطعه براساس ماه</div>
  <VolumeSellEquipBar/>
  <QtySellEquipBar/>


  
  </div>
  <div className="grid grid-cols-2 mt-7 ">
  <div className='col-span-2'>درصد تاخیر برای سفارشات و قطعات</div>
 <DelayEquipChart/>
 <DelayOrderChart/>
  


  
  </div> */}
 
  
    </div>
  
   
  );
};

export default HomePage;
