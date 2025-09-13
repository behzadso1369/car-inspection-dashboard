import React from 'react';
import { Box, Step, StepLabel, Stepper } from '@mui/material';



interface StatusBarProps extends React.PropsWithChildren {
  activeStep: number;
  handleNext: () => void;

  state: any;
  orderTypeId: number;

}

const StatusBar: React.FunctionComponent<StatusBarProps> = ({
  activeStep,
  orderTypeId,


  state,
}) => {
  console.log(state)
 


  const getSteps = () => {
    if(orderTypeId === 1) {
      return [
        'دریافت درخواست',
        'ارسال پیش فاکتور',
        'دریافت پیش پرداخت',
        'خرید مواد اولیه ',
        'ساخت',
        ' کنترل کیفیت',
        ' ارسال سفارش',
       
    
        'پایان سفارش' ,
       
      
       
       
     
   
       
      
      
      
        
       
      ];
    }else {
      return [
        'دریافت درخواست',
        'ارسال پیش فاکتور',
        'تایید پیش پرداخت',
        ' ارسال گزارش',
        'اعزام کارشناس',
        'پایان سفارش' ,
        
       
        
        
        
      
      
     
      
        
        
      ];
    }
  
  };
  const steps = getSteps();


  return (
    <>
     <div className="w-full border border-[#BDBDBD] rounded-lg mb-4 flex justify-center items-center p-4 gap-10">
      <Box className="w-full" dir='ltr'>
        <Stepper  alternativeLabel activeStep={activeStep} className='paperRoot'>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {
              completed: activeStep > index,
            };
            const labelProps: { optional?: React.ReactNode } = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel  {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
      
        
        
    
        {/* <ShowForPermission role={["MANAGER"]} >
        <div className="w-28">
            <Button
              title={'ثبت و ادامه'}
              active={true}
              style={PrimaryButton}
              disableStyle={DisabledPrimaryButton}
              onClick={() => handleNext()}
            />
          </div>
        </ShowForPermission> */}
      
      
    </div>
    </>
   
  );
};

export default StatusBar;
