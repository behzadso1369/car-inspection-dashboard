import React from 'react';
import { Link } from 'react-router-dom';
import { ListPageShell } from '../../components/list/ListPageShell';
import { DashboardCard } from '../../components/dashboard/DashboardCard';

const FLOW_STEPS = [
  'ادمین در پنل لینک می‌سازد → مثلاً https://carmacheck.com/s/ab12',
  'لینک در پیامک، تلگرام یا استوری قرار می‌گیرد',
  'مشتری لینک را باز می‌کند → nginx مسیر /s/ را به API می‌دهد',
  'API کلیک را ثبت می‌کند، کوکی ck_utm می‌گذارد، با 302 به مقصد + UTM هدایت می‌کند',
  'مشتری در سایت می‌چرخد (صفحات بعدی UTM ندارند؛ کوکی می‌ماند)',
  'Create سفارش بدون فیلد UTM → سرور از کوکی یا آخرین کلیک همان مرورگر کمپین را روی سفارش می‌گذارد',
  'بعد از پرداخت، در گزارش کمپین «فروش» به‌روز می‌شود',
];

const METRICS = [
  {
    key: 'totalClicks',
    label: 'کلیک کل',
    meaning: 'همهٔ باز شدن‌ها، شامل پیش‌نمایش تلگرام و ربات‌ها',
  },
  {
    key: 'uniqueClicks',
    label: 'کلیک یکتا',
    meaning: 'انسان واقعی؛ IP تکراری یک بار — معیار درست کمپین',
  },
  {
    key: 'reservations',
    label: 'رزرو',
    meaning: 'سفارش خودرو + موتور با همان UTM (عمومی) یا Ref (لینک شخصی)',
  },
  {
    key: 'salesAmount',
    label: 'فروش',
    meaning: 'فقط سفارش‌های با پرداخت تأییدشده (Price − Discount)',
  },
  {
    key: 'conversionRate',
    label: 'نرخ تبدیل',
    meaning: 'رزرو ÷ کلیک یکتا × ۱۰۰ (در گزارش کمپین)',
  },
];

const INVALID_BEHAVIOR = [
  { case: 'کد وجود ندارد (/s/zzzz)', behavior: '302 به صفحهٔ اصلی — بدون صفحه خطا' },
  { case: 'لینک خاموش (deactivate)', behavior: 'همان — به خانه' },
  { case: 'expiresAt گذشته', behavior: 'همان — به خانه' },
];

const ACCEPTANCE = [
  'ساخت لینک → کپی shortUrl → باز در مرورگر → 302 با utm و یک کلیک در لیست',
  'باز با User-Agent ربات (مثلاً تلگرام) → uniqueClicks زیاد نشود',
  'کد نامعتبر → خانهٔ سایت',
  'کلیک لینک → چرخش در سایت → Create بدون UTM → UtmCampaign روی سفارش',
  'Bulk دو شماره → CSV دو خط؛ در DB شماره خام ذخیره نمی‌شود',
  'deactivate → لینک قبلی به خانه',
];

const ShortLinkFlow: React.FunctionComponent = () => {
  return (
    <ListPageShell
      title="روند لینک کوتاه"
      subtitle="از ساخت در پنل تا کلیک مشتری، رزرو و گزارش — فرانت سایت مشتری تغییری نمی‌خواهد."
    >
      <DashboardCard title="نمودار روند (۷ قدم)">
        <ol className="space-y-2 text-sm leading-relaxed pr-1">
          {FLOW_STEPS.map((step, i) => (
            <li
              key={i}
              className="rounded-xl bg-brand-soft/50 border border-card-border px-3 py-2.5 list-none relative pr-8"
            >
              <span className="absolute right-3 top-2.5 text-brand font-bold text-xs">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </DashboardCard>

      <DashboardCard title="نقش‌ها" className="mt-3">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#f7fafc] border-b border-card-border text-right">
                <th className="py-2 px-3">نقش</th>
                <th className="py-2 px-3">کار</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-card-border/70">
                <td className="py-2 px-3">ادمین پنل</td>
                <td className="py-2 px-3">
                  ساخت لینک، CSV انبوه، گزارش، خاموش کردن — فقط{' '}
                  <code className="text-xs bg-gray-100 px-1 rounded dir-ltr">/api/admin/short-links*</code>
                </td>
              </tr>
              <tr className="border-b border-card-border/70">
                <td className="py-2 px-3">مشتری</td>
                <td className="py-2 px-3">
                  <code className="text-xs bg-gray-100 px-1 rounded dir-ltr">GET /s/{'{code}'}</code>{' '}
                  سپس رزرو معمولی
                </td>
              </tr>
              <tr className="border-b border-card-border/70">
                <td className="py-2 px-3">ربات تلگرام / واتساپ</td>
                <td className="py-2 px-3">
                  پیش‌نمایش با is_bot=true — در کلیک یکتا شمرده نمی‌شود
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </DashboardCard>

      <DashboardCard title="لینک عمومی vs یکتا (پیامک)" className="mt-3">
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="rounded-xl border border-card-border p-3">
            <p className="font-bold text-primary mb-2">مثال ۱ — یک لینک برای همه</p>
            <p className="text-black-opacity-70 mb-2">
              از{' '}
              <Link to="/utm/short-link/create" className="text-brand underline">
                ساخت لینک
              </Link>{' '}
              با channel=sms و کمپین aban_takhfif. فقط <bdi>shortUrl</bdi> را در پیامک بگذارید؛{' '}
              <bdi>targetUrl</bdi> را برای مشتری نفرستید.
            </p>
            <p className="text-xs text-black-opacity-50">
              رزرو: UtmCampaign روی سفارش؛ Ref خالی.
            </p>
          </div>
          <div className="rounded-xl border border-card-border p-3">
            <p className="font-bold text-primary mb-2">مثال ۲ — لینک برای هر شماره</p>
            <p className="text-black-opacity-70 mb-2">
              از{' '}
              <Link to="/utm/short-link/bulk" className="text-brand underline">
                پیامک انبوه
              </Link>{' '}
              CSV با ستون‌های phone و short_link را مستقیم در پنل پیامک آپلود کنید.
            </p>
            <p className="text-xs text-black-opacity-50">
              هر کلیک ref جدا دارد؛ در لیست hasRecipient=true و رزرو همان ردیف مچ می‌شود.
            </p>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard title="معنی اعداد در لیست و گزارش" className="mt-3">
        <ul className="space-y-2 text-sm">
          {METRICS.map((m) => (
            <li key={m.key} className="flex flex-col sm:flex-row sm:gap-2 border-b border-card-border/50 pb-2">
              <span className="font-medium text-brand shrink-0 sm:w-28">{m.label}</span>
              <span className="text-black-opacity-70">{m.meaning}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-4">
          اتریبیوشن <strong>last-click</strong> است: اگر بعد از SMS کاربر از اینستا بیاید، سفارش مال
          اینستاگرام می‌شود. UTM قبلی تا ۳۰ روز (کوکی ck_utm) می‌ماند.
        </p>
      </DashboardCard>

      <DashboardCard title="کد نامعتبر یا لینک خاموش" className="mt-3">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#f7fafc] border-b border-card-border text-right">
              <th className="py-2 px-3">حالت</th>
              <th className="py-2 px-3">رفتار</th>
            </tr>
          </thead>
          <tbody>
            {INVALID_BEHAVIOR.map((row) => (
              <tr key={row.case} className="border-b border-card-border/70">
                <td className="py-2 px-3">{row.case}</td>
                <td className="py-2 px-3">{row.behavior}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-black-opacity-60 mt-3">
          خاموش کردن از{' '}
          <Link to="/utm/short-link/list" className="text-brand underline">
            لیست لینک‌ها
          </Link>{' '}
          — پیامک‌های قبلی با همان آدرس به خانه می‌روند.
        </p>
      </DashboardCard>

      <DashboardCard title="حریم خصوصی" className="mt-3">
        <p className="text-sm text-black-opacity-70">
          شماره موبایل در جدول لینک‌ها ذخیره نمی‌شود (فقط هش). IP خام در link_clicks نیست. CSV
          انبوه فقط برای خروجی به پنل پیامک است.
        </p>
      </DashboardCard>

      <DashboardCard title="تست پذیرش (۶ مورد)" className="mt-3">
        <ol className="text-sm space-y-2 pr-4 list-decimal">
          {ACCEPTANCE.map((item) => (
            <li key={item} className="text-black-opacity-80">
              {item}
            </li>
          ))}
        </ol>
        <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 mt-4">
          برای تست واقعی روی دامنه، nginx باید <code className="dir-ltr text-[11px]">/s/</code> را
          به API پروکسی کند. تا قبل از آن می‌توانید{' '}
          <code className="dir-ltr text-[11px]">https://api.carmacheck.com/s/ab12</code> را مستقیم
          باز کنید.
        </p>
      </DashboardCard>
    </ListPageShell>
  );
};

export default ShortLinkFlow;
