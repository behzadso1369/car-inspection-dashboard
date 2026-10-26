import React, { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { ListPageShell } from '../../components/list/ListPageShell';
import { DashboardCard } from '../../components/dashboard/DashboardCard';
import Button, { PrimaryButton, SecondaryButton } from '../../libs/button/button';
import { ShortLinkChannel, ShortLinkBulkItem } from '../../_models/response/shortLink/shortLink.response';
import {
  bulkShortLinksPreview,
  downloadBulkCsv,
  errorText,
} from './shortLinkApi';
import {
  normalizeCampaignInput,
  normalizeTargetPath,
  parsePhoneLines,
  validateBulkPhones,
  validateCampaign,
} from './shortLinkHelpers';
import { BULK_PHONE_LIMIT, inputStyle } from './shortLinkConstants';
import { Field, SelectField } from './ShortLinkShared';

const ShortLinkBulk: React.FunctionComponent = () => {
  const [channel, setChannel] = useState<ShortLinkChannel>('sms');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [utmContent, setUtmContent] = useState('');
  const [targetPath, setTargetPath] = useState('/');
  const [phonesText, setPhonesText] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<ShortLinkBulkItem[] | null>(null);

  const buildBody = () => {
    const campaign = normalizeCampaignInput(utmCampaign);
    const campaignErr = validateCampaign(campaign);
    if (campaignErr) return { error: campaignErr as string, body: null };

    const { phones, invalid } = parsePhoneLines(phonesText);
    if (invalid.length) {
      return {
        error: `شماره نامعتبر: ${invalid.slice(0, 5).join('، ')}${invalid.length > 5 ? '…' : ''}`,
        body: null,
      };
    }
    const phoneErr = validateBulkPhones(phones);
    if (phoneErr) return { error: phoneErr, body: null };

    return {
      error: null,
      body: {
        channel,
        utmCampaign: campaign,
        targetPath: normalizeTargetPath(targetPath),
        phones,
        ...(utmContent.trim() ? { utmContent: utmContent.trim() } : {}),
      },
    };
  };

  const onDownload = async () => {
    setFormError(null);
    setPreview(null);
    const { error, body } = buildBody();
    if (error || !body) {
      setFormError(error);
      return;
    }
    setBusy(true);
    try {
      await downloadBulkCsv(body);
    } catch (err: any) {
      setFormError(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  const onPreview = async () => {
    setFormError(null);
    setPreview(null);
    const { error, body } = buildBody();
    if (error || !body) {
      setFormError(error);
      return;
    }
    setBusy(true);
    try {
      const result = await bulkShortLinksPreview(body);
      setPreview(result.items ?? []);
    } catch (err: any) {
      setFormError(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  const { phones: parsedCount } = parsePhoneLines(phonesText);

  return (
    <ListPageShell
      title="پیامک انبوه"
      subtitle={`هر خط یک شماره ۰۹ (حداکثر ${BULK_PHONE_LIMIT} شماره). خروجی CSV برای پنل پیامک.`}
    >
      <p className="text-xs text-sky-900 bg-sky-50 border border-sky-200 rounded-xl px-3 py-2 mb-3">
        پس از دانلود CSV، فایل را در پنل پیامک آپلود کنید (ستون‌ها: phone و short_link). شماره در
        دیتابیس لینک‌ها ذخیره نمی‌شود؛ هر گیرنده کد و ref جدا دارد.
      </p>
      <DashboardCard title="تنظیمات کمپین">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField label="کانال" value={channel} onChange={setChannel} />
          <Field
            label="نام کمپین *"
            value={utmCampaign}
            onChange={(e) => setUtmCampaign(e.target.value)}
            dir="ltr"
            placeholder="aban_takhfif"
          />
          <Field
            label="utm_content (اختیاری)"
            value={utmContent}
            onChange={(e) => setUtmContent(e.target.value)}
            dir="ltr"
          />
          <Field
            label="صفحه مقصد"
            value={targetPath}
            onChange={(e) => setTargetPath(e.target.value)}
            dir="ltr"
            placeholder="/"
          />
        </div>
      </DashboardCard>

      <DashboardCard title="لیست شماره" className="mt-3">
        <label className="flex flex-col gap-1 text-xs text-[#464F60]">
          شماره‌ها (هر خط یکی)
          <textarea
            value={phonesText}
            onChange={(e) => setPhonesText(e.target.value)}
            rows={10}
            className="rounded-lg bg-white px-3 py-2 text-sm text-primary outline-none font-mono dir-ltr text-left"
            style={inputStyle}
            placeholder={'09121234567\n09129876543'}
          />
        </label>
        <p className="text-xs text-black-opacity-50 mt-2">
          {parsedCount.length.toLocaleString('fa-IR')} شماره یکتا (پس از نرمال‌سازی)
        </p>
      </DashboardCard>

      {formError ? (
        <p className="text-red-600 text-sm mt-3" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button
          title="دانلود CSV"
          active={!busy}
          style={PrimaryButton}
          onClick={onDownload}
        />
        <Button
          title="پیش‌نمایش JSON"
          active={!busy}
          style={SecondaryButton}
          onClick={onPreview}
        />
        {busy ? <CircularProgress size={22} /> : null}
      </div>

      {preview && preview.length > 0 ? (
        <DashboardCard title={`پیش‌نمایش (${preview.length})`} className="mt-3">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-card-border text-right">
                  <th className="py-2 px-2">شماره</th>
                  <th className="py-2 px-2">لینک کوتاه</th>
                  <th className="py-2 px-2">code</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((row) => (
                  <tr key={row.recipientRef} className="border-b border-card-border/60">
                    <td className="py-2 px-2 dir-ltr text-left">
                      <bdi>{row.phone}</bdi>
                    </td>
                    <td className="py-2 px-2 dir-ltr text-left text-xs break-all">{row.shortUrl}</td>
                    <td className="py-2 px-2 dir-ltr text-left">{row.code}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      ) : null}
    </ListPageShell>
  );
};

export default ShortLinkBulk;
