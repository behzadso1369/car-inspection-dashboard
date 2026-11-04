import { Control, UseFormRegister } from 'react-hook-form';
import Datepicker from '../../libs/datepicker/datepicker';
import Button, { PrimaryButton, SecondaryButton } from '../../libs/button/button';
import { UtmFilterOptions } from '../../_models/response/utm/utmAnalytics.response';
const fieldClass =
  'h-8 rounded-lg border-0 bg-white text-sm px-3 w-full shadow-[0px_0px_0px_1px_rgba(134,143,160,0.16),0px_1px_2px_0px_rgba(0,0,0,0.06)]';

export interface UtmFilterFormValues {
  fromDate: string;
  toDate: string;
  source: string;
  medium: string;
  campaign: string;
  content: string;
  eventType: string;
  path: string;
  shortCode: string;
  ref: string;
  includeBots: boolean;
}

export const defaultUtmFilterForm: UtmFilterFormValues = {
  fromDate: '',
  toDate: '',
  source: '',
  medium: '',
  campaign: '',
  content: '',
  eventType: '',
  path: '',
  shortCode: '',
  ref: '',
  includeBots: false,
};

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-black-opacity-80">{label}</label>
      <select className={fieldClass} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export function UtmAnalyticsFilters({
  register,
  control,
  setValue,
  watch,
  filterOptions,
  loading,
  onApply,
  onClear,
  compact,
}: {
  register: UseFormRegister<UtmFilterFormValues>;
  control: Control<UtmFilterFormValues>;
  setValue: (name: keyof UtmFilterFormValues, value: string | boolean) => void;
  watch: (name: keyof UtmFilterFormValues) => string | boolean;
  filterOptions: UtmFilterOptions | null;
  loading?: boolean;
  onApply: () => void;
  onClear: () => void;
  compact?: boolean;
}) {
  const includeBots = Boolean(watch('includeBots'));

  return (
    <div
      className={`grid gap-3 items-end ${
        compact
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      }`}
    >
      <Datepicker label="از تاریخ" register={register} control={control} title="fromDate" />
      <Datepicker label="تا تاریخ" register={register} control={control} title="toDate" />
      <SelectField
        label="utm_source"
        value={String(watch('source') ?? '')}
        onChange={(v) => setValue('source', v)}
        options={filterOptions?.sources ?? []}
        placeholder="همه منابع"
      />
      <SelectField
        label="utm_medium"
        value={String(watch('medium') ?? '')}
        onChange={(v) => setValue('medium', v)}
        options={filterOptions?.mediums ?? []}
        placeholder="همه medium"
      />
      <SelectField
        label="utm_campaign"
        value={String(watch('campaign') ?? '')}
        onChange={(v) => setValue('campaign', v)}
        options={filterOptions?.campaigns ?? []}
        placeholder="همه کمپین‌ها"
      />
      <SelectField
        label="utm_content"
        value={String(watch('content') ?? '')}
        onChange={(v) => setValue('content', v)}
        options={filterOptions?.contents ?? []}
        placeholder="همه content"
      />
      <SelectField
        label="نوع رویداد"
        value={String(watch('eventType') ?? '')}
        onChange={(v) => setValue('eventType', v)}
        options={filterOptions?.eventTypes ?? []}
        placeholder="همه"
      />
      <SelectField
        label="کد لینک کوتاه"
        value={String(watch('shortCode') ?? '')}
        onChange={(v) => setValue('shortCode', v)}
        options={filterOptions?.shortCodes ?? []}
        placeholder="همه"
      />
      {!compact && (
        <>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-black-opacity-80">مسیر (path)</label>
            <input className={fieldClass} {...register('path')} placeholder="مثلاً OrderSite" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-black-opacity-80">ref (پیامک انبوه)</label>
            <input className={fieldClass} {...register('ref')} placeholder="شناسه گیرنده" />
          </div>
        </>
      )}
      <label className="flex items-center gap-2 text-xs text-black-opacity-80 pb-2 cursor-pointer">
        <input
          type="checkbox"
          checked={includeBots}
          onChange={(e) => setValue('includeBots', e.target.checked)}
          className="rounded border-gray-300"
        />
        نمایش ربات‌ها (عیب‌یابی)
      </label>
      <div className="flex items-center gap-2 pb-0.5 sm:col-span-2 lg:col-span-1">
        <Button
          title="اعمال فیلتر"
          active={!loading}
          style={PrimaryButton}
          onClick={onApply}
        />
        <Button title="حذف فیلتر" active={!loading} style={SecondaryButton} onClick={onClear} />
      </div>
    </div>
  );
}
