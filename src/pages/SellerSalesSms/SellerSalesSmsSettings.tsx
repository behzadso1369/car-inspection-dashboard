import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useForm, useWatch } from 'react-hook-form';
import { ListPageShell } from '../../components/list/ListPageShell';
import { DashboardCard } from '../../components/dashboard/DashboardCard';
import Button, { PrimaryButton, SecondaryButton } from '../../libs/button/button';
import WalletSwitchField from '../Wallet/WalletSwitchField';
import Input from '../../libs/input/input';
import { CopyRow, Field } from '../ShortLink/ShortLinkShared';
import { inputStyle } from '../ShortLink/shortLinkConstants';
import { listCampaigns, listShortLinks, errorText as shortLinkErrorText } from '../ShortLink/shortLinkApi';
import { ShortLinkCampaignRow, ShortLinkItem } from '../../_models/response/shortLink/shortLink.response';
import { SellerSalesSmsSettings as SettingsModel } from '../../_models/response/sellerSalesSms/sellerSalesSms.response';
import {
  errorText,
  getSellerSalesSmsSettings,
  sendSellerSalesSmsTest,
  updateSellerSalesSmsSettings,
} from './sellerSalesSmsApi';
import {
  campaignKey,
  parseCampaignKey,
  utmFieldsFromShortLink,
} from './sellerSalesSmsHelpers';
import LockedSmsPhonePreview from './LockedSmsPhonePreview';

type FormValues = {
  isEnabled: boolean;
  name: string;
  title: string;
  amount: number;
  landingPath: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
};

const SellerSalesSmsSettingsPage: React.FunctionComponent = () => {
  const { register, control, reset, getValues } = useForm<FormValues>({
    defaultValues: {
      isEnabled: true,
      name: 'کاربر',
      title: 'خودرو',
      amount: 100000,
      landingPath: 'car-inspection',
      utmSource: 'sms',
      utmMedium: 'sms',
      utmCampaign: 'seller_inspection',
      utmContent: '',
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [settings, setSettings] = useState<SettingsModel | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [testPhone, setTestPhone] = useState('');
  const [testName, setTestName] = useState('');
  const [testTitle, setTestTitle] = useState('');
  const [testError, setTestError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [campaignRows, setCampaignRows] = useState<ShortLinkCampaignRow[]>([]);
  const [campaignsError, setCampaignsError] = useState<string | null>(null);
  const [selectedCampaignKey, setSelectedCampaignKey] = useState('');
  const [campaignLinks, setCampaignLinks] = useState<ShortLinkItem[]>([]);
  const [linksLoading, setLinksLoading] = useState(false);
  const [selectedShortLinkId, setSelectedShortLinkId] = useState<number | ''>('');
  const [testShortLinkId, setTestShortLinkId] = useState<number | ''>('');

  const previewName = useWatch({ control, name: 'name' }) ?? '';
  const previewTitle = useWatch({ control, name: 'title' }) ?? '';
  const previewAmount = useWatch({ control, name: 'amount' }) ?? 0;

  const applyLinkToForm = useCallback(
    (link: ShortLinkItem) => {
      const utm = utmFieldsFromShortLink(link);
      const current = getValues();
      reset({
        ...current,
        ...utm,
      });
    },
    [getValues, reset]
  );

  const syncCampaignFromSettings = useCallback((data: SettingsModel) => {
    if (data.utmSource && data.utmMedium && data.utmCampaign) {
      setSelectedCampaignKey(
        campaignKey(data.utmSource, data.utmMedium, data.utmCampaign)
      );
    }
  }, []);

  const applySettings = useCallback(
    (data: SettingsModel) => {
      setSettings(data);
      reset({
        isEnabled: !!data.isEnabled,
        name: data.name ?? '',
        title: data.title ?? '',
        amount: data.amount ?? 0,
        landingPath: data.landingPath ?? 'car-inspection',
        utmSource: data.utmSource ?? '',
        utmMedium: data.utmMedium ?? '',
        utmCampaign: data.utmCampaign ?? '',
        utmContent: data.utmContent ?? '',
      });
      syncCampaignFromSettings(data);
      if (data.shortLinkId != null) {
        setSelectedShortLinkId(data.shortLinkId);
      }
      setTestShortLinkId('');
    },
    [reset, syncCampaignFromSettings]
  );

  const loadCampaignLinks = useCallback(
    async (key: string, preferShortUrl?: string, preferShortLinkId?: number | null) => {
      if (!key) {
        setCampaignLinks([]);
        setSelectedShortLinkId('');
        return;
      }
      const { utmCampaign, utmSource } = parseCampaignKey(key);
      setLinksLoading(true);
      try {
        const { items } = await listShortLinks({
          campaign: utmCampaign,
          source: utmSource,
          isActive: true,
          pageSize: 200,
        });
        const sorted = [...items].sort((a, b) => {
          if (a.hasRecipient !== b.hasRecipient) return a.hasRecipient ? 1 : -1;
          return b.id - a.id;
        });
        setCampaignLinks(sorted);

        let picked: ShortLinkItem | undefined;
        if (preferShortLinkId != null) {
          picked = sorted.find((l) => l.id === preferShortLinkId);
        }
        if (!picked && preferShortUrl) {
          picked = sorted.find((l) => l.shortUrl === preferShortUrl);
        }
        if (!picked && sorted.length === 1) {
          picked = sorted[0];
        }
        if (picked) {
          setSelectedShortLinkId(picked.id);
          applyLinkToForm(picked);
        }
      } catch (err: any) {
        setFormError(shortLinkErrorText(err));
      } finally {
        setLinksLoading(false);
      }
    },
    [applyLinkToForm]
  );

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setFormError(null);
    setCampaignsError(null);
    try {
      const [data, campaigns] = await Promise.all([
        getSellerSalesSmsSettings(),
        listCampaigns({}).catch((err) => {
          setCampaignsError(shortLinkErrorText(err));
          return [] as ShortLinkCampaignRow[];
        }),
      ]);
      setCampaignRows(campaigns);
      applySettings(data);
      const key = campaignKey(data.utmSource, data.utmMedium, data.utmCampaign);
      await loadCampaignLinks(key, data.shortUrl, data.shortLinkId);
    } catch (err: any) {
      setFormError(errorText(err));
    } finally {
      setLoading(false);
    }
  }, [applySettings, loadCampaignLinks]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const onCampaignChange = async (key: string) => {
    setSelectedCampaignKey(key);
    setSelectedShortLinkId('');
    await loadCampaignLinks(key);
  };

  const onShortLinkChange = (id: number | '') => {
    setSelectedShortLinkId(id);
    if (id === '') return;
    const link = campaignLinks.find((l) => l.id === id);
    if (link) applyLinkToForm(link);
  };

  const campaignOptions = useMemo(() => {
    const rows = [...campaignRows];
    if (settings?.utmCampaign) {
      const key = campaignKey(
        settings.utmSource,
        settings.utmMedium,
        settings.utmCampaign
      );
      const found = rows.some(
        (r) => campaignKey(r.utmSource, r.utmMedium, r.utmCampaign) === key
      );
      if (!found) {
        rows.unshift({
          utmSource: settings.utmSource,
          utmMedium: settings.utmMedium,
          utmCampaign: settings.utmCampaign,
          links: 0,
          totalClicks: 0,
          uniqueClicks: 0,
          reservations: 0,
          salesAmount: 0,
          conversionRate: 0,
        });
      }
    }
    return rows;
  }, [campaignRows, settings]);

  const onSave = async () => {
    setFormError(null);
    setSuccessMessage(null);
    const values = getValues();
    if (!values.utmSource.trim() || !values.utmMedium.trim() || !values.utmCampaign.trim()) {
      setFormError('utm_source، utm_medium و utm_campaign الزامی هستند.');
      return;
    }
    if (values.name.length > 25) {
      setFormError('نام مخاطب (#NAME#) حداکثر ۲۵ کاراکتر است.');
      return;
    }
    if (selectedShortLinkId === '') {
      setFormError('یک کمپین و لینک کوتاه از لیست انتخاب کنید.');
      return;
    }

    setSaving(true);
    try {
      const body = {
        isEnabled: !!values.isEnabled,
        name: values.name.trim(),
        title: values.title.trim(),
        amount: Number(values.amount),
        landingPath: values.landingPath.trim(),
        utmSource: values.utmSource.trim(),
        utmMedium: values.utmMedium.trim(),
        utmCampaign: values.utmCampaign.trim(),
        utmContent: values.utmContent.trim(),
        shortLinkId: selectedShortLinkId,
      };
      const data = await updateSellerSalesSmsSettings(body);
      applySettings(data);
      setSuccessMessage('تنظیمات ذخیره شد.');
    } catch (err: any) {
      setFormError(errorText(err));
    } finally {
      setSaving(false);
    }
  };

  const onTestSend = async () => {
    setTestError(null);
    setTestResult(null);
    const phone = testPhone.trim();
    if (!/^09\d{9}$/.test(phone)) {
      setTestError('شماره موبایل معتبر نیست — با 09 شروع‌شده و ۱۱ رقم باشد.');
      return;
    }

    setTesting(true);
    try {
      const linkId =
        testShortLinkId !== ''
          ? testShortLinkId
          : selectedShortLinkId !== ''
            ? selectedShortLinkId
            : settings?.shortLinkId;
      if (linkId == null) {
        setTestError('برای تست، یک لینک از لیست کمپین انتخاب کنید.');
        setTesting(false);
        return;
      }

      const body: { phone: string; name?: string; title?: string; shortLinkId?: number } = {
        phone,
        shortLinkId: Number(linkId),
      };
      if (testName.trim()) body.name = testName.trim();
      if (testTitle.trim()) body.title = testTitle.trim();
      const result = await sendSellerSalesSmsTest(body);
      if (result.sent) {
        setTestResult('پیامک آزمایشی ارسال شد.');
      } else {
        setTestError(result.error || `وضعیت: ${result.status}`);
      }
    } catch (err: any) {
      setTestError(errorText(err));
    } finally {
      setTesting(false);
    }
  };

  return (
    <ListPageShell
      title="پیامک کارشناسی فروش"
      subtitle="قالب sms.ir (۶۴۸۷۸۴) قفل است؛ فقط متغیرها، UTM، مسیر فرود و سوییچ را ویرایش کنید."
    >
      {loading ? (
        <div className="bg-white flex justify-center items-center w-full h-64 rounded-2xl border border-card-border">
          <CircularProgress />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <DashboardCard title="تنظیمات ارسال">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 pb-4 border-b border-card-border">
              <label className="flex flex-col gap-1 text-xs text-[#464F60] md:col-span-1">
                کمپین (از گزارش لینک کوتاه)
                <select
                  value={selectedCampaignKey}
                  onChange={(e) => onCampaignChange(e.target.value)}
                  className="h-10 rounded-lg bg-white px-3 text-sm text-primary outline-none"
                  style={inputStyle}
                >
                  <option value="">— انتخاب کمپین —</option>
                  {campaignOptions.map((row) => {
                    const key = campaignKey(row.utmSource, row.utmMedium, row.utmCampaign);
                    return (
                      <option key={key} value={key}>
                        {row.utmCampaign} ({row.utmSource}/{row.utmMedium}) — {row.links} لینک
                      </option>
                    );
                  })}
                </select>
                <span className="text-[11px] text-black-opacity-50">
                  لینک‌هایی که قبلاً در «لینک کوتاه» ساخته‌اید؛ UTM و مسیر فرود از همین انتخاب پر می‌شود.
                </span>
              </label>
              <label className="flex flex-col gap-1 text-xs text-[#464F60] md:col-span-1">
                لینک کوتاه این کمپین *
                <select
                  value={selectedShortLinkId === '' ? '' : String(selectedShortLinkId)}
                  onChange={(e) =>
                    onShortLinkChange(e.target.value ? Number(e.target.value) : '')
                  }
                  disabled={!selectedCampaignKey || linksLoading}
                  className="h-10 rounded-lg bg-white px-3 text-sm text-primary outline-none dir-ltr text-left disabled:opacity-60"
                  style={inputStyle}
                >
                  <option value="">
                    {linksLoading ? 'در حال بارگذاری…' : '— انتخاب لینک —'}
                  </option>
                  {campaignLinks.map((link) => (
                    <option key={link.id} value={link.id}>
                      {link.code} — {link.shortUrl}
                      {link.hasRecipient ? ' (شخصی)' : ''}
                    </option>
                  ))}
                </select>
              </label>
              {campaignsError ? (
                <p className="md:col-span-2 text-amber-700 text-xs">{campaignsError}</p>
              ) : null}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <WalletSwitchField
                name="isEnabled"
                control={control}
                label="فعال بودن پیامک"
                hint={settings?.isEnabled ? 'روشن — درج فروشنده جدید SMS می‌فرستد' : 'خاموش'}
              />
              <Input
                type="text"
                placeholder="کاربر"
                register={register}
                control={control}
                title="name"
                label="نام مخاطب (#NAME#)"
                width="w-full"
              />
              <Input
                type="text"
                placeholder="خودرو"
                register={register}
                control={control}
                title="title"
                label="عنوان پیش‌فرض آگهی (#TITLE#)"
                width="w-full"
              />
              <Input
                placeholder="100000"
                type="number"
                register={register}
                control={control}
                title="amount"
                label="مبلغ تخفیف (#AMOUNT#) — تومان"
                width="w-full"
              />
              <Input
                type="text"
                placeholder="car-inspection"
                register={register}
                control={control}
                title="landingPath"
                label="مسیر فرود (بدون دامنه و ?)"
                width="w-full"
              />
              <Input
                type="text"
                placeholder="sms"
                register={register}
                control={control}
                title="utmSource"
                label="utm_source *"
                width="w-full"
              />
              <Input
                type="text"
                placeholder="sms"
                register={register}
                control={control}
                title="utmMedium"
                label="utm_medium *"
                width="w-full"
              />
              <Input
                type="text"
                placeholder="seller_inspection"
                register={register}
                control={control}
                title="utmCampaign"
                label="utm_campaign *"
                width="w-full"
              />
              <Input
                type="text"
                placeholder="divar"
                register={register}
                control={control}
                title="utmContent"
                label="utm_content (اختیاری)"
                width="w-full"
              />
            </div>

            {formError ? (
              <p className="text-red-600 text-sm mt-4" role="alert">
                {formError}
              </p>
            ) : null}
            {successMessage ? (
              <p className="text-green-700 text-sm mt-4">{successMessage}</p>
            ) : null}

            <div className="flex justify-end mt-4">
              <Button
                title={saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
                active={!saving}
                style={PrimaryButton}
                onClick={onSave}
              />
            </div>
          </DashboardCard>

          {settings ? (
            <DashboardCard title="پیش‌نمایش و لینک‌ها (فقط خواندنی)">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <dt className="text-black-opacity-50 text-xs">شناسه قالب</dt>
                  <dd className="dir-ltr text-left font-medium">{settings.templateId}</dd>
                </div>
                <div>
                  <dt className="text-black-opacity-50 text-xs">عنوان قالب</dt>
                  <dd>{settings.templateTitle}</dd>
                </div>
              </dl>
              <div className="flex flex-col gap-3 mb-4">
                <span className="text-xs text-[#464F60]">مقصد کامل (landingUrl)</span>
                <CopyRow url={settings.landingUrl} label="کپی مقصد" />
                <span className="text-xs text-[#464F60]">لینک داخل پیامک (shortUrl)</span>
                <CopyRow url={settings.shortUrl} label="کپی لینک کوتاه" />
              </div>
              <LockedSmsPhonePreview
                lockedBody={settings.lockedBody}
                name={previewName}
                title={previewTitle}
                amount={Number(previewAmount)}
                smsLinkParameter={settings.smsLinkParameter}
                shortUrl={settings.shortUrl}
                templateTitle={settings.templateTitle}
              />
            </DashboardCard>
          ) : null}

          <DashboardCard title="ارسال آزمایشی">
            <p className="text-xs text-black-opacity-60 mb-4">
              مبلغ از تنظیمات ذخیره‌شده است. لینک را می‌توانی همان انتخاب بالا بگذاری یا برای این تست
              لینک دیگری از همان کمپین انتخاب کنی.
            </p>
            <label className="flex flex-col gap-1 text-xs text-[#464F60] max-w-xl mb-4">
              لینک برای این پیامک آزمایشی
              <select
                value={testShortLinkId === '' ? '' : String(testShortLinkId)}
                onChange={(e) =>
                  setTestShortLinkId(e.target.value ? Number(e.target.value) : '')
                }
                disabled={!campaignLinks.length}
                className="h-10 rounded-lg bg-white px-3 text-sm text-primary outline-none dir-ltr text-left disabled:opacity-60"
                style={inputStyle}
              >
                <option value="">— پیش‌فرض: لینک ذخیره‌شده در تنظیمات —</option>
                {campaignLinks.map((link) => (
                  <option key={link.id} value={link.id}>
                    {link.code} — {link.shortUrl}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
              <Field
                label="شماره موبایل *"
                placeholder="09120000000"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                dir="ltr"
              />
              <Field
                label="نام (اختیاری)"
                placeholder="علی"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
              />
              <Field
                label="عنوان آگهی (اختیاری)"
                placeholder="پژو 206"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
              />
            </div>
            {testError ? (
              <p className="text-red-600 text-sm mt-3" role="alert">
                {testError}
              </p>
            ) : null}
            {testResult ? <p className="text-green-700 text-sm mt-3">{testResult}</p> : null}
            <div className="mt-4">
              <Button
                title={testing ? 'در حال ارسال...' : 'ارسال پیامک آزمایشی'}
                active={!testing}
                style={SecondaryButton}
                onClick={onTestSend}
              />
            </div>
          </DashboardCard>
        </div>
      )}
    </ListPageShell>
  );
};

export default SellerSalesSmsSettingsPage;
