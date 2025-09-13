import { AgGridReact } from 'ag-grid-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
// import  defaultColDef  from '../../utils/agGrid';

import { ColDef } from 'ag-grid-community';
import { Link } from 'react-router-dom';
import { notificationData } from '../../data/data';

const Notification: React.FunctionComponent = () => {
  //   const gridRef = useRef<any>();
  const gridRef = useRef<any>();
  const [rowData, setRowData] = useState<any>();
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
      headerName: 'ردیف',
      minWidth: 80,
      maxWidth: 100,
    },
    { field: 'date', headerName: 'تاریخ', minWidth: 100 },
    { field: 'time', headerName: 'ساعت', minWidth: 100 },
    { field: 'noticeSubject', headerName: 'موضوع اعلان', minWidth: 120 },
    {
      field: 'status',
      headerName: 'وضعیت',
      cellRenderer: (params: any) => {
        return (
          <>
            {params.data.statusCode === 0 && (
              <div className="bg-[#FF3E3E] w-1.5 h-1.5 rounded-full ml-2"></div>
            )}

            <span>{params.data.status}</span>
          </>
        );
      },
      minWidth: 100,
    },
    {
      field: 'action',
      headerName: 'common.operation',
      cellRenderer: (params: any) => {
        return (
          <Link to={`./${params.data.row}`}>
            <span
              className="border-b border-[#0054F6] text-[#0054F6] text-[10px]"
              style={{ lineHeight: '26px' }}
            >
              جزئیات
            </span>
          </Link>
        );
      },
      minWidth: 100,
    },
  ];

  useEffect(() => {
    setRowData(notificationData);
  }, []);

  return (
    <div className="ag-theme-alpine default-table w-full">
      <AgGridReact
        ref={gridRef}
        rowHeight={60}
        headerHeight={50}
        domLayout="autoHeight"
        rowData={rowData}
        enableRtl={true}
        suppressAggFuncInHeader={true}
        defaultColDef={defaultColDef}
        columnDefs={columnDefs}
        pagination={false}
   
        suppressMoveWhenRowDragging={true}
        paginationPageSize={5}
        suppressColumnVirtualisation={true}
        suppressRowVirtualisation={true}
      />
    </div>
  );
};

export default Notification;
