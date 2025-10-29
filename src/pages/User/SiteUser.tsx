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

const label = { inputProps: { 'aria-label': 'Switch demo' } };
const SiteUser: React.FunctionComponent = () => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  
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
    instance.get(ApiHelper.get("GetSiteUserList"),{params: {pageNumber:page,pageSize:rowsPerPage}}).then((res:any) => {
      setRowData(res?.data?.resultObject)
      setCount(res?.data?.countData)
      
    })
  }
  useEffect(() => {
    getAllUser();
  }, [page,rowsPerPage,search]);
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

  const columnDefs:ColDef[] = [
    {
      field: 'FullName',
      rowDrag:true,
      headerName: 'نام کاربری',
      cellRenderer: (params:any) => {
        return (
          <>
          {params.data.FullName ? <span>{params.data.FullName}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
          </>
        )
     
       }
        },
    {
      field: 'PhoneNumber',
      headerName: 'شماره تلفن همراه',
      width:400,
      cellRenderer: (params:any) => {
        return (
          <>
          {params.data.PhoneNumber ? <span className='text-xs'>{params.data.PhoneNumber}</span> : <button className='bg-red-400 text-balck flex justify-center items-center  px-3'>ثبت نشده است</button>}
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
    }
   
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
  return (
    <Fragment>
    
       <div className="bg-white border border-[#2c3c511a] rounded-xl flex items-baseline justify-between p-4 mb-3">
          <h3 className="text-base font-bold text-primary">  کاربران </h3>
      </div>
        <QuickSearch  activeSearch={true}   register={register}
                control={control}   onSubmit={onFilterTextBoxChanged}/>
      <div
        className="absolute right-0 bottom-0 bg-white w-full"
        style={{ boxShadow: '0px -2px 7px 0px rgba(0, 0, 0, 0.05)' }}
      >
    <PaginationLib count={count} page={page} setPage={setPage} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} />
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
     
    </Fragment>
   
  );
};
export default SiteUser;
