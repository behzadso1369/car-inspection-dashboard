import React, { useEffect } from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import Input from '../../../libs/input/input';
import TextArea from '../../../libs/text-area/text-area';
import Button, { PrimaryButton, SecondaryButton } from '../../../libs/button/button';
import WalletSwitchField from '../WalletSwitchField';
import { toNumber } from '../walletHelpers';

interface EditWalletChargePlanProps {
  showEditModal: boolean;
  planId: number;
  planTitle: string;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditWalletChargePlan: React.FunctionComponent<EditWalletChargePlanProps> = ({
  showEditModal,
  setShowEditModal,
  planId,
  planTitle,
}) => {
  const { register, control, getValues, reset } = useForm({});

  const onSubmit = () => {
    const values = getValues();
    instance
      .put(ApiHelper.get('WalletChargePlanUpdate') + '?id=' + planId, {
        title: values.title,
        description: values.description || null,
        payAmount: toNumber(values.payAmount),
        creditAmount: toNumber(values.creditAmount),
        sortOrder: toNumber(values.sortOrder),
        isActive: !!values.isActive,
      })
      .then((res: any) => {
        if (res.data) {
          setShowEditModal(false);
        }
      });
  };

  const getPlanById = () => {
    instance
      .get(ApiHelper.get('WalletChargePlanGet'), { params: { id: planId } })
      .then((res: any) => {
        const plan = res.data.resultObject;
        reset({
          title: plan.title,
          description: plan.description ?? '',
          payAmount: plan.payAmount,
          creditAmount: plan.creditAmount,
          sortOrder: plan.sortOrder,
          isActive: !!plan.isActive,
        });
      });
  };

  useEffect(() => {
    getPlanById();
  }, []);

  return (
    <Dialog
      className="w-full"
      onClose={() => setShowEditModal(false)}
      open={showEditModal}
      maxWidth={false}
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{
        '& .MuiPaper-elevation': {
          width: '80% ',
        },
      }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !pb-6">
        <span>ویرایش پلن شارژ</span>
        <span>{planTitle}</span>
      </DialogTitle>
      <div className="grid grid-cols-4 gap-3 !py-3 px-4">
        <Input
          placeholder="عنوان"
          type="text"
          register={register}
          control={control}
          title="title"
          label="عنوان"
          width="w-full"
        />
        <Input
          placeholder="500000"
          type="number"
          register={register}
          control={control}
          title="payAmount"
          label="مبلغ پرداخت درگاه (تومان)"
          width="w-full"
        />
        <Input
          placeholder="550000"
          type="number"
          register={register}
          control={control}
          title="creditAmount"
          label="واریز به کیف‌پول (تومان)"
          width="w-full"
        />
        <Input
          placeholder="1"
          type="number"
          register={register}
          control={control}
          title="sortOrder"
          label="ترتیب نمایش"
          width="w-full"
        />
        <TextArea register={register} control={control} title="description" label="توضیحات" />
        <WalletSwitchField name="isActive" control={control} label="فعال (نمایش در سایت)" />
        <div className="col-span-4 flex justify-end mt-8">
          <Button
            title="لغو"
            active={true}
            style={SecondaryButton}
            onClick={() => setShowEditModal(false)}
          />
          <Button title="ویرایش" active={true} style={PrimaryButton} onClick={onSubmit} />
        </div>
      </div>
    </Dialog>
  );
};

export default EditWalletChargePlan;
