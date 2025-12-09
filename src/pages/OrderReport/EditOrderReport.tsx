import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import Dropdown from '../../libs/dropdown/dropdown';
import Button, { PrimaryButton, SecondaryButton } from '../../libs/button/button';

const EditOrderReport: React.FunctionComponent = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderReportId = searchParams.get('id');
  const inputImageRef = useRef<any>(null);
  const [users, setUsers] = useState<any>([]);
  const [orders, setOrders] = useState<any>([]);
  const [image, setImage] = useState<any>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [progressImageBar, setProgressImageBar] = useState<boolean>(false);

  const { register, control, reset, getValues } = useForm({
    values: {
      UserId: "",
      OrderId: ""
    }
  });

  const onSubmit = () => {
    if (!orderReportId) return;

    const formData = new FormData();
    formData.append("UserId", getValues("UserId"));
    formData.append("OrderId", getValues("OrderId"));
    if (image) {
      formData.append("Image", image);
    }

    instance.put(ApiHelper.get("EdtiOrderReport") + "?id=" + orderReportId, formData).then((res: any) => {
      if (res.data) {
        navigate(-1);
      }
    })
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
    instance.get(ApiHelper.get("OrderList"), { params: { skip: 0, take: 10000 } }).then((res: any) => {
      const newOrders = res.data.resultObject?.map((item: any) => {
        return {
          id: item.id,
          name: `سفارش ${item.id}`
        }
      }) || []
      setOrders(newOrders);
    })
  }

  const getOrderReportById = () => {
    if (!orderReportId) return;

    instance.get(ApiHelper.get("GetOrderReport"), { params: { id: orderReportId } }).then((res: any) => {
      reset({
        UserId: res.data.resultObject.userId,
        OrderId: res.data.resultObject.orderId
      })
      if (res.data.resultObject.image) {
        setExistingImage(res.data.resultObject.image);
      }
    })
  }

  const uploadImageFile = async () => {
    const file = inputImageRef.current?.files[0];
    setImage(file);
  };

  useEffect(() => {
    if (orderReportId) {
      getOrderReportById();
    }
    getUsers();
    getOrders();
  }, [orderReportId])

  return (
    <div className="w-full">
      <div className="bg-white border border-[#2c3c511a] rounded-xl flex items-baseline justify-between p-4 mb-3">
        <h3 className="text-base font-bold text-primary">ویرایش گزارش کارشناسی</h3>
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
            <div className='w-1/2'>
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
            {progressImageBar ? <span>فایل عکس در حال آپلود است</span> : <div>
              {image ? (
                <div className='w-auto relative p-2 border-2 border-slate-400 flex flex-col items-center'>
                  <img width="50px" height="50px" src={URL.createObjectURL(image)} alt="Preview" />
                </div>
              ) : existingImage ? (
                <div className='w-auto relative p-2 border-2 border-slate-400 flex flex-col items-center'>
                  <img width="50px" height="50px" src={existingImage} alt="Existing" />
                </div>
              ) : null}
            </div>}
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
            title='ذخیره'
            active={true}
            style={PrimaryButton}
            onClick={onSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default EditOrderReport;

