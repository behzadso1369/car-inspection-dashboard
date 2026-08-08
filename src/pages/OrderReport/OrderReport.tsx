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
import { NavLink, useNavigate } from 'react-router-dom';
import DeleteOrderReport from './DeleteOrderReport';
import { Image } from 'antd';
import { ListPageShell } from '../../components/list/ListPageShell';
import { ResponsiveDataView } from '../../components/list/ResponsiveDataView';
import { FixedPaginationBar } from '../../components/list/FixedPaginationBar';
import { CardAction, CardField } from '../../types/list';

const OrderReport: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const [showDeleteUser, setShowDeleteUser] = useState<boolean>(false);
  const [orderReportId, setOrderReportId] = useState<number>(0);
  const [orderReportName, setOrderReportName] = useState<string>("");
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [search, setSearch] = useState<string>("");
  const [count, setCount] = React.useState(0);

  const [rowData, setRowData] = useState<any>();

  const allgridRef = useRef<any>();

  const { register, control, getValues } =
    useForm({
      defaultValues: {
        filterOrder: 1,
        search: ""
      }
    });
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 150,
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
    };
  }, []);

  const getAllOrderReports = () => {
    instance.get(ApiHelper.get("OrderReportList"), { params: { pageNumber: page, pageSize: rowsPerPage } }).then((res: any) => {
      setRowData(res?.data?.resultObject);
      setCount(res?.data?.countData);
    })
  }

  useEffect(() => {
    getAllOrderReports();
  }, [page, rowsPerPage, showDeleteUser, search]);

  const deleteOrderReport = (params: any) => {
    setOrderReportId(params.data.id);
    setOrderReportName(params.data.id?.toString() || "");
    setShowDeleteUser(true);
  }

  const openEdit = (row: any) => {
    navigate(`../edit?id=${row.id}`);
  };

  const openDelete = (row: any) => {
    setOrderReportId(row.id);
    setOrderReportName(row.id?.toString() || '');
    setShowDeleteUser(true);
  };

  const cardFields: CardField[] = useMemo(
    () => [
      {
        key: 'id',
        label: '#',
        primary: true,
        getValue: (row) => (row.id != null ? `#${row.id}` : 'ثبت نشده است'),
      },
      {
        key: 'orderId',
        label: 'شناسه سفارش',
        getValue: (row) => row.orderId ?? 'ثبت نشده است',
      },
      {
        key: 'userId',
        label: 'شناسه کاربر',
        getValue: (row) => row.userId ?? 'ثبت نشده است',
      },
    ],
    []
  );

  const cardActions: CardAction[] = useMemo(
    () => [
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
      unSortIcon: true,
      rowDrag: true,
      filter: false,
      pinned: "right",
      maxWidth: 60,
      wrapText: false
    },
    {
      field: 'userId',
      headerName: 'شناسه کاربر',
      cellRenderer: (params: any) => {
        return (
          <>
            {params.data.userId ? <span>{params.data.userId}</span> : <button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
          </>
        )
      }
    },
    {
      field: 'orderId',
      headerName: 'شناسه سفارش',
      cellRenderer: (params: any) => {
        return (
          <>
            {params.data.orderId ? <span>{params.data.orderId}</span> : <button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
          </>
        )
      }
    },
    {
      field: 'imagePath',
      headerName: 'عکس',
      cellRenderer: (params: any) => {
        return (
          <>
            {params.data.imagePath ? (
                 <Image
                 style={{width: "80px",height: "50px",borderRadius: "7px",objectFit: "cover" }}
                 src={"https://api.carmacheck.com/" + params.data.imagePath}
                 />
            ) : (
              <button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>
            )}
          </>
        )
      }
    },
    {
      field: 'action',
      headerName: 'عملیات',
      cellRenderer: (params: any) => {
        return (
          <div className="flex justify-start items-start">
            <button className='bg-yellow-500 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black' onClick={() => {
              navigate(`../edit?id=${params.data.id}`);
            }}>ویرایش  </button>
            <button className='bg-red-500 mr-2 text-xs py-2 cursor-pointer rounded-md px-2  outline-none text-white' onClick={() => deleteOrderReport(params)}>حذف  </button>
          </div>
        );
      },
      filter: false
    },
  ];

  const onFilterTextBoxChanged = useCallback(() => {
    allgridRef.current!.api!.setGridOption(
      'quickFilterText',
      getValues().search
    );
  }, []);

  const overlayComponent = () => {
    return (
      <div className='bg-white flex justify-center items-center w-full h-80'>
        <CircularProgress />
      </div>
    )
  }

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
          suppressAggFuncInHeader={true}
          defaultColDef={defaultColDef}
          columnDefs={columnDefs}
          pagination={false}
          localeText={AG_GRID_LOCALE_FN}
          suppressColumnVirtualisation={true}
          rowDragManaged={true}
          suppressRowVirtualisation={true}
          suppressMoveWhenRowDragging={true}
          paginationPageSize={5}
          loadingOverlayComponent={overlayComponent}
        />
      </div>
    </div>
  );

  return (
    <Fragment>
      <ListPageShell
        title="گزارش کارشناسی"
        headerAction={
          <NavLink
            to="../create"
            className="inline-flex items-center justify-center bg-brand w-full sm:w-auto min-h-[44px] px-4 rounded-xl text-white"
          >
            اضافه کردن گزارش کارشناسی
          </NavLink>
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
          emptyMessage="گزارشی وجود ندارد"
          getRowKey={(row) => row.id}
          desktopView={desktopView}
        />
      </ListPageShell>

      {showDeleteUser && (
        <DeleteOrderReport orderReportId={orderReportId} orderReportName={orderReportName} showDeleteModal={showDeleteUser} setShowDeleteModal={setShowDeleteUser} />
      )}
    </Fragment>
  );
};

export default OrderReport;

