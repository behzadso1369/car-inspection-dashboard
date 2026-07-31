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
import CreateFAQ from './CreateFAQ';
import DeleteFAQ from './DeleteFAQ';
import EditFAQ from './EditFAQ';

const FAQ: React.FunctionComponent = () => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [faqId, setFaqId] = useState<number>(0);
  const [faqQuestion, setFaqQuestion] = useState<string>('');
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

  const getAllFAQs = () => {
    instance
      .get(ApiHelper.get('FAQList'), { params: { pageNumber: page, pageSize: rowsPerPage } })
      .then((res: any) => {
        setRowData(res?.data?.resultObject);
        setCount(res?.data?.countData);
      });
  };

  useEffect(() => {
    getAllFAQs();
  }, [page, rowsPerPage, showAddModal, showDeleteModal, showEditModal]);

  const deleteFAQItem = (params: any) => {
    setFaqId(params.data.id);
    setFaqQuestion(params.data.question);
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
      field: 'question',
      headerName: 'سوال',
      cellRenderer: (params: any) => {
        return (
          <>
            {params.data.question ? (
              <span>{params.data.question}</span>
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
      field: 'answer',
      headerName: 'پاسخ',
      cellRenderer: (params: any) => {
        return (
          <>
            {params.data.answer ? (
              <span>{params.data.answer}</span>
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
      field: 'categoryName',
      headerName: 'دسته بندی',
      cellRenderer: (params: any) => {
        return (
          <>
            {params.data.categoryName || params.data.category?.name ? (
              <span>{params.data.categoryName || params.data.category?.name}</span>
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
                setFaqId(params.data.id);
                setFaqQuestion(params.data.question);
              }}
            >
              ویرایش
            </button>
            <button
              className="bg-red-500 mr-2 text-xs py-2 cursor-pointer rounded-md px-2 outline-none text-white"
              onClick={() => deleteFAQItem(params)}
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
        <h3 className="text-base font-bold text-primary">سوالات متداول</h3>
        <button
          className="bg-[#0047bc] px-2 text-sm py-2 cursor-pointer mr-2 rounded-md outline-none text-white"
          onClick={() => setShowAddModal(true)}
        >
          اضافه کردن سوال
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
      {showAddModal && <CreateFAQ showAddUserModal={showAddModal} setShowAddUserModal={setShowAddModal} />}
      {showDeleteModal && (
        <DeleteFAQ
          faqId={faqId}
          faqQuestion={faqQuestion}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
        />
      )}
      {showEditModal && (
        <EditFAQ
          faqId={faqId}
          faqQuestion={faqQuestion}
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
        />
      )}
    </Fragment>
  );
};

export default FAQ;
