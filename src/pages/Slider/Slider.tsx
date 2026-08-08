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
import CreateSlider from './CreateSlider';
import DeleteSlider from './DeleteSlider';
import { NavLink } from 'react-router-dom';
import { Image } from 'antd';
import EditSlider from './EditSlider';
import { ListPageShell } from '../../components/list/ListPageShell';
import { ResponsiveDataView } from '../../components/list/ResponsiveDataView';
import { FixedPaginationBar } from '../../components/list/FixedPaginationBar';
import { cardFieldsFromColDefs, defaultEditDeleteActions } from '../../utils/listCardHelpers';

const Slider: React.FunctionComponent = () => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showDeleteUser, setShowDeleteUser] = useState<boolean>(false);
  const [sliderId, setSlideId] = useState<number>(0);
  const [slideName, setSlideName] = useState<string>("");
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [search,setSearch] = useState<string>("")
  const [count, setCount] = React.useState(0);

  const [rowData, setRowData] = useState<any>();
  const [showEditModal, setShowEditModal] = React.useState<boolean>(false);

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
    instance.get(ApiHelper.get("SliderList"),{params: {pageNumber:page,pageSize:rowsPerPage}}).then((res:any) => {
      setRowData(res?.data?.resultObject);
         setCount(res?.data?.countData);
    })
  }
  useEffect(() => {
    getAllRoles();
 
  }, [page,rowsPerPage,showAddModal,showDeleteUser,search,showAddModal,showEditModal]);

  const deleteSlider = (params:any) => {
    setSlideId(params.data.id);
    setSlideName(params.data.text);
    setShowDeleteUser(true);
  };

  const openEdit = (row: any) => {
    setShowEditModal(true);
    setSlideId(row.id);
    setSlideName(row.text);
  };

  const openDelete = (row: any) => {
    setSlideId(row.id);
    setSlideName(row.text);
    setShowDeleteUser(true);
  };


 

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
      field: 'text',
      headerName: 'متن ',
      cellRenderer: (params:any) => {
        return (
          <>
          {params.data.text ? <span>{params.data.text}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
          </>
        )
     
       }
        },
        {
            field: 'link',
            headerName: 'Lilinknk',
            cellRenderer: (params:any) => {
              return (
                <>
                {params.data.link ? <span>{params.data.link}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
                </>
              )
           
             }
              },
              {
                field: 'imagePath',
                headerName: 'عکس',
                autoHeight:true,
                cellRenderer: (params:any) => {
                  return (
                    <div className="flex items-center py-2">
                    <Image
               style={{width: "100px",height: "70px",borderRadius: "7px",objectFit: "cover" }}
               src={"https://api.carmacheck.com/" + params.data.imagePath}
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
            setSlideId(params.data.id);
            setSlideName(params.data.text);
            }}>ویرایش   اسلاید </button>
          <button className='bg-red-500 mr-2 text-xs py-2 cursor-pointer rounded-md px-2  outline-none text-white' onClick={() => deleteSlider(params)}>حذف  اسلاید</button>
    </div>
        
        
        );
      },
      filter: false
    },
  ];

  const cardFields = useMemo(
    () => cardFieldsFromColDefs(columnDefs, { primaryField: 'text' }),
    []
  );

  const cardActions = useMemo(
    () =>
      defaultEditDeleteActions({
        onEdit: openEdit,
        onDelete: openDelete,
        editLabel: 'ویرایش اسلاید',
        deleteLabel: 'حذف اسلاید',
      }),
    []
  );

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
        title="اسلایدها"
        headerAction={
          <button
            className="bg-brand w-full sm:w-auto min-h-[44px] px-4 rounded-xl text-white"
            onClick={() => setShowAddModal(true)}
          >
            اضافه کردن اسلاید
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
          emptyMessage="اسلایدی وجود ندارد"
          getRowKey={(row) => row.id ?? row.Id}
          desktopView={desktopView}
        />
      </ListPageShell>
      {showAddModal && (
        <CreateSlider showAddUserModal={showAddModal} setShowAddUserModal={setShowAddModal} />
     )}
     
      {showDeleteUser && (
       <DeleteSlider slideId={sliderId} slideName={slideName} showDeleteModal={showDeleteUser} setShowDeleteModal={setShowDeleteUser}/>
     )}
         {showEditModal && (
        <EditSlider slideId={sliderId} slideName={slideName} showEditModal={showEditModal} setShowEditModal={setShowEditModal} />
     )}
   
    
   
    </Fragment>
   
  );
};

export default Slider;
