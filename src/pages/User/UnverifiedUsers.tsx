
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
import AddUser from './AddUser';
import EditUser from './EditUser';
import Switch from '@mui/material/Switch';
import DeleteUser from './DeleteUser';
import { NavLink } from 'react-router-dom';

const label = { inputProps: { 'aria-label': 'Switch demo' } };


const UnverifiedUsers: React.FunctionComponent = () => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteUser, setShowDeleteUser] = useState<boolean>(false);
  const [userId, setUserId] = useState<number>(0);
  const [userName, setUserName] = useState<string>("");
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
  // var filterParams: IDateFilterParams = {
  //   comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
  //     var dateAsString = cellValue;
  //     if (dateAsString == null) return -1;
  //     var dateParts = dateAsString.split('/');
  //     var cellDate = new Date(
  //       Number(dateParts[2]),
  //       Number(dateParts[1]) - 1,
  //       Number(dateParts[0])
  //     );
  //     if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
  //       return 0;
  //     }
  //     if (cellDate < filterLocalDateAtMidnight) {
  //       return -1;
  //     }
  //     if (cellDate > filterLocalDateAtMidnight) {
  //       return 1;
  //     }
  //     return 0;
  //   },
  // };
  const getAllUser = () => {
    instance.get(ApiHelper.get("User"),{params: {
        page: page,
      count:rowsPerPage,
       status: ""
      }}).then((res:any) => {
      setRowData(res?.data?.results)
    })
  }
  useEffect(() => {
    getAllUser();
 
  }, [page,rowsPerPage]);
  const setDisableUser = (params:any) => {

      instance.put(ApiHelper.get("disableUser"),{userId:params.data.id}).then((res:any) => {
        if(res.data.success) {
          getAllUser();
        }
      })
  
  

  }
 
  const deleteUser = (params:any) => {
    setUserId(params.data.id);
    setUserName(params.data.username);
    setShowDeleteUser(true);
  
  }


 

  const columnDefs:ColDef[] = [
    {
      field: 'id',
      headerName: '#',
      minWidth: 90,
      maxWidth: 80,
      sortable: true,
      unSortIcon: true,
      rowDrag:true,
      filter: false,
      pinned: "right",
    },
    {
      field: 'first_name',
      headerName: 'نام  ',
      cellRenderer: (params:any) => {
        return (
          <>
          {params.data.first_name ? <span className='text-sm'>{params.data.first_name}</span> : <button className='bg-slate-300 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
          </>
        )
     
       }
        },
   
    {
      field: 'last_name',
      headerName: 'نام خانوادگی',
      cellRenderer: (params:any) => {
        return (
          <>
          {params.data.last_name ? <span>{params.data.last_name}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
          </>
        )
     
       }
        },

    
    
  
    {
      field: 'mobile',
      headerName: 'شماره موبایل',
      cellRenderer: (params:any) => {
        return (
          <>
          {params.data.mobile ? <span className='text-base'>{params.data.mobile}</span> : <button className='bg-red-400 text-balck flex justify-center items-center py-2 px-3'>ثبت نشده است</button>}
          </>
        )
     
       }
    
    },
   
    {
      field: 'is_active',
      headerName: 'فعال/غیر فعال',
 
   cellRenderer: (params:any) => {
    return (
      <Switch {...label} defaultChecked={params.data.is_active} onChange={() => setDisableUser(params)} />
    )
 
   }
    },
  
    {
      field: 'action',
      headerName: 'عملیات',
     
      cellRenderer: (params:any) => {
        return (
   
  <div className="flex justify-start items-start">
         
        
                <button className='bg-yellow-500 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black' ><NavLink to={"../../users/detail/" + params.data.id}>ویرایش کاربر </NavLink></button>
                <button className='bg-red-500 mr-2 text-xs py-2 cursor-pointer rounded-md px-2  outline-none text-white' onClick={() => deleteUser(params)}>حذف کاربر</button>

          
           
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
  // const onSubmit = () => {
  //   const data = getValues();
  //   console.log(data);
    
  //   reset(data);
  //   // setUrlParams();
  // };
  // const params: any[] = [];
  // const clickHandler = (key: string) => {
  //   setValue(key, '0');
  //   // setUrlParams();
  // };



  return (
    <Fragment>
    
       <div className="bg-white border border-[#2c3c511a] rounded-xl flex items-baseline justify-between p-4 mb-3">
        
          <h3 className="text-base font-bold text-primary">  کاربران </h3>
          <button className='bg-[#0047bc] px-2  text-sm py-2 cursor-pointer mr-2 rounded-md   outline-none text-white' onClick={() => setShowAddModal(true)}>اضافه کردن کاربر</button>
      
      </div>
        <QuickSearch activeSearch={true}   register={register}
                control={control}   onSubmit={onFilterTextBoxChanged}/>
               
     
      <div
        className="absolute right-0 bottom-0 bg-white w-full"
        style={{ boxShadow: '0px -2px 7px 0px rgba(0, 0, 0, 0.05)' }}
      >
 <PaginationLib page={page} setPage={setPage} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} />
      </div>
      <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-alpine w-full default-table pb-32 pt-6">
        <AgGridReact
          ref={allgridRef}
          // getRowId={(params) => params.data.requestId}
          
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
          icons={{
            checkboxChecked:
              '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"></path></svg>',
            sortAscending: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"></path></svg>`,
            sortDescending: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"></path></svg>`,
            sortUnSort: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"></path></svg>`,
          }}
        />
      </div>
      </div>
      {showAddModal && (
        <AddUser showAddUserModal={showAddModal} setShowAddUserModal={setShowAddModal} />
     )}
      {showEditModal && (
        <EditUser  userId={userId} userName={userName} showEditUserModal={showEditModal} setShowEditUserModal={setShowEditModal}  />
     )}
      {showDeleteUser && (
       <DeleteUser userId={userId} username={userName} showDeleteModal={showDeleteUser} setShowDeleteModal={setShowDeleteUser}/>
     )}
    
   
    </Fragment>
   
  );
};

export default UnverifiedUsers;

