import React, { useEffect, useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Dialog, DialogTitle } from '@mui/material';

import { useForm } from 'react-hook-form';


import { Button, PrimaryButton, SecondaryButton } from '../../../../libs/button/button';
import instance from '../../../../helper/interceptor';
import { ApiHelper } from '../../../../helper/api-request';
import Input from '../../../../libs/input/input';

import Dropdown from '../../../../libs/dropdown/dropdown';

import TextArea from '../../../../libs/text-area/text-area';



interface EditPieceProps extends React.PropsWithChildren {
  showEditEquipPartInfomation: boolean;
  showAction:boolean;


  detailData:any
  setShowEditEquipPartInformation: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditEquipPartInformation: React.FunctionComponent<
EditPieceProps
> = ({ showEditEquipPartInfomation, setShowEditEquipPartInformation,detailData,showAction }) => {

    const { register, control,getValues,setValue,watch} = useForm({defaultValues:{
        "editOrderEquipPartId": detailData.equipPartId,
        "eqPartCode": detailData.eqPartCode,
        "qty": detailData.qty,
        "equipId": detailData.equipId,
        "equipPartId": detailData.equipPartId,
        "equipmentPlaque": detailData.equipmentPlaque,
        "customEqPartTitle": detailData.customEqPartTitle,
        "serialNumber": detailData.serialNumber,
        "price": detailData.price,
        "priceUnitId": detailData.priceUnitId,
        "description": detailData.description
    }});


    const [equip,setEquips] = useState<any>([]);
    const [equipPart,setEquipsPart] = useState<any>([]);
    const [priceUnits,setPriceUnits] = useState<any>([]);
  const watchEquip = watch("equipId");
  useEffect(() => {
    instance.get(ApiHelper.get("getPriceUnits")).then((res:any) => {
      if(res.data.success) {
        setPriceUnits(res.data.data);
      }
    })
    instance.get(ApiHelper.get('getEquips')).then((res:any) => {
        setEquips(res.data);
      })
      instance.get(ApiHelper.get('getEquipParts'),{params: {
        equipId:getValues().equipId
      }}).then((res:any) => {
        setEquipsPart(res.data);
        setValue("equipPartId",res.data.data[0].id);
      })
   

   
  }, [watchEquip]);
  const onSubmit = () => {
    const data = {
      ...getValues(),
      qty: Number(getValues().qty),
      price: Number(getValues().price),
    }
   instance.put(ApiHelper.get("editOrderEquipPart"),{...data,requestId : detailData.requestId}).then((res:any) => {
    if(res.data.data.success) {
        setShowEditEquipPartInformation(false);
    }
   })
    
   
  };
  return (
    <Dialog
      className="w-full  !overflow-hidden"
      onClose={() => setShowEditEquipPartInformation(false)}
      open={showEditEquipPartInfomation}
     
  
      
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{
        '& .MuiPaper-elevation': {
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !pb-6">
        <span>سایر اطلاعات قطعه</span>
        
        <span className="text-sm font-bold text-blue-700">
                   {detailData.equipPartTitle}
        </span>
      </DialogTitle>
      <div className="grid grid-cols-3 gap-3 pb-8 px-10 py-5">
      
              
    <Dropdown
                  register={register}
                  control={control}
                  title="equipId"
                  label='نام تجهیز'
                  option={equip?.data}
                  fullWidth={true}
                  disabled={showAction}
                />
                  <Dropdown
                register={register}
                control={control}
                title="equipPartId"
                disabled={showAction}
                label='نام قطعه'
                option={equipPart?.data}
             
                fullWidth={true}
               
              /> 
               <Input
       
       placeholder='کد قطعه'
       type="text"
       register={register}
       control={control}
       title="eqPartCode"
       disabled={showAction}
       label='کد قطعه'
       width="w-full"
     />
      <Input

       type="number"
       register={register}
       disabled={showAction}
       control={control}
       title="qty"
       label='تعداد'
       width="w-full"
     />
       <Input
       placeholder='پلاک تجهیز'
       type="text"
       register={register}
       control={control}
       disabled={showAction}
       title="equipmentPlaque"
       label='پلاک تجهیز'
       width="w-full"
     />
       <Input
           
              type="text"
              register={register}
              control={control}
              disabled={showAction}
              title="serialNumber"
              label='شماره سریال'
              width="w-full"
            />
              <Input
             
              type="number"
              register={register}
              control={control}
              disabled={showAction}
              title="price"
              label='قیمت'
              width="w-full"
            />
              <Dropdown
                  register={register}
                  control={control}
                  disabled={showAction}
                  title="priceUnitId"
                  label='واحد قیمت'
                  option={priceUnits}
                  fullWidth={true}
                />
                <div className="col-span-3 p-0">
                <TextArea
        control={control}
        disabled={showAction}
        title='description'
        register={register}
        label='مشخصات قطعه'
        
        />
                </div>
                {!showAction &&       <div className='col-span-3 flex justify-end mt-8'>
              <Button
              title='لغو'
              active={true}
              style={SecondaryButton}
              onClick={() =>setShowEditEquipPartInformation(false)}
            />
              <Button
              title='ویرایش'
              active={true}
              style={PrimaryButton}
              onClick={onSubmit}
            />
            
              </div>}
                
              
               
            </div>
    
   
    </Dialog>
  );
};

export default EditEquipPartInformation;
