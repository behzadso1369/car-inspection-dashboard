import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';
import { CircularProgress } from '@mui/material';
import { AG_GRID_LOCALE_FN } from '../../utils/ag-grid-localize/localize';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import { ListPageShell } from '../../components/list/ListPageShell';
import { ResponsiveDataView } from '../../components/list/ResponsiveDataView';
import { FixedPaginationBar } from '../../components/list/FixedPaginationBar';
import PaginationLib from '../../libs/pagination/pagination';
import { DashboardCard, KpiCard } from '../../components/dashboard/DashboardCard';
import { cardFieldsFromColDefs } from '../../utils/listCardHelpers';
import { formatSignedToman, formatToman, txAmountClass } from '../Wallet/walletHelpers';
import {
  OrderByUserOrder,
  OrderByUserPick,
  OrderByUserResult,
  OrderByUserWalletTx,
} from '../../_models/response/order/orderByUser.response';
import OrderByUserDetail from './OrderByUserDetail';
import {
  isMotorcycleOrder,
  orderInspectionName,
  orderModelName,
  VEHICLE_KIND_CAR,
  VEHICLE_KIND_MOTORCYCLE,
  vehicleKindLabel,
} from './vehicleKind';

type ActiveQuery = { search?: string; userId?: string };

const USER_TYPE: Record<string, string> = {
  Normal: 'عادی',
};

const txDate = (tx: OrderByUserWalletTx) => tx.createdOnPersian || tx.createdOn || '—';

const presentOrder = (order: OrderByUserOrder, fallbackKind: number): OrderByUserOrder => {
  const vehicleKind = order.vehicleKind ?? fallbackKind;
  const motorcycle = vehicleKind === VEHICLE_KIND_MOTORCYCLE || isMotorcycleOrder(order);
  return {
    ...order,
    vehicleKind,
    vehicleKindTitle: vehicleKindLabel(vehicleKind, order.vehicleKindTitle),
    carName: motorcycle ? orderModelName({ ...order, vehicleKind }) || order.carName : order.carName,
    inspectionType: motorcycle
      ? orderInspectionName({ ...order, vehicleKind }) || order.inspectionType
      : order.inspectionType,
  };
};

const UserOrderTable: React.FC<{
  rows: OrderByUserOrder[];
  nameHeader: string;
  emptyMessage: string;
  onOpen: (row: OrderByUserOrder) => void;
}> = ({ rows, nameHeader, emptyMessage, onOpen }) => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const columnDefs = useMemo<ColDef[]>(
    () => [
      { field: 'id', headerName: 'شناسه', maxWidth: 90, pinned: 'right', filter: false },
      { field: 'vehicleKindTitle', headerName: 'نوع', minWidth: 120 },
      { field: 'code', headerName: 'کد', minWidth: 110 },
      { field: 'createdOnPersian', headerName: 'تاریخ', minWidth: 150 },
      { field: 'carName', headerName: nameHeader, minWidth: 140 },
      { field: 'inspectionType', headerName: 'نوع کارشناسی', minWidth: 140 },
      {
        field: 'location.displayAddress',
        headerName: 'محل',
        minWidth: 180,
        valueGetter: (params) => params.data?.location?.displayAddress || '—',
      },
      {
        field: 'finalPrice',
        headerName: 'مبلغ نهایی',
        minWidth: 130,
        cellRenderer: (params: any) => formatToman(params.data?.finalPrice),
      },
      { field: 'paymentStatusTitle', headerName: 'وضعیت پرداخت', minWidth: 160 },
      { field: 'flowStateTitle', headerName: 'مرحله', minWidth: 140 },
      {
        field: 'action',
        headerName: 'عملیات',
        filter: false,
        minWidth: 120,
        cellRenderer: (params: any) => (
          <button
            type="button"
            className="bg-brand text-xs py-2 cursor-pointer rounded-md px-2 outline-none text-white"
            onClick={(event) => {
              event.stopPropagation();
              onOpen(params.data);
            }}
          >
            جزئیات
          </button>
        ),
      },
    ],
    [nameHeader, onOpen]
  );
  const cardFields = useMemo(
    () =>
      cardFieldsFromColDefs(columnDefs, {
        primaryField: 'carName',
        badgeField: 'vehicleKindTitle',
        maxBodyFields: 8,
        valueOverrides: {
          id: (row) => (row.id != null ? `#${row.id}` : '—'),
          finalPrice: (row) => formatToman(row.finalPrice),
          'location.displayAddress': (row) => row.location?.displayAddress || '—',
        },
      }),
    [columnDefs]
  );
  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      minWidth: 120,
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
    }),
    []
  );
  const desktopView = (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-alpine w-full default-table pb-4 pt-2">
        <AgGridReact
          animateRows={true}
          rowHeight={60}
          headerHeight={50}
          domLayout="autoHeight"
          rowData={rows}
          enableRtl={true}
          suppressAggFuncInHeader={true}
          defaultColDef={defaultColDef}
          columnDefs={columnDefs}
          pagination={false}
          localeText={AG_GRID_LOCALE_FN}
          suppressColumnVirtualisation={true}
          suppressRowVirtualisation={true}
          getRowId={(params) => `${params.data?.vehicleKind ?? 0}-${params.data?.id}`}
          onRowClicked={(event) => {
            if (event.data) onOpen(event.data);
          }}
        />
      </div>
    </div>
  );

  return (
    <ResponsiveDataView
      rowData={rows}
      fields={cardFields}
      actions={[
        { key: 'detail', label: 'جزئیات', variant: 'primary', onClick: (row) => onOpen(row) },
      ]}
      emptyMessage={emptyMessage}
      getRowKey={(row) => `${row.vehicleKind ?? 0}-${row.id}`}
      desktopView={desktopView}
    />
  );
};

const Order: React.FunctionComponent = () => {
  const requestId = useRef(0);
  const activeQuery = useRef<ActiveQuery | null>(null);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pickUsers, setPickUsers] = useState<OrderByUserPick[] | null>(null);
  const [dossier, setDossier] = useState<OrderByUserResult | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderByUserOrder | null>(null);

  const load = useCallback((query: ActiveQuery, pageNumber: number, pageSize: number) => {
    const id = ++requestId.current;
    setLoading(true);
    setError('');
    instance
      .get(ApiHelper.get('OrderByUser'), {
        params: {
          ...query,
          pageNumber,
          pageSize: Math.min(100, Math.max(1, pageSize)),
        },
      })
      .then((res: any) => {
        if (id !== requestId.current) return;
        if (res?.data?.isSuccess === false) {
          setDossier(null);
          setPickUsers(null);
          setCount(0);
          setError(res?.data?.statusMessage || 'جستجو ناموفق بود.');
          return;
        }
        const body = (res?.data?.resultObject ?? {}) as OrderByUserResult;
        setCount(Number(res?.data?.countData ?? 0));
        if (body.needsUserPick) {
          setPickUsers(body.users ?? []);
          setDossier(null);
          return;
        }
        setDossier(body);
      })
      .catch((err: any) => {
        if (id !== requestId.current) return;
        setDossier(null);
        setCount(0);
        setError(
          err?.response?.data?.statusMessage ||
            err?.response?.data?.message ||
            'جستجو ناموفق بود.'
        );
      })
      .finally(() => {
        if (id === requestId.current) setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!activeQuery.current) return;
    load(activeQuery.current, page, rowsPerPage);
  }, [page, rowsPerPage, load]);

  const submitSearch = (event?: React.FormEvent) => {
    event?.preventDefault();
    const text = search.trim();
    if (!text) {
      setError('شماره تماس، شناسه کاربر یا نام را وارد کنید.');
      return;
    }
    setPickUsers(null);
    setDossier(null);
    setSelectedOrder(null);
    setCount(0);
    activeQuery.current = { search: text };
    if (page !== 1) setPage(1);
    else load(activeQuery.current, 1, rowsPerPage);
  };

  const openUser = (userId: string) => {
    setSelectedOrder(null);
    setDossier(null);
    activeQuery.current = { userId };
    if (page !== 1) setPage(1);
    else load({ userId }, 1, rowsPerPage);
  };

  const backToPick = () => {
    setDossier(null);
    setSelectedOrder(null);
    setCount(0);
    activeQuery.current = null;
  };

  const orders = (dossier?.orders ?? []).map((order) => presentOrder(order, VEHICLE_KIND_CAR));
  const motorcycleOrders = (dossier?.motorcycleOrders ?? []).map((order) =>
    presentOrder(order, VEHICLE_KIND_MOTORCYCLE)
  );
  const user = dossier?.user;
  const wallet = dossier?.wallet;
  const openOrder = useCallback((row: OrderByUserOrder) => setSelectedOrder(row), []);

  return (
    <>
      <ListPageShell
        title="سفارشات پشتیبان"
        subtitle="با شماره تماس، شناسه کاربر یا نام، پرونده مشتری را باز کنید. سفارش خودرو و موتورسیکلت جدا نشان داده می‌شود."
        headerAction={
          <NavLink
            to="/support-order"
            className="bg-brand w-full sm:w-auto min-h-[44px] px-4 rounded-xl text-white flex items-center justify-center"
          >
            سفارش تلفنی جدید
          </NavLink>
        }
        searchSlot={
          <form onSubmit={submitSearch} className="flex flex-col sm:flex-row gap-2">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="شماره موبایل، شناسه کاربر یا نام"
              className="flex-1 h-10 rounded-lg bg-white px-3 text-sm text-primary outline-none border border-card-border"
            />
            <button
              type="submit"
              disabled={loading}
              className="min-h-[44px] px-5 rounded-xl bg-brand text-white text-sm font-medium disabled:opacity-60"
            >
              {loading ? 'در حال جستجو...' : 'جستجو'}
            </button>
          </form>
        }
        pagination={
          dossier ? (
            <FixedPaginationBar>
              <PaginationLib
                count={count}
                page={page}
                setPage={setPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
              />
            </FixedPaginationBar>
          ) : undefined
        }
      >
        {error && (
          <div className="mb-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && !dossier && (
          <div className="flex justify-center py-16">
            <CircularProgress sx={{ color: '#0237fe' }} />
          </div>
        )}

        {pickUsers && !dossier && !loading && (
          <DashboardCard title="انتخاب کاربر">
            {pickUsers.length === 0 ? (
              <p className="text-sm text-black-opacity-50">کاربری با این مشخصات یافت نشد.</p>
            ) : (
              <>
                <p className="text-sm text-black-opacity-60 mb-3">چند کاربر پیدا شد. یکی را انتخاب کنید.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {pickUsers.map((person) => (
                    <button
                      key={person.userId}
                      type="button"
                      onClick={() => openUser(person.userId)}
                      className="text-right rounded-xl border border-card-border bg-[#FCFCFC] p-3 hover:border-brand"
                    >
                      <p className="font-bold text-primary">{person.fullName || 'بدون نام'}</p>
                      <p className="text-sm text-black-opacity-70 mt-1" dir="ltr">
                        {person.phoneNumber || '—'}
                      </p>
                      <p className="text-xs text-black-opacity-50 mt-1">
                        {Number(person.orderCount || 0).toLocaleString('fa-IR')} سفارش
                      </p>
                    </button>
                  ))}
                </div>
              </>
            )}
          </DashboardCard>
        )}

        {dossier && user && (
          <div className="space-y-3">
            {pickUsers && (
              <button
                type="button"
                onClick={backToPick}
                className="text-sm text-brand font-medium"
              >
                بازگشت به نتایج جستجو
              </button>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <KpiCard
                label="مشتری"
                value={user.fullName || '—'}
                hint={[user.phoneNumber, user.email].filter(Boolean).join(' · ')}
                tone="brand"
              />
              <KpiCard
                label="مانده کیف‌پول"
                value={formatToman(wallet?.balance ?? 0)}
                hint={wallet?.hasWallet ? 'کیف‌پول فعال' : 'کیف‌پول ندارد'}
                tone={wallet?.hasWallet ? 'success' : 'neutral'}
              />
              <KpiCard label="عضویت" value={user.createdOnPersian || '—'} />
              <KpiCard
                label="نوع کاربر"
                value={USER_TYPE[user.userType] || user.userType || '—'}
                hint={user.phoneNumberConfirmed ? 'موبایل تأیید شده' : 'موبایل تأیید نشده'}
              />
            </div>

            <DashboardCard title="کیف‌پول">
              {!wallet?.hasWallet ? (
                <p className="text-sm text-black-opacity-50">برای این کاربر کیف‌پول ساخته نشده است.</p>
              ) : (wallet.transactions ?? []).length === 0 ? (
                <p className="text-sm text-black-opacity-50">تراکنشی ثبت نشده است.</p>
              ) : (
                <div className="overflow-auto max-h-80">
                  <table className="w-full text-sm min-w-[720px]">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b text-black-opacity-60">
                        <th className="text-right p-2 font-medium">نوع</th>
                        <th className="text-right p-2 font-medium">مبلغ</th>
                        <th className="text-right p-2 font-medium">موجودی بعد</th>
                        <th className="text-right p-2 font-medium">سفارش</th>
                        <th className="text-right p-2 font-medium">توضیحات</th>
                        <th className="text-right p-2 font-medium">تاریخ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wallet.transactions.map((tx, index) => (
                        <tr key={tx.id ?? index} className="border-b border-card-border">
                          <td className="p-2">{tx.typeTitle || '—'}</td>
                          <td className={`p-2 ${txAmountClass(tx.amount)}`}>{formatSignedToman(tx.amount)}</td>
                          <td className="p-2">{formatToman(tx.balanceAfter)}</td>
                          <td className="p-2">{tx.orderId ? `#${tx.orderId}` : '—'}</td>
                          <td className="p-2">{tx.description || '—'}</td>
                          <td className="p-2 whitespace-nowrap">{txDate(tx)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </DashboardCard>

            <DashboardCard title={`سفارش‌های خودرو (${Number(count || orders.length).toLocaleString('fa-IR')})`}>
              <UserOrderTable
                rows={orders}
                nameHeader="خودرو"
                emptyMessage="سفارش خودرویی برای این کاربر ثبت نشده است"
                onOpen={openOrder}
              />
            </DashboardCard>

            <DashboardCard
              title={`سفارش‌های موتورسیکلت (${Number(
                dossier?.motorcycleOrderCount ?? motorcycleOrders.length
              ).toLocaleString('fa-IR')})`}
            >
              <UserOrderTable
                rows={motorcycleOrders}
                nameHeader="موتور"
                emptyMessage="سفارش موتورسیکلتی برای این کاربر ثبت نشده است"
                onOpen={openOrder}
              />
            </DashboardCard>
          </div>
        )}

        {!loading && !dossier && !pickUsers && !error && (
          <div className="rounded-2xl border border-dashed border-card-border bg-white px-4 py-10 text-center text-sm text-black-opacity-50">
            شماره تماس، شناسه کاربر یا نام مشتری را جستجو کنید.
          </div>
        )}
      </ListPageShell>

      <OrderByUserDetail
        open={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  );
};

export default Order;
