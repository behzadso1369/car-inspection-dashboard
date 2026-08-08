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
import CreateSlider from './CreateAboutUs';
import DeleteSlider from './DeleteAboutUs';
import { NavLink } from 'react-router-dom';
import CreateBlogCategory from './CreateAboutUs';
import EditBlogCategory from './EditAboutUs';
import CreateCarInspectionSrvice from './CreateAboutUs';
import DeleteCarInspectionSrvice from './DeleteAboutUs';
import EditCarInspectionSrvice from './EditAboutUs';
import {Image} from "antd";
import CreateSecretOfOurServiceQuality from './CreateAboutUs';
import DeleteSecretOfOurServiceQuality from './DeleteAboutUs';
import EditSecretOfOurServiceQuality from './EditAboutUs';
import CreateWhyWe from './CreateAboutUs';
import DeleteWhyWe from './DeleteAboutUs';
import EditWhyWe from './EditAboutUs';
import CreateAboutUs from './CreateAboutUs';
import DeleteAboutUs from './DeleteAboutUs';
import EditAboutUs from './EditAboutUs';
import { ListPageShell } from '../../components/list/ListPageShell';
import { ResponsiveDataView } from '../../components/list/ResponsiveDataView';
import { FixedPaginationBar } from '../../components/list/FixedPaginationBar';
import { cardFieldsFromColDefs, defaultEditDeleteActions } from '../../utils/listCardHelpers';
import { useNavigate } from 'react-router-dom';

const AboutUs: React.FunctionComponent = () => {
  const navigate = useNavigate();
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
    instance.get(ApiHelper.get("AboutUsList"),{params: {pageNumber:page,pageSize:rowsPerPage}}).then((res:any) => {
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
  };

  const openEdit = (row: any) => {
    navigate(`./${row.id}`);
  };

  const openDelete = (row: any) => {
    setSecretOfOurServiceQualityId(row.id);
    setSecretOfOurServiceQualityName(row.title);
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
      field: 'content',
      headerName: 'متن ',
      cellRenderer: (params:any) => {
        return (
          <>
          {params.data.content ? <span>{params.data.content}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
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
          <NavLink to={`./${params.data.id}`} className='bg-yellow-500 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black' >ویرایش    </NavLink>
          <button className='bg-red-500 mr-2 text-xs py-2 cursor-pointer rounded-md px-2  outline-none text-white' onClick={() => deleteBlog(params)}>حذف  خدمات</button>
    </div>
        
        
        );
      },
      filter: false
    },
  ];

  const cardFields = useMemo(
    () => cardFieldsFromColDefs(columnDefs, { primaryField: 'content' }),
    []
  );

  const cardActions = useMemo(
    () =>
      defaultEditDeleteActions({
        onEdit: openEdit,
        onDelete: openDelete,
        deleteLabel: 'حذف خدمات',
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
        title="درباره ما"
        headerAction={
          <NavLink
            to="../about-us/create"
            className="bg-brand w-full sm:w-auto min-h-[44px] px-4 rounded-xl text-white inline-flex items-center justify-center"
          >
            اضافه کردن
          </NavLink>
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
          emptyMessage="موردی وجود ندارد"
          getRowKey={(row) => row.id ?? row.Id}
          desktopView={desktopView}
        />
      </ListPageShell>
      {/* {showAddModal && (
        <CreateAboutUs showAddUserModal={showAddModal} setShowAddUserModal={setShowAddModal} />
     )} */}
     
      {showDeleteUser && (
       <DeleteAboutUs secretOfOurServiceQualityId={secretOfOurServiceQualityId} secretOfOurServiceQualityName={secretOfOurServiceQualityName} showDeleteModal={showDeleteUser} setShowDeleteModal={setShowDeleteUser}/>
     )}
       {/* {showEditModal && (
        <EditAboutUs secretOfOurServiceQualityId={secretOfOurServiceQualityId} secretOfOurServiceQualityName={secretOfOurServiceQualityName} showEditModal={showEditModal} setShowEditModal={setShowEditModal} />
     )} */}
   
    
   
    </Fragment>
   
  );
};

export default AboutUs;
