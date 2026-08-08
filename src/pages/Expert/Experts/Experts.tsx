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
import CreateExpert from './CreateExpert';
import EditExpert from './EditExpert';
import DeleteExpert from './DeleteExpert';
import ExpertCoverageAreas from './ExpertCoverageAreas';
import { ListPageShell } from '../../../components/list/ListPageShell';
import { ResponsiveDataView } from '../../../components/list/ResponsiveDataView';
import { FixedPaginationBar } from '../../../components/list/FixedPaginationBar';
import { CardAction, CardField } from '../../../types/list';
import { formatMoney, payoutTypeLabel } from '../expertFinance';

const Experts: React.FunctionComponent = () => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCoverageModal, setShowCoverageModal] = useState(false);
  const [expertId, setExpertId] = useState(0);
  const [expertName, setExpertName] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [rowData, setRowData] = useState<any>();

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

  const getAllExperts = () => {
    instance
      .get(ApiHelper.get('ExpertList'), { params: { pageNumber: page, pageSize: rowsPerPage } })
      .then((res: any) => {
        setRowData(res?.data?.resultObject);
        setCount(res?.data?.countData);
      });
  };

  useEffect(() => {
    getAllExperts();
  }, [page, rowsPerPage, showAddModal, showDeleteModal, showEditModal]);

  const openCoverage = (row: any) => {
    setExpertId(row.id);
    setExpertName(row.fullName);
    setShowCoverageModal(true);
  };

  const openEdit = (row: any) => {
    setExpertId(row.id);
    setExpertName(row.fullName);
    setShowEditModal(true);
  };

  const openDelete = (row: any) => {
    setExpertId(row.id);
    setExpertName(row.fullName);
    setShowDeleteModal(true);
  };

  const cardFields: CardField[] = useMemo(
    () => [
      {
        key: 'fullName',
        label: 'نام کامل',
        primary: true,
        getValue: (row) => row.fullName || '—',
      },
      {
        key: 'isActive',
        label: 'وضعیت',
        badge: true,
        badgeTone: (row) => (row.isActive ? 'success' : 'default'),
        getValue: (row) => (row.isActive ? 'فعال' : 'غیرفعال'),
      },
      {
        key: 'phoneNumber',
        label: 'موبایل',
        getValue: (row) => row.phoneNumber || '—',
      },
      {
        key: 'nationalCode',
        label: 'کد ملی',
        getValue: (row) => row.nationalCode || '—',
      },
      {
        key: 'baseCity',
        label: 'شهر پایگاه',
        getValue: (row) => row.baseCity || '—',
      },
      {
        key: 'payoutType',
        label: 'قرارداد مالی',
        getValue: (row) => {
          if (row.payoutType === 1) {
            return `درصدی (${row.commissionPercent ?? '—'}٪)`;
          }
          if (row.payoutType === 2) {
            return `ثابت (${formatMoney(row.fixedAmountPerOrder)})`;
          }
          return payoutTypeLabel(row.payoutType);
        },
      },
    ],
    []
  );

  const cardActions: CardAction[] = useMemo(
    () => [
      {
        key: 'coverage',
        label: 'محدوده پوشش',
        variant: 'primary',
        onClick: (row) => openCoverage(row),
      },
      {
        key: 'edit',
        label: 'ویرایش',
        variant: 'secondary',
        onClick: (row) => openEdit(row),
      },
      {
        key: 'delete',
        label: 'حذف',
        variant: 'danger',
        onClick: (row) => openDelete(row),
      },
    ],
    []
  );

  const columnDefs: ColDef[] = [
    {
      field: 'id',
      headerName: '#',
      sortable: true,
      pinned: 'right',
      maxWidth: 80,
      filter: false,
    },
    { field: 'fullName', headerName: 'نام کامل' },
    { field: 'phoneNumber', headerName: 'موبایل' },
    { field: 'nationalCode', headerName: 'کد ملی' },
    { field: 'baseCity', headerName: 'شهر پایگاه' },
    {
      field: 'payoutType',
      headerName: 'قرارداد مالی',
      minWidth: 140,
      cellRenderer: (params: any) => {
        if (params.data.payoutType === 1) {
          return `درصدی (${params.data.commissionPercent ?? '—'}٪)`;
        }
        if (params.data.payoutType === 2) {
          return `ثابت (${formatMoney(params.data.fixedAmountPerOrder)})`;
        }
        return payoutTypeLabel(params.data.payoutType);
      },
    },
    {
      field: 'isActive',
      headerName: 'وضعیت',
      cellRenderer: (params: any) => (
        <span
          className={`text-xs py-1 px-2 rounded-md ${
            params.data.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
          }`}
        >
          {params.data.isActive ? 'فعال' : 'غیرفعال'}
        </span>
      ),
    },
    {
      field: 'action',
      headerName: 'عملیات',
      filter: false,
      minWidth: 280,
      cellRenderer: (params: any) => (
        <div className="flex justify-start items-center gap-2 flex-wrap">
          <button
            className="bg-blue-500 text-xs py-2 cursor-pointer rounded-md px-2 outline-none text-white"
            onClick={() => {
              setExpertId(params.data.id);
              setExpertName(params.data.fullName);
              setShowCoverageModal(true);
            }}
          >
            محدوده پوشش
          </button>
          <button
            className="bg-yellow-500 text-xs py-2 cursor-pointer rounded-md px-2 outline-none text-black"
            onClick={() => {
              setExpertId(params.data.id);
              setExpertName(params.data.fullName);
              setShowEditModal(true);
            }}
          >
            ویرایش
          </button>
          <button
            className="bg-red-500 text-xs py-2 cursor-pointer rounded-md px-2 outline-none text-white"
            onClick={() => {
              setExpertId(params.data.id);
              setExpertName(params.data.fullName);
              setShowDeleteModal(true);
            }}
          >
            حذف
          </button>
        </div>
      ),
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
        title="کارشناسان"
        headerAction={
          <button
            className="bg-brand w-full sm:w-auto min-h-[44px] px-4 rounded-xl text-white"
            onClick={() => setShowAddModal(true)}
          >
            اضافه کردن کارشناس
          </button>
        }
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
          rowData={rowData ?? []}
          fields={cardFields}
          actions={cardActions}
          emptyMessage="کارشناسی وجود ندارد"
          getRowKey={(row) => row.id}
          desktopView={desktopView}
        />
      </ListPageShell>
      {showAddModal && (
        <CreateExpert showAddModal={showAddModal} setShowAddModal={setShowAddModal} />
      )}
      {showEditModal && (
        <EditExpert
          expertId={expertId}
          expertName={expertName}
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
        />
      )}
      {showDeleteModal && (
        <DeleteExpert
          expertId={expertId}
          expertName={expertName}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
        />
      )}
      {showCoverageModal && (
        <ExpertCoverageAreas
          expertId={expertId}
          expertName={expertName}
          showModal={showCoverageModal}
          setShowModal={setShowCoverageModal}
        />
      )}
    </Fragment>
  );
};

export default Experts;
