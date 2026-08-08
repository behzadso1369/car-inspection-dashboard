import React, { useState, useRef, useEffect, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { NavLink } from 'react-router-dom';
import { ColDef } from 'ag-grid-community';
import { userOperation } from '../../data/data';
import {
  Button,
  DisabledSecondaryButton,
  SecondaryButton,
} from '../../libs/button/button';
import { faFilter, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import { Input } from '../../libs/input/input';
import { ResponsiveDataView } from '../../components/list/ResponsiveDataView';
import { cardFieldsFromColDefs } from '../../utils/listCardHelpers';

const ProfileOperation: React.FunctionComponent = () => {
  const gridRef = useRef<any>();
  const [activeSearch, setActiveSearch] = useState<boolean>(false);
  const { register, control, handleSubmit, watch, getValues } = useForm();

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 150,
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
    };
  }, []);

  const columnDefs: ColDef[] = [
    { field: 'row', headerName: 'ردیف' },
    { field: 'date', headerName: 'تاریخ' },
    { field: 'loginTime', headerName: 'زمان ورود' },
    { field: 'logoutTime', headerName: 'زمان خروج' },
    { field: 'role', headerName: 'نقش' },
    { field: 'shift', headerName: 'شیفت' },
    { field: 'orderCollectionTime', headerName: 'زمان جمع‌آوری سفارش' },
    { field: 'deliveryTime', headerName: 'زمان تحویل' },
    { field: 'inactiveTime', headerName: 'زمان غیرفعال' },
    { field: 'orderNumber', headerName: 'شماره سفارش' },
    { field: 'errorNumber', headerName: 'تعداد خطا' },
  ];

  useEffect(() => {
    const subscription = watch(() => {
      setActiveSearch(Boolean(getValues().search));
    });
    return () => subscription.unsubscribe();
  }, [getValues, watch]);

  const tabs = [
    { title: 'اطلاعات پروفایل', path: `/profile`, ID: 1 },
    { title: 'عملیات', path: `/profile/operation`, ID: 2 },
  ];

  const submitHandler = () => {
    console.log('test');
  };

  const cardFields = cardFieldsFromColDefs(columnDefs, { primaryField: 'date' });

  const desktopView = (
    <div className="ag-theme-alpine select-table w-full pb-4 pt-2">
      <AgGridReact
        ref={gridRef}
        rowHeight={60}
        headerHeight={50}
        domLayout="autoHeight"
        rowData={userOperation}
        enableRtl={true}
        suppressColumnVirtualisation={true}
        suppressRowVirtualisation={true}
        suppressAggFuncInHeader={true}
        defaultColDef={defaultColDef}
        columnDefs={columnDefs}
        pagination={false}
        suppressMoveWhenRowDragging={true}
        paginationPageSize={5}
      />
    </div>
  );

  return (
    <div className="w-full pb-6">
      <div className="bg-white border border-card-border rounded-2xl p-4 mb-4 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
            <h3 className="text-base font-bold text-primary">پروفایل کاربری</h3>
            <span className="text-sm text-black-opacity-60">علیرضا پیروز</span>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-black-opacity-60">
            <div className="flex gap-1">
              <span className="font-medium">تاریخ:</span>
              <span>1402/08/08</span>
            </div>
            <div className="flex gap-1">
              <span className="font-medium">زمان:</span>
              <span>22:48</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 sm:gap-6 border-b border-card-border mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <NavLink
            end
            className={({ isActive }) =>
              isActive
                ? 'border-b-2 border-brand text-brand font-bold pb-3 whitespace-nowrap text-sm'
                : 'text-primary pb-3 whitespace-nowrap text-sm'
            }
            to={tab.path}
            key={tab.ID}
          >
            {tab.title}
          </NavLink>
        ))}
      </div>

      <form
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4"
        onSubmit={handleSubmit(submitHandler)}
      >
        <Input
          icon={faMagnifyingGlass}
          placeholder="جستجو"
          type="text"
          register={register}
          control={control}
          title="search"
          width="w-full sm:w-80"
        />
        <Button
          title="جستجو"
          active={activeSearch}
          style={SecondaryButton}
          disableStyle={DisabledSecondaryButton}
          onClick={submitHandler}
        />
        <div className="sm:mr-auto">
          <Button
            title="فیلتر"
            active={true}
            style={SecondaryButton}
            icon={faFilter}
            iconStyle="text-secondary"
          />
        </div>
      </form>

      <ResponsiveDataView
        rowData={userOperation}
        fields={cardFields}
        emptyMessage="عملیاتی ثبت نشده است"
        getRowKey={(row) => row.row}
        desktopView={desktopView}
      />
    </div>
  );
};

export default ProfileOperation;
