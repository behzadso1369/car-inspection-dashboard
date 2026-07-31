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

const UnassignedOrders: React.FunctionComponent = () => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [rowData, setRowData] = useState<any>();
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
    }),
    []
  );

  const getUnassignedOrders = () => {
    instance
      .get(ApiHelper.get('UnassignedOnSiteOrders'), {
        params: { pageNumber: page, pageSize: rowsPerPage },
      })
      .then((res: any) => {
        setRowData(res?.data?.resultObject);
        setCount(res?.data?.countData);
      });
  };

  useEffect(() => {
    getUnassignedOrders();
  }, [page, rowsPerPage, refreshKey]);

  const columnDefs: ColDef[] = [
    {
      field: 'orderId',
      headerName: '#',
      sortable: true,
      pinned: 'right',
      maxWidth: 80,
      filter: false,
    },
    {
      field: 'customerName',
      headerName: 'مشتری',
      cellRenderer: (params: any) => (
        <span>{params.data.customerName || params.data.userFullName || '—'}</span>
      ),
    },
    {
      field: 'customerPhone',
      headerName: 'موبایل',
      cellRenderer: (params: any) => (
        <span>{params.data.customerPhone || params.data.phoneNumber || '—'}</span>
      ),
    },
    {
      field: 'carGroupName',
      headerName: 'خودرو',
      cellRenderer: (params: any) => (
        <span>{params.data.carGroupName || params.data.carDisplayName || '—'}</span>
      ),
    },
    {
      field: 'address',
      headerName: 'آدرس',
      cellRenderer: (params: any) => (
        <span>{params.data.address || params.data.fullAddress || '—'}</span>
      ),
    },
    {
      field: 'scheduledDate',
      headerName: 'تاریخ کارشناسی',
      cellRenderer: (params: any) => {
        const date = params.data.scheduledDate;
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
      cellRenderer: (params: any) => (
        <span>{params.data.scheduledTime?.substring?.(0, 5) || params.data.scheduledTime || '—'}</span>
      ),
    },
    {
      field: 'finalPrice',
      headerName: 'مبلغ',
      cellRenderer: (params: any) => {
        const price = params.data.finalPrice ?? params.data.price;
        return price ? <span>{price.toLocaleString()} تومان</span> : <span>—</span>;
      },
    },
    {
      field: 'action',
      headerName: 'عملیات',
      filter: false,
      minWidth: 220,
      cellRenderer: (params: any) => {
        const id = params.data.orderId ?? params.data.id;
        return (
          <div className="flex justify-start items-center gap-2">
            <button
              className="bg-[#0047bc] text-xs py-2 cursor-pointer rounded-md px-2 outline-none text-white"
              onClick={() => {
                setOrderId(id);
                setShowAssignModal(true);
              }}
            >
              تخصیص کارشناس
            </button>
            <button
              className="bg-gray-600 text-xs py-2 cursor-pointer rounded-md px-2 outline-none text-white"
              onClick={() => {
                setOrderId(id);
                setShowReportModal(true);
              }}
            >
              گزارش
            </button>
          </div>
        );
      },
    },
  ];

  const onFilterTextBoxChanged = useCallback(() => {
    allgridRef.current!.api!.setGridOption('quickFilterText', getValues().search);
  }, []);

  const overlayComponent = () => (
    <div className="bg-white flex justify-center items-center w-full h-80">
      <CircularProgress />
    </div>
  );

  return (
    <Fragment>
      <div className="bg-white border border-[#2c3c511a] rounded-xl flex items-baseline justify-between p-4 mb-3">
        <div>
          <h3 className="text-base font-bold text-primary">صف تخصیص کارشناس</h3>
          <p className="text-xs text-gray-500 mt-1">
            سفارش‌های کارشناسی در محل که منتظر تخصیص کارشناس هستند
          </p>
        </div>
      </div>
      <QuickSearch
        activeSearch={true}
        register={register}
        control={control}
        onSubmit={onFilterTextBoxChanged}
      />
      <div
        className="absolute right-0 bottom-0 bg-white w-full"
        style={{ boxShadow: '0px -2px 7px 0px rgba(0, 0, 0, 0.05)' }}
      >
        <PaginationLib
          count={count}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>
      <div style={containerStyle}>
        <div style={gridStyle} className="ag-theme-alpine w-full default-table pb-32 pt-6">
          <AgGridReact
            ref={allgridRef}
            animateRows={true}
            rowHeight={60}
            headerHeight={50}
            domLayout="autoHeight"
            rowData={rowData}
            enableRtl={true}
            defaultColDef={defaultColDef}
            columnDefs={columnDefs}
            pagination={false}
            localeText={AG_GRID_LOCALE_FN}
            loadingOverlayComponent={overlayComponent}
          />
        </div>
      </div>
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
