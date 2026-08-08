import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import { AG_GRID_LOCALE_FN } from '../../../utils/ag-grid-localize/localize';
import Button, { SecondaryButton } from '../../../libs/button/button';
import CreateExpertCoverage from './CreateExpertCoverage';
import { ResponsiveDataView } from '../../../components/list/ResponsiveDataView';
import { cardFieldsFromColDefs } from '../../../utils/listCardHelpers';
import { CardAction } from '../../../types/list';

interface ExpertCoverageAreasProps extends React.PropsWithChildren {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  expertId: number;
  expertName: string;
}

const ExpertCoverageAreas: React.FunctionComponent<ExpertCoverageAreasProps> = ({
  showModal,
  setShowModal,
  expertId,
  expertName,
}) => {
  const [rowData, setRowData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddCoverage, setShowAddCoverage] = useState(false);

  const getCoverageAreas = () => {
    setLoading(true);
    instance
      .get(ApiHelper.get('ExpertCoverageAreaList'), {
        params: { expertId, pageNumber: 1, pageSize: 100 },
      })
      .then((res: any) => {
        setRowData(res?.data?.resultObject || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (showModal && expertId) {
      getCoverageAreas();
    }
  }, [showModal, expertId, showAddCoverage]);

  const deleteCoverage = (id: number) => {
    instance.delete(ApiHelper.get('DeleteExpertCoverageArea') + '?id=' + id).then(() => {
      getCoverageAreas();
    });
  };

  const columnDefs: ColDef[] = [
    { field: 'id', headerName: '#', maxWidth: 80 },
    { field: 'city', headerName: 'شهر' },
    { field: 'centerLat', headerName: 'عرض جغرافیایی' },
    { field: 'centerLng', headerName: 'طول جغرافیایی' },
    { field: 'radiusKm', headerName: 'شعاع (کیلومتر)' },
    {
      field: 'action',
      headerName: 'عملیات',
      filter: false,
      cellRenderer: (params: any) => (
        <button
          className="bg-red-500 text-xs py-2 cursor-pointer rounded-md px-2 outline-none text-white"
          onClick={() => deleteCoverage(params.data.id)}
        >
          حذف
        </button>
      ),
    },
  ];

  const cardFields = cardFieldsFromColDefs(columnDefs, { primaryField: 'city' });

  const cardActions: CardAction[] = [
    {
      key: 'delete',
      label: 'حذف',
      variant: 'danger',
      onClick: (row) => deleteCoverage(row.id),
    },
  ];

  const desktopView = (
    <div className="ag-theme-alpine w-full default-table pb-4 pt-2">
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        enableRtl={true}
        localeText={AG_GRID_LOCALE_FN}
        domLayout="autoHeight"
        rowHeight={50}
        headerHeight={45}
      />
    </div>
  );

  return (
    <>
      <Dialog
        className="w-full"
        onClose={() => setShowModal(false)}
        open={showModal}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: '16px', background: '#fff', margin: '16px', width: 'calc(100% - 32px)' } }}
      >
        <DialogTitle className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b !py-4 px-4">
          <span className="text-sm font-bold text-primary">محدوده‌های پوشش — {expertName}</span>
          <button
            className="bg-brand w-full sm:w-auto min-h-[44px] px-4 rounded-xl text-white text-sm"
            onClick={() => setShowAddCoverage(true)}
          >
            افزودن محدوده
          </button>
        </DialogTitle>
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          <ResponsiveDataView
            rowData={rowData}
            fields={cardFields}
            actions={cardActions}
            loading={loading}
            emptyMessage="محدوده‌ای ثبت نشده است"
            getRowKey={(row) => row.id}
            desktopView={desktopView}
          />
          <div className="flex justify-end mt-4">
            <Button
              title="بستن"
              active={true}
              style={SecondaryButton}
              onClick={() => setShowModal(false)}
            />
          </div>
        </div>
      </Dialog>
      {showAddCoverage && (
        <CreateExpertCoverage
          showModal={showAddCoverage}
          setShowModal={setShowAddCoverage}
          expertId={expertId}
          expertName={expertName}
        />
      )}
    </>
  );
};

export default ExpertCoverageAreas;
