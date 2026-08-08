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
import Dropdown from '../../../libs/dropdown/dropdown';
import { CircularProgress } from '@mui/material';
import { ListPageShell } from '../../../components/list/ListPageShell';
import { ResponsiveDataView } from '../../../components/list/ResponsiveDataView';
import { FixedPaginationBar } from '../../../components/list/FixedPaginationBar';
import { CardAction, CardField } from '../../../types/list';
import EditExpertEarning from './EditExpertEarning';
import ConfirmExpertEarning from './ConfirmExpertEarning';
import RejectExpertEarning from './RejectExpertEarning';
import {
  EXPERT_EARNING_STATUS,
  earningStatusLabel,
  earningStatusOptions,
  earningStatusTone,
  formatMoney,
  payoutTypeLabel,
} from '../expertFinance';

const ExpertEarnings: React.FunctionComponent = () => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedEarning, setSelectedEarning] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [count, setCount] = useState(0);
  const [rowData, setRowData] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<number>(-1);

  const allgridRef = useRef<any>();

  const { register, control, getValues, watch } = useForm({
    defaultValues: { filterOrder: 1, search: '', status: -1 },
  });

  const watchedStatus = Number(watch('status'));

  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      minWidth: 110,
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
    }),
    []
  );

  const getEarnings = () => {
    const params: Record<string, any> = {
      pageNumber: page,
      pageSize: rowsPerPage,
    };
    if (statusFilter >= 0) {
      params.status = statusFilter;
    }
    instance.get(ApiHelper.get('ExpertEarningList'), { params }).then((res: any) => {
      setRowData(res?.data?.resultObject ?? []);
      setCount(res?.data?.countData ?? 0);
    });
  };

  useEffect(() => {
    if (!Number.isNaN(watchedStatus) && watchedStatus !== statusFilter) {
      setPage(1);
      setStatusFilter(watchedStatus);
    }
  }, [watchedStatus]);

  useEffect(() => {
    getEarnings();
  }, [page, rowsPerPage, statusFilter, showEditModal, showConfirmModal, showRejectModal]);

  const openEdit = (row: any) => {
    setSelectedEarning(row);
    setShowEditModal(true);
  };

  const openConfirm = (row: any) => {
    setSelectedEarning(row);
    setShowConfirmModal(true);
  };

  const openReject = (row: any) => {
    setSelectedEarning(row);
    setShowRejectModal(true);
  };

  const isPending = (row: any) => row.status === EXPERT_EARNING_STATUS.PendingSettlement;

  const cardFields: CardField[] = useMemo(
    () => [
      {
        key: 'expertName',
        label: 'کارشناس',
        primary: true,
        getValue: (row) => row.expertName || '—',
      },
      {
        key: 'status',
        label: 'وضعیت',
        badge: true,
        badgeTone: (row) => earningStatusTone(row.status),
        getValue: (row) => earningStatusLabel(row.status),
      },
      {
        key: 'orderId',
        label: 'سفارش',
        getValue: (row) => `#${row.orderId}`,
      },
      {
        key: 'finalAmount',
        label: 'مبلغ نهایی',
        getValue: (row) => `${formatMoney(row.finalAmount)} ریال`,
      },
      {
        key: 'calculatedAmount',
        label: 'مبلغ محاسبه‌شده',
        getValue: (row) => `${formatMoney(row.calculatedAmount)} ریال`,
      },
      {
        key: 'payoutType',
        label: 'نوع قرارداد',
        getValue: (row) =>
          row.payoutType === 1
            ? `${payoutTypeLabel(row.payoutType)} (${row.commissionPercent ?? '—'}٪)`
            : `${payoutTypeLabel(row.payoutType)} (${formatMoney(row.fixedAmountPerOrder)})`,
      },
      {
        key: 'earnedAt',
        label: 'تاریخ ثبت',
        getValue: (row) =>
          row.earnedAt ? new Date(row.earnedAt).toLocaleString('fa-IR') : '—',
      },
    ],
    []
  );

  const cardActions: CardAction[] = useMemo(
    () => [
      {
        key: 'edit',
        label: 'ویرایش مبلغ',
        variant: 'secondary',
        hidden: (row) => !isPending(row),
        onClick: (row) => openEdit(row),
      },
      {
        key: 'confirm',
        label: 'تایید تسویه',
        variant: 'primary',
        hidden: (row) => !isPending(row),
        onClick: (row) => openConfirm(row),
      },
      {
        key: 'reject',
        label: 'رد',
        variant: 'danger',
        hidden: (row) => !isPending(row),
        onClick: (row) => openReject(row),
      },
    ],
    []
  );

  const statusBadge = (status: number) => {
    const tone =
      status === EXPERT_EARNING_STATUS.Settled
        ? 'bg-green-100 text-green-800'
        : status === EXPERT_EARNING_STATUS.Rejected
          ? 'bg-red-100 text-red-800'
          : 'bg-amber-100 text-amber-800';
    return (
      <span className={`text-xs py-1 px-2 rounded-md ${tone}`}>{earningStatusLabel(status)}</span>
    );
  };

  const columnDefs: ColDef[] = [
    {
      field: 'id',
      headerName: '#',
      sortable: true,
      pinned: 'right',
      maxWidth: 70,
      filter: false,
    },
    { field: 'expertName', headerName: 'کارشناس', minWidth: 140 },
    {
      field: 'orderId',
      headerName: 'سفارش',
      maxWidth: 100,
      cellRenderer: (params: any) => `#${params.data.orderId}`,
    },
    {
      field: 'status',
      headerName: 'وضعیت',
      minWidth: 130,
      cellRenderer: (params: any) => statusBadge(params.data.status),
    },
    {
      field: 'finalAmount',
      headerName: 'مبلغ نهایی',
      minWidth: 130,
      cellRenderer: (params: any) => formatMoney(params.data.finalAmount),
    },
    {
      field: 'calculatedAmount',
      headerName: 'محاسبه‌شده',
      minWidth: 120,
      cellRenderer: (params: any) => formatMoney(params.data.calculatedAmount),
    },
    {
      field: 'orderFinalPrice',
      headerName: 'مبلغ سفارش',
      minWidth: 120,
      cellRenderer: (params: any) => formatMoney(params.data.orderFinalPrice),
    },
    {
      field: 'payoutType',
      headerName: 'قرارداد',
      minWidth: 120,
      cellRenderer: (params: any) => payoutTypeLabel(params.data.payoutType),
    },
    {
      field: 'earnedAt',
      headerName: 'تاریخ ثبت',
      minWidth: 150,
      cellRenderer: (params: any) =>
        params.data.earnedAt
          ? new Date(params.data.earnedAt).toLocaleString('fa-IR')
          : '—',
    },
    {
      field: 'adminNote',
      headerName: 'یادداشت',
      minWidth: 140,
      cellRenderer: (params: any) => params.data.adminNote || '—',
    },
    {
      field: 'action',
      headerName: 'عملیات',
      filter: false,
      minWidth: 280,
      cellRenderer: (params: any) => {
        if (!isPending(params.data)) {
          return <span className="text-xs text-slate-400">—</span>;
        }
        return (
          <div className="flex justify-start items-center gap-2 flex-wrap">
            <button
              className="bg-yellow-500 text-xs py-2 cursor-pointer rounded-md px-2 outline-none text-black"
              onClick={() => openEdit(params.data)}
            >
              ویرایش مبلغ
            </button>
            <button
              className="bg-green-600 text-xs py-2 cursor-pointer rounded-md px-2 outline-none text-white"
              onClick={() => openConfirm(params.data)}
            >
              تایید تسویه
            </button>
            <button
              className="bg-red-500 text-xs py-2 cursor-pointer rounded-md px-2 outline-none text-white"
              onClick={() => openReject(params.data)}
            >
              رد
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

  const desktopView = (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-alpine w-full default-table pb-4 pt-2">
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
  );

  return (
    <Fragment>
      <ListPageShell
        title="درآمد کارشناسان"
        searchSlot={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_220px] gap-3 items-end">
            <QuickSearch
              activeSearch={true}
              register={register}
              control={control}
              onSubmit={onFilterTextBoxChanged}
            />
            <div className="w-full">
              <Dropdown
                optionTitle="title"
                register={register}
                control={control}
                title="status"
                label="وضعیت"
                option={earningStatusOptions}
                fullWidth={true}
              />
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
          actions={cardActions}
          emptyMessage="درآمدی ثبت نشده است"
          getRowKey={(row) => row.id}
          desktopView={desktopView}
        />
      </ListPageShell>
      {showEditModal && selectedEarning && (
        <EditExpertEarning
          earning={selectedEarning}
          showModal={showEditModal}
          setShowModal={setShowEditModal}
        />
      )}
      {showConfirmModal && selectedEarning && (
        <ConfirmExpertEarning
          earning={selectedEarning}
          showModal={showConfirmModal}
          setShowModal={setShowConfirmModal}
        />
      )}
      {showRejectModal && selectedEarning && (
        <RejectExpertEarning
          earning={selectedEarning}
          showModal={showRejectModal}
          setShowModal={setShowRejectModal}
        />
      )}
    </Fragment>
  );
};

export default ExpertEarnings;
