import React, { useMemo } from 'react';

export interface LockedSmsPhonePreviewProps {
  lockedBody: string;
  name: string;
  title: string;
  amount: number;
  smsLinkParameter?: string;
  shortUrl?: string;
  templateTitle?: string;
}

function linkTokenFromSettings(smsLinkParameter?: string, shortUrl?: string) {
  if (smsLinkParameter?.trim()) return smsLinkParameter.trim();
  if (shortUrl) {
    try {
      const u = new URL(shortUrl);
      const path = u.pathname.replace(/^\//, '');
      return path || shortUrl;
    } catch {
      return shortUrl.replace(/^https?:\/\/(www\.)?carmacheck\.com\//i, '');
    }
  }
  return 's/…';
}

export function buildSmsPreviewMessage(
  lockedBody: string,
  vars: { name: string; title: string; amount: number; linkParameter: string }
): string {
  const amountStr = Number(vars.amount || 0).toLocaleString('fa-IR');
  return lockedBody
    .replace(/\\n/g, '\n')
    .replace(/#NAME#/g, vars.name?.trim() || 'کاربر')
    .replace(/#TITLE#/g, vars.title?.trim() || 'خودرو')
    .replace(/#AMOUNT#/g, amountStr)
    .replace(/#LINK#/g, vars.linkParameter);
}

function MessageLine({ line }: { line: string }) {
  const trimmed = line.trim();
  if (!trimmed) return <span className="block h-2" aria-hidden />;

  const urlMatch = trimmed.match(/(carmacheck\.com\/\S+)/i);
  if (urlMatch) {
    const [urlPart] = urlMatch;
    const [before, after] = trimmed.split(urlPart);
    return (
      <p className="text-[15px] leading-[1.65] text-[#1c1c1e] whitespace-pre-wrap break-words">
        {before}
        <span className="text-[#007aff] font-medium dir-ltr inline-block">{urlPart}</span>
        {after}
      </p>
    );
  }

  if (trimmed.includes('تخفیف') || trimmed.includes('🎁')) {
    return (
      <p className="text-[15px] leading-[1.65] text-[#1c1c1e] font-semibold bg-gradient-to-l from-emerald-50/90 to-transparent -mx-1 px-1 rounded-lg">
        {line}
      </p>
    );
  }

  if (/^✅/.test(trimmed)) {
    return (
      <p className="text-[14px] leading-[1.6] text-[#3a3a3c] pr-0.5">{line}</p>
    );
  }

  return (
    <p className="text-[15px] leading-[1.65] text-[#1c1c1e] whitespace-pre-wrap">{line}</p>
  );
}

const LockedSmsPhonePreview: React.FunctionComponent<LockedSmsPhonePreviewProps> = ({
  lockedBody,
  name,
  title,
  amount,
  smsLinkParameter,
  shortUrl,
  templateTitle,
}) => {
  const linkParameter = linkTokenFromSettings(smsLinkParameter, shortUrl);

  const message = useMemo(
    () =>
      buildSmsPreviewMessage(lockedBody, {
        name,
        title,
        amount,
        linkParameter,
      }),
    [lockedBody, name, title, amount, linkParameter]
  );

  const lines = message.split('\n');
  const nowLabel = useMemo(() => {
    try {
      return new Intl.DateTimeFormat('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date());
    } catch {
      return 'اکنون';
    }
  }, []);

  return (
    <div className="mt-2">
      <p className="text-xs text-black-opacity-50 mb-4 text-center sm:text-right">
        پیش‌نمایش زنده با مقادیر فعلی فرم — متن قالب در sms.ir قفل است
      </p>
      <div className="flex justify-center">
        <div
          className="relative w-[min(100%,300px)] rounded-[2.25rem] p-[10px] shadow-[0_24px_60px_-12px_rgba(15,23,42,0.35),0_0_0_1px_rgba(255,255,255,0.08)_inset]"
          style={{
            background: 'linear-gradient(145deg, #2d2d2f 0%, #1a1a1c 45%, #0d0d0f 100%)',
          }}
        >
          <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-[88px] h-[26px] bg-black rounded-full z-20 shadow-inner" />

          <div className="relative overflow-hidden rounded-[1.65rem] bg-[#e5e5ea] min-h-[420px] flex flex-col">
            <div
              className="absolute inset-0 opacity-[0.35] pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 80% 50% at 50% -10%, #a8c7fa 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, #c4b5fd 0%, transparent 45%)',
              }}
            />

            <div className="relative z-10 flex items-center justify-between px-5 pt-3 pb-1 text-[11px] font-semibold text-[#1c1c1e]">
              <span className="tabular-nums">{nowLabel}</span>
              <div className="flex items-center gap-1 opacity-80">
                <span className="w-4 h-2 rounded-sm border border-[#1c1c1e]/40 relative">
                  <span className="absolute inset-[2px] right-[3px] bg-[#1c1c1e]/70 rounded-[1px]" />
                </span>
              </div>
            </div>

            <header className="relative z-10 flex items-center gap-2 px-3 py-2.5 bg-[#f2f2f7]/95 backdrop-blur-md border-b border-black/5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0f766e] to-[#14b8a6] flex items-center justify-center text-white text-xs font-bold shadow-md shrink-0">
                ک
              </div>
              <div className="flex-1 min-w-0 text-right">
                <p className="text-sm font-bold text-[#1c1c1e] truncate">کارماچک</p>
                <p className="text-[10px] text-[#8e8e93] truncate">
                  {templateTitle ?? 'پیامک اطلاع‌رسانی'}
                </p>
              </div>
              <span className="text-[10px] text-[#8e8e93] dir-ltr shrink-0">02191090283</span>
            </header>

            <div className="relative z-10 flex-1 px-3 py-4 overflow-y-auto">
              <p className="text-[10px] text-center text-[#8e8e93] mb-3">امروز</p>
              <div className="flex justify-start">
                <div className="max-w-[92%] relative group">
                  <div
                    className="rounded-[20px] rounded-br-md px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-white/80"
                    style={{
                      background: 'linear-gradient(180deg, #ffffff 0%, #f9f9fb 100%)',
                    }}
                  >
                    <div className="space-y-1">{lines.map((line, i) => (
                        <MessageLine key={`${i}-${line.slice(0, 12)}`} line={line} />
                      ))}</div>
                  </div>
                  <p className="text-[10px] text-[#8e8e93] mt-1.5 mr-1">{nowLabel}</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 px-3 py-2 bg-[#f2f2f7]/90 border-t border-black/5">
              <div className="h-9 rounded-full bg-white/90 border border-black/5 flex items-center px-4">
                <span className="text-xs text-[#c7c7cc]">پیامک</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockedSmsPhonePreview;
