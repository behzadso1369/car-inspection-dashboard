import React, { useEffect, useState } from 'react';
import { CircularProgress, Dialog, DialogTitle, IconButton, useMediaQuery, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AdminPaymentList from '../../components/payment/AdminPaymentList';
import { AdminPayment } from '../../_models/response/payment/adminPayment';
import {
  fetchFinanceOrderDetail,
  fetchFinanceOrderDetailByCode,
  financeApiError,
} from './financeApi';

interface FinanceOrderDetailDialogProps {
  open: boolean;
  onClose: () => void;
  orderId?: number | null;
  vehicleKind?: number | null;
  orderCode?: string | null;
}

const FinanceOrderDetailDialog: React.FunctionComponent<FinanceOrderDetailDialogProps> = ({
  open,
  onClose,
  orderId,
  vehicleKind,
  orderCode,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [meta, setMeta] = useState<{ code?: string; kind?: string; user?: string }>({});

  useEffect(() => {
    if (!open) return;
    setError(null);
    setPayments([]);
    setLoading(true);

    const load = async () => {
      try {
        let detail;
        if (orderCode?.trim()) {
          detail = await fetchFinanceOrderDetailByCode(orderCode.trim());
        } else if (orderId != null && vehicleKind != null) {
          detail = await fetchFinanceOrderDetail(orderId, vehicleKind);
        } else {
          setError('شناسه سفارش کافی نیست.');
          return;
        }
        setPayments(detail.payments ?? []);
        const order = detail.order as { code?: string; id?: number } | undefined;
        setMeta({
          code: order?.code ?? orderCode ?? undefined,
          kind: detail.vehicleKindTitle ?? undefined,
          user: detail.user?.userName || detail.user?.userPhone || undefined,
        });
      } catch (err) {
        setError(financeApiError(err));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [open, orderId, vehicleKind, orderCode]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 'min(96vw, 920px)' },
          maxWidth: '100%',
          m: { xs: 0, sm: 1.5 },
          borderRadius: { xs: 0, sm: '16px' },
          background: '#F4F6FB',
        },
      }}
    >
      <DialogTitle className="!p-0">
        <div className="flex items-start justify-between gap-3 px-4 py-3 bg-white border-b border-card-border">
          <div>
            <p className="text-base font-bold text-primary !font-peydaBold">جزئیات سفارش مالی</p>
            <p className="text-xs text-black-opacity-50 mt-1">
              {meta.code && <>کد {meta.code} · </>}
              {meta.kind}
              {meta.user && <> · {meta.user}</>}
            </p>
          </div>
          <IconButton onClick={onClose} size="small" aria-label="بستن">
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <div className="p-4 max-h-[75vh] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-16">
            <CircularProgress sx={{ color: '#0237fe' }} />
          </div>
        ) : error ? (
          <p className="text-sm text-mid-red">{error}</p>
        ) : (
          <AdminPaymentList payments={payments} />
        )}
      </div>
    </Dialog>
  );
};

export default FinanceOrderDetailDialog;
