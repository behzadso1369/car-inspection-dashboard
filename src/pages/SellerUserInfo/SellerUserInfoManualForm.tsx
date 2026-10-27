import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ListPageShell } from '../../components/list/ListPageShell';
import { inputStyle } from '../ShortLink/shortLinkConstants';
import Button, { PrimaryButton, SecondaryButton } from '../../libs/button/button';
import { errorText, upsertSellerUserInfo } from './sellerUserInfoApi';
import { hasUpsertPayload } from './sellerUserInfoHelpers';
import { SellerUserInfoUpsertBody } from '../../_models/response/sellerUserInfo/sellerUserInfo.response';

const SellerUserInfoManualForm: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    rowNumber: '',
    car: '',
    price: '',
    mileage: '',
    model: '',
    neighborhood: '',
    phone: '',
    adUrl: '',
    description: '',
    callResult: '',
    isDealer: false,
  });

  const parseOptionalInt = (raw: string) => {
    const t = raw.trim();
    if (!t) return undefined;
    const n = Number(t.replace(/,/g, ''));
    return Number.isFinite(n) ? n : undefined;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');

    const body: SellerUserInfoUpsertBody = {
      rowNumber: parseOptionalInt(form.rowNumber) ?? null,
      car: form.car.trim() || null,
      price: parseOptionalInt(form.price) ?? null,
      mileage: parseOptionalInt(form.mileage) ?? null,
      model: form.model.trim() || null,
      neighborhood: form.neighborhood.trim() || null,
      phone: form.phone.trim() || null,
      adUrl: form.adUrl.trim() || null,
      description: form.description.trim() || null,
      callResult: form.callResult.trim() || null,
      isDealer: form.isDealer,
    };

    if (!hasUpsertPayload(body as Record<string, unknown>)) {
      setFormError('حداقل یکی از فیلدها باید مقدار داشته باشد.');
      return;
    }

    setSaving(true);
    try {
      const result = await upsertSellerUserInfo(body);
      const item = result.items?.[0];
      const msg =
        result.updated > 0
          ? 'رکورد موجود با همان adUrl به‌روزرسانی شد.'
          : 'رکورد جدید ثبت شد.';
      setSuccess(msg);
      if (item?.id) {
        window.setTimeout(() => navigate(`/divar-sellers/${item.id}`), 800);
      }
    } catch (err: any) {
      setFormError(errorText(err));
    } finally {
      setSaving(false);
    }
  };

  const field = (
    key: keyof typeof form,
    label: string,
    opts?: { ltr?: boolean; multiline?: boolean; type?: string }
  ) => (
    <label className="flex flex-col gap-1 text-xs text-[#464F60]">
      {label}
      {opts?.multiline ? (
        <textarea
          value={form[key] as string}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className="min-h-[80px] rounded-lg px-2 py-2 text-sm"
          style={inputStyle}
          dir={opts.ltr ? 'ltr' : undefined}
        />
      ) : (
        <input
          type={opts?.type || 'text'}
          value={typeof form[key] === 'boolean' ? undefined : (form[key] as string)}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className="h-9 rounded-lg px-2 text-sm"
          style={inputStyle}
          dir={opts?.ltr ? 'ltr' : undefined}
        />
      )}
    </label>
  );

  return (
    <ListPageShell
      title="ثبت / ویرایش دستی فروشنده"
      subtitle="اگر adUrl تکراری باشد همان رکورد به‌روز می‌شود؛ پیامک دوباره ارسال نمی‌شود."
      headerAction={
        <Link to="/divar-sellers/list">
          <Button title="بازگشت به لیست" active style={SecondaryButton} />
        </Link>
      }
    >
      <form
        onSubmit={onSubmit}
        className="bg-white border border-card-border rounded-2xl p-4 shadow-card space-y-4 max-w-3xl"
      >
        {formError ? <p className="text-red-700 text-sm">{formError}</p> : null}
        {success ? <p className="text-emerald-700 text-sm">{success}</p> : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {field('adUrl', 'لینک آگهی دیوار (کلید یکتا) *', { ltr: true })}
          {field('phone', 'شماره تماس', { ltr: true })}
          {field('car', 'خودرو')}
          {field('model', 'مدل / سال')}
          {field('price', 'قیمت (تومان)', { ltr: true, type: 'text' })}
          {field('mileage', 'کارکرد (کیلومتر)', { ltr: true })}
          {field('neighborhood', 'محله')}
          {field('rowNumber', 'ردیف اکسل', { ltr: true })}
        </div>

        <div className="grid grid-cols-1 gap-3">
          {field('description', 'توضیحات', { multiline: true })}
          {field('callResult', 'نتیجه تماس پشتیبانی', { multiline: true })}
        </div>

        <label className="flex items-center gap-2 text-sm text-primary cursor-pointer">
          <input
            type="checkbox"
            checked={form.isDealer}
            onChange={(e) => setForm((f) => ({ ...f, isDealer: e.target.checked }))}
          />
          نمایشگاه‌دار (isDealer)
        </label>

        <p className="text-xs text-black-opacity-50 leading-relaxed">
          اگر isDealer را در ویرایش نفرستید، سرور مقدار قبلی را نگه می‌دارد؛ در این فرم با تیک مشخص
          می‌شود.
        </p>

        <Button
          title={saving ? 'در حال ذخیره…' : 'ذخیره'}
          active={!saving}
          style={PrimaryButton}
          disableStyle={PrimaryButton}
        />
      </form>
    </ListPageShell>
  );
};

export default SellerUserInfoManualForm;
