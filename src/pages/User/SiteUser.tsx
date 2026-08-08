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
import { ListPageShell } from '../../components/list/ListPageShell';
import { ResponsiveDataView } from '../../components/list/ResponsiveDataView';
import { FixedPaginationBar } from '../../components/list/FixedPaginationBar';
import { CardField } from '../../types/list';

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

  const cardFields: CardField[] = useMemo(
    () => [
      {
        key: 'FullName',
        label: 'نام کاربری',
        primary: true,
        getValue: (row) => row.FullName || 'ثبت نشده است',
      },
      {
        key: 'PhoneNumber',
        label: 'شماره تلفن همراه',
        getValue: (row) => row.PhoneNumber || 'ثبت نشده است',
      },
      {
        key: 'LockoutEnd',
        label: 'فعال/غیرفعال',
        getValue: (row) => (row.LockoutEnd === null ? 'فعال' : 'غیرفعال'),
      },
    ],
    []
  );

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
        title="کاربران سایت"
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
          emptyMessage="کاربری وجود ندارد"
          getRowKey={(row) => row.Id}
          desktopView={desktopView}
        />
      </ListPageShell>
     
    </Fragment>
   
  );
};
export default SiteUser;
