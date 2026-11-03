import React, { useCallback, useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import { ListPageShell } from '../../components/list/ListPageShell';
import Input from '../../libs/input/input';
import Button, { PrimaryButton } from '../../libs/button/button';
import { formatToman } from '../Wallet/walletHelpers';
import { DigipaySettingsResult } from '../../_models/response/payment/digipaySettings.response';
import { canManageInstallmentActions } from '../../utils/auth-role';

type FormValues = { installmentSurchargePercent: string };

const DigipaySettings: React.FunctionComponent = () => {
  const canEdit = canManageInstallmentActions();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<DigipaySettingsResult | null>(null);

  const { register, control, reset, getValues } = useForm<FormValues>({
    defaultValues: { installmentSurchargePercent: '30' },
  });

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    instance
      .get(ApiHelper.get('DigipaySettings'))
      .then((res) => {
        const obj = res.data?.resultObject as DigipaySettingsResult | undefined;
        if (obj) {
          setSettings(obj);
          reset({ installmentSurchargePercent: String(obj.installmentSurchargePercent ?? 30) });
        }
      })
      .catch((err) => {
        setError(err?.response?.data?.statusMessage || 'بارگذاری تنظیمات ناموفق بود');
      })
      .finally(() => setLoading(false));
  }, [reset]);

  useEffect(() => {
    load();
  }, [load]);

  const save = () => {
    if (!canEdit) return;
    const raw = getValues().installmentSurchargePercent.trim();
    const value = Number(raw);
    if (Number.isNaN(value) || value < 0 || value > 100) {
      setError('درصد باید بین ۰ تا ۱۰۰ باشد.');
      return;
    }
    setSaving(true);
    setError(null);
    instance
      .put(ApiHelper.get('DigipaySettings'), { installmentSurchargePercent: value })
      .then((res) => {
        const obj = res.data?.resultObject as DigipaySettingsResult | undefined;
        if (obj) setSettings(obj);
        load();
      })
      .catch((err) => {
        setError(err?.response?.data?.statusMessage || 'ذخیره ناموفق بود');
      })
      .finally(() => setSaving(false));
  };

  const sample = settings?.sample;

  return (
    <ListPageShell
      title="درصد افزایش پرداخت اقساطی (دیجی‌پی)"
      subtitle="عدد سراسری روی مبلغ باقی‌مانده بعد از کیف‌پول؛ زیبال تغییر نمی‌کند. فقط Admin و SuperAdmin می‌توانند ذخیره کنند."
    >
      {loading ? (
        <div className="flex justify-center py-16">
          <CircularProgress sx={{ color: '#0237fe' }} />
        </div>
      ) : (
        <div className="max-w-lg space-y-4">
          {error && (
            <p className="text-sm text-mid-red bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <div className="bg-white border border-card-border rounded-2xl p-4">
            <Input
              title="installmentSurchargePercent"
              register={register}
              control={control}
              type="number"
              label="درصد افزایش (۰–۱۰۰)"
              placeholder="مثلاً 30"
            />
            {!canEdit && (
              <p className="text-xs text-amber-700 mt-2">نقش شما اجازه ذخیره ندارد؛ فقط مشاهده.</p>
            )}
            {canEdit && (
              <div className="mt-4">
                <Button
                  title={saving ? 'در حال ذخیره…' : 'ذخیره'}
                  active={!saving}
                  style={PrimaryButton}
                  onClick={save}
                />
              </div>
            )}
          </div>

          {sample && (
            <div className="bg-teal-50/80 border border-teal-100 rounded-2xl p-4 text-sm space-y-2">
              <p className="font-bold text-teal-900">{sample.title || 'نمونه محاسبه'}</p>
              <p className="text-black-opacity-70">{sample.displayText}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-2">
                <span>پایه: {formatToman(sample.baseAmount)}</span>
                <span>افزایش: {formatToman(sample.surchargeAmount)}</span>
                <span className="font-medium text-brand">قابل پرداخت: {formatToman(sample.payableAmount)}</span>
              </div>
            </div>
          )}

          <p className="text-xs text-black-opacity-50">
            روی هر پرداخت دیجی‌پی در جزئیات سفارش، فیلدهای baseAmount / surchargePercent / surchargeAmount /
            amount (نهایی) از API نمایش داده می‌شود.
          </p>
        </div>
      )}
    </ListPageShell>
  );
};

export default DigipaySettings;
