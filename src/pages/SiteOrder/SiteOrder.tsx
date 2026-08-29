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
import { Box, CircularProgress } from '@mui/material';
import DeleteOrder from '../Order/DeleteOrder';
import SiteOrderDetail from './SiteOrderDetail';
import moment from 'jalali-moment';
import { ListPageShell } from '../../components/list/ListPageShell';
import { ResponsiveDataView } from '../../components/list/ResponsiveDataView';
import { FixedPaginationBar } from '../../components/list/FixedPaginationBar';
import { CardAction, CardField } from '../../types/list';
const SiteOrder: React.FunctionComponent = () => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showDeleteUser, setShowDeleteUser] = useState<boolean>(false);
  const [secretOfOurServiceQualityId, setSecretOfOurServiceQualityId] = useState<number>(0);
  const [secretOfOurServiceQualityName, setSecretOfOurServiceQualityName] = useState<string>("");
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [search,setSearch] = useState<string>("")
  const [count, setCount] = React.useState(0);
  const [blogCatName, setBlogCatName] = React.useState<string>("");
  const [blogCatId, setBlogCatId] = React.useState<number>(0);
  const [showEditModal, setShowEditModal] = React.useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const [rowData, setRowData] = useState<any>();


  const allgridRef = useRef<any>();

  const { register, control,getValues } =
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
  const getAllRoles = () => {
    instance.get(ApiHelper.get("GetOrderReportDropDown"),{params: {pageNumber:page,pageSize:rowsPerPage}}).then((res:any) => {
      setRowData(res?.data?.resultObject);
         setCount(res?.data?.countData);
    })
  }
  useEffect(() => {
    getAllRoles();
 
  }, [page,rowsPerPage,showAddModal,showDeleteUser,search,showAddModal,showEditModal]);

  const deleteBlog = (params:any) => {
    setSecretOfOurServiceQualityId(params.data.id);
    setSecretOfOurServiceQualityName(params.data.title);
    setShowDeleteUser(true);
  
  }

  const openDelete = (row: any) => {
    setSecretOfOurServiceQualityId(row.id);
    setSecretOfOurServiceQualityName(row.title);
    setShowDeleteUser(true);
  };

  const openDetail = (row: any) => {
    setSecretOfOurServiceQualityId(row.id);
    setSelectedOrder(row);
    setShowDetailModal(true);
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
        key: 'paymentStatusTitle',
        label: 'وضعیت پرداخت',
        badge: true,
        badgeTone: () => 'info',
        getValue: (row) => row.paymentStatusTitle || 'ثبت نشده است',
      },
      {
        key: 'userId',
        label: 'کاربر',
        getValue: (row) => row.userId ?? 'ثبت نشده است',
      },
      {
        key: 'price',
        label: 'قیمت سفارش',
        getValue: (row) =>
          row.price != null ? `${row.price.toLocaleString()} تومان` : 'ثبت نشده است',
      },
      {
        key: 'lastLevel',
        label: 'آخرین مرحله',
        getValue: (row) => row.flowState?.title || 'ثبت نشده است',
      },
      {
        key: 'createdOn',
        label: 'تاریخ ثبت سفارش',
        getValue: (row) =>
          row.createdOn
            ? moment(row.createdOn).locale('fa').format('YYYY-MM-DD ساعت HH:mm:ss')
            : 'ثبت نشده است',
      },
    ],
    []
  );

  const cardActions: CardAction[] = useMemo(
    () => [
      {
        key: 'detail',
        label: 'جزئیات سفارش',
        variant: 'primary',
        onClick: (row) => openDetail(row),
      },
      {
        key: 'delete',
        label: 'حذف سفارش',
        variant: 'danger',
        onClick: (row) => openDelete(row),
      },
    ],
    []
  );

  const columnDefs:ColDef[] = [
    {
      field: 'id',
      headerName: '#',
      sortable: true,
      unSortIcon: true,
      rowDrag:true,
      filter: false,
      pinned: "right",
maxWidth:80,
      wrapText:false
     
    },
  
   
    {
      field: 'userId',
      headerName: 'کاربر ',
      cellRenderer: (params:any) => {
        return (
          <>
          {params.data.userId ? <span>{params.data.userId}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
          </>
        )
     
       }
        },
    {
      field: 'createdOn',
      headerName: ' تاریخ ثبت سفارش ',
      cellRenderer: (params:any) => {
        debugger
        return (
          <>
          {params.data.createdOn ? <span>{moment(params.data.createdOn).locale("fa").format("YYYY-MM-DD ساعت HH:mm:ss")}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
          </>
        )
     
       }
        },
    {
      field: 'price',
      headerName: 'قیمت سفارش',
      cellRenderer: (params:any) => {
        return (
          <>
          {params.data.price ? <span>{params.data.price.toLocaleString() + "  " + " تومان"}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
          </>
        )
     
       }
        },

    {
      field: 'lastLevel',
      headerName: 'آخرین مرحله',
      cellRenderer: (params:any) => {
        return (
          <>
          {params?.data?.flowState?.title ? <span>{params?.data?.flowState?.title}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
          </>
        )
     
       }
        },
    {
      field: 'paymentStatusTitle',
      headerName: 'وضعیت پرداخت',
      cellRenderer: (params:any) => {
        return (
          <>
          {params?.data?.paymentStatusTitle ? <span>{params?.data?.paymentStatusTitle}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
          </>
        )
     
       }
        },
    
   
  
        
      

    
    
  
  
  
    {
      field: 'action',
      headerName: 'عملیات',
      minWidth: 180,
      cellRenderer: (params:any) => {
        return (
   
          <div className="flex justify-start items-center gap-1 flex-wrap">
          <button className='bg-brand text-xs py-2 cursor-pointer rounded-md px-2 outline-none text-white' onClick={() => openDetail(params.data)}>جزئیات</button>
          <button className='bg-red-500 text-xs py-2 cursor-pointer rounded-md px-2 outline-none text-white' onClick={() => deleteBlog(params)}>حذف سفارش</button>
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
        title="سفارشات سایت"
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
          emptyMessage="سفارشی وجود ندارد"
          getRowKey={(row) => row.id}
          desktopView={desktopView}
        />
      </ListPageShell>
   
     
      {showDeleteUser && (
       <DeleteOrder secretOfOurServiceQualityId={secretOfOurServiceQualityId} secretOfOurServiceQualityName={secretOfOurServiceQualityName} showDeleteModal={showDeleteUser} setShowDeleteModal={setShowDeleteUser}/>
     )}
      {showDetailModal && (
        <SiteOrderDetail
          showModal={showDetailModal}
          setShowModal={setShowDetailModal}
          orderId={secretOfOurServiceQualityId}
          initialOrder={selectedOrder}
        />
      )}
      
   
    
   
    </Fragment>
   
  );
};

export default SiteOrder;
