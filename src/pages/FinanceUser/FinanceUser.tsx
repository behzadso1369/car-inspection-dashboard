import React, { useRef, useState, Fragment, useMemo, useCallback, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';
import { AG_GRID_LOCALE_FN } from '../../utils/ag-grid-localize/localize';
import PaginationLib from '../../libs/pagination/pagination';
import { useForm } from 'react-hook-form';
import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';
import QuickSearch from '../../libs/quick-search/quick-search';
import { CircularProgress } from '@mui/material';
import { ListPageShell } from '../../components/list/ListPageShell';
import { ResponsiveDataView } from '../../components/list/ResponsiveDataView';
import { FixedPaginationBar } from '../../components/list/FixedPaginationBar';
import { cardFieldsFromColDefs } from '../../utils/listCardHelpers';
import { CardAction } from '../../types/list';
import { FinanceUser as FinanceUserRow } from '../../_models/response/financeUser/financeUser.response';
import CreateFinanceUser from './CreateFinanceUser';
import EditFinanceUser from './EditFinanceUser';
import DeleteFinanceUser from './DeleteFinanceUser';
import { formatCreatedOn } from './financeUserHelpers';

const FinanceUser: React.FunctionComponent = () => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userId, setUserId] = useState(0);
  const [userName, setUserName] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [count, setCount] = useState(0);
  const [rowData, setRowData] = useState<FinanceUserRow[]>();
  const [busyId, setBusyId] = useState<number | null>(null);

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

  const getUsers = useCallback(() => {
    instance
      .get(ApiHelper.get('FinanceUserList'), {
        params: { pageNumber: page, pageSize: rowsPerPage },
      })
      .then((res: any) => {
        setRowData(res?.data?.resultObject ?? []);
        setCount(res?.data?.countData ?? 0);
      })
      .catch(() => {
        setRowData([]);
        setCount(0);
      });
  }, [page, rowsPerPage]);

  useEffect(() => {
    getUsers();
  }, [getUsers, showAddModal, showDeleteModal, showEditModal]);

  const openEdit = (row: FinanceUserRow) => {
    setUserId(row.id);
    setUserName(row.fullName);
    setShowEditModal(true);
  };

  const openDelete = (row: FinanceUserRow) => {
    setUserId(row.id);
    setUserName(row.fullName);
    setShowDeleteModal(true);
  };

  const deactivate = (row: FinanceUserRow) => {
    if (!row.isActive || busyId === row.id) return;
    setBusyId(row.id);
    instance
      .put(ApiHelper.get('FinanceUserUpdate') + '?id=' + row.id, { isActive: false })
      .then((res: any) => {
        if (res.data?.isSuccess) getUsers();
      })
      .catch(() => undefined)
      .finally(() => setBusyId(null));
  };

  const columnDefs: ColDef[] = [
    {
      field: 'fullName',
      headerName: 'نام',
      minWidth: 160,
    },
    {
      field: 'phoneNumber',
      headerName: 'موبایل',
      minWidth: 140,
      cellRenderer: (params: any) => <bdi>{params.data?.phoneNumber || '—'}</bdi>,
    },
    {
      field: 'isActive',
      headerName: 'وضعیت',
      maxWidth: 120,
      cellRenderer: (params: any) =>
        params.data?.isActive ? (
          <span className="text-emerald-600 text-xs">فعال</span>
        ) : (
          <span className="text-red-500 text-xs">غیرفعال</span>
        ),
    },
    {
      field: 'isPhoneVerified',
      headerName: 'تایید موبایل',
      maxWidth: 140,
      cellRenderer: (params: any) =>
        params.data?.isPhoneVerified ? (
          <span className="text-emerald-600 text-xs">تایید شده</span>
        ) : (
          <span className="text-amber-600 text-xs">وارد نشده</span>
        ),
    },
    {
      field: 'createdOn',
      headerName: 'تاریخ ساخت',
      minWidth: 160,
      cellRenderer: (params: any) => formatCreatedOn(params.data?.createdOn),
    },
    {
      field: 'action',
      headerName: 'عملیات',
      filter: false,
      minWidth: 260,
      cellRenderer: (params: any) => (
        <div className="flex justify-start items-center">
          <button
            className="bg-yellow-500 text-xs py-2 cursor-pointer mr-2 rounded-md px-2 outline-none text-black"
            onClick={() => openEdit(params.data)}
          >
            ویرایش
          </button>
          {params.data?.isActive ? (
            <button
              className="bg-slate-500 mr-2 text-xs py-2 cursor-pointer rounded-md px-2 outline-none text-white disabled:opacity-50"
              disabled={busyId === params.data?.id}
              onClick={() => deactivate(params.data)}
            >
              غیرفعال
            </button>
          ) : null}
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
    primaryField: 'fullName',
    badgeField: 'isActive',
    valueOverrides: {
      isActive: (row) => (row.isActive ? 'فعال' : 'غیرفعال'),
      isPhoneVerified: (row) => (row.isPhoneVerified ? 'تایید شده' : 'وارد نشده'),
      createdOn: (row) => formatCreatedOn(row.createdOn),
    },
  });

  const cardActions: CardAction<FinanceUserRow>[] = [
    { key: 'edit', label: 'ویرایش', variant: 'ghost', onClick: openEdit },
    {
      key: 'deactivate',
      label: 'غیرفعال',
      variant: 'secondary',
      hidden: (row) => !row.isActive,
      onClick: deactivate,
    },
    { key: 'delete', label: 'حذف', variant: 'danger', onClick: openDelete },
  ];

  const onFilterTextBoxChanged = useCallback(() => {
    allgridRef.current?.api?.setGridOption('quickFilterText', getValues().search);
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
        title="کاربران مالی"
        subtitle="پرتال مالی جداست. کاربر رمز عبور ندارد و با کد یک‌بارمصرف وارد می‌شود. غیرفعال کردن ورود را می‌بندد؛ حذف، نرم است و کاربر را از لیست خارج می‌کند."
        headerAction={
          <button
            className="bg-brand w-full sm:w-auto min-h-[44px] px-4 rounded-xl text-white text-sm"
            onClick={() => setShowAddModal(true)}
          >
            افزودن کاربر
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
          emptyMessage="کاربر مالی یافت نشد"
          getRowKey={(row, index) => row.id ?? index}
          desktopView={desktopView}
        />
      </ListPageShell>
      {showAddModal && (
        <CreateFinanceUser showAddModal={showAddModal} setShowAddModal={setShowAddModal} />
      )}
      {showDeleteModal && (
        <DeleteFinanceUser
          userId={userId}
          userName={userName}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
        />
      )}
      {showEditModal && (
        <EditFinanceUser
          userId={userId}
          userName={userName}
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
        />
      )}
    </Fragment>
  );
};

export default FinanceUser;
