import React, { useEffect, useRef, useState } from 'react';
import { Input } from '../../libs/input/input';
import { useForm } from 'react-hook-form';
import { Button, SecondaryButton } from '../../libs/button/button';
import { Switch } from '@mui/material';
import Datepicker from '../../libs/datepicker/datepicker';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const Profile: React.FunctionComponent = () => {
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      father_name: '',
      mobile: '',
      email: '',
      birthday: '',
      is_phone_accepted: false,
      is_mobile_accepted: false,
      is_email_accepted: false,
      avatar: '',
      national_id: '',
      address: '',
      phone: '',
    },
  });

  const [image, setImage] = useState<any>(null);
  const [profileName, setProfileName] = useState<string>('');
  const [progressImageBar, setProgressImageBar] = useState<boolean>(false);
  const inputImageRef = useRef<any>(null);

  const uploadImageFile = async () => {
    const file = inputImageRef.current?.files[0];
    const formData = new FormData();
    formData.append('files', file);
    setProgressImageBar(true);
    setImage(null);
  };

  const getProfile = () => {
    instance.get(ApiHelper.get('Profile')).then((res: any) => {
      setProfileName(res?.data?.full_name);
      reset({
        ...res?.data,
        national_id: res?.data?.personal_data?.national_id,
        birthday: res?.data?.personal_data?.birthday,
      });
    });
  };

  useEffect(() => {
    getProfile();
  }, []);

  const onSubmit = () => {
    instance.post(ApiHelper.get('EditProfile')).then((res) => {
      if (res) {
        getProfile();
      }
    });
  };

  return (
    <div className="w-full pb-24 max-w-full overflow-x-hidden">
      <div className="bg-white border border-card-border rounded-2xl p-4 mb-4 shadow-card">
        <h3 className="text-base sm:text-lg font-bold text-primary">پروفایل کاربری</h3>
        {profileName && (
          <p className="text-sm text-black-opacity-60 mt-1">{profileName}</p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-white border border-card-border rounded-2xl p-4 shadow-card">
          <h4 className="text-sm font-bold text-primary mb-4">اطلاعات شخصی</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <Input
              placeholder="نام"
              label="نام"
              type="text"
              register={register}
              control={control}
              title="first_name"
              width="w-full"
            />
            <Input
              placeholder="نام خانوادگی"
              label="نام خانوادگی"
              type="text"
              register={register}
              control={control}
              title="last_name"
              width="w-full"
            />
            <Input
              placeholder="نام پدر"
              label="نام پدر"
              type="text"
              register={register}
              control={control}
              title="father_name"
              width="w-full"
            />
            <Input
              placeholder="ایمیل"
              label="ایمیل"
              type="text"
              register={register}
              control={control}
              title="email"
              width="w-full"
            />
            <Input
              placeholder="شماره موبایل"
              label="شماره موبایل"
              type="mobile"
              register={register}
              control={control}
              title="mobile"
              width="w-full"
            />
            <Input
              placeholder="شماره تلفن"
              label="شماره تلفن"
              type="text"
              register={register}
              control={control}
              title="phone"
              width="w-full"
            />
            <Input
              placeholder="کد ملی"
              label="کد ملی"
              type="text"
              register={register}
              control={control}
              title="national_id"
              width="w-full"
            />
            <Datepicker
              label="تاریخ تولد"
              register={register}
              control={control}
              title="birthday"
            />
          </div>
        </div>

        <div className="bg-white border border-card-border rounded-2xl p-4 shadow-card">
          <h4 className="text-sm font-bold text-primary mb-4">تصویر پروفایل</h4>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label
              htmlFor="imageFile"
              className="inline-flex items-center justify-center min-h-[44px] rounded-xl px-4 text-sm bg-brand text-white cursor-pointer w-full sm:w-auto"
            >
              آپلود عکس
            </label>
            <input
              name="imageFile"
              id="imageFile"
              type="file"
              ref={inputImageRef}
              onInput={uploadImageFile}
              className="hidden"
            />
            {progressImageBar ? (
              <span className="text-sm text-black-opacity-60">فایل عکس در حال آپلود است</span>
            ) : (
              image && (
                <div className="p-2 border border-card-border rounded-xl">
                  <img width="50" height="50" src={image.image} alt="پروفایل" className="rounded-lg" />
                </div>
              )
            )}
          </div>
        </div>

        <div className="bg-white border border-card-border rounded-2xl p-4 shadow-card space-y-4">
          <h4 className="text-sm font-bold text-primary">وضعیت تأیید</h4>
          <div className="flex justify-between items-center gap-3 py-2 border-b border-card-border last:border-0">
            <span className="text-sm">شماره موبایل تایید شده است؟</span>
            <Switch disabled {...register('is_mobile_accepted')} {...label} defaultChecked={false} />
          </div>
          <div className="flex justify-between items-center gap-3 py-2 border-b border-card-border last:border-0">
            <span className="text-sm">شماره تلفن تایید شده است؟</span>
            <Switch disabled {...register('is_phone_accepted')} {...label} defaultChecked={false} />
          </div>
          <div className="flex justify-between items-center gap-3 py-2">
            <span className="text-sm">ایمیل تایید شده است؟</span>
            <Switch disabled {...register('is_email_accepted')} {...label} defaultChecked={false} />
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-2">
          <Button
            title="انصراف"
            active={true}
            style={SecondaryButton}
            onClick={() => console.log('cancel')}
            iconStyle="text-[#B2E7FD] text-[10px]"
          />
          <button
            type="submit"
            className="w-full sm:w-auto min-h-[44px] px-6 rounded-xl bg-brand text-white text-sm font-medium"
          >
            ویرایش اطلاعات کاربری
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
