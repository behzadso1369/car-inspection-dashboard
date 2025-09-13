import Dropdown from '../../../../libs/dropdown/dropdown';
import { dataOptions } from '../../data/data';
import Datepicker from '../../../../libs/datepicker/datepicker';
import {
    Button,
    PrimaryButton,
  
  } from '../../../../libs/button/button';
  import { Input } from '../../../../libs/input/input';
import { useForm } from 'react-hook-form';
const OrderDetail = () => {
    const { register, control, handleSubmit,getValues } = useForm({
        defaultValues: {
          orderType: '0',
          role: '0',
          gender: '0',
        },
      });
      const onSubmit = () => {
        console.log(getValues());
        
       
      };
    return (  
        <div className="pb-20">
        <div className="bg-white border border-[#2c3c511a] rounded-xl flex justify-between p-4">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-primary">ویرایش سفارش </h3>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex  flex-wrap 2xl:justify-around pt-16">
            <div className="grid grid-cols-3 gap-4 pb-8">
            <Dropdown
                    register={register}
                    control={control}
                    title="orderType"
                    label='نوع سفارش'
                    option={dataOptions.orderType}
                    fullWidth={true}
                  />
                     <Input
                placeholder='مشتری'
                type="text"
                register={register}
                control={control}
                title="customerName"
                label='مشتری'
                width="w-80"
              />
                 <Input
                placeholder='کارشناس مشتری'
                type="text"
                register={register}
                control={control}
                title="companyName"
                label='کارشناس مشتری'
                width="w-80"
              />
            </div>
            <div className="grid grid-cols-3 gap-4 pb-8">
              <Input
                placeholder='شماره استعلام'
                type="text"
                register={register}
                control={control}
                title="inquiryNumber"
                label='شماره استعلام'
                width="w-80"
              />
                <Datepicker
                    label='تاریخ استعلام'
                    register={register}
                    control={control}
                    title="inquiryDate"
                  />
               <Datepicker
                    label='تاریخ تحویل مندرج در  استعلام'
                    register={register}
                    control={control}
                    title="inquieryDeliveryDate"
                  />
            </div>
            <div className="grid grid-cols-3 gap-4 pb-8">
              <Input
                placeholder='کد کالای مشتری'
                type="text"
                register={register}
                control={control}
                title="customerStaffCode"
                label='کد کالای مشتری'
                dir={'ltr'}
                width="w-80"
              />
                 <Input
                placeholder='کد  ارجاع'
                type="text"
                register={register}
                control={control}
                title="returnCode"
                label='کد  ارجاع'
                dir={'ltr'}
                width="w-80"
              />
              <Dropdown
                register={register}
                control={control}
                title="pieceName"
                label='نام قطعه'
                option={[
                  { value: '0', title: 'قطعه ۱' },
                  { value: '1', title: 'قطعه ۲' },
                ]}
                fullWidth={false}
               
              />
            </div>
            <div className="grid grid-cols-3 gap-4 pb-8">
            <Input
                placeholder='کد قطعه'
                type="text"
                register={register}
                control={control}
                title="pieceCode"
                label='کد قطعه'
                width="w-80"
              />
                <Input
                placeholder='تعداد'
                type="text"
                register={register}
                control={control}
                title="orderNumber"
                label='تعداد'
                width="w-80"
              />
                <Dropdown
                    register={register}
                    control={control}
                    title="tollingName"
                    label='نام تجهیز'
                    option={dataOptions.orderType}
                    fullWidth={true}
                  />
  
            </div>
            <div className="grid grid-cols-3 gap-4 pb-8">
            <Dropdown
                    register={register}
                    control={control}
                    title="orderType"
                    label='پلاک تجهیز'
                    option={dataOptions.orderType}
                    fullWidth={true}
                  />
                    <Input
                placeholder='شماره سریال'
                type="text"
                register={register}
                control={control}
                title="serianNumber"
                label='شماره سریال'
                width="w-80"
              />
                <Datepicker
                    label='تاریخ دریافت درخواست'
                    register={register}
                    control={control}
                    title="receiveOrderDate"
                  />
              
              </div>
              <div className="grid grid-cols-3 gap-4 pb-8">
              <Datepicker
                    label='تاریخ ارسال پیش فاکتور '
                    register={register}
                    control={control}
                    title="preFactorSentDate"
                  />
                    <Datepicker
                    label='تاریخ دریافت پیش پرداخت برنامه'
                    register={register}
                    control={control}
                    title="pragramPrepaymentًReceiveDate"
                  />
                    <Datepicker
                    label='تاریخ دریافت پیش پرداخت'
                    register={register}
                    control={control}
                    title="receivePerPaymentDate"
                  />
  
              
              </div>
              <div className="grid grid-cols-3 gap-4 pb-8">
              <Datepicker
                    label='تاریخ   خرید مواد برنامه '
                    register={register}
                    control={control}
                    title="programSellingMaterialDate"
                  />
                    <Datepicker
                    label='تاریخ    واقعی خرید مواد'
                    register={register}
                    control={control}
                    title="realSellingMaterialDate"
                  />
                    <Datepicker
                    label='تاریخ واقعی  اتمام ساخت'
                    register={register}
                    control={control}
                    title="realFinishingMadeDate"
                  />
              
              </div>
              <div className="grid grid-cols-3 gap-4 pb-8">
              <Datepicker
                    label='تاریخ QC برنامه'
                    register={register}
                    control={control}
                    title="programQCDate"
                  />
                    <Datepicker
                    label='تاریخ    واقعی  QC'
                    register={register}
                    control={control}
                    title="realQCDate"
                  />
                    <Datepicker
                    label='تاریخ  ارسال برنامه'
                    register={register}
                    control={control}
                    title="programSendingDate"
                  />
              
              </div>
              <div className="grid grid-cols-3 gap-4 pb-8">
              <Datepicker
                    label='تاریخ    واقعی  ارسال'
                    register={register}
                    control={control}
                    title="realSendingDate"
                  />
              <Datepicker
                    label='تاریخ اتمام سفارش برنامه'
                    register={register}
                    control={control}
                    title="programOrderFinishDate"
                  />
                   
                    <Datepicker
                    label='تاریخ   اتمام سفارش'
                    register={register}
                    control={control}
                    title="orderFinishDate"
                  />
              
              </div>
              <div className="grid grid-cols-7 gap-4 pb-8">
                <div className="col-start-7 col-end-8">
                <Button
                title='ثبت سفارش جدید'
                active={true}
                style={PrimaryButton}
                onClick={onSubmit}
              />
                </div>
              
             
           
          </div>
          </div>
         
        </form>
      </div>
    );
}
 
export default OrderDetail;