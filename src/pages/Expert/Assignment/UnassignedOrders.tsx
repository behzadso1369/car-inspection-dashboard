import React, { useRef, useState, Fragment, useMemo, useCallback, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';
import { AG_GRID_LOCALE_FN } from '../../../utils/ag-grid-localize/localize';
import PaginationLib from '../../../libs/pagination/pagination';
import { useForm } from 'react-hook-form';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import QuickSearch from '../../../libs/quick-search/quick-search';
import { CircularProgress } from '@mui/material';
import moment from 'jalali-moment';
import AssignExpertModal from './AssignExpertModal';
import OrderReportDetailModal from './OrderReportDetailModal';
import { ListPageShell } from '../../../components/list/ListPageShell';
import { ResponsiveDataView } from '../../../components/list/ResponsiveDataView';
import { FixedPaginationBar } from '../../../components/list/FixedPaginationBar';
import { CardAction, CardField } from '../../../types/list';

interface UnassignedOrderAddress {
  city?: string;
  street?: string;
  lat?: number;
  lng?: number;
}

interface UnassignedOrderRow {
  assignmentId: number;
  orderId: number;
  carGroup?: string;
  locationType?: string;
  address?: UnassignedOrderAddress;
  scheduledDate?: string;
  scheduledTime?: string;
  pendingSince?: string;
}

const formatDate = (date?: string) =>
  date ? moment(date).locale('fa').format('YYYY/MM/DD') : '—';

const formatDateTime = (date?: string) =>
  date ? moment(date).locale('fa').format('YYYY/MM/DD HH:mm') : '—';

const UnassignedOrders: React.FunctionComponent = () => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [rowData, setRowData] = useState<UnassignedOrderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(0);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const allgridRef = useRef<any>();

  const { register, control, getValues } = useForm({
    defaultValues: { filterOrder: 1, search: '' },
  });

  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      minWidth: 120,
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      wrapText: true,
      autoHeight: true,
    }),
    []
  );

  const getUnassignedOrders = () => {
    setLoading(true);
    instance
      .get(ApiHelper.get('UnassignedOnSiteOrders'), {
        params: {
          pageNumber: page,
          pageSize: rowsPerPage,
        },
      })
      .then((res: any) => {
        setRowData(res?.data?.resultObject ?? []);
        setCount(res?.data?.countData ?? 0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getUnassignedOrders();
  }, [page, rowsPerPage, refreshKey]);

  const openAssign = (id: number) => {
    setOrderId(id);
    setShowAssignModal(true);
  };

  const openReport = (id: number) => {
    setOrderId(id);
    setShowReportModal(true);
  };

  const cardFields: CardField<UnassignedOrderRow>[] = useMemo(
    () => [
      {
        key: 'orderId',
        label: 'شماره سفارش',
        primary: true,
        getValue: (row) => `#${row.orderId}`,
      },
      {
        key: 'locationType',
        label: 'نوع محل',
        badge: true,
        badgeTone: () => 'info',
        getValue: (row) => row.locationType || '—',
      },
      {
        key: 'carGroup',
        label: 'خودرو',
        getValue: (row) => row.carGroup || '—',
      },
      {
        key: 'city',
        label: 'شهر',
        getValue: (row) => row.address?.city || '—',
      },
      {
        key: 'scheduledDate',
        label: 'تاریخ',
        getValue: (row) => formatDate(row.scheduledDate),
      },
      {
        key: 'scheduledTime',
        label: 'ساعت',
        getValue: (row) => row.scheduledTime?.substring?.(0, 5) || '—',
      },
      {
        key: 'pendingSince',
        label: 'در انتظار از',
        getValue: (row) => formatDateTime(row.pendingSince),
      },
      {
        key: 'street',
        label: 'آدرس',
        getValue: (row) => row.address?.street || '—',
      },
    ],
    []
  );

  const cardActions: CardAction<UnassignedOrderRow>[] = useMemo(
    () => [
      {
        key: 'assign',
        label: 'تخصیص کارشناس',
        variant: 'primary',
        onClick: (row) => openAssign(row.orderId),
      },
      {
        key: 'report',
        label: 'گزارش',
        variant: 'secondary',
        onClick: (row) => openReport(row.orderId),
      },
    ],
    []
  );

  const columnDefs: ColDef[] = [
    {
      field: 'orderId',
      headerName: 'شماره سفارش',
      sortable: true,
      pinned: 'right',
      maxWidth: 110,
      filter: false,
    },
    {
      field: 'assignmentId',
      headerName: 'شناسه اعزام',
      maxWidth: 110,
    },
    {
      field: 'carGroup',
      headerName: 'خودرو',
      minWidth: 120,
    },
    {
      field: 'locationType',
      headerName: 'نوع محل',
      minWidth: 130,
    },
    {
      field: 'address.city',
      headerName: 'شهر',
      minWidth: 100,
      valueGetter: (params) => params.data?.address?.city ?? '—',
    },
    {
      field: 'address.street',
      headerName: 'آدرس',
      minWidth: 260,
      flex: 2,
      cellRenderer: (params: any) => (
        <span className="leading-6 whitespace-normal">{params.data?.address?.street || '—'}</span>
      ),
    },
    {
      field: 'scheduledDate',
      headerName: 'تاریخ کارشناسی',
      minWidth: 130,
      cellRenderer: (params: any) => {
        const date = params.data?.scheduledDate;
        return date ? (
          <span>{moment(date).locale('fa').format('YYYY/MM/DD')}</span>
        ) : (
          <span className="text-gray-400">—</span>
        );
      },
    },
    {
      field: 'scheduledTime',
      headerName: 'ساعت',
      maxWidth: 90,
      cellRenderer: (params: any) => (
        <span>{params.data?.scheduledTime?.substring?.(0, 5) || '—'}</span>
      ),
    },
    {
      field: 'pendingSince',
      headerName: 'در انتظار از',
      minWidth: 150,
      cellRenderer: (params: any) => {
        const pendingSince = params.data?.pendingSince;
        return pendingSince ? (
          <span>{moment(pendingSince).locale('fa').format('YYYY/MM/DD HH:mm')}</span>
        ) : (
          <span className="text-gray-400">—</span>
        );
      },
    },
    {
      field: 'action',
      headerName: 'عملیات',
      filter: false,
      minWidth: 220,
      wrapText: false,
      autoHeight: false,
      cellRenderer: (params: any) => (
        <div className="flex justify-start items-center gap-2 py-2">
          <button
            className="bg-brand text-xs py-2 cursor-pointer rounded-md px-2 outline-none text-white"
            onClick={() => openAssign(params.data.orderId)}
          >
            تخصیص کارشناس
          </button>
          <button
            className="bg-gray-600 text-xs py-2 cursor-pointer rounded-md px-2 outline-none text-white"
            onClick={() => openReport(params.data.orderId)}
          >
            گزارش
          </button>
        </div>
      ),
    },
  ];

  const onFilterTextBoxChanged = useCallback(() => {
    const text = getValues().search;
    if (allgridRef.current?.api) {
      allgridRef.current.api.setGridOption('quickFilterText', text);
    }
  }, [getValues]);

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
          rowHeight={72}
          headerHeight={50}
          domLayout="autoHeight"
          rowData={rowData}
          enableRtl={true}
          defaultColDef={defaultColDef}
          columnDefs={columnDefs}
          pagination={false}
          localeText={AG_GRID_LOCALE_FN}
          loadingOverlayComponent={overlayComponent}
          getRowId={(params) => String(params.data.assignmentId ?? params.data.orderId)}
        />
      </div>
    </div>
  );

  return (
    <Fragment>
      <ListPageShell
        title="صف تخصیص کارشناس"
        subtitle="سفارش‌های کارشناسی در محل که منتظر تخصیص کارشناس هستند"
        searchSlot={
          <QuickSearch
            activeSearch={true}
            register={register}
            control={control}
            onSubmit={onFilterTextBoxChanged}
          />
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
          rowData={rowData}
          fields={cardFields}
          actions={cardActions}
          loading={loading}
          emptyMessage="سفارش تخصیص‌نشده‌ای وجود ندارد"
          getRowKey={(row) => row.assignmentId ?? row.orderId}
          desktopView={desktopView}
        />
      </ListPageShell>
      {showAssignModal && (
        <AssignExpertModal
          orderId={orderId}
          showModal={showAssignModal}
          setShowModal={setShowAssignModal}
          onAssigned={() => setRefreshKey((k) => k + 1)}
        />
      )}
      {showReportModal && (
        <OrderReportDetailModal
          orderId={orderId}
          showModal={showReportModal}
          setShowModal={setShowReportModal}
        />
      )}
    </Fragment>
  );
};

export default UnassignedOrders;
