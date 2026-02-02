import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import Input from '../../libs/input/input';
import Dropdown from '../../libs/dropdown/dropdown';
import Button, { PrimaryButton, SecondaryButton, DisabledPrimaryButton } from '../../libs/button/button';

const CreateOrderReport: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const inputImageRef = useRef<any>(null);
  const { register, control, getValues } = useForm({});
  const [users, setUsers] = useState<any>([]);
  const [orders, setOrders] = useState<any>([]);
  const [image, setImage] = useState<any>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("UserId", getValues("UserId"));
    formData.append("OrderId", getValues("OrderId"));
    if (image) {
      formData.append("Image", image);
    }

    instance.post(ApiHelper.get("CreateOrderReport"), formData).then((res: any) => {
      if (res.data) {
        navigate(-1);
      }
    })
  };

  const uploadImageFile = async () => {
    const file = inputImageRef.current?.files[0];
    if (file) {
      setIsUploading(true);
      // شبیه‌سازی آپلود عکس
      setTimeout(() => {
        setImage(file);
        setIsUploading(false);
      }, 1000);
    }
  };

  const getUsers = () => {
    instance.get(ApiHelper.get("GetSiteUserList"), { params: { skip: 0, take: 10000 } }).then((res: any) => {
      const newUsers = res.data.resultObject.map((item: any) => {
        return {
          id: item.Id,
          name: item.FullName
        }
      })
      setUsers(newUsers);
    })
  }

  const getOrders = () => {
    instance.get(ApiHelper.get("GetOrderReportDropDown"), { params: { skip: 0, take: 10000 } }).then((res: any) => {
      const newOrders = res.data.resultObject?.map((item: any) => {
        return {
          id: item.id,
          name: `سفارش ${item.id}`
        }
      }) || []
      setOrders(newOrders);
    })
  }

  useEffect(() => {
    getUsers();
    getOrders();
  }, [])

  return (
    <div className="w-full">
      <div className="bg-white border border-[#2c3c511a] rounded-xl flex items-baseline justify-between p-4 mb-3">
        <h3 className="text-base font-bold text-primary">اضافه کردن گزارش کارشناسی</h3>
      </div>
      <div className="grid grid-cols-4 gap-3 !py-3 px-4">
        <Dropdown
          optionTitle='name'
          register={register}
          control={control}
          title="UserId"
          label='کاربر'
          option={users}
          fullWidth={true}
        />
        <Dropdown
          optionTitle='name'
          register={register}
          control={control}
          title="OrderId"
          label='سفارش'
          option={orders}
          fullWidth={true}
        />
        <div className='mt-8 col-span-2 flex'>
          <div className="flex ">
            <div className='w-full md:w-1/2'>
              <label
                htmlFor="Image"
                className=" rounded-md px-3 py-1 text-sm bg-gray-700 text-white hover:bg-blue-700 focus:bg-blue-opacity-90 focus:shadow-primary-focus whitespace-nowrap cursor-pointer"
              >
                آپلود عکس
              </label>
              <input
                name="Image"
                id="Image"
                type="file"
                ref={inputImageRef}
                onInput={uploadImageFile}
                style={{ visibility: 'hidden' }}
              />
            </div>
            {isUploading ? (
              <div className='w-auto relative p-2 border-2 border-slate-400 flex flex-col items-center justify-center' style={{ minWidth: '50px', minHeight: '50px' }}>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-700"></div>
                <span className="text-xs mt-2 text-gray-600">در حال آپلود عکس...</span>
              </div>
            ) : image ? (
              <div className='w-auto relative p-2 border-2 border-slate-400 flex flex-col items-center'>
                <img width="50px" height="50px" src={URL.createObjectURL(image)} alt="Preview" />
              </div>
            ) : null}
            <div className="flex "></div>
          </div>
        </div>
        <div className='col-span-4 flex justify-end mt-8'>
          <Button
            title='لغو'
            active={true}
            style={SecondaryButton}
            onClick={() => navigate(-1)}
          />
          <Button
            title='اضافه کردن'
            active={!!image && !isUploading}
            style={PrimaryButton}
            disableStyle={DisabledPrimaryButton}
            onClick={onSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateOrderReport;

