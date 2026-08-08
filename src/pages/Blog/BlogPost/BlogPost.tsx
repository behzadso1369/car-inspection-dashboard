import React, { useRef, useState, Fragment, useMemo, useCallback, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';
import { AG_GRID_LOCALE_FN } from '../../../utils/ag-grid-localize/localize';
import PaginationLib from '../../../libs/pagination/pagination';
import { useForm } from 'react-hook-form';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import QuickSearch from '../../../libs/quick-search/quick-search';
import { CircularProgress } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import DeleteBlogPost from './DeleteBlogPost';
import { Image } from 'antd';
import { ListPageShell } from '../../../components/list/ListPageShell';
import { ResponsiveDataView } from '../../../components/list/ResponsiveDataView';
import { FixedPaginationBar } from '../../../components/list/FixedPaginationBar';
import { cardFieldsFromColDefs } from '../../../utils/listCardHelpers';
import { CardAction } from '../../../types/list';
const BlogPost: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showDeleteUser, setShowDeleteUser] = useState<boolean>(false);
  const [blogCatId, setBlogCatId] = useState<number>(0);
  const [blogCatName,setBlogCatName] = useState<string>("");
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [search,setSearch] = useState<string>("")
  const [count, setCount] = React.useState(0);

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
    instance.get(ApiHelper.get("BlogPostList"),{params: {pageNumber:page,pageSize:rowsPerPage}}).then((res:any) => {
      setRowData(res?.data?.resultObject);
         setCount(res?.data?.countData);
    })
  }
  useEffect(() => {
    getAllRoles();
 
  }, [page,rowsPerPage,showAddModal,showDeleteUser,search]);

  const deleteBlog = (params:any) => {
    setBlogCatId(params.data.id);
    setBlogCatName(params.data.title);
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
      maxWidth:60,
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
            field: 'slug',
            headerName: 'slug',
            cellRenderer: (params:any) => {
              return (
                <>
                {params.data.slug ? <span>{params.data.slug}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
                </>
              )
           
             }
              },
        {
            field: 'isPublished',
            headerName: 'منتشر شده است؟',
            cellRenderer: (params:any) => {
              return (
                <>
                {params.data.isPublished ? <span>{params.data.isPublished ? "بله" : "خیر"}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
                </>
              )
           
             }
              },
              {
                field: 'IsFirstPage',
                headerName: 'نمایش در صفحه اصلی',
                cellRenderer: (params:any) => {
                  return (
                    <>
                    {params.data.isFirstPage ? <span>{params.data.isFirstPage ? "بله" : "خیر"}</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
                    </>
                  )
               
                 }
                  },
                  {
                    field: 'category',
                    headerName: 'دسته بندی ',
                    cellRenderer: (params:any) => {
                      return (
                        <>
                        {params.data.category.name ? <span>{params.data.category.name }</span> :<button className='bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2  outline-none text-black'>ثبت نشده است</button>}
                        </>
                      )
                   
                     }
                      },
              {
                field: 'ImagePath',
                headerName: 'عکس',
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
                          navigate(`./edit?id=${params.data.id}`);
                          }}>ویرایش  </button>
                        <button className='bg-red-500 mr-2 text-xs py-2 cursor-pointer rounded-md px-2  outline-none text-white' onClick={() => deleteBlog(params)}>حذف  </button>
                  </div>
                      
                      
                      );
                    },
                    filter: false
                  },
  ];
  const cardFields = cardFieldsFromColDefs(columnDefs, {
    primaryField: 'title',
    valueOverrides: {
      category: (row) => row.category?.name || '—',
      isPublished: (row) => (row.isPublished ? 'بله' : 'خیر'),
      IsFirstPage: (row) => (row.isFirstPage ? 'بله' : 'خیر'),
    },
  });

  const cardActions: CardAction[] = useMemo(
    () => [
      {
        key: 'edit',
        label: 'ویرایش',
        variant: 'ghost',
        onClick: (row) => navigate(`./edit?id=${row.id}`),
      },
      {
        key: 'delete',
        label: 'حذف',
        variant: 'danger',
        onClick: (row) => {
          setBlogCatId(row.id);
          setBlogCatName(row.title);
          setShowDeleteUser(true);
        },
      },
    ],
    [navigate]
  );

  const onFilterTextBoxChanged = useCallback(() => {
    allgridRef.current!.api!.setGridOption('quickFilterText', getValues().search);
  }, [getValues]);

  const overlayComponent = () => (
    <div className="bg-white flex justify-center items-center w-full h-80">
      <CircularProgress />
    </div>
  );

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
  );

  return (
    <Fragment>
      <ListPageShell
        title="پست های بلاگ"
        headerAction={
          <NavLink
            to="./create"
            className="bg-brand w-full sm:w-auto min-h-[44px] px-4 rounded-xl text-white text-sm flex items-center justify-center"
          >
            اضافه کردن پست بلاگ
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
          emptyMessage="پستی یافت نشد"
          getRowKey={(row, index) => row.id ?? index}
          desktopView={desktopView}
        />
      </ListPageShell>
      {showDeleteUser && (
        <DeleteBlogPost
          slideId={blogCatId}
          slideName={blogCatName}
          showDeleteModal={showDeleteUser}
          setShowDeleteModal={setShowDeleteUser}
        />
      )}
    </Fragment>
  );
};

export default BlogPost;
