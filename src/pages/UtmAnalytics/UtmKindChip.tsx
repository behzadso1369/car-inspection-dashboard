import { kindChipClass } from './utmAnalyticsHelpers';

export function UtmKindChip({
  kind,
  title,
}: {
  kind?: string | null;
  title?: string | null;
}) {
  const label = title || kind || 'سایر';
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-medium dir-ltr ${kindChipClass(
        kind
      )}`}
    >
      {label}
    </span>
  );
}
