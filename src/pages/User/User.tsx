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
import Switch from '@mui/material/Switch';
import DeleteUser from './DeleteUser';
import EditUserRole from './EditUserRole';
import Register from './Register';
import { ListPageShell } from '../../components/list/ListPageShell';
import { ResponsiveDataView } from '../../components/list/ResponsiveDataView';
import { FixedPaginationBar } from '../../components/list/FixedPaginationBar';
import { CardAction, CardField } from '../../types/list';
const label = { inputProps: { 'aria-label': 'Switch demo' } };
const User: React.FunctionComponent = () => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteUser, setShowDeleteUser] = useState<boolean>(false);
  const [userId, setUserId] = useState<number>(0);
  const [userName, setUserName] = useState<string>("");
  const [roleName, setRoleName] = useState<string>("");
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [count, setCount] = React.useState(0);
  const [search,setSearch] = useState<string>("")
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
  const getAllUser = () => {
    instance.get(ApiHelper.get("GetAllUsers"),{params: {pageNumber:page,pageSize:rowsPerPage}}).then((res:any) => {
      setRowData(res?.data?.resultObject)
      setCount(res?.data?.countData)
      
    })
  }
  useEffect(() => {
    getAllUser();
  }, [page,rowsPerPage,showAddModal,showDeleteUser,search,showEditModal]);
  const setDisableUser = (params:any,value:any) => {
  if(value.target.checked) {
    instance.post(ApiHelper.get("ActiveUser"),{userId:params.data.Id}).then((res:any) => {
      if(res.data.isSuccess) {
        getAllUser();
      }
    })
  }else {
    instance.delete(ApiHelper.get("DeActiveUser") + "/" + params.data.Id).then((res:any) => {
      if(res.data.isSuccess) {
        getAllUser();
      }
    })
  }
  }
  const deleteUser = (params:any) => {
    setUserId(params.data.Id);
    setUserName(params.data.UserName);
    setShowDeleteUser(true);
  
  }

  const openEditRole = (row: any) => {
    setShowEditModal(true);
    setUserId(row.Id);
    setRoleName(row.Roles?.[0] ?? '');
  };

  const cardFields: CardField[] = useMemo(
    () => [
      {
        key: 'UserName',
        label: 'نام کاربری',
        primary: true,
        getValue: (row) => row.UserName || 'ثبت نشده است',
      },
      {
        key: 'role',
        label: 'نقش کاربر',
        badge: true,
        badgeTone: () => 'info',
        getValue: (row) => row.Roles?.[0] || 'ثبت نشده است',
      },
      {
        key: 'Email',
        label: 'ایمیل',
        getValue: (row) => row.Email || 'ثبت نشده است',
      },
      {
        key: 'LockoutEnd',
        label: 'فعال/غیرفعال',
        badge: true,
        badgeTone: (row) => (row.LockoutEnd === null ? 'success' : 'default'),
        getValue: (row) => (row.LockoutEnd === null ? 'فعال' : 'غیرفعال'),
      },
    ],
    []
  );

  const cardActions: CardAction[] = useMemo(
    () => [
      {
        key: 'editRole',
        label: 'ویرایش نقش',
        variant: 'secondary',
        onClick: (row) => openEditRole(row),
      },
    ],
    []
  );

  const columnDefs:ColDef[] = [
    {
      field: 'UserName',
      rowDrag:true,
      headerName: 'نام کاربری',
      cellRenderer: (params:any) => {
        return (
          <>
          {params.data.UserName ? <span>{params.data.UserName}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
          </>
        )
     
       }
        },
    {
      field: 'Email',
      headerName: 'ایمیل',
      width:400,
      cellRenderer: (params:any) => {
        return (
          <>
          {params.data.Email ? <span className='text-xs'>{params.data.Email}</span> : <button className='bg-red-400 text-balck flex justify-center items-center py-2 px-3'>ثبت نشده است</button>}
          </>
        )
     
       }
    
    },
    {
      field: 'role',
      headerName: 'نقش کاربر',
      cellRenderer: (params:any) => {
        return (
          <>
          {params.data.Roles[0] ? <span className='text-base'>{params.data.Roles[0]}</span> : <button className='bg-red-400 text-balck flex justify-center items-center h-8  rounded-2xl  px-2 text-white'>ثبت نشده است</button>}
          </>
        )
     
       }
    },
    {
      field: 'LockoutEnd',
      headerName: 'فعال/غیر فعال',
 
   cellRenderer: (params:any) => {
    return (
      <Switch {...label} defaultChecked={params.data.LockoutEnd === null ? true : false} onChange={(value:any) => setDisableUser(params,value)} />
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
                  setUserId(params.data.Id);
                  setRoleName(params.data.Roles[0]);
                  }}>ویرایش نقش </button>
                {/* <button className='bg-red-500 mr-2 text-xs py-2 cursor-pointer rounded-md px-2  outline-none text-white' onClick={() => deleteUser(params)}>حذف کاربر</button> */}
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
        title="کاربران"
        headerAction={
          <button
            className="bg-brand w-full sm:w-auto min-h-[44px] px-4 rounded-xl text-white"
            onClick={() => setShowAddModal(true)}
          >
            ثبت نام کاربر
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
          emptyMessage="کاربری وجود ندارد"
          getRowKey={(row) => row.Id}
          desktopView={desktopView}
        />
      </ListPageShell>
      {/* {showAddModal && (
        <AddUser showAddUserModal={showAddModal} setShowAddUserModal={setShowAddModal} />
     )} */}
      {showEditModal && (
        <EditUserRole userId={userId} roleName={roleName} showEditModal={showEditModal} setShowEditModal={setShowEditModal} />
     )}
     
      {showDeleteUser && (
       <DeleteUser userId={userId} username={userName} showDeleteModal={showDeleteUser} setShowDeleteModal={setShowDeleteUser}/>
     )}
       {showDeleteUser && (
       <DeleteUser userId={userId} username={userName} showDeleteModal={showDeleteUser} setShowDeleteModal={setShowDeleteUser}/>
     )}
      {showAddModal && (
       <Register showAddUserModal={showAddModal} setShowAddUserModal={setShowAddModal}/>
     )}
    </Fragment>
   
  );
};
export default User;
