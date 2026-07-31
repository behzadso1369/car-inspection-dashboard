import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, CircularProgress } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import { AG_GRID_LOCALE_FN } from '../../../utils/ag-grid-localize/localize';
import Button, { PrimaryButton, SecondaryButton } from '../../../libs/button/button';
import CreateExpertCoverage from './CreateExpertCoverage';

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

  return (
    <>
      <Dialog
        className="w-full"
        onClose={() => setShowModal(false)}
        open={showModal}
        maxWidth={false}
        PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
        sx={{ '& .MuiPaper-elevation': { width: '80%' } }}
      >
        <DialogTitle className="w-full flex items-center justify-between border-b !py-3 px-4">
          <span>محدوده‌های پوشش — {expertName}</span>
          <button
            className="bg-[#0047bc] px-3 text-sm py-2 cursor-pointer rounded-md outline-none text-white"
            onClick={() => setShowAddCoverage(true)}
          >
            افزودن محدوده
          </button>
        </DialogTitle>
        <div className="p-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <CircularProgress />
            </div>
          ) : (
            <div className="ag-theme-alpine w-full default-table" style={{ height: 300 }}>
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
          )}
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
