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
import CreateFAQCategory from './CreateFAQCategory';
import DeleteFAQCategory from './DeleteFAQCategory';
import EditFAQCategory from './EditFAQCategory';

const FAQCategories: React.FunctionComponent = () => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [categoryName, setCategoryName] = useState<string>('');
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [count, setCount] = React.useState(0);
  const [showEditModal, setShowEditModal] = React.useState<boolean>(false);
  const [rowData, setRowData] = useState<any>();

  const allgridRef = useRef<any>();

  const { register, control, getValues } = useForm({
    defaultValues: {
      filterOrder: 1,
      search: '',
    },
  });

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 150,
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
    };
  }, []);

  const getAllCategories = () => {
    instance
      .get(ApiHelper.get('FAQCategoriesList'), { params: { pageNumber: page, pageSize: rowsPerPage } })
      .then((res: any) => {
        setRowData(res?.data?.resultObject);
        setCount(res?.data?.countData);
      });
  };

  useEffect(() => {
    getAllCategories();
  }, [page, rowsPerPage, showAddModal, showDeleteModal, showEditModal]);

  const deleteCategory = (params: any) => {
    setCategoryId(params.data.id);
    setCategoryName(params.data.name);
    setShowDeleteModal(true);
  };

  const columnDefs: ColDef[] = [
    {
      field: 'id',
      headerName: '#',
      sortable: true,
      unSortIcon: true,
      rowDrag: true,
      filter: false,
      pinned: 'right',
      maxWidth: 80,
      wrapText: false,
    },
    {
      field: 'name',
      headerName: 'نام',
      cellRenderer: (params: any) => {
        return (
          <>
            {params.data.name ? (
              <span>{params.data.name}</span>
            ) : (
              <button className="bg-slate-400 text-xs py-2 cursor-pointer mr-2 rounded-md px-2 outline-none text-black">
                ثبت نشده است
              </button>
            )}
          </>
        );
      },
    },
    {
      field: 'action',
      headerName: 'عملیات',
      cellRenderer: (params: any) => {
        return (
          <div className="flex justify-start items-start">
            <button
              className="bg-yellow-500 text-xs py-2 cursor-pointer mr-2 rounded-md px-2 outline-none text-black"
              onClick={() => {
                setShowEditModal(true);
                setCategoryId(params.data.id);
                setCategoryName(params.data.name);
              }}
            >
              ویرایش
            </button>
            <button
              className="bg-red-500 mr-2 text-xs py-2 cursor-pointer rounded-md px-2 outline-none text-white"
              onClick={() => deleteCategory(params)}
            >
              حذف
            </button>
          </div>
        );
      },
      filter: false,
    },
  ];

  const onFilterTextBoxChanged = useCallback(() => {
    allgridRef.current!.api!.setGridOption('quickFilterText', getValues().search);
  }, []);

  const overlayComponent = () => {
    return (
      <div className="bg-white flex justify-center items-center w-full h-80">
        <CircularProgress />
      </div>
    );
  };

  return (
    <Fragment>
      <div className="bg-white border border-[#2c3c511a] rounded-xl flex items-baseline justify-between p-4 mb-3">
        <h3 className="text-base font-bold text-primary">دسته بندی سوالات متداول</h3>
        <button
          className="bg-[#0047bc] px-2 text-sm py-2 cursor-pointer mr-2 rounded-md outline-none text-white"
          onClick={() => setShowAddModal(true)}
        >
          اضافه کردن دسته بندی
        </button>
      </div>
      <QuickSearch activeSearch={true} register={register} control={control} onSubmit={onFilterTextBoxChanged} />

      <div
        className="absolute right-0 bottom-0 bg-white w-full"
        style={{ boxShadow: '0px -2px 7px 0px rgba(0, 0, 0, 0.05)' }}
      >
        <PaginationLib
          count={count}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>
      <div style={containerStyle}>
        <div style={gridStyle} className="ag-theme-alpine w-full default-table pb-32 pt-6">
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
      {showAddModal && (
        <CreateFAQCategory showAddUserModal={showAddModal} setShowAddUserModal={setShowAddModal} />
      )}
      {showDeleteModal && (
        <DeleteFAQCategory
          categoryId={categoryId}
          categoryName={categoryName}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
        />
      )}
      {showEditModal && (
        <EditFAQCategory
          categoryId={categoryId}
          categoryName={categoryName}
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
        />
      )}
    </Fragment>
  );
};

export default FAQCategories;
