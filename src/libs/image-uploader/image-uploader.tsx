import React, { useState, useRef } from 'react';
import 'cropperjs/dist/cropper.css';
import {faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './image-uploader.css';

import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Button, PrimaryButton, SecondaryButton } from '../button/button';

import { Dialog, DialogTitle } from '@mui/material';
import Cropper, { ReactCropperElement } from 'react-cropper';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';

export const Uploader = () => {
  const [image, setImage] = useState('');
  const [cropData, setCropData] = useState('');
  const [size, setSize] = useState<any>(0);
  const [name, setName] = useState('تصویر کاربر را وارد کنید');
  const [openCropper, setOpenCropper] = useState<any>(false);

  const onChange = (e: any) => {
    e.preventDefault();

    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as any);
      setName(e.target.files[0].name);
      setSize((e.target.files[0].size / 1000000).toFixed(3));
      setOpenCropper(true);
    };
    reader.readAsDataURL(files[0]);
  };

  interface CropperProps extends React.PropsWithChildren {
    showAddModal: any;
    setShowAddModal: any;
    image: string;
  }

  const CropperModal: React.FunctionComponent<CropperProps> = ({
    showAddModal,
    setShowAddModal,
    image,
  }) => {
    const cropperRef = useRef<ReactCropperElement>(null);
    const getCropData = () => {
      if (typeof cropperRef.current?.cropper !== 'undefined') {
        setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
      }
    };
    const dataUrlToFile = (url: string, fileName: string) => {
      const [mediaType, data] = url.split(",");
      
    
      const mime = mediaType.match(/:(.*?);/)?.[0];
    
      var n = data.length;
    
      const arr = new Uint8Array(n);
    
      while (n--) {
        arr[n] = data.charCodeAt(n);
      }
    
      return new File([arr], fileName, { type: mime });
    };
    const onSubmit = () => {
      getCropData();
      setTimeout(() => {
        const formData = new FormData();

        formData.append('files', dataUrlToFile(cropData,"output.png"));
        console.log(formData);
        instance.post(ApiHelper.get("uploadFiles"),formData).then((res:any) => {
          if(res.data.data) {
            setShowAddModal(false);
          }
        
        })
      },100)
      
     
    };

    return (
      <Dialog
        className="w-full relative !overflow-hidden"
        onClose={() => setShowAddModal(false)}
        open={showAddModal}
        fullWidth
        maxWidth="lg"
        PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
        sx={{
          '& .MuiPaper-elevation': {
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle className="flex gap-3 w-full border border-b-red ">
          <FontAwesomeIcon icon={faPlus} size="sm" />
          <span className="text-sm font-bold text-primary pb-2">
            افزودن تصویر 
          </span>
        </DialogTitle>
        <Cropper
          ref={cropperRef}
          style={{ height: 400, width: '100%' }}
          zoomTo={0.5}
          initialAspectRatio={1}
          aspectRatio={1}
          preview=".img-preview"
          src={image}
          viewMode={1}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          responsive={true}
          
          autoCropArea={1}
          checkOrientation={false}
          guides={true}
        />
        <div className="flex gap-3 justify-end pt-20 pb-4 px-4">
          <Button
            title="لغو"
            active={true}
            style={SecondaryButton}
            onClick={onSubmit}
          />
          <Button
            title="ثبت"
            active={true}
            style={PrimaryButton}
            onClick={onSubmit}
          />
        </div>
        <div
          className="absolute top-4 left-4 rounded-full w-8 h-8 cursor-pointer bg-red flex items-center justify-center bg-white"
          style={{ boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.15)' }}
          onClick={() => setShowAddModal(false)}
        >
          <FontAwesomeIcon className="top-2 left-4" icon={faXmark} />
        </div>
      </Dialog>
    );
  };

  return (
    <>
      {cropData ? (
        <>
          {size < 25 ? (
            <div className="w-[320px] h-[50px]  rounded-md  text-[#464F60]  border-[1px] border-[#1B263B]  flex items-center justify-between relative bg-white">
              <div onClick={() => setCropData('')}>
                <FontAwesomeIcon
                  className="mr-3      cursor-pointer    "
                  icon={faTrash}
                />
              </div>
              <div className="flex  items-center">
                <div className="flex flex-col items-end ml-1 ">
                  <p className="text-[#1B263B] text-[14px]">{name}</p>
                  <div className="text-[#2C3C51] text-[11px]  flex flex-row-reverse gap-1">
                    {' '}
                    <span> {size}</span> <span>MB</span>{' '}
                  </div>
                </div>
                <div className="w-[49px] flex items-center justify-center h-[49px] ">
                  <img
                    style={{
                      width: '49px',
                      height: '49px',
                      borderRadius: '5px 0px 0px 5px ',
                    }}
                    src={cropData}
                    alt="cropped"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="w-[320px] h-[50px]  rounded-md  text-[#464F60]  border-[1px] border-red-500  flex items-center justify-between relative bg-white">
                <div onClick={() => setCropData('')}>
                  <FontAwesomeIcon
                    className="mr-3      cursor-pointer    "
                    icon={faXmark}
                  />
                </div>
                <div className="flex  items-center">
                  <div className="flex flex-col items-end ml-1 ">
                    <p className="text-[#1B263B] text-[14px]">{name}</p>
                    <div className="text-[#2C3C51] text-[11px]  flex flex-row-reverse gap-1">
                      {' '}
                      <span> {size}</span> <span>MB</span>{' '}
                    </div>
                  </div>
                  <div className="w-[49px] flex items-center justify-center h-[49px] ">
                    <img
                      style={{
                        width: '49px',
                        height: '49px',
                        borderRadius: '5px 0px 0px 5px ',
                      }}
                      src={cropData}
                      alt="cropped"
                    />
                  </div>
                </div>
              </div>
              <p className='text-red-500 text-[10px] mt-1'>حجم فایل بیش از حد مجاز است</p>
            </>
          )}
        </>
      ) : (
        <>
          <div
            className="w-[320px] h-[50px] p-[12px] rounded-md  text-[#464F60] border-dashed border-[1px] border-black  flex items-center justify-between
       relative bg-white"
          >
            <div className="flex gap-2">
              <FontAwesomeIcon icon={faUpload} size="xs" />
              <p className="text-[11px]"> عکس  خود را انتحاب کنید</p>
            </div>
            <div
              className={`input-button h-[27px]  w-[95px] text-[12px]   bg-white text-[#464F60] shadow-secondary hover:text-[#171C26] focus:!shadow-mid-blue-focus duration-100 whitespace-nowrap rounded-md px-3 py-1 text-sm flex items-center gap-2 justify-center`}
            >
              <label htmlFor="input" className="mr-2">
                آپلود عکس{' '}
              </label>
              <input
                id="input"
                className="custom  text-[#464F60]"
                type="file"
                onChange={onChange}
              />
            </div>
          </div>
          <p className="text-[10px] mt-1">
            حداکثر حجم فایل 25 مگابایت باشد و نام فایل بدون علائم خاص باشد
          </p>
        </>
      )}

      {openCropper && (
        <CropperModal
          image={image}
          showAddModal={openCropper}
          setShowAddModal={setOpenCropper}
        />
      )}
    </>
  );
};

export default Uploader;
