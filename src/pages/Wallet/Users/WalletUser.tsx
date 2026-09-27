import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import Input from '../../../libs/input/input';
import Button, { PrimaryButton, SecondaryButton } from '../../../libs/button/button';
import { ListPageShell } from '../../../components/list/ListPageShell';
import { DashboardCard, KpiCard } from '../../../components/dashboard/DashboardCard';
import { WalletBalance } from '../../../_models/response/wallet/wallet.response';
import { formatToman } from '../walletHelpers';
import AdjustWalletModal from './AdjustWalletModal';

const WalletUser: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { register, control, getValues } = useForm({
    defaultValues: {
      phoneNumber: '',
      userId: '',
    },
  });
  const [wallet, setWallet] = useState<WalletBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAdjust, setShowAdjust] = useState(false);

  const searchWallet = (params?: { phoneNumber?: string; userId?: string }) => {
    const values = params ?? getValues();
    const phoneNumber = String(values.phoneNumber || '').trim();
    const userId = String(values.userId || '').trim();
    if (!phoneNumber && !userId) return;

    const query: Record<string, string> = {};
    if (userId) query.userId = userId;
    else query.phoneNumber = phoneNumber;

    setLoading(true);
    instance
      .get(ApiHelper.get('WalletUser'), { params: query })
      .then((res: any) => {
        if (res?.data?.isSuccess === false) {
          setWallet(null);
          return;
        }
        setWallet(res?.data?.resultObject ?? null);
      })
      .catch(() => setWallet(null))
      .finally(() => setLoading(false));
  };

  return (
    <ListPageShell
      title="کیف‌پول کاربر"
      subtitle="جستجو با موبایل یا شناسه کاربر، سپس شارژ یا کسر دستی موجودی."
    >
      <DashboardCard title="جستجوی کاربر">
        <div className="grid grid-cols-4 gap-3">
          <Input
            placeholder="09125533318"
            type="text"
            register={register}
            control={control}
            title="phoneNumber"
            label="شماره موبایل"
            width="w-full"
          />
          <Input
            placeholder="USER_GUID"
            type="text"
            register={register}
            control={control}
            title="userId"
            label="شناسه کاربر"
            width="w-full"
          />
          <div className="col-span-4 flex justify-end">
            <Button
              title={loading ? 'در حال جستجو...' : 'جستجو'}
              active={!loading}
              style={PrimaryButton}
              onClick={() => searchWallet()}
            />
          </div>
        </div>
      </DashboardCard>

      {wallet && (
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <KpiCard label="موجودی" value={formatToman(wallet.balance)} tone="success" />
            <KpiCard label="شناسه کیف‌پول" value={wallet.walletId} tone="brand" />
            <KpiCard label="شناسه کاربر" value={wallet.userId} hint="برای تعدیل و تاریخچه لازم است" />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <Button
              title="تاریخچه تراکنش‌ها"
              active={true}
              style={SecondaryButton}
              onClick={() =>
                navigate(`/wallet/transactions?userId=${encodeURIComponent(wallet.userId)}`)
              }
            />
            <Button
              title="تعدیل موجودی"
              active={true}
              style={PrimaryButton}
              onClick={() => setShowAdjust(true)}
            />
          </div>
        </div>
      )}

      {showAdjust && wallet && (
        <AdjustWalletModal
          open={showAdjust}
          userId={wallet.userId}
          onClose={() => setShowAdjust(false)}
          onSuccess={() => searchWallet({ userId: wallet.userId })}
        />
      )}
    </ListPageShell>
  );
};

export default WalletUser;
