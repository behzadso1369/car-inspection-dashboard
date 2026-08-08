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
import CreateSlider from './CreateMasterSiteDetail';
import DeleteSlider from './DeleteMasterSiteDetail';
import { NavLink } from 'react-router-dom';
import CreateBlogCategory from './CreateMasterSiteDetail';
import EditBlogCategory from './EditMasterSiteDetail';
import CreateCarInspectionSrvice from './CreateMasterSiteDetail';
import DeleteCarInspectionSrvice from './DeleteMasterSiteDetail';
import EditCarInspectionSrvice from './EditMasterSiteDetail';
import {Image} from "antd";
import CreateSecretOfOurServiceQuality from './CreateMasterSiteDetail';
import DeleteSecretOfOurServiceQuality from './DeleteMasterSiteDetail';
import EditSecretOfOurServiceQuality from './EditMasterSiteDetail';
import CreateMasterSiteDetail from './CreateMasterSiteDetail';
import DeleteMasterSiteDetail from './DeleteMasterSiteDetail';
import EditMasterSiteDetail from './EditMasterSiteDetail';
import { ListPageShell } from '../../components/list/ListPageShell';
import { ResponsiveDataView } from '../../components/list/ResponsiveDataView';
import { FixedPaginationBar } from '../../components/list/FixedPaginationBar';
import { cardFieldsFromColDefs, defaultEditDeleteActions } from '../../utils/listCardHelpers';

const MasterSiteDetail: React.FunctionComponent = () => {
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
    instance.get(ApiHelper.get("MasterSiteDetailList"),{params: {pageNumber:page,pageSize:rowsPerPage}}).then((res:any) => {
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
    setShowEditModal(true);
    setSecretOfOurServiceQualityId(row.id);
    setSecretOfOurServiceQualityName(row.title);
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
      maxWidth:50,
      wrapText:false
     
    },
  
   
    {
      field: 'companyName',
      headerName: 'Ù†Ø§Ù… Ø´Ø±Ú©Øª ',
      cellRenderer: (params:any) => {
        return (
          <>
          {params.data.companyName ? <span>{params.data.companyName}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>Ø«Ø¨Øª Ù†Ø´Ø¯Ù‡ Ø§Ø³Øª</button>}
          </>
        )
     
       }
        },
        {
            field: 'slogan',
            headerName: 'Ø§Ø³Ù„ÙˆÚ¯Ø§Ù†',
            cellRenderer: (params:any) => {
              return (
                <>
                {params.data.slogan ? <span>{params.data.slogan}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>Ø«Ø¨Øª Ù†Ø´Ø¯Ù‡ Ø§Ø³Øª</button>}
                </>
              )
           
             }
              },
        {
            field: 'navbarPhoneNumber',
            headerName: 'Ø´Ù…Ø§Ø±Ù‡ ØªÙ„ÙÙ† Ø¨Ø§Ù„Ø§',
            cellRenderer: (params:any) => {
              return (
                <>
                {params.data.navbarPhoneNumber ? <span>{params.data.navbarPhoneNumber}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>Ø«Ø¨Øª Ù†Ø´Ø¯Ù‡ Ø§Ø³Øª</button>}
                </>
              )
           
             }
              },
        {
            field: 'phoneNumbers',
            headerName: 'ØªÙ„ÙÙ† Ù‡Ø§',
            cellRenderer: (params:any) => {
              return (
                <>
                {params.data.phoneNumbers ? <span>{params.data.phoneNumbers}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>Ø«Ø¨Øª Ù†Ø´Ø¯Ù‡ Ø§Ø³Øª</button>}
                </>
              )
           
             }
              },
        {
            field: 'workingHours',
            headerName: 'Ø³Ø§Ø¹Ø§Øª Ú©Ø§Ø±ÛŒ',
            cellRenderer: (params:any) => {
              return (
                <>
                {params.data.workingHours ? <span>{params.data.workingHours}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>Ø«Ø¨Øª Ù†Ø´Ø¯Ù‡ Ø§Ø³Øª</button>}
                </>
              )
           
             }
              },
        {
            field: 'address',
            headerName: 'Ø¢Ø¯Ø±Ø³',
            cellRenderer: (params:any) => {
              return (
                <>
                {params.data.address ? <span>{params.data.address}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>Ø«Ø¨Øª Ù†Ø´Ø¯Ù‡ Ø§Ø³Øª</button>}
                </>
              )
           
             }
              },
              {
                field: 'imagePath',
                headerName: 'Ø¹Ú©Ø³',
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
      headerName: 'Ø¹Ù…Ù„ÛŒØ§Øª',
     
     
      cellRenderer: (params:any) => {
        return (
   
          <div className="flex justify-start items-start">
          <button className='bg-yellow-500 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black' onClick={() => {
            
            setShowEditModal(true)
            setSecretOfOurServiceQualityId(params.data.id);
            setSecretOfOurServiceQualityName(params.data.title);
            }}>ÙˆÛŒØ±Ø§ÛŒØ´    </button>
          <button className='bg-red-500 mr-2 text-xs py-2 cursor-pointer rounded-md px-2  outline-none text-white' onClick={() => deleteBlog(params)}>Ø­Ø°Ù  </button>
    </div>
        
        
        );
      },
      filter: false
    },
  ];

  const cardFields = useMemo(
    () => cardFieldsFromColDefs(columnDefs, { primaryField: 'companyName' }),
    []
  );

  const cardActions = useMemo(
    () =>
      defaultEditDeleteActions({
        onEdit: openEdit,
        onDelete: openDelete,
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
        title="اطلاعات اصلی سایت"
        headerAction={
          <button
            className="bg-brand w-full sm:w-auto min-h-[44px] px-4 rounded-xl text-white"
            onClick={() => setShowAddModal(true)}
          >
            اضافه کردن
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
        <CreateMasterSiteDetail showAddUserModal={showAddModal} setShowAddUserModal={setShowAddModal} />
     )}
     
      {showDeleteUser && (
       <DeleteMasterSiteDetail secretOfOurServiceQualityId={secretOfOurServiceQualityId} secretOfOurServiceQualityName={secretOfOurServiceQualityName} showDeleteModal={showDeleteUser} setShowDeleteModal={setShowDeleteUser}/>
     )}
       {showEditModal && (
        <EditMasterSiteDetail secretOfOurServiceQualityId={secretOfOurServiceQualityId} secretOfOurServiceQualityName={secretOfOurServiceQualityName} showEditModal={showEditModal} setShowEditModal={setShowEditModal} />
     )}
    </Fragment>
  );
};

export default MasterSiteDetail;
