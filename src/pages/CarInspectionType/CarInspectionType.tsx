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
import CreateSlider from './CreateCarInspectionType';
import DeleteSlider from './DeleteCarInspectionType';
import { NavLink } from 'react-router-dom';
import CreateBlogCategory from './CreateCarInspectionType';
import EditBlogCategory from './EditCarInspectionType';
import CreateCarInspectionSrvice from './CreateCarInspectionType';
import DeleteCarInspectionSrvice from './DeleteCarInspectionType';
import EditCarInspectionSrvice from './EditCarInspectionType';
import {Image} from "antd";
import { ListPageShell } from '../../components/list/ListPageShell';
import { ResponsiveDataView } from '../../components/list/ResponsiveDataView';
import { FixedPaginationBar } from '../../components/list/FixedPaginationBar';
import { cardFieldsFromColDefs, defaultEditDeleteActions } from '../../utils/listCardHelpers';
import CreateSecretOfOurServiceQuality from './CreateCarInspectionType';
import DeleteSecretOfOurServiceQuality from './DeleteCarInspectionType';
import EditSecretOfOurServiceQuality from './EditCarInspectionType';
import CreateCarInspectionType from './CreateCarInspectionType';
import DeleteCarInspectionType from './DeleteCarInspectionType';
import EditCarInspectionType from './EditCarInspectionType';
const CarInspectionType: React.FunctionComponent = () => {
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
    instance.get(ApiHelper.get("CarInspectionTypeList"),{params: {pageNumber:page,pageSize:rowsPerPage}}).then((res:any) => {
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
      field: 'name',
      headerName: 'نام ',
      cellRenderer: (params:any) => {
        return (
          <>
          {params.data.name ? <span>{params.data.name}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
          </>
        )
     
       }
        },
        {
            field: 'inspectionTypeDescription',
            headerName: 'توضیحات',
            cellRenderer: (params:any) => {
              return (
                <>
                {params.data.inspectionTypeDescription ? <span>{params.data.inspectionTypeDescription}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
                </>
              )
           
             }
              },
              {
                field: 'featureIds',
                headerName: 'ویژگی ها',
                autoHeight:true,
                cellRenderer: (params:any) => {
                  return (
                    <>
                    {params.data.inspectionTypeDescription ? <div>{params.data.features.map((item:any) => (
                      <span>{item.name} -</span>
                    ))}</div> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
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
            }}>ویرایش    </button>
          <button className='bg-red-500 mr-2 text-xs py-2 cursor-pointer rounded-md px-2  outline-none text-white' onClick={() => deleteBlog(params)}>حذف  </button>
    </div>
        
        
        );
      },
      filter: false
    },
  ];

  const cardFields = cardFieldsFromColDefs(columnDefs, {
    primaryField: 'name',
    valueOverrides: {
      featureIds: (row: any) =>
        row.features?.map((item: any) => item.name).join(' - ') || '—',
    },
  });
  const cardActions = defaultEditDeleteActions({
    onEdit: (row) => {
      setShowEditModal(true);
      setSecretOfOurServiceQualityId(row.id);
      setSecretOfOurServiceQualityName(row.title);
    },
    onDelete: (row) => {
      setSecretOfOurServiceQualityId(row.id);
      setSecretOfOurServiceQualityName(row.title);
      setShowDeleteUser(true);
    },
  });

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
          rowData={rowData ?? []}
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
        title="نوع کارشناسی خودرو"
        headerAction={
          <button
            className="bg-brand w-full sm:w-auto min-h-[44px] px-4 rounded-xl text-white"
            onClick={() => setShowAddModal(true)}
          >
            اضافه کردن    نوع کارشناسی خودرو
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
          getRowKey={(row) => row.id ?? row.Id}
          desktopView={desktopView}
        />
      </ListPageShell>
      {showAddModal && (
        <CreateCarInspectionType showAddUserModal={showAddModal} setShowAddUserModal={setShowAddModal} />
     )}
     
      {showDeleteUser && (
       <DeleteCarInspectionType secretOfOurServiceQualityId={secretOfOurServiceQualityId} secretOfOurServiceQualityName={secretOfOurServiceQualityName} showDeleteModal={showDeleteUser} setShowDeleteModal={setShowDeleteUser}/>
     )}
       {showEditModal && (
        <EditCarInspectionType secretOfOurServiceQualityId={secretOfOurServiceQualityId} secretOfOurServiceQualityName={secretOfOurServiceQualityName} showEditModal={showEditModal} setShowEditModal={setShowEditModal} />
     )}
   
    
   
    </Fragment>
   
  );
};

export default CarInspectionType;
