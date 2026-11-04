import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CircularProgress } from '@mui/material';
import { Input } from '../../libs/input/input';
import Button, { PrimaryButton } from '../../libs/button/button';
import logoUrl from '../../assets/images/carmacheck-logo.png';
import { normalizePhone, isValidMobile } from '../FinanceUser/financeUserHelpers';
import { financeApiError, sendFinanceOtp, verifyFinanceOtp } from './financeApi';
import { isFinanceLoggedIn } from './financeAuth';

const FinanceLogin: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { register, control, getValues, setValue } = useForm({
    defaultValues: { phoneNumber: '', code: '' },
  });
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isFinanceLoggedIn()) navigate('/finance/payments', { replace: true });
  }, [navigate]);

  const submitPhone = async () => {
    setError(null);
    const normalized = normalizePhone(getValues().phoneNumber);
    if (!isValidMobile(normalized)) {
      setError('شماره موبایل معتبر نیست.');
      return;
    }
    setLoading(true);
    try {
      await sendFinanceOtp(normalized);
      setPhone(normalized);
      setStep('code');
    } catch (err) {
      setError(financeApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const submitCode = async () => {
    setError(null);
    const otp = String(getValues().code || '').trim();
    if (otp.length < 4) {
      setError('کد یک‌بارمصرف را وارد کنید.');
      return;
    }
    setLoading(true);
    try {
      await verifyFinanceOtp(phone, otp);
      navigate('/finance/payments', { replace: true });
    } catch (err) {
      setError(financeApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center bg-surface px-4" dir="rtl">
      <div className="w-full max-w-md bg-white border border-card-border rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col items-center mb-6">
          <img src={logoUrl} alt="کارماچک" className="h-12 mb-3" />
          <h1 className="text-xl font-bold text-primary !font-peydaBold">پرتال مالی</h1>
          <p className="text-sm text-black-opacity-60 mt-2 text-center">
            ورود با شماره موبایل ثبت‌شده و کد یک‌بارمصرف
          </p>
        </div>

        {error && (
          <p className="text-sm text-mid-red bg-red-50 border border-red-100 rounded-xl px-3 py-2 mb-4">
            {error}
          </p>
        )}

        {step === 'phone' ? (
          <div className="space-y-4">
            <Input
              title="phoneNumber"
              register={register}
              control={control}
              type="text"
              placeholder="09xxxxxxxxx"
            />
            <Button
              title={loading ? 'در حال ارسال…' : 'دریافت کد'}
              active={!loading}
              style={PrimaryButton}
              onClick={submitPhone}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-black-opacity-50">کد برای {phone} ارسال شد.</p>
            <Input
              title="code"
              register={register}
              control={control}
              type="text"
              placeholder="******"
            />
            <Button
              title={loading ? '…' : 'ورود'}
              active={!loading}
              style={PrimaryButton}
              onClick={submitCode}
            />
            <button
              type="button"
              className="w-full text-sm text-brand"
              onClick={() => {
                setStep('phone');
                setValue('code', '');
              }}
            >
              تغییر شماره
            </button>
          </div>
        )}

        {loading && (
          <div className="flex justify-center mt-4">
            <CircularProgress size={28} sx={{ color: '#0237fe' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceLogin;
