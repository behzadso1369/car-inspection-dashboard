import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import Input from '../../../libs/input/input';
import Button, { PrimaryButton } from '../../../libs/button/button';
import { ListPageShell } from '../../../components/list/ListPageShell';
import { DashboardCard } from '../../../components/dashboard/DashboardCard';
import WalletSwitchField from '../WalletSwitchField';
import { toNumber } from '../walletHelpers';
import { WalletSettings } from '../../../_models/response/wallet/wallet.response';

const WalletSettingsPage: React.FunctionComponent = () => {
  const { register, control, reset, getValues } = useForm({
    defaultValues: {
      giftAmountPerOrder: 100000,
      isGiftEnabled: true,
      allowWalletPayment: true,
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<WalletSettings | null>(null);

  const loadSettings = () => {
    setLoading(true);
    instance
      .get(ApiHelper.get('WalletSettings'))
      .then((res: any) => {
        const data: WalletSettings = res?.data?.resultObject;
        if (data) {
          setSettings(data);
          reset({
            giftAmountPerOrder: data.giftAmountPerOrder,
            isGiftEnabled: !!data.isGiftEnabled,
            allowWalletPayment: !!data.allowWalletPayment,
          });
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const onSubmit = () => {
    const values = getValues();
    setSaving(true);
    instance
      .put(ApiHelper.get('WalletSettings'), {
        giftAmountPerOrder: toNumber(values.giftAmountPerOrder),
        isGiftEnabled: !!values.isGiftEnabled,
        allowWalletPayment: !!values.allowWalletPayment,
      })
      .then((res: any) => {
        if (res?.data?.isSuccess !== false) {
          loadSettings();
        }
      })
      .finally(() => setSaving(false));
  };

  return (
    <ListPageShell
      title="تنظیمات کیف‌پول"
      subtitle="هدیه سفارش و اجازه استفاده از موجودی در پرداخت. مبلغ‌ها به تومان است."
    >
      {loading ? (
        <div className="bg-white flex justify-center items-center w-full h-64 rounded-2xl border border-card-border">
          <CircularProgress />
        </div>
      ) : (
        <DashboardCard title="هدیه و پرداخت با کیف‌پول">
          <div className="grid grid-cols-4 gap-3">
            <Input
              placeholder="100000"
              type="number"
              register={register}
              control={control}
              title="giftAmountPerOrder"
              label="مبلغ پشتیبان هدیه (تومان)"
              width="w-full"
            />
            <WalletSwitchField
              name="isGiftEnabled"
              control={control}
              label="هدیه بعد از سفارش"
              hint={settings?.isGiftEnabled ? 'فعال' : 'خاموش'}
            />
            <WalletSwitchField
              name="allowWalletPayment"
              control={control}
              label="پرداخت سفارش با کیف‌پول"
              hint={settings?.allowWalletPayment ? 'فعال' : 'خاموش'}
            />
            <p className="col-span-4 text-xs text-black-opacity-60 leading-relaxed">
              مبلغ پشتیبان فقط وقتی استفاده می‌شود که قیمت کارشناسی گروه خودرو پیدا نشود.
              هدیه واقعی معمولاً از تناسب OurPrice بین ۱۰۰ تا ۵۰۰ هزار تومان است.
            </p>
            <div className="col-span-4 flex justify-end mt-2">
              <Button
                title={saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
                active={!saving}
                style={PrimaryButton}
                onClick={onSubmit}
              />
            </div>
          </div>
        </DashboardCard>
      )}
    </ListPageShell>
  );
};

export default WalletSettingsPage;
