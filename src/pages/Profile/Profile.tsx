import React, { useEffect, useRef, useState } from 'react';
import { Input } from '../../libs/input/input';
import { useForm } from 'react-hook-form';


import { Button, PrimaryButton, SecondaryButton } from '../../libs/button/button';


import { Switch } from '@mui/material';
import Datepicker from '../../libs/datepicker/datepicker';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
const label = { inputProps: { 'aria-label': 'Switch demo' } };

const Profile: React.FunctionComponent = () => {
  
  const { register, control, handleSubmit,reset } = useForm({
    defaultValues: {
      "first_name": "",
      "last_name": "",
      "father_name": "",
      "mobile": "",
      "email": "",
      "birthday": "",
      "is_phone_accepted": false,
      "is_mobile_accepted": false,
      "is_email_accepted": false,
      "avatar": "",     
     "national_id": "",
     "address": "",
     "phone": ""
    },
  });

  const [image,setImage] = useState<any>(null);
  const [profileName,setProfileName] = useState<string>("");

  const [progressImageBar,setProgressImageBar] = useState<boolean>(false);
  const inputImageRef = useRef<any>(null);
  const uploadImageFile = async () => {
    const file = inputImageRef.current?.files[0];

    const formData = new FormData();
    formData.append('files', file);

    console.log(formData);
    setProgressImageBar(true);
    setImage(null);
//     instance.post(ApiHelper.get("uploadFiles"),formData).then((res:any) => {
  

//       instance.get(ApiHelper.get("getFileBase64") + "/" + res.data.data[0]).then((res:any) => {
//         const byteCharacters = atob(res.data.base64Data);
// const byteNumbers = new Array(byteCharacters.length);
// for (let i = 0; i < byteCharacters.length; i++) {
//     byteNumbers[i] = byteCharacters.charCodeAt(i);
// }
// const byteArray = new Uint8Array(byteNumbers);

// let image = new Blob([byteArray], { type: 'image/jpeg' });
// let imageUrl = URL.createObjectURL(image);
// setProgressImageBar(false);
// setImage({image: imageUrl});
    

//       })
    
//         setFileId(res.data.data[0]);
//         files.push({
//           "fileId": res.data.data[0],
//           "fileTypeId": 1

//         })
//         setFiles(files);
//     })

  };
  const getProfile = () => {
    instance.get(ApiHelper.get("Profile")).then((res:any) => {
      setProfileName(res?.data?.full_name);
     reset({...res?.data,national_id:res?.data?.personal_data?.national_id,birthday:res?.data?.personal_data?.birthday})
    })
  }
  useEffect(() => {
    getProfile()
  },[])


  const onSubmit = () => {
   instance.post(ApiHelper.get("EditProfile")).then(res => {
    if(res) {
      getProfile();
    }
   })
  };

  return (
    <div className="pb-20">
      <div className="bg-white border border-[#2c3c511a] rounded-xl flex justify-between p-4">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-primary">پروفایل کاربری:</h3>
          <span className="text-sm text-black">{profileName}</span>
        </div>
        {/* <div className="flex justify-center items-center gap-4">
          <div className="flex gap-1">
            <h3 className="text-xs">{'تاریخ'}: </h3>
            <p className="text-xs">1402/08/08</p>
          </div>
          <div className="flex gap-1">
            <h3 className="text-xs">{'زمان'}: </h3>
            <p className="text-xs">22:48</p>
          </div>
        </div> */}
      </div>
     

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-4 py-3 px-2">
        <Input
            placeholder={'نام '}
            label={'نام'}
            type="text"
            register={register}
            control={control}
            title="first_name"
          
          />
        <Input
            placeholder={'نام خانوادگی'}
            label={'نام خانوادگی' }
            type="text"
            register={register}
            control={control}
            title="last_name"
        
          />
        <Input
            placeholder={'نام پدر'}
            label={'نام پدر'}
            type="text"
            register={register}
            control={control}
            title="father_name"
           
          />
        <Input
            placeholder={'ایمیل'}
            label={'ایمیل'}
            type="text"
            register={register}
            control={control}
            title="email"
         
          />
        <Input
            placeholder={'شماره موبایل'}
            label={'شماره موبایل'}
            type="mobile"
            register={register}
            control={control}
            title="prevPass"
          />
        <Input
            placeholder={'شماره تلفن'}
            label={'شماره تلفن'}
            type="text"
            register={register}
            control={control}
            title="phone"
    
          />
        <Input
            placeholder={'کد ملی'}
            label={'کد ملی'}
            type="text"
            register={register}
            control={control}
            title="national_id"
         
          />
              <Datepicker
                    label={"تاریخ تولد"}
                    register={register}
                    control={control}
                    
                    title={"birthday"}
                  />
                    <div>
                  <div className='w-1/2 flex items-center'>
      <label
        htmlFor="imageFile"
        className=" rounded-md px-3 py-1 text-sm bg-gray-700 text-white hover:bg-blue-700 focus:bg-blue-opacity-90 focus:shadow-primary-focus whitespace-nowrap cursor-pointer"
      >
        آپلود عکس   
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
                  </div>
              <div className='flex justify-between items-center'>
                    <span>شماره موبایل تایید شده است؟</span>
                    <Switch disabled {...register("is_mobile_accepted")} {...label} defaultChecked={false}  />

                  </div>
                  <div className='flex justify-between items-center'>
                    <span>شماره تلفن تایید شده است؟</span>
                    <Switch disabled {...register("is_phone_accepted")} {...label} defaultChecked={false}  />

                  </div>
                  <div className='flex justify-between items-center'>
                    <span> ایمیل تایید شده است؟</span>
                    <Switch disabled {...register("email")} {...label} defaultChecked={false}  />

                  </div>
                
          
        
            

        </div>
        <div className="flex justify-end items-end pt-10">
        
          <div className="flex gap-3">
            <Button
              title={'انصراف'}
              active={true}
              style={SecondaryButton}
              onClick={() => {
                console.log('test');
              }}
              iconStyle="text-[#B2E7FD] text-[10px]"
            />
            <Button
              title={'ویرایش اطلاعات کاربری'}
              active={true}
              style={PrimaryButton}
              onClick={onSubmit}
            />
          </div>
        </div>
      </form>
   
    </div>
  );
};

export default Profile;
