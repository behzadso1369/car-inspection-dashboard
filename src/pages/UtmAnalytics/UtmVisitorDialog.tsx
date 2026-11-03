import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { UtmVisitRow } from '../../_models/response/utm/utmAnalytics.response';
import { formatDateTimeFa } from './utmAnalyticsHelpers';
import { UtmKindChip } from './UtmKindChip';
import { EVENT_TYPE_LABELS } from './utmAnalyticsHelpers';

export function UtmVisitorDialog({
  open,
  ipHash,
  loading,
  events,
  onClose,
}: {
  open: boolean;
  ipHash: string;
  loading: boolean;
  events: UtmVisitRow[];
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle className="flex items-center justify-between gap-2 !font-peydaBold">
        <span>
          تایم‌لاین بازدیدکننده{' '}
          <code className="text-xs bg-gray-100 px-2 py-1 rounded dir-ltr">{ipHash}</code>
        </span>
        <IconButton onClick={onClose} size="small" aria-label="بستن">
          <FontAwesomeIcon icon={faXmark} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <div className="flex justify-center py-12">
            <CircularProgress sx={{ color: '#0f766e' }} />
          </div>
        ) : events.length === 0 ? (
          <p className="text-sm text-black-opacity-60 py-6 text-center">رویدادی یافت نشد.</p>
        ) : (
          <ul className="space-y-3">
            {events.map((ev, index) => (
              <li
                key={`${ev.visitedAt}-${index}`}
                className="border border-card-border rounded-xl p-3 bg-white"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs text-black-opacity-60">
                    {formatDateTimeFa(ev.visitedAt ?? ev.createdAt)}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100">
                      {EVENT_TYPE_LABELS[ev.eventType] ?? ev.eventType}
                    </span>
                    {ev.kind && <UtmKindChip kind={ev.kind} title={ev.kindTitle} />}
                    {ev.isBot && (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                        ربات
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm dir-ltr text-left break-all text-primary">{ev.path}</p>
                {(ev.utmCampaign || ev.utmSource) && (
                  <p className="text-[11px] text-black-opacity-50 mt-2 dir-ltr text-left">
                    {[ev.utmSource, ev.utmMedium, ev.utmCampaign, ev.utmContent]
                      .filter(Boolean)
                      .join(' / ')}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
        <p className="text-[11px] text-black-opacity-45 mt-4">
          IP خام ذخیره نمی‌شود؛ فقط هش نمایش داده می‌شود. حداکثر ۵۰۰ رویداد.
        </p>
      </DialogContent>
    </Dialog>
  );
}
