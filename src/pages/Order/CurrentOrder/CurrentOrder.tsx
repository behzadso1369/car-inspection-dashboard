'use strict';
import React, { useRef, useState, Fragment, useMemo, useCallback, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';

import { Link } from 'react-router-dom';
import imgUrl from '../../../assets/images/time.png'

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';
import { ColDef, IDateFilterParams } from 'ag-grid-community';


import { QuickSearch } from '../../../libs/quick-search/quick-search';


import { AG_GRID_LOCALE_FN } from '../../../utils/ag-grid-localize/localize';







// import  defaultColDef  from '../../utils/agGrid';
import statusDetector from '../../../utils/statusDetector';

import { useForm } from 'react-hook-form';


import { dataOptions } from '../data/data';
import Dropdown from '../../../libs/dropdown/dropdown';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import { CircularProgress } from '@mui/material';


const CurrentOrder: React.FunctionComponent = () => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const [activeSearch, setActiveSearch] = useState<boolean>(false);
  const [hidePiece, setHidePiece] = useState<boolean>(true);
  const [rowData, setRowData] = useState<any>();

  const allgridRef = useRef<any>();

  const { register, getValues, control,watch } =
  useForm({
    defaultValues: {
      filterOrder: 1
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
  var filterParams: IDateFilterParams = {
    comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
      var dateAsString = cellValue;
      if (dateAsString == null) return -1;
      var dateParts = dateAsString.split('/');
      var cellDate = new Date(
        Number(dateParts[2]),
        Number(dateParts[1]) - 1,
        Number(dateParts[0])
      );
      if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
        return 0;
      }
      if (cellDate < filterLocalDateAtMidnight) {
        return -1;
      }
      if (cellDate > filterLocalDateAtMidnight) {
        return 1;
      }
      return 0;
    },
  };
  const getCurrentOrder = (id:number) => {
    instance.get(ApiHelper.get("getAllRequests"),{params: {ResultType:id}}).then((res:any) => {
      setRowData(res?.data?.data)
    })
  }
  useEffect(() => {
    getCurrentOrder(1);
    const subscription = watch(() => {
      setActiveSearch(Boolean(getValues()));
      getCurrentOrder(getValues().filterOrder);
      if(getValues().filterOrder === 1) {
          setHidePiece(true)
      }else {
        setHidePiece(false)

      }
    });
    return () => subscription.unsubscribe();
  }, [getValues, watch]);

 

  const columnDefs:ColDef[] = [
    {
      field: 'requestId',
      headerName: '#',
      maxWidth: 90,
      sortable: true,
      unSortIcon: true,
      rowDrag:true,
      filter: false
    },
    {
      field: 'orderTypeId',
      headerName: '#',
     hide:true
    },
    {
      field: 'orderTypeTitle',
      headerName: 'نوع سفارش',
      cellRenderer: (params: any) => {
        const colorClass = statusDetector(params.data.orderTypeId);
        return (
          <div>
             <div
             className={`${colorClass} text-[0.625rem] rounded-lg px-3 h-7 flex justify-center items-center`}
           >
            {params.data.orderTypeTitle}
            </div>
 
          </div>
        );
      },
      maxWidth: 120,
      filter: 'agSetColumnFilter'
    },
    {
      field: 'equipPartTitle',
      headerName: 'نام قطعه',
      maxWidth: 120,
      hide: hidePiece
    },
   
    {
      field: 'customerName',
      headerName: 'نام مشتری',
      maxWidth: 120,
    },
    {
      field: 'userLastName',
      headerName: 'کارشناس مشتری',
      maxWidth: 170,
    },
    {
      field: 'startDate',
      headerName: 'تاریخ دریافت درخواست',
      maxWidth: 200,
      sortable: true,
      unSortIcon: true,
      cellRenderer: (params: any) => {
        return (
          <div className="flex items-center gap-4">
            <img
              className="w-5 h-5"
              src={imgUrl}
              alt="time"
            />
            <span>{params.data.startDate}</span>
          </div>
        );
      },
      filter: 'agDateColumnFilter',
      filterParams: filterParams,
    },
    {
      field: 'refCode',
      headerName: 'شماره ارجاع',
      maxWidth: 120,
    },
    {
      field: 'equiptitle',
      headerName: 'نام تجهیز',
      maxWidth: 130,
      hide: hidePiece,
      filter: 'agSetColumnFilter'
    },
    {
      field: 'action',
      headerName: 'عملیات',
      cellRenderer: (params: any) => {
        return (
   
  <div className="flex justify-start items-start">
         
            {/* <ShowForPermission role={["MANAGER"]}>
            <Link to={`${params.data.requestId}`}>
              <span
                className="border-b border-[#0054F6] text-[#0054F6] text-[10px]"
                style={{ lineHeight: '26px' }}
              >
               جزییات سفارش
              </span>
            </Link>

            </ShowForPermission> */}
            <Link to={`order-tracking/${params.data.requestId}`}>
              <span
                className="border-b mr-2 border-[#0054F6] text-[#0054F6] text-[10px]"
                style={{ lineHeight: '26px' }}
              >
               پیگیری سفارش
              </span>
            </Link>
            {/* {params.data.state === 'none' && (
              <p
                onClick={() => errorHandler(params.data)}
                className="text-[#FF3E3E] text-[10px] cursor-pointer"
              >
                اعلام خطا
              </p>
            )} */}
          </div>
        
        
        );
      },
  
      filter: false
    },
  ];
  const onFilterTextBoxChanged = useCallback(() => {

    allgridRef.current!.api!.setGridOption(
      'quickFilterText',
      // getValues().search
    );
  }, []);
  const overlayComponent = () => {
    return (
      <div className='bg-white flex justify-center items-center w-full h-64'>
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
        <div className="bg-white border border-[#2c3c511a] rounded-xl flex justify-between p-4 mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-primary"> سفارشات </h3>
        </div>
      </div>
        <QuickSearch activeSearch={activeSearch}   register={register}
                control={control}   onSubmit={onFilterTextBoxChanged}/>
      <div
        className="absolute right-0 bottom-0 bg-white w-full"
        style={{ boxShadow: '0px -2px 7px 0px rgba(0, 0, 0, 0.05)' }}
      >
        {/* <PaginationLib /> */}
      </div>
      <div style={containerStyle}>
      <div className='w-full flex flex-wrap align-baseline mt-3'> 
              
              <Dropdown
                register={register}
                
                control={control}
                title="filterOrder"
                label='تفکیک براساس'
                
                option={dataOptions.filterOrder}
                fullWidth={true}
              />
              </div>

      <div style={gridStyle} className="ag-theme-quartz w-full  pb-32 pt-6">
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
    
   
    </Fragment>
  );
};

export default CurrentOrder;
