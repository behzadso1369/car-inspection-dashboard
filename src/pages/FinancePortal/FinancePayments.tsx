import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';
import { useForm } from 'react-hook-form';
import { CircularProgress } from '@mui/material';
import { AG_GRID_LOCALE_FN } from '../../utils/ag-grid-localize/localize';
import { ListPageShell } from '../../components/list/ListPageShell';
import { ResponsiveDataView } from '../../components/list/ResponsiveDataView';
import { FixedPaginationBar } from '../../components/list/FixedPaginationBar';
import PaginationLib from '../../libs/pagination/pagination';
import Button, { PrimaryButton, SecondaryButton } from '../../libs/button/button';
import Input from '../../libs/input/input';
import { cardFieldsFromColDefs } from '../../utils/listCardHelpers';
import { CardAction } from '../../types/list';
import { formatToman } from '../Wallet/walletHelpers';
import { FinancePaymentRow } from '../../_models/response/payment/financePayment';
import { gatewayChipClass, gatewayLabel, paymentStatusClass } from '../Payment/paymentUiHelpers';
import { fetchFinancePayments, financeApiError } from './financeApi';
import FinanceOrderDetailDialog from './FinanceOrderDetailDialog';

type FilterForm = {
  trackId: string;
  orderId: string;
  status: string;
  from: string;
  to: string;
  gateway: '' | 'Digipay' | 'Zibal';
};

const FinancePayments: React.FunctionComponent = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [count, setCount] = useState(0);
  const [rows, setRows] = useState<FinancePaymentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [detail, setDetail] = useState<FinancePaymentRow | null>(null);

  const { register, control, getValues, reset } = useForm<FilterForm>({
    defaultValues: {
      trackId: '',
      orderId: '',
      status: '',
      from: '',
      to: '',
      gateway: '',
    },
  });

  const [filters, setFilters] = useState<FilterForm>(getValues());

  const openDetail = useCallback((row: FinancePaymentRow) => setDetail(row), []);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const f = filters;
      const orderIdNum = f.orderId.trim() ? Number(f.orderId.trim()) : '';
      const statusNum = f.status.trim() ? Number(f.status.trim()) : '';
      const { rows: data, count: total } = await fetchFinancePayments({
        pageNumber: page,
        pageSize: rowsPerPage,
        gateway: f.gateway || undefined,
        trackId: f.trackId.trim() || undefined,
        orderId: Number.isNaN(orderIdNum) ? '' : orderIdNum,
        status: Number.isNaN(statusNum) ? '' : statusNum,
        from: f.from || undefined,
        to: f.to || undefined,
      });
      setRows(data);
      setCount(total);
    } catch (err) {
      setLoadError(financeApiError(err));
      setRows([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [filters, page, rowsPerPage]);

  useEffect(() => {
    load();
  }, [load]);

  const applyFilters = () => {
    setPage(1);
    setFilters(getValues());
  };

  const clearFilters = () => {
    reset();
    setPage(1);
    setFilters({
      trackId: '',
      orderId: '',
      status: '',
      from: '',
      to: '',
      gateway: '',
    });
  };

  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      minWidth: 120,
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
    }),
    []
  );

  const columnDefs = useMemo<ColDef[]>(
    () => [
      { field: 'paymentId', headerName: 'پرداخت', maxWidth: 90, pinned: 'right', filter: false },
      {
        field: 'gatewayTitle',
        headerName: 'درگاه',
        minWidth: 110,
        cellRenderer: (p: any) => {
          const row = p.data as FinancePaymentRow;
          return (
            <span className={`text-[11px] px-2 py-0.5 rounded-full ${gatewayChipClass(row.gateway)}`}>
              {gatewayLabel(row)}
            </span>
          );
        },
      },
      {
        field: 'ticketTypeTitle',
        headerName: 'نوع خرید',
        minWidth: 100,
        valueGetter: (p) => p.data?.ticketTypeTitle || '—',
      },
      {
        field: 'amount',
        headerName: 'مبلغ',
        minWidth: 120,
        cellRenderer: (p: any) => formatToman(p.data?.amount),
      },
      { field: 'orderId', headerName: 'سفارش', maxWidth: 90 },
      { field: 'orderCode', headerName: 'کد', minWidth: 110 },
      {
        field: 'userFullName',
        headerName: 'مشتری',
        minWidth: 130,
        valueGetter: (p) => p.data?.userFullName || p.data?.userPhone || '—',
      },
      {
        field: 'statusTitle',
        headerName: 'وضعیت',
        minWidth: 120,
        cellRenderer: (p: any) => {
          const row = p.data as FinancePaymentRow;
          return (
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full ${paymentStatusClass(row.status, row.statusTitle)}`}
            >
              {row.statusTitle}
            </span>
          );
        },
      },
      {
        field: 'trackId',
        headerName: 'پیگیری / Provider',
        minWidth: 140,
        valueGetter: (p) => p.data?.trackId || p.data?.providerId || '—',
      },
      {
        field: 'paidAtPersian',
        headerName: 'زمان پرداخت',
        minWidth: 130,
        valueGetter: (p) => p.data?.paidAtPersian || p.data?.paidAt || '—',
      },
      {
        field: 'action',
        headerName: 'عملیات',
        filter: false,
        minWidth: 100,
        cellRenderer: (p: any) => (
          <button
            type="button"
            className="bg-brand text-xs py-2 rounded-md px-2 text-white"
            onClick={(e) => {
              e.stopPropagation();
              openDetail(p.data);
            }}
          >
            جزئیات
          </button>
        ),
      },
    ],
    [openDetail]
  );

  const cardFields = useMemo(
    () =>
      cardFieldsFromColDefs(columnDefs, {
        primaryField: 'gatewayTitle',
        badgeField: 'ticketTypeTitle',
        valueOverrides: {
          amount: (row) => formatToman(row.amount),
          trackId: (row) => row.trackId || row.providerId || '—',
          paidAtPersian: (row) => row.paidAtPersian || row.paidAt || '—',
          userFullName: (row) => row.userFullName || row.userPhone || '—',
        },
      }),
    [columnDefs]
  );

  const cardActions: CardAction<FinancePaymentRow>[] = useMemo(
    () => [
      {
        key: 'detail',
        label: 'جزئیات سفارش',
        onClick: openDetail,
        variant: 'primary',
      },
    ],
    [openDetail]
  );

  const overlayComponent = () => (
    <div className="bg-white flex justify-center items-center w-full h-80">
      <CircularProgress sx={{ color: '#0237fe' }} />
    </div>
  );

  const desktopView = (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-alpine w-full default-table pb-4 pt-2">
        <AgGridReact
          ref={gridRef}
          animateRows
          rowHeight={60}
          headerHeight={50}
          domLayout="autoHeight"
          rowData={rows}
          enableRtl
          defaultColDef={defaultColDef}
          columnDefs={columnDefs}
          pagination={false}
          localeText={AG_GRID_LOCALE_FN}
          loadingOverlayComponent={overlayComponent}
          onRowDoubleClicked={(e) => e.data && openDetail(e.data)}
        />
      </div>
    </div>
  );

  return (
    <>
      <ListPageShell
        title="دفتر پرداخت‌ها"
        subtitle="فقط خواندن — دیجی‌پی و زیبال. جستجو روی TrackId، ProviderId یا Ticket."
        searchSlot={
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-end">
              <div>
                <label className="text-xs text-black-opacity-50 block mb-1">درگاه</label>
                <select
                  className="w-full min-h-[40px] rounded-lg border border-card-border px-3 text-sm"
                  {...register('gateway')}
                >
                  <option value="">همه</option>
                  <option value="Digipay">دیجی‌پی</option>
                  <option value="Zibal">زیبال</option>
                </select>
              </div>
              <Input
                title="trackId"
                register={register}
                control={control}
                type="text"
                placeholder="TrackId یا ProviderId"
                label="جستجو"
              />
              <Input
                title="orderId"
                register={register}
                control={control}
                type="text"
                placeholder="شناسه سفارش"
                label="سفارش"
              />
              <Input title="status" register={register} control={control} type="text" placeholder="کد وضعیت" label="وضعیت" />
              <Input title="from" register={register} control={control} type="date" label="از تاریخ" />
              <Input title="to" register={register} control={control} type="date" label="تا تاریخ" />
            </div>
            {loadError && (
              <p className="text-sm text-mid-red bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                {loadError}
              </p>
            )}
            <div className="flex flex-wrap gap-2 justify-end">
              <Button title="پاک کردن" active style={SecondaryButton} onClick={clearFilters} />
              <Button title="اعمال فیلتر" active style={PrimaryButton} onClick={applyFilters} />
            </div>
          </div>
        }
        pagination={
          <FixedPaginationBar>
            <PaginationLib
              count={count}
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
            />
          </FixedPaginationBar>
        }
      >
        <ResponsiveDataView
          rowData={rows}
          fields={cardFields}
          actions={cardActions}
          loading={loading}
          emptyMessage="پرداختی یافت نشد"
          getRowKey={(row) => row.paymentId}
          desktopView={desktopView}
        />
      </ListPageShell>

      <FinanceOrderDetailDialog
        open={!!detail}
        onClose={() => setDetail(null)}
        orderId={detail?.orderId}
        vehicleKind={detail?.vehicleKind}
        orderCode={detail?.orderCode}
      />
    </>
  );
};

export default FinancePayments;
