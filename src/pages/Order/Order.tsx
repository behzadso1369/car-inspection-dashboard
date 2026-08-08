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
import CreateSlider from './CreateOrder';
import DeleteSlider from './DeleteOrder';
import { NavLink } from 'react-router-dom';
import CreateBlogCategory from './CreateOrder';
import EditBlogCategory from './EditOrder';
import CreateCarInspectionSrvice from './CreateOrder';
import DeleteCarInspectionSrvice from './DeleteOrder';
import EditCarInspectionSrvice from './EditOrder';
import {Image} from "antd";
import CreateSecretOfOurServiceQuality from './CreateOrder';
import DeleteSecretOfOurServiceQuality from './DeleteOrder';
import EditSecretOfOurServiceQuality from './EditOrder';
import CreateWhyWe from './CreateOrder';
import DeleteWhyWe from './DeleteOrder';
import EditWhyWe from './EditOrder';
import CreateFinancialExpenditure from './CreateOrder';
import DeleteFinancialExpenditure from './DeleteOrder';
import EditFinancialExpenditure from './EditOrder';
import image from "../../assets/images/Login.jpg"
import CreateOrder from './CreateOrder';
import DeleteOrder from './DeleteOrder';
import EditOrder from './EditOrder';
import { ListPageShell } from '../../components/list/ListPageShell';
import { ResponsiveDataView } from '../../components/list/ResponsiveDataView';
import { FixedPaginationBar } from '../../components/list/FixedPaginationBar';
import { CardAction, CardField } from '../../types/list';
const Order: React.FunctionComponent = () => {
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
    instance.get(ApiHelper.get("OrderList"),{params: {pageNumber:page,pageSize:rowsPerPage}}).then((res:any) => {
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

  const openEdit = (row: any) => {
    setShowEditModal(true);
    setSecretOfOurServiceQualityId(row.id);
    setSecretOfOurServiceQualityName(row.title);
  };

  const openDelete = (row: any) => {
    setSecretOfOurServiceQualityId(row.id);
    setSecretOfOurServiceQualityName(row.title);
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
        key: 'flowState',
        label: 'مرحله فرآیند',
        badge: true,
        badgeTone: () => 'info',
        getValue: (row) => row.flowState || 'ثبت نشده است',
      },
      {
        key: 'userName',
        label: 'کاربر',
        getValue: (row) => row.userName || 'ثبت نشده است',
      },
      {
        key: 'userPhone',
        label: 'شماره موبایل',
        getValue: (row) => row.userPhone || 'ثبت نشده است',
      },
      {
        key: 'inspectionType',
        label: 'نوع کارشناسی',
        getValue: (row) => row.inspectionType || 'ثبت نشده است',
      },
      {
        key: 'createdDate',
        label: 'تاریخ کارشناسی',
        getValue: (row) => row.createdDate || 'ثبت نشده است',
      },
    ],
    []
  );

  const cardActions: CardAction[] = useMemo(
    () => [
      {
        key: 'edit',
        label: 'ویرایش سفارش',
        variant: 'secondary',
        onClick: (row) => openEdit(row),
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
      field: 'userName',
      headerName: 'کاربر ',
      cellRenderer: (params:any) => {
        return (
          <>
          {params.data.userName ? <span>{params.data.userName}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
          </>
        )
     
       }
        },
    {
      field: 'userPhone',
      headerName: 'شماره موبایل ',
      cellRenderer: (params:any) => {
        return (
          <>
          {params.data.userPhone ? <span>{params.data.userPhone}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
          </>
        )
     
       }
        },

    {
      field: 'carInspectionType',
      headerName: 'نوع کارشناسی ',
      cellRenderer: (params:any) => {
        return (
          <>
          {params?.data?.inspectionType ? <span>{params?.data?.inspectionType}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
          </>
        )
     
       }
        },
    {
      field: 'flowState',
      headerName: 'مرحله فرآیند ',
      cellRenderer: (params:any) => {
        return (
          <>
          {params?.data?.flowState ? <span>{params?.data?.flowState}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
          </>
        )
     
       }
        },
    
   
        {
            field: 'createdDate',
            headerName: 'تاریخ کارشناسی',
            cellRenderer: (params:any) => {
              return (
                <>
                {params.data.createdDate ? <span>{params.data.createdDate}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
                </>
              )
           
             }
              },
        
      

    
    
  
  
  
    {
      field: 'action',
      headerName: 'عملیات',
     
     
      cellRenderer: (params:any) => {
        return (
   
          <div className="flex justify-start items-start">
          <button className='bg-yellow-500 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black' onClick={() => {
            
            setShowEditModal(true)
            setSecretOfOurServiceQualityId(params.data.id);
            setSecretOfOurServiceQualityName(params.data.title);
            }}>ویرایش   سفارش </button>
          <button className='bg-red-500 mr-2 text-xs py-2 cursor-pointer rounded-md px-2  outline-none text-white' onClick={() => deleteBlog(params)}>حذف  سفارش</button>
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
        title="سفارشات پشتیبان"
        headerAction={
          <button
            className="bg-brand w-full sm:w-auto min-h-[44px] px-4 rounded-xl text-white"
            onClick={() => setShowAddModal(true)}
          >
            اضافه کردن سفارش
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
          emptyMessage="سفارشی وجود ندارد"
          getRowKey={(row) => row.id}
          desktopView={desktopView}
        />
      </ListPageShell>
      {showAddModal && (
        <CreateOrder showAddUserModal={showAddModal} setShowAddUserModal={setShowAddModal} />
     )}
     
      {showDeleteUser && (
       <DeleteOrder secretOfOurServiceQualityId={secretOfOurServiceQualityId} secretOfOurServiceQualityName={secretOfOurServiceQualityName} showDeleteModal={showDeleteUser} setShowDeleteModal={setShowDeleteUser}/>
     )}
       {showEditModal && (
        <EditOrder secretOfOurServiceQualityId={secretOfOurServiceQualityId} secretOfOurServiceQualityName={secretOfOurServiceQualityName} showEditModal={showEditModal} setShowEditModal={setShowEditModal} />
     )}
   
    
   
    </Fragment>
   
  );
};

export default Order;
