import React, {useRef, Fragment, useMemo, useState, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';




import { AG_GRID_LOCALE_FN } from '../../utils/ag-grid-localize/localize';


import instance from '../../helper/interceptor';
import { ApiHelper } from '../../helper/api-request';

import { useForm } from 'react-hook-form';

import QuickSearch from '../../libs/quick-search/quick-search';
import PaginationLib from '../../libs/pagination/pagination';
import { NavLink } from 'react-router-dom';



const BuyOrder: React.FunctionComponent = () => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const { register, getValues, control } =
  useForm({
    defaultValues: {
      filterOrder: 1,
      search: ""
    }
  });
  const [rowData, setRowData] = useState<any>([]);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const allgridRef = useRef<any>();
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 150,
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
    };
  }, []);
  const onFilterTextBoxChanged = useCallback(() => {

    allgridRef.current!.api!.setGridOption(
      'quickFilterText',

      getValues().search
    );
  }, []);
  const columnDefs:ColDef[] = [
    {
      field: 'id',
      headerName: '#',
      minWidth: 90,
      maxWidth: 80,
      sortable: true,
      unSortIcon: true,
      rowDrag:true,
      filter: false
    },
    {
      field: 'user_full_name',
      headerName: 'نام  کاربر',
      cellRenderer: (params:any) => {
        return (
          <>
          {params.data.first_name ? <span className='text-sm'>{params.data.user_full_name}</span> : <button className='bg-slate-300 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
          </>
        )
     
       }
        },
   
        {
          field: 'excahnge',
          headerName: 'ارز',
          cellRenderer: (params:any) => {
            return (
              <>
              {params?.data?.source_name && params?.data?.destination_name ? <span>{params.data.source_name +  "/" + params.data.destination_name
              }</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
              </>
            )
         
           }
            },
    
        
        
      
        {
          field: 'exchangeValue',
          headerName: 'مقدار ارز',
          cellRenderer: (params:any) => {
            return (
              <>
              {params.data.destination_amount ? <span className='text-base'>{params.data.destination_amount + " " + params.data.destination_name}</span> : <button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
              </>
            )
         
           }
        
        },
            {
              field: 'type',
              headerName: 'نوع سفارش',
              cellRenderer: (params:any) => {
                return (
                  <>
                  {<button className='bg-green-600 text-white text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none '>خرید</button>}
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
                 
                
                        <button className='bg-yellow-500 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black' ><NavLink to={"../../order/detail/" + params.data.id}>جزییات سفارش </NavLink></button>
                        {/* <button className='bg-red-500 mr-2 text-xs py-2 cursor-pointer rounded-md px-2  outline-none text-white' >حذف سفارش</button> */}
        
                  
                   
                  </div>
                
                
                );
              },
              filter: false
            },
  ];
  useEffect(() => {
    getBuyOrders();
 
  }, [page,rowsPerPage]);

 

 
  const getBuyOrders = () => {
    instance.get(ApiHelper.get("Order"),{params: {
      status: "",
      type: "purchase",
      page: page,
      count: rowsPerPage
    }}).then((res:any) => {
      setRowData(res?.data?.results)
    })
  }



  return (
    <Fragment>
       <div className="bg-white border border-[#2c3c511a] rounded-xl flex justify-between p-4 mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-primary">  سفارشات خرید</h3>
        </div>
      </div>
        <QuickSearch activeSearch={false}   register={register}
                control={control}   onSubmit={onFilterTextBoxChanged}/>
      <div
        className="absolute right-0 bottom-0 bg-white w-full"
        style={{ boxShadow: '0px -2px 7px 0px rgba(0, 0, 0, 0.05)' }}
      >
           <PaginationLib page={page} setPage={setPage} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} />
      </div>
      <div style={containerStyle}>

      <div style={gridStyle} className="ag-theme-quartz w-full  pb-32 pt-6">
        <AgGridReact
          ref={allgridRef}
          getRowId={(params) => params.data.id}
          
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

export default BuyOrder;
