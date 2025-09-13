import React, { useEffect, useState } from 'react';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import OrderChart from './OrderChart';
import UserChart from './UserChart';
import TransactionChart from './TransactionChart';


const HomePage: React.FunctionComponent = () => {
  const [data,setData] = useState<any>([])
  const getAllUser = () => {
    instance.get(ApiHelper.get("Stats")).then((res:any) => {
      setData(res?.data)
    })
  }
  useEffect(() => {
    getAllUser();
 
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1  lg:grid-cols-2 xl:grid-cols-2">
        <UserChart piceName={'کاربران'} allData={{accounts_count:data?.accounts_count,accounts_accepted_count:data?.accounts_accepted_count,accounts_confirmation_count:data?.accounts_confirmation_count,accounts_pending_count:data?.accounts_pending_count}} />
        <OrderChart piceName={'سفارشات'} allData={{orders_count: data?.orders_count,orders_delivered_count:data.orders_delivered_count,orders_deposit_count:data.orders_deposit_count,orders_purchase_count: data.orders_purchase_count,orders_sell_count:data.orders_sell_count,orders_suspended_count:data.orders_suspended_count}}  />
        <TransactionChart piceName={'تراکنش ها'} allData={{
transactions_count: data?.
transactions_count,
transactions_accepted_count: data?.transactions_accepted_count,

transactions_withdraw_count:data?.
transactions_withdraw_count

}}  />
     
       
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
