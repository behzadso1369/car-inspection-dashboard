import React, { useRef } from 'react';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, PrimaryButton, SecondaryButton } from '../button/button';
import { Dialog, DialogTitle } from '@mui/material';
import Cropper, { ReactCropperElement } from 'react-cropper';


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
  const onSubmit = () => {
   

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
          افزودن تصویر کاربر
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

export default CropperModal;
