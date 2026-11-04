import React, { useCallback, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AdminPayment } from '../../_models/response/payment/adminPayment';
import { formatToman } from '../../pages/Wallet/walletHelpers';
import {
  copyText,
  gatewayChipClass,
  gatewayLabel,
  isZibalGateway,
  paymentStatusClass,
  showsInstallmentBlock,
} from '../../pages/Payment/paymentUiHelpers';
import {
  deliverInstallment,
  refundInstallment,
  reverseInstallment,
} from '../../pages/Payment/installmentApi';

const dash = '—';

const Pill: React.FC<{ className: string; children: React.ReactNode }> = ({ className, children }) => (
  <span className={`inline-flex text-[11px] px-2.5 py-1 rounded-full font-medium ${className}`}>
    {children}
  </span>
);

const Copyable: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => {
  const [copied, setCopied] = useState(false);
  if (!value) return null;
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      {label}:{' '}
      <bdi className="text-primary font-medium">{value}</bdi>
      <button
        type="button"
        className="text-[10px] text-brand underline"
        onClick={async () => {
          const ok = await copyText(value);
          if (ok) {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          }
        }}
      >
        {copied ? 'کپی شد' : 'کپی'}
      </button>
    </span>
  );
};

interface AdminPaymentListProps {
  payments: AdminPayment[];
  showAdminActions?: boolean;
  onChanged?: () => void;
}

export const AdminPaymentList: React.FunctionComponent<AdminPaymentListProps> = ({
  payments,
  showAdminActions = false,
  onChanged,
}) => {
  const [busyId, setBusyId] = useState<number | null>(null);
  const [refundTarget, setRefundTarget] = useState<AdminPayment | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  const runAction = useCallback(
    async (
      paymentId: number,
      fn: () => Promise<{ isSuccess: boolean; statusMessage?: string }>
    ): Promise<boolean> => {
      setActionError(null);
      setBusyId(paymentId);
      try {
        const res = await fn();
        if (!res.isSuccess) {
          setActionError(res.statusMessage || 'عملیات ناموفق بود');
          return false;
        }
        onChanged?.();
        return true;
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { statusMessage?: string } } })?.response?.data
            ?.statusMessage || 'خطا در ارتباط با سرور';
        setActionError(msg);
        return false;
      } finally {
        setBusyId(null);
      }
    },
    [onChanged]
  );

  const openRefund = (payment: AdminPayment) => {
    setActionError(null);
    setRefundTarget(payment);
    setRefundAmount(String(payment.amount ?? ''));
  };

  const submitRefund = async () => {
    if (!refundTarget) return;
    const parsed = refundAmount.trim() ? Number(refundAmount.replace(/,/g, '')) : undefined;
    const ok = await runAction(refundTarget.id, () =>
      refundInstallment(refundTarget.id, parsed)
    );
    if (ok) setRefundTarget(null);
  };

  if (!payments.length) {
    return <p className="text-sm text-black-opacity-50">تراکنش درگاهی برای این سفارش نیست.</p>;
  }

  return (
    <div className="space-y-3">
      {actionError && (
        <p className="text-sm text-mid-red bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          {actionError}
        </p>
      )}
      {payments.map((payment) => {
        const zibal = isZibalGateway(payment);
        const installment = showsInstallmentBlock(payment);
        const busy = busyId === payment.id;

        return (
          <div key={payment.id} className="rounded-xl border border-card-border p-3 sm:p-4 bg-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-sm font-bold text-primary">{formatToman(payment.amount)}</span>
              <Pill className={paymentStatusClass(payment.status, payment.statusTitle)}>
                {payment.statusTitle || dash}
              </Pill>
              <Pill className={gatewayChipClass(payment.gateway)}>{gatewayLabel(payment)}</Pill>
              {payment.ticketTypeTitle && (
                <Pill className="bg-brand-soft text-brand">{payment.ticketTypeTitle}</Pill>
              )}
            </div>

            {payment.needsDelivery === true && (
              <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                اعلام تحویل خدمت به دیجی‌پی هنوز انجام نشده است.
                {showAdminActions && (
                  <button
                    type="button"
                    disabled={busy}
                    className="mr-2 mt-2 sm:mt-0 inline-flex min-h-[36px] items-center rounded-lg bg-amber-600 px-3 text-white text-xs disabled:opacity-50"
                    onClick={() => runAction(payment.id, () => deliverInstallment(payment.id))}
                  >
                    {busy ? '…' : 'اعلام تحویل'}
                  </button>
                )}
              </div>
            )}

            {(payment.surchargeAmount != null && payment.surchargeAmount > 0) ||
            (payment.baseAmount != null && payment.baseAmount !== payment.amount) ? (
              <div className="mb-3 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs space-y-1">
                <p className="font-bold text-primary text-sm mb-1">افزایش اقساطی</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <span>مبلغ پایه: {formatToman(payment.baseAmount)}</span>
                  <span>
                    افزایش
                    {payment.surchargePercent != null ? ` (${payment.surchargePercent}٪)` : ''}:{' '}
                    {formatToman(payment.surchargeAmount)}
                  </span>
                  <span className="font-medium text-brand">نهایی: {formatToman(payment.amount)}</span>
                </div>
              </div>
            ) : null}

            {installment && (
              <div className="mb-3 rounded-xl bg-teal-50/60 border border-teal-100 p-3 text-xs space-y-1">
                <p className="font-bold text-teal-900 text-sm mb-1">اقساط / اعتباری</p>
                {payment.fpName && <p>طرح: {payment.fpName}{payment.fpCode ? ` (${payment.fpCode})` : ''}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                  <span>پیش‌پرداخت: {formatToman(payment.prepaymentAmount)}</span>
                  <span>نقد: {formatToman(payment.cashAmount)}</span>
                  <span>اعتبار: {formatToman(payment.creditAmount)}</span>
                </div>
                {payment.deliveredAt && (
                  <p className="text-black-opacity-60 mt-1">تحویل به دیجی‌پی: {payment.deliveredAt}</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-black-opacity-70">
              <Copyable label="پیگیری" value={payment.trackId} />
              <Copyable label="ProviderId" value={payment.providerId} />
              <span>مرجع: <bdi className="text-primary">{payment.refId || dash}</bdi></span>
              <span>کارت: <bdi className="text-primary">{payment.cardNumber || dash}</bdi></span>
              <span>زمان پرداخت: {payment.paidAtPersian || payment.paidAt || dash}</span>
              {payment.ticket && (
                <span className="sm:col-span-2 break-all">
                  تیکت (پشتیبانی): <bdi className="text-primary">{payment.ticket}</bdi>
                </span>
              )}
            </div>

            {zibal && payment.paymentUrl && (
              <a
                href={payment.paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-xs text-brand font-medium"
              >
                باز کردن درگاه زیبال
              </a>
            )}

            {showAdminActions && (payment.canRefund === true || payment.canReverse === true) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {payment.canRefund === true && (
                  <button
                    type="button"
                    disabled={busy}
                    className="min-h-[36px] rounded-lg border border-red-200 bg-red-50 px-3 text-xs text-mid-red disabled:opacity-50"
                    onClick={() => openRefund(payment)}
                  >
                    استرداد
                  </button>
                )}
                {payment.canReverse === true && (
                  <button
                    type="button"
                    disabled={busy}
                    className="min-h-[36px] rounded-lg border border-orange-200 bg-orange-50 px-3 text-xs text-orange-800 disabled:opacity-50"
                    onClick={() =>
                      runAction(payment.id, () => reverseInstallment(payment.id))
                    }
                    title="فقط IPG — معمولاً تا حدود ۲۵ دقیقه پس از verify"
                  >
                    ریورس IPG
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      <Dialog open={!!refundTarget} onClose={() => setRefundTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle className="!flex !items-center !justify-between">
          <span>تایید استرداد دیجی‌پی</span>
          <IconButton size="small" onClick={() => setRefundTarget(null)} aria-label="بستن">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <p className="text-sm text-black-opacity-70 mb-3">
            مبلغ از دیجی‌پی به مشتری برمی‌گردد. برای استرداد کامل فیلد مبلغ را خالی بگذارید یا همان
            مبلغ پرداخت را بگذارید.
          </p>
          <TextField
            fullWidth
            size="small"
            label="مبلغ استرداد (تومان)"
            value={refundAmount}
            onChange={(e) => setRefundAmount(e.target.value)}
            helperText={`حداکثر: ${refundTarget ? formatToman(refundTarget.amount) : dash}`}
          />
        </DialogContent>
        <DialogActions className="!px-4 !pb-3">
          <button
            type="button"
            className="min-h-[40px] px-4 rounded-xl border border-card-border text-sm"
            onClick={() => setRefundTarget(null)}
          >
            انصراف
          </button>
          <button
            type="button"
            className="min-h-[40px] px-4 rounded-xl bg-mid-red text-white text-sm disabled:opacity-50"
            disabled={busyId != null}
            onClick={submitRefund}
          >
            تایید استرداد
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminPaymentList;
