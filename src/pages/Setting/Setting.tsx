import React, { useEffect, useRef, useState } from 'react';
import { Input } from '../../libs/input/input';
import { useForm } from 'react-hook-form';
import { Dropdown } from '../../libs/dropdown/dropdown';


import { Button, PrimaryButton, SecondaryButton } from '../../libs/button/button';





import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';

import { useNavigate } from 'react-router-dom';


import { Switch } from '@mui/material';
const label = { inputProps: { 'aria-label': 'Switch demo' } };

const Setting: React.FunctionComponent = () => {

  const navigate = useNavigate();

  const inputImageRef = useRef<any>(null);


  const [fileId,setFileId] = useState<any>(null);
  const [files,setFiles] = useState<any>([]);
  const [image,setImage] = useState<any>(null);

  const [progressImageBar,setProgressImageBar] = useState<boolean>(false);

  
  const { register, control,reset} = useForm({
    defaultValues: {
        "name": "",
        "url": "",
        "description": "",
        "keyword": "",
        "zibal_api": "",
        "zarinpal_api": "",
        "idpay_api": "",
        "pay_ir_api": "",
        "vendar_api": "",
        "aghapardakht_api": "",
        "landing_template": "",
        "gateway": "",
        "validation_api": "",
        "GOOGLE_RECAPTCHA_SECRET_KEY": "",
        "GOOGLE_RECAPTCHA_PUBLIC_KEY": "",
        "GOOGLE_ANALYTICS": "",
        "is_enter_persian_information": true,
        "video_link": "",
        "is_register":true ,
        "phone": "",
        "mobile": "",
        "email": "",
        "address": "",
        "telegram_channel_link": "",
        "telegram_support_link": "",
        "rules_link": "",
        "rules_text": "",
        "nobitex_api": "",
        "active_nobitex": true,
        "is_automatic": true,
        "finnotech_id": "",
        "finnotech_secret": "",
        "exchange_public_key": "",
        "exchange_secret_key": "",
        "exchange_password": "",
        "header_text": "",
        "header_url": ""

    }
  });

 
  
  useEffect(() => {
    instance.get(ApiHelper.get("Setting")).then(res => {

        reset(res?.data[0]);
    })
  

   
  }, []);
 


  // const onRowClicked = (params:any) => {
  //   console.log(params);
  //   setOneRow(params.data);

  // }


  
  const uploadImageFile = async () => {
    const file = inputImageRef.current?.files[0];

    const formData = new FormData();
    formData.append('files', file);

    console.log(formData);
    setProgressImageBar(true);
    instance.post(ApiHelper.get("uploadFiles"),formData).then((res:any) => {
  

      instance.get(ApiHelper.get("getFileBase64") + "/" + res.data.data[0]).then((res:any) => {
        const byteCharacters = atob(res.data.base64Data);
const byteNumbers = new Array(byteCharacters.length);
for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
}
const byteArray = new Uint8Array(byteNumbers);

let image = new Blob([byteArray], { type: 'image/jpeg' });
let imageUrl = URL.createObjectURL(image);
setProgressImageBar(false);
setImage({image: imageUrl});
    

      })
    
        setFileId(res.data.data[0]);
        files.push({
          "fileId": res.data.data[0],
          "fileTypeId": 1

        })
        setFiles(files);
    })
    
  };
 

  const onSubmit = () => {
    const finalData = {};

    instance.post(ApiHelper.get("AddRequest"),finalData).then((res:any) => {
      if(res?.data?.success) {
        navigate('/order/receive-order');

      }
    })

    
    
   
  };

  return (
    <div className="pb-20">
      <div className="bg-white border border-[#2c3c511a] rounded-xl flex justify-between p-4 mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-primary">ویرایش کاربر</h3>
        </div>
      </div>

    
      
    <div className="grid grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-3 pb-8">
  
       <Input
       placeholder='اسم سایت'
       type="text"
       register={register}
       control={control}
       title="name"
       label='اسم سایت'
       width="w-full"
     />
       <Input
             placeholder='آدرس سایت'
           
              type="text"
              register={register}
              control={control}
              title="url"
              label='آدرس سایت'
              width="w-full"
            />
               <Input
                 placeholder='توضیحات سایت'
           
           type="text"
           register={register}
           control={control}
           title="description"
           label='توضیحات'
           width="w-full"
         />
          <Input
                 placeholder='کلمات کلیدی'
           
           type="text"
           register={register}
           control={control}
           title="keyword"
           label='کلمات کلیدی'
           width="w-full"
         />
          <Input
          placeholder='Zibal API'
           
           type="text"
           register={register}
           control={control}
           title="phone"
           label='zibal_api'
           width="w-full"
         />
          <Input
          placeholder='Zarinpal API'
           
           type="text"
           register={register}
           control={control}
           title="zarinpal_api"
           label='Zarinpal API'
           width="w-full"
         />
          <Input
          placeholder='IDpay API'
           
           type="text"
           register={register}
           control={control}
           title="idpay_api"
           label='IDpay API'
           width="w-full"
         />
          <Input
          placeholder='Pay.ir API'
           
           type="text"
           register={register}
           control={control}
           title="pay_ir_api"
           label='Pay.ir API'
           width="w-full"
         />
                    <Input
                    placeholder='Vendar API'
           
           type="text"
           register={register}
           control={control}
           title="vendar_api"
           label='Vendar API'
           width="w-full"
         />
           <Input
           placeholder='Agha Pardakht API'
           
           type="text"
           register={register}
           control={control}
           title="aghapardakht_api"
           label='Agha Pardakht API'
           width="w-full"
         />
             <Dropdown
                  register={register}
                  control={control}
                  title="landing_template"
                  label='Landing template'
                  option={[
                    {id:0,title: "Theme 1"},
                    {id:1,title: "Theme 2"},
                    {id:2,title: "Theme 3"},
                  ]}
                  fullWidth={true}
                />
                    <Dropdown
                  register={register}
                  control={control}
                  title="gateway"
                  label='Gateway'
                  option={[
                    {id:0,title: "Zibal"},
                    {id:1,title: "Zarin Pal"},
                    {id:2,title: "IdPay"},
                    {id:3,title: "Vendar"},
                    {id:4,title: "Agha Pardakht"},
                  ]}
                  fullWidth={true}
                />





           <Input
           placeholder='وب سرویس احراز هویت'
           
           type="text"
           register={register}
           control={control}
           title="validation_api"
           label='وب سرویس احراز هویت'
           width="w-full"
         />
           <Input
           placeholder='GOOGLE RECAPTCHA SECRET KEY'
           
           type="text"
           register={register}
           control={control}
           title="GOOGLE_RECAPTCHA_SECRET_KEY"
           label='GOOGLE RECAPTCHA SECRET KEY'
           width="w-full"
         />
        
                 <Input
                 placeholder='GOOGLE RECAPTCHA PUBLIC KEY'
           
           type="text"
           register={register}
           control={control}
           title="GOOGLE_RECAPTCHA_PUBLIC_KEY"
           label='GOOGLE RECAPTCHA PUBLIC KEY'
           width="w-full"
         />
      
                    <Input
                    placeholder='GOOGLE ANALYTICS'
           
           type="text"
           register={register}
           control={control}
           title="GOOGLE_ANALYTICS"
           label='GOOGLE ANALYTICS'
           width="w-full"
         />
                    <Input
                    placeholder='Video link'
           
           type="text"
           register={register}
           control={control}
           title="video_link"
           label='Video link'
           width="w-full"
         />
                    <Input
                    placeholder='Phone'
           
           type="text"
           register={register}
           control={control}
           title="phone"
           label='Phone'
           width="w-full"
         />
                    <Input
                    placeholder='Mobile'
           
           type="text"
           register={register}
           control={control}
           title="mobile"
           label='Mobile'
           width="w-full"
         />
                    <Input
                    placeholder='Email'
           
           type="text"
           register={register}
           control={control}
           title="email"
           label='Email'
           width="w-full"
         />
                    <Input
                    placeholder='Address'
           
           type="text"
           register={register}
           control={control}
           title="address"
           label='Address'
           width="w-full"
         />
                    <Input
                    placeholder='Telegram channel link'
           
           type="text"
           register={register}
           control={control}
           title="telegram_channel_link"
           label='Telegram channel link'
           width="w-full"
         />
                    <Input
                    placeholder='Telegram support link'
           
           type="text"
           register={register}
           control={control}
           title="telegram_support_link"
           label='Telegram support link'
           width="w-full"
         />
                    <Input
                    placeholder='Rules link'
           
           type="text"
           register={register}
           control={control}
           title="rules_link"
           label='Rules link'
           width="w-full"
         />
                    <Input
                    placeholder='Rules text'
           
           type="text"
           register={register}
           control={control}
           title="rules_text"
           label='Rules text'
           width="w-full"
         />
                    <Input
                    placeholder='Nobitex api'
           
           type="text"
           register={register}
           control={control}
           title="nobitex_api"
           label='Nobitex api'
           width="w-full"
         />
                    <Input
                    placeholder='GFinnotech id'
           
           type="text"
           register={register}
           control={control}
           title="finnotech_id"
           label='Finnotech id'
           width="w-full"
         />
                    <Input
                    placeholder='Finnotech secret'
           
           type="text"
           register={register}
           control={control}
           title="finnotech_secret"
           label='Finnotech secret'
           width="w-full"
         />
                    <Input
                    placeholder='Exchange public key'
           
           type="text"
           register={register}
           control={control}
           title="exchange_public_key"
           label='Exchange public key'
           width="w-full"
         />
                    <Input
                    placeholder='Exchange secret key'
           
           type="text"
           register={register}
           control={control}
           title="exchange_secret_key"
           label='Exchange secret key'
           width="w-full"
         />
                    <Input
                    placeholder='Exchange password'
           
           type="text"
           register={register}
           control={control}
           title="exchange_password"
           label='Exchange password'
           width="w-full"
         />
                    <Input
                    placeholder='Header text'
           
           type="text"
           register={register}
           control={control}
           title="header_text"
           label='Header text'
           width="w-full"
         />
                    <Input
                    placeholder='Header url'
           
           type="text"
           register={register}
           control={control}
           title="header_url"
           label='Header url'
           width="w-full"
         />
        
                
         

         

                  <div className='flex justify-between items-center'>
                    <span>Is enter persian information</span>
                    <Switch {...register("is_enter_persian_information")} {...label} defaultChecked={false}  />

                  </div>
                  
                  <div className='flex justify-between items-center'>
                    <span>Is register</span>
                    <Switch {...register("is_register")}  {...label} defaultChecked={false}  />

                  </div>
                  <div className='flex justify-between items-center'>
                    <span>Active nobitex</span>
                    <Switch {...register("active_nobitex")}  {...label} defaultChecked={false}  />

                  </div>
                  <div className='flex justify-between items-center'>
                    <span>Is automatic</span>
                    <Switch {...register("active_nobitex")}  {...label} defaultChecked={false}  />

                  </div>
                 
       
               
                
            
         



             
              <div className='mt-8 col-span-2 flex'>
        <div className="flex ">
    
    <div className='w-1/2'>
      <label
        htmlFor="imageFile"
        className=" rounded-md px-3 py-1 text-sm bg-gray-700 text-white hover:bg-blue-700 focus:bg-blue-opacity-90 focus:shadow-primary-focus whitespace-nowrap cursor-pointer"
      >
        آپلود لوگو   
      </label>
      <input
        name="imageFile"
        id="imageFile"
        type="file"
        ref={inputImageRef}
        onInput={uploadImageFile}
        style={{ visibility: 'hidden' }}
      />

    </div>
    {progressImageBar ? <span>فایل عکس در حال آپلود است</span> : <div>
    {image &&  <div className='w-auto relative p-2 border-2 border-slate-400 flex flex-col items-center'><img width="50px" height="50px" src={image.image}/></div>}
    </div>}

  
  

    {/* <Button
      title={'ذخیره   '}
      active={true}
      style={PrimaryButton}
      onClick={uploadFile}
    >
      {' '}
      ذخیره
    </Button> */}
    <div className="flex "></div>
        </div>
      
        </div>
         
        
  
     
           {/* <div className='col-span-3 mt-6'>
           <Uploader  />
           </div> */}
         
      
        


                
             

          
            
           
         


             
          
    </div>
    <div className='col-span-3 flex justify-end mt-8'>
              <Button
              title='لغو'
              active={true}
              style={SecondaryButton}
            />
              <Button
              title='ویرایش'
              active={true}
              style={PrimaryButton}
              onClick={onSubmit}
            />
            
              </div>
    </div>
  );
};

export default Setting;
