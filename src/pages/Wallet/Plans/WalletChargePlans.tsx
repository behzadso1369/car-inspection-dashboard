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
import CreateWalletChargePlan from './CreateWalletChargePlan';
import DeleteWalletChargePlan from './DeleteWalletChargePlan';
import EditWalletChargePlan from './EditWalletChargePlan';
import { ListPageShell } from '../../../components/list/ListPageShell';
import { ResponsiveDataView } from '../../../components/list/ResponsiveDataView';
import { FixedPaginationBar } from '../../../components/list/FixedPaginationBar';
import { cardFieldsFromColDefs, defaultEditDeleteActions } from '../../../utils/listCardHelpers';
import { formatToman } from '../walletHelpers';

const WalletChargePlans: React.FunctionComponent = () => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [planId, setPlanId] = useState(0);
  const [planTitle, setPlanTitle] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [count, setCount] = useState(0);
  const [rowData, setRowData] = useState<any>();

  const allgridRef = useRef<any>();

  const { register, control, getValues } = useForm({
    defaultValues: {
      filterOrder: 1,
      search: '',
    },
  });

  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      minWidth: 130,
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
    }),
    []
  );

  const getAllPlans = () => {
    instance
      .get(ApiHelper.get('WalletChargePlanList'), {
        params: { pageNumber: page, pageSize: rowsPerPage },
      })
      .then((res: any) => {
        setRowData(res?.data?.resultObject);
        setCount(res?.data?.countData);
      });
  };

  useEffect(() => {
    getAllPlans();
  }, [page, rowsPerPage, showAddModal, showDeleteModal, showEditModal]);

  const openEdit = (row: any) => {
    setShowEditModal(true);
    setPlanId(row.id);
    setPlanTitle(row.title);
  };

  const openDelete = (row: any) => {
    setPlanId(row.id);
    setPlanTitle(row.title);
    setShowDeleteModal(true);
  };

  const columnDefs: ColDef[] = [
    {
      field: 'id',
      headerName: '#',
      sortable: true,
      unSortIcon: true,
      filter: false,
      pinned: 'right',
      maxWidth: 80,
    },
    {
      field: 'title',
      headerName: 'عنوان',
    },
    {
      field: 'payAmount',
      headerName: 'پرداخت درگاه',
      cellRenderer: (params: any) => formatToman(params.data?.payAmount),
    },
    {
      field: 'creditAmount',
      headerName: 'واریز به کیف‌پول',
      cellRenderer: (params: any) => formatToman(params.data?.creditAmount),
    },
    {
      field: 'bonus',
      headerName: 'هدیه شارژ',
      filter: false,
      cellRenderer: (params: any) => {
        const bonus = Number(params.data?.creditAmount ?? 0) - Number(params.data?.payAmount ?? 0);
        return bonus > 0 ? formatToman(bonus) : 'بدون بونوس';
      },
    },
    {
      field: 'sortOrder',
      headerName: 'ترتیب',
      maxWidth: 100,
    },
    {
      field: 'isActive',
      headerName: 'فعال',
      maxWidth: 110,
      cellRenderer: (params: any) =>
        params.data?.isActive ? (
          <span className="text-emerald-600 text-xs">فعال</span>
        ) : (
          <span className="text-red-500 text-xs">غیرفعال</span>
        ),
    },
    {
      field: 'action',
      headerName: 'عملیات',
      filter: false,
      minWidth: 180,
      cellRenderer: (params: any) => (
        <div className="flex justify-start items-start">
          <button
            className="bg-yellow-500 text-xs py-2 cursor-pointer mr-2 rounded-md px-2 outline-none text-black"
            onClick={() => openEdit(params.data)}
          >
            ویرایش
          </button>
          <button
            className="bg-red-500 mr-2 text-xs py-2 cursor-pointer rounded-md px-2 outline-none text-white"
            onClick={() => openDelete(params.data)}
          >
            حذف
          </button>
        </div>
      ),
    },
  ];

  const cardFields = cardFieldsFromColDefs(columnDefs, {
    primaryField: 'title',
    badgeField: 'isActive',
    valueOverrides: {
      payAmount: (row) => formatToman(row.payAmount),
      creditAmount: (row) => formatToman(row.creditAmount),
      bonus: (row) => {
        const bonus = Number(row.creditAmount ?? 0) - Number(row.payAmount ?? 0);
        return bonus > 0 ? formatToman(bonus) : 'بدون بونوس';
      },
      isActive: (row) => (row.isActive ? 'فعال' : 'غیرفعال'),
    },
  });
  const cardActions = defaultEditDeleteActions({
    onEdit: openEdit,
    onDelete: openDelete,
  });

  const onFilterTextBoxChanged = useCallback(() => {
    allgridRef.current!.api!.setGridOption('quickFilterText', getValues().search);
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
        title="پلن‌های شارژ کیف‌پول"
        subtitle="فقط پلن‌های فعال در سایت کاربر نمایش داده می‌شوند. اختلاف واریز و پرداخت، هدیه شارژ است."
        headerAction={
          <button
            className="bg-brand w-full sm:w-auto min-h-[44px] px-4 rounded-xl text-white text-sm"
            onClick={() => setShowAddModal(true)}
          >
            اضافه کردن پلن
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
          emptyMessage="پلنی یافت نشد"
          getRowKey={(row, index) => row.id ?? index}
          desktopView={desktopView}
        />
      </ListPageShell>
      {showAddModal && (
        <CreateWalletChargePlan
          showAddUserModal={showAddModal}
          setShowAddUserModal={setShowAddModal}
        />
      )}
      {showDeleteModal && (
        <DeleteWalletChargePlan
          planId={planId}
          planTitle={planTitle}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
        />
      )}
      {showEditModal && (
        <EditWalletChargePlan
          planId={planId}
          planTitle={planTitle}
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
        />
      )}
    </Fragment>
  );
};

export default WalletChargePlans;
