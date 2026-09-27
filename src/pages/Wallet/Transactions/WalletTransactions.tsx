import React, { useRef, useState, Fragment, useMemo, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';
import { AG_GRID_LOCALE_FN } from '../../../utils/ag-grid-localize/localize';
import PaginationLib from '../../../libs/pagination/pagination';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import Input from '../../../libs/input/input';
import Button, { PrimaryButton, SecondaryButton } from '../../../libs/button/button';
import { CircularProgress } from '@mui/material';
import { ListPageShell } from '../../../components/list/ListPageShell';
import { ResponsiveDataView } from '../../../components/list/ResponsiveDataView';
import { FixedPaginationBar } from '../../../components/list/FixedPaginationBar';
import { cardFieldsFromColDefs } from '../../../utils/listCardHelpers';
import { formatSignedToman, formatToman, txAmountClass } from '../walletHelpers';

const WalletTransactions: React.FunctionComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialUserId = searchParams.get('userId') || '';

  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [count, setCount] = useState(0);
  const [rowData, setRowData] = useState<any[]>([]);
  const [userIdFilter, setUserIdFilter] = useState(initialUserId);

  const allgridRef = useRef<any>();
  const { register, control, getValues, reset } = useForm({
    defaultValues: { userId: initialUserId },
  });

  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      minWidth: 120,
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
    }),
    []
  );

  const getTransactions = () => {
    const params: Record<string, any> = {
      pageNumber: page,
      pageSize: rowsPerPage,
    };
    if (userIdFilter) params.userId = userIdFilter;
    instance.get(ApiHelper.get('WalletTransactions'), { params }).then((res: any) => {
      setRowData(res?.data?.resultObject ?? []);
      setCount(res?.data?.countData ?? 0);
    });
  };

  useEffect(() => {
    getTransactions();
  }, [page, rowsPerPage, userIdFilter]);

  const applyFilter = () => {
    const userId = String(getValues().userId || '').trim();
    setPage(1);
    setUserIdFilter(userId);
    if (userId) setSearchParams({ userId });
    else setSearchParams({});
  };

  const clearFilter = () => {
    reset({ userId: '' });
    setPage(1);
    setUserIdFilter('');
    setSearchParams({});
  };

  const columnDefs: ColDef[] = [
    {
      field: 'id',
      headerName: '#',
      maxWidth: 80,
      pinned: 'right',
      filter: false,
    },
    {
      field: 'typeTitle',
      headerName: 'نوع',
    },
    {
      field: 'amount',
      headerName: 'مبلغ',
      cellRenderer: (params: any) => (
        <span className={txAmountClass(params.data?.amount)}>
          {formatSignedToman(params.data?.amount)}
        </span>
      ),
    },
    {
      field: 'balanceAfter',
      headerName: 'موجودی بعد',
      cellRenderer: (params: any) => formatToman(params.data?.balanceAfter),
    },
    {
      field: 'orderId',
      headerName: 'سفارش',
      cellRenderer: (params: any) => (params.data?.orderId ? `#${params.data.orderId}` : '—'),
    },
    {
      field: 'description',
      headerName: 'توضیحات',
    },
    {
      field: 'createdOn',
      headerName: 'تاریخ',
      cellRenderer: (params: any) =>
        params.data?.createdOn ? new Date(params.data.createdOn).toLocaleString('fa-IR') : '—',
    },
  ];

  const cardFields = cardFieldsFromColDefs(columnDefs, {
    primaryField: 'typeTitle',
    valueOverrides: {
      amount: (row) => formatSignedToman(row.amount),
      balanceAfter: (row) => formatToman(row.balanceAfter),
      orderId: (row) => (row.orderId ? `#${row.orderId}` : '—'),
      createdOn: (row) =>
        row.createdOn ? new Date(row.createdOn).toLocaleString('fa-IR') : '—',
    },
  });

  const overlayComponent = () => (
    <div className="bg-white flex justify-center items-center w-full h-80">
      <CircularProgress />
    </div>
  );

  const desktopView = (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-alpine w-full default-table pb-4 pt-2">
        <AgGridReact
          ref={allgridRef}
          animateRows={true}
          rowHeight={60}
          headerHeight={50}
          domLayout="autoHeight"
          rowData={rowData ?? []}
          enableRtl={true}
          suppressAggFuncInHeader={true}
          defaultColDef={defaultColDef}
          columnDefs={columnDefs}
          pagination={false}
          localeText={AG_GRID_LOCALE_FN}
          suppressColumnVirtualisation={true}
          suppressRowVirtualisation={true}
          paginationPageSize={20}
          loadingOverlayComponent={overlayComponent}
        />
      </div>
    </div>
  );

  return (
    <Fragment>
      <ListPageShell
        title="تراکنش‌های کیف‌پول"
        subtitle="بدون فیلتر، همه تراکنش‌ها نمایش داده می‌شوند. مبلغ منفی یعنی کسر از موجودی."
        searchSlot={
          <div className="grid grid-cols-4 gap-3 items-end">
            <Input
              placeholder="USER_GUID"
              type="text"
              register={register}
              control={control}
              title="userId"
              label="شناسه کاربر"
              width="w-full"
            />
            <div className="col-span-4 lg:col-span-2 flex gap-2 justify-end">
              <Button title="حذف فیلتر" active={true} style={SecondaryButton} onClick={clearFilter} />
              <Button title="اعمال فیلتر" active={true} style={PrimaryButton} onClick={applyFilter} />
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
          rowData={rowData ?? []}
          fields={cardFields}
          emptyMessage="تراکنشی یافت نشد"
          getRowKey={(row, index) => row.id ?? index}
          desktopView={desktopView}
        />
      </ListPageShell>
    </Fragment>
  );
};

export default WalletTransactions;
