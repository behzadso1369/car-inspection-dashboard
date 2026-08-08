import { AgGridReact } from 'ag-grid-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ColDef } from 'ag-grid-community';
import { Link, useNavigate } from 'react-router-dom';
import { notificationData } from '../../data/data';
import { ListPageShell } from '../../components/list/ListPageShell';
import { ResponsiveDataView } from '../../components/list/ResponsiveDataView';
import { cardFieldsFromColDefs } from '../../utils/listCardHelpers';
import { CardAction } from '../../types/list';

const Notification: React.FunctionComponent = () => {
  const navigate = useNavigate();
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

  const columnDefs: ColDef[] = [
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
      headerName: 'عملیات',
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

  const cardFields = cardFieldsFromColDefs(columnDefs, {
    primaryField: 'noticeSubject',
    badgeField: 'status',
    valueOverrides: {
      status: (row) => row.status || '—',
    },
  });

  const cardActions: CardAction[] = [
    {
      key: 'detail',
      label: 'جزئیات',
      variant: 'primary',
      onClick: (row) => navigate(`./${row.row}`),
    },
  ];

  const desktopView = (
    <div className="ag-theme-alpine default-table w-full pb-4 pt-2">
      <AgGridReact
        ref={gridRef}
        rowHeight={60}
        headerHeight={50}
        domLayout="autoHeight"
        rowData={rowData ?? []}
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

  return (
    <ListPageShell title="اعلان‌ها" subtitle="لیست اعلان‌های سیستم">
      <ResponsiveDataView
        rowData={rowData ?? []}
        fields={cardFields}
        actions={cardActions}
        emptyMessage="اعلانی وجود ندارد"
        getRowKey={(row) => row.row}
        desktopView={desktopView}
      />
    </ListPageShell>
  );
};

export default Notification;
