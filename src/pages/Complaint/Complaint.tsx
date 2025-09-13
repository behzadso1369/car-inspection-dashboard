import React, { useRef, useState, Fragment, useMemo, useCallback, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Link } from 'react-router-dom';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';


import { QuickSearch } from '../../libs/quick-search/quick-search';
import { AG_GRID_LOCALE_FN } from '../../utils/ag-grid-localize/localize';
import PaginationLib from '../../libs/pagination/pagination';


import { useForm } from 'react-hook-form';
import { complaintData } from '../../data/data';
import complaintType from '../../utils/complaintType';



const CompalaintMain: React.FunctionComponent = () => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const [activeSearch, setActiveSearch] = useState<boolean>(false);

  const allgridRef = useRef<any>();
  const { register, getValues,  control ,watch } =
  useForm();
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 150,
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
    };
  }, []);
  useEffect(() => {
    const subscription = watch(() => {
      setActiveSearch(Boolean(getValues().search));
    });
    return () => subscription.unsubscribe();
  }, [getValues, watch]);

 

  const columnDefs:ColDef[] = [
    {
      field: 'id',
      headerName: '#',
    
      sortable: true,
      unSortIcon: true,
      rowDrag:true,
      filter: false
    },
    {
      field: 'complaintType',
      headerName: 'نوع شکایت',
      cellRenderer: (params: any) => {
        const colorClass = complaintType(params.data.complaintType);
        return (
          <div>
             <div
             className={`${colorClass} text-[0.625rem] rounded-lg px-3 h-7 flex justify-center items-center`}
           >
            {params.data.complaintType}
            </div>
 
          </div>
        );
      },
    
      filter: 'agSetColumnFilter'
    },
   
    {
      field: 'customerName',
      headerName: 'نام مشتری',
    
    },
    {
      field: 'complaintTitle',
      headerName: 'موضوع شکایت',
   
    },
   
    {
      field: 'action',
      headerName: 'عملیات',
      cellRenderer: (params: any) => {
        return (
          <div className="flex justify-start items-start gap-3 w-16">
            <Link to={`${params.data.id}`}>
              <span
                className="border-b border-[#0054F6] text-[#0054F6] text-[10px]"
                style={{ lineHeight: '26px' }}
              >
                جواب به شکایت
              </span>
            </Link>
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
 



  return (
    <Fragment>
        <QuickSearch activeSearch={activeSearch}   register={register}
                control={control}   onSubmit={onFilterTextBoxChanged}/>
        {/* <div className="w-full flex gap-2 justify-end items-end pt-2">
        {params.map(([key, value]) => {
          const titleText = dataOptions[key]?.filter(
            (item: any) => item.value === value
          )[0].title;

          return (
            <div>
              {value === '0' ? null : (
                <Chip
                  title={titleText ?? value}
                  clickHandler={() => clickHandler(key)}
                />
              )}
            </div>
          );
        })}
        <Button
          title={'فیلتر'}
          active={true}
          style={SecondaryButton}
          icon={faFilter}
          iconStyle="text-secondary"
          onClick={() => setFilter(!filter)}
        />
      </div>

      {filter && (
        <Filter setFilter={setFilter}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col xl:flex-row gap-10">
              <div className="flex flex-col gap-6">
                <Datepicker
                  label={'تاریخ سفارش'}
                  register={register}
                  control={control}
                  title="fromDate"
                />
              </div>
              <div className="flex flex-col gap-6">
                <Datepicker
                  label={'تاریخ درخواست'}
                  register={register}
                  control={control}
                  title="upToDate"
                />
               
              </div>
              <Dropdown
                register={register}
                control={control}
                title="orderType"
                label={'نوع سفارش'}
                option={dataOptions.orderType}
                fullWidth={false}
              />
            </div>

            <div className="flex flex-col justify-end h-32">
              <div className="flex justify-end gap-3 mt-3">
                <Button
                  title={'حذف فیلتر'}
                  active={true}
                  style={SecondaryButton}
                />
                <Button
                  title={'اعمال فیلتر'}
                  active={true}
                  style={PrimaryButton}
                  onClick={() => onSubmit()}
                />
              </div>
            </div>
          </form>
        </Filter>
      )} */}
      <div
        className="absolute right-0 bottom-0 bg-white w-full"
        style={{ boxShadow: '0px -2px 7px 0px rgba(0, 0, 0, 0.05)' }}
      >
        {/* <PaginationLib /> */}
      </div>
      <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-alpine w-full default-table pb-32 pt-6">
        <AgGridReact
          ref={allgridRef}
          getRowId={(params) => params.data.id}
          
          animateRows={true}
          rowHeight={60}
          headerHeight={50}
          domLayout="autoHeight"
          rowData={complaintData}
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

export default CompalaintMain;
