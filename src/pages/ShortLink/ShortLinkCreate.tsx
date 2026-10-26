import React, { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { ListPageShell } from '../../components/list/ListPageShell';
import { DashboardCard } from '../../components/dashboard/DashboardCard';
import Button, { PrimaryButton } from '../../libs/button/button';
import Datepicker from '../../libs/datepicker/datepicker';
import { ShortLinkChannel, ShortLinkCreated } from '../../_models/response/shortLink/shortLink.response';
import { createShortLink, errorText } from './shortLinkApi';
import {
  normalizeCampaignInput,
  normalizeTargetPath,
  validateCampaign,
} from './shortLinkHelpers';
import { CopyRow, Field, SelectField } from './ShortLinkShared';

const ShortLinkCreate: React.FunctionComponent = () => {
  const { register, control, getValues } = useForm({
    defaultValues: { expiresAt: '' },
  });
  const [channel, setChannel] = useState<ShortLinkChannel>('sms');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [utmContent, setUtmContent] = useState('');
  const [targetPath, setTargetPath] = useState('/');
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<ShortLinkCreated | null>(null);

  const submit = async () => {
    setFormError(null);
    const campaign = normalizeCampaignInput(utmCampaign);
    const campaignErr = validateCampaign(campaign);
    if (campaignErr) {
      setFormError(campaignErr);
      return;
    }

    setBusy(true);
    try {
      const body: Record<string, unknown> = {
        channel,
        utmCampaign: campaign,
        targetPath: normalizeTargetPath(targetPath),
      };
      if (utmContent.trim()) body.utmContent = utmContent.trim();
      const expiresAt = getValues('expiresAt');
      if (expiresAt) {
        body.expiresAt = new Date(`${expiresAt}T23:59:59`).toISOString();
      }
      const result = await createShortLink(body as any);
      setCreated(result);
    } catch (err: any) {
      setFormError(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <ListPageShell
      title="ساخت لینک کوتاه"
      subtitle="کانال را انتخاب کنید؛ utm_source و utm_medium توسط سرور پر می‌شود."
    >
      <DashboardCard title="فرم ساخت">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField label="کانال" value={channel} onChange={setChannel} />
          <Field
            label="نام کمپین (utm_campaign) *"
            placeholder="aban_takhfif"
            value={utmCampaign}
            onChange={(e) => setUtmCampaign(e.target.value)}
            dir="ltr"
          />
          <Field
            label="نسخه / utm_content (اختیاری)"
            placeholder="v1"
            value={utmContent}
            onChange={(e) => setUtmContent(e.target.value)}
            dir="ltr"
          />
          <Field
            label="صفحه مقصد (path)"
            hint="فقط مسیر روی carmacheck.com — پیش‌فرض /"
            placeholder="/"
            value={targetPath}
            onChange={(e) => setTargetPath(e.target.value)}
            dir="ltr"
          />
          <div className="md:col-span-2 max-w-xs">
            <Datepicker
              label="تاریخ انقضا (اختیاری — شمسی)"
              register={register}
              control={control}
              title="expiresAt"
            />
          </div>
        </div>

        {formError ? (
          <p className="text-red-600 text-sm mt-4" role="alert">
            {formError}
          </p>
        ) : null}

        <div className="mt-4 flex items-center gap-2">
          <Button
            title={busy ? 'در حال ساخت…' : 'ساخت لینک'}
            active={!busy}
            style={PrimaryButton}
            onClick={submit}
          />
          {busy ? <CircularProgress size={22} /> : null}
        </div>
      </DashboardCard>

      {created ? (
        <DashboardCard title="لینک ساخته شد" className="mt-3">
          <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 mb-3">
            فقط <strong>لینک کوتاه</strong> را در پیامک یا تلگرام بگذارید. آدرس UTM بلند را برای
            مشتری ارسال نکنید — سرور بعد از کلیک خودش ریدایرکت می‌کند.
          </p>
          <CopyRow url={created.shortUrl} />
          <p className="text-xs text-black-opacity-60 mt-3 break-all dir-ltr text-left">
            مقصد UTM (فقط برای بررسی ادمین): {created.targetUrl}
          </p>
        </DashboardCard>
      ) : null}
    </ListPageShell>
  );
};

export default ShortLinkCreate;
