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

// import defaultColDef  from '../../utils/agGrid';

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
  const columnDefs:ColDef[] = [
    {
      field: 'row',
      headerName: 'ds.routes.user.fields.row',
    },
    { field: 'date', headerName: 'ds.routes.user.fields.date' },
    {
      field: 'loginTime',
      headerName: 'ds.routes.user.fields.loginTime',
    },
    { field: 'logoutTime', headerName: 'ds.routes.user.fields.loginTime' },
    { field: 'role', headerName: 'ds.routes.user.fields.role' },
    { field: 'shift', headerName: 'ds.routes.user.fields.shift' },
    {
      field: 'orderCollectionTime',
      headerName: 'ds.routes.user.fields.orderCollectionTime',
    },
    {
      field: 'deliveryTime',
      headerName: 'ds.routes.user.fields.deliveryTime',
    },
    {
      field: 'inactiveTime',
      headerName: 'ds.routes.user.fields.inactiveTime',
    },
    {
      field: 'orderNumber',
      headerName: 'ds.routes.user.fields.orderNumber',
    },
    {
      field: 'errorNumber',
      headerName: 'ds.routes.user.fields.errorsNumber',
    },
  ];

  useEffect(() => {
    const subscription = watch(() => {
      watch(() => {
        setActiveSearch(Boolean(getValues().search));
      });
    });
    return () => subscription.unsubscribe();
  }, [getValues, watch]);

  const tabs = [
    {
      title: 'ds.routes.user.fields.profileInfo',
      path: `/profile`,
      ID: 1,
      size: 3,
    },
    {
      title: 'ds.routes.user.fields.operation',
      path: `/profile/operation`,
      ID: 2,
      size: 12,
    },
  ];

  const submitHandler = () => {
    console.log('test');
  };

  return (
    <>
      <div className="bg-white border border-[#2c3c511a] rounded-xl flex justify-between p-4 mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-primary">پروفایل کاربری:</h3>
          <span className="text-sm text-black">علیرضا پیروز</span>
        </div>
        <div className="flex justify-center items-center gap-4">
          <div className="flex gap-1">
            <h3 className="text-xs">{'ds.routes.user.fields.date'}: </h3>
            <p className="text-xs">1402/08/08</p>
          </div>
          <div className="flex gap-1">
            <h3 className="text-xs">{'ds.routes.user.fields.time'}: </h3>
            <p className="text-xs">22:48</p>
          </div>
        </div>
      </div>
      <form
        className="flex items-center gap-3"
        onSubmit={handleSubmit(submitHandler)}
      >
        <Input
          icon={faMagnifyingGlass}
          placeholder={'common.search'}
          type="text"
          register={register}
          control={control}
          title="search"
          width="w-80"
        />
        <Button
          title={'common.togetherSearch'}
          active={activeSearch}
          style={SecondaryButton}
          disableStyle={DisabledSecondaryButton}
          onClick={submitHandler}
        />
      </form>
      <div className="flex justify-end items-end py-2">
        <Button
          title={'common.filter'}
          active={true}
          style={SecondaryButton}
          icon={faFilter}
          iconStyle="text-secondary"
        />
      </div>
      <div className="flex gap-6 pt-4">
        {tabs.map((tab) => (
          <NavLink
            end
            className={({ isActive }) =>
              isActive
                ? 'border-b-2 border-primary text-primary font-bold flex pb-3'
                : 'text-primary flex pb-3'
            }
            to={tab.path}
            key={tab.ID}
            data-testid={tab.title}
          >
          </NavLink>
        ))}
      </div>
      <div className="ag-theme-alpine select-table w-full">
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
    </>
  );
};

export default ProfileOperation;
