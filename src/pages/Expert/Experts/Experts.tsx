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
import CreateExpert from './CreateExpert';
import EditExpert from './EditExpert';
import DeleteExpert from './DeleteExpert';
import ExpertCoverageAreas from './ExpertCoverageAreas';

const Experts: React.FunctionComponent = () => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCoverageModal, setShowCoverageModal] = useState(false);
  const [expertId, setExpertId] = useState(0);
  const [expertName, setExpertName] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [rowData, setRowData] = useState<any>();

  const allgridRef = useRef<any>();

  const { register, control, getValues } = useForm({
    defaultValues: { filterOrder: 1, search: '' },
  });

  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      minWidth: 120,
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
    }),
    []
  );

  const getAllExperts = () => {
    instance
      .get(ApiHelper.get('ExpertList'), { params: { pageNumber: page, pageSize: rowsPerPage } })
      .then((res: any) => {
        setRowData(res?.data?.resultObject);
        setCount(res?.data?.countData);
      });
  };

  useEffect(() => {
    getAllExperts();
  }, [page, rowsPerPage, showAddModal, showDeleteModal, showEditModal]);

  const columnDefs: ColDef[] = [
    {
      field: 'id',
      headerName: '#',
      sortable: true,
      pinned: 'right',
      maxWidth: 80,
      filter: false,
    },
    { field: 'fullName', headerName: 'نام کامل' },
    { field: 'phoneNumber', headerName: 'موبایل' },
    { field: 'nationalCode', headerName: 'کد ملی' },
    { field: 'baseCity', headerName: 'شهر پایگاه' },
    {
      field: 'isActive',
      headerName: 'وضعیت',
      cellRenderer: (params: any) => (
        <span
          className={`text-xs py-1 px-2 rounded-md ${
            params.data.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
          }`}
        >
          {params.data.isActive ? 'فعال' : 'غیرفعال'}
        </span>
      ),
    },
    {
      field: 'action',
      headerName: 'عملیات',
      filter: false,
      minWidth: 280,
      cellRenderer: (params: any) => (
        <div className="flex justify-start items-center gap-2 flex-wrap">
          <button
            className="bg-blue-500 text-xs py-2 cursor-pointer rounded-md px-2 outline-none text-white"
            onClick={() => {
              setExpertId(params.data.id);
              setExpertName(params.data.fullName);
              setShowCoverageModal(true);
            }}
          >
            محدوده پوشش
          </button>
          <button
            className="bg-yellow-500 text-xs py-2 cursor-pointer rounded-md px-2 outline-none text-black"
            onClick={() => {
              setExpertId(params.data.id);
              setExpertName(params.data.fullName);
              setShowEditModal(true);
            }}
          >
            ویرایش
          </button>
          <button
            className="bg-red-500 text-xs py-2 cursor-pointer rounded-md px-2 outline-none text-white"
            onClick={() => {
              setExpertId(params.data.id);
              setExpertName(params.data.fullName);
              setShowDeleteModal(true);
            }}
          >
            حذف
          </button>
        </div>
      ),
    },
  ];

  const onFilterTextBoxChanged = useCallback(() => {
    allgridRef.current!.api!.setGridOption('quickFilterText', getValues().search);
  }, []);

  const overlayComponent = () => (
    <div className="bg-white flex justify-center items-center w-full h-80">
      <CircularProgress />
    </div>
  );

  return (
    <Fragment>
      <div className="bg-white border border-[#2c3c511a] rounded-xl flex items-baseline justify-between p-4 mb-3">
        <h3 className="text-base font-bold text-primary">کارشناسان</h3>
        <button
          className="bg-[#0047bc] px-2 text-sm py-2 cursor-pointer mr-2 rounded-md outline-none text-white"
          onClick={() => setShowAddModal(true)}
        >
          اضافه کردن کارشناس
        </button>
      </div>
      <QuickSearch
        activeSearch={true}
        register={register}
        control={control}
        onSubmit={onFilterTextBoxChanged}
      />
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
            defaultColDef={defaultColDef}
            columnDefs={columnDefs}
            pagination={false}
            localeText={AG_GRID_LOCALE_FN}
            loadingOverlayComponent={overlayComponent}
          />
        </div>
      </div>
      {showAddModal && (
        <CreateExpert showAddModal={showAddModal} setShowAddModal={setShowAddModal} />
      )}
      {showEditModal && (
        <EditExpert
          expertId={expertId}
          expertName={expertName}
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
        />
      )}
      {showDeleteModal && (
        <DeleteExpert
          expertId={expertId}
          expertName={expertName}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
        />
      )}
      {showCoverageModal && (
        <ExpertCoverageAreas
          expertId={expertId}
          expertName={expertName}
          showModal={showCoverageModal}
          setShowModal={setShowCoverageModal}
        />
      )}
    </Fragment>
  );
};

export default Experts;
