import React from 'react';
import { ShortLinkChannel } from '../../_models/response/shortLink/shortLink.response';
import { inputStyle } from './shortLinkConstants';
import { copyText } from './shortLinkHelpers';
import Button, { SecondaryButton } from '../../libs/button/button';

export function Field({
  label,
  hint,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-[#464F60]">
      {label}
      <input
        {...props}
        className="h-10 rounded-lg bg-white px-3 text-sm text-primary outline-none dir-ltr text-left"
        style={inputStyle}
      />
      {hint ? <span className="text-[11px] text-black-opacity-50">{hint}</span> : null}
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  loading,
  emptyHint,
}: {
  label: string;
  value: string;
  onChange: (value: ShortLinkChannel) => void;
  options: { value: ShortLinkChannel; label: string }[];
  loading?: boolean;
  emptyHint?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-[#464F60]">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ShortLinkChannel)}
        className="h-10 rounded-lg bg-white px-3 text-sm text-primary outline-none disabled:opacity-60"
        style={inputStyle}
        disabled={loading || options.length === 0}
      >
        {options.length === 0 ? (
          <option value="">{emptyHint ?? 'کانال فعالی نیست'}</option>
        ) : (
          options.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))
        )}
      </select>
      {loading ? <span className="text-[11px] text-black-opacity-50">در حال بارگذاری کانال‌ها…</span> : null}
    </label>
  );
}

export function CopyRow({ url, label = 'کپی لینک' }: { url: string; label?: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
      <code className="flex-1 rounded-lg bg-brand-soft/40 border border-card-border px-3 py-2 text-xs dir-ltr text-left break-all">
        {url}
      </code>
      <Button
        title={copied ? 'کپی شد' : label}
        active
        style={SecondaryButton}
        onClick={async () => {
          await copyText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
      />
    </div>
  );
}
