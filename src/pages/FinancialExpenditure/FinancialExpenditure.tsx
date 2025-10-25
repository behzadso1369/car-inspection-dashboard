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
import CreateSlider from './CreateFinancialExpenditure';
import DeleteSlider from './DeleteFinancialExpenditure';
import { NavLink } from 'react-router-dom';
import CreateBlogCategory from './CreateFinancialExpenditure';
import EditBlogCategory from './EditFinancialExpenditure';
import CreateCarInspectionSrvice from './CreateFinancialExpenditure';
import DeleteCarInspectionSrvice from './DeleteFinancialExpenditure';
import EditCarInspectionSrvice from './EditFinancialExpenditure';
import {Image} from "antd";
import CreateSecretOfOurServiceQuality from './CreateFinancialExpenditure';
import DeleteSecretOfOurServiceQuality from './DeleteFinancialExpenditure';
import EditSecretOfOurServiceQuality from './EditFinancialExpenditure';
import CreateWhyWe from './CreateFinancialExpenditure';
import DeleteWhyWe from './DeleteFinancialExpenditure';
import EditWhyWe from './EditFinancialExpenditure';
import CreateFinancialExpenditure from './CreateFinancialExpenditure';
import DeleteFinancialExpenditure from './DeleteFinancialExpenditure';
import EditFinancialExpenditure from './EditFinancialExpenditure';
import image from "../../assets/images/Login.jpg"
const FinancialExpenditure: React.FunctionComponent = () => {
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
    instance.get(ApiHelper.get("FinancialExpenditureList"),{params: {pageNumber:page,pageSize:rowsPerPage}}).then((res:any) => {
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
      field: 'title',
      headerName: 'عنوان ',
      cellRenderer: (params:any) => {
        return (
          <>
          {params.data.title ? <span>{params.data.title}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
          </>
        )
     
       }
        },
        {
            field: 'descriptionsData',
            headerName: 'توضیحات',
            cellRenderer: (params:any) => {
              return (
                <>
                {params.data.descriptionsData ? <span>{params.data.descriptionsData}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
                </>
              )
           
             }
              },
              {
                field: 'image',
                headerName: 'عکس',
                autoHeight:true,
                cellRenderer: (params:any) => {
                   const imagePath = params?.data?.imagePath;
                  
                  return (
                    <div className="flex items-center py-2">
                       <Image
                         onError={(e) => {
                          
        // e. = image; // Fallback if image fails to load
      }}
                    style={{width: "100px",height: "70px",borderRadius: "7px",objectFit: "cover" }}
                    src={imagePath ? "https://api.carmacheck.com/" + imagePath : image}
                    /> 
                        
                    </div>
                   
                      
                   
                 
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
            }}>ویرایش   خدمات </button>
          <button className='bg-red-500 mr-2 text-xs py-2 cursor-pointer rounded-md px-2  outline-none text-white' onClick={() => deleteBlog(params)}>حذف  خدمات</button>
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




  return (
    <Fragment>
    
       <div className="bg-white border border-[#2c3c511a] rounded-xl flex items-baseline justify-between p-4 mb-3">
        
          <h3 className="text-base font-bold text-primary">خرجکرد مالی</h3>
          <button  className='bg-[#0047bc] px-2  text-sm py-2 cursor-pointer mr-2 rounded-md   outline-none text-white' onClick={() => setShowAddModal(true)}>اضافه کردن خرجکرد مالی   </button>
      
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
        <CreateFinancialExpenditure showAddUserModal={showAddModal} setShowAddUserModal={setShowAddModal} />
     )}
     
      {showDeleteUser && (
       <DeleteFinancialExpenditure secretOfOurServiceQualityId={secretOfOurServiceQualityId} secretOfOurServiceQualityName={secretOfOurServiceQualityName} showDeleteModal={showDeleteUser} setShowDeleteModal={setShowDeleteUser}/>
     )}
       {showEditModal && (
        <EditFinancialExpenditure secretOfOurServiceQualityId={secretOfOurServiceQualityId} secretOfOurServiceQualityName={secretOfOurServiceQualityName} showEditModal={showEditModal} setShowEditModal={setShowEditModal} />
     )}
   
    
   
    </Fragment>
   
  );
};

export default FinancialExpenditure;
