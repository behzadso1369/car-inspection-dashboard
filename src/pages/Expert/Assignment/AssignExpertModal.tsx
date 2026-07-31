import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, CircularProgress } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import { AG_GRID_LOCALE_FN } from '../../../utils/ag-grid-localize/localize';
import Button, { PrimaryButton, SecondaryButton } from '../../../libs/button/button';

interface AssignExpertModalProps extends React.PropsWithChildren {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  orderId: number;
  onAssigned: () => void;
}

const AssignExpertModal: React.FunctionComponent<AssignExpertModalProps> = ({
  showModal,
  setShowModal,
  orderId,
  onAssigned,
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState<number | null>(null);

  const fetchSuggestions = () => {
    setLoading(true);
    instance
      .get(ApiHelper.get('SuggestExperts'), { params: { orderId } })
      .then((res: any) => {
        setSuggestions(res?.data?.resultObject || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (showModal && orderId) {
      fetchSuggestions();
    }
  }, [showModal, orderId]);

  const assignExpert = (expertId: number) => {
    setAssigning(expertId);
    instance
      .post(ApiHelper.get('AssignExpert'), { OrderId: orderId, ExpertId: expertId })
      .then((res: any) => {
        if (res.data) {
          setShowModal(false);
          onAssigned();
        }
      })
      .finally(() => setAssigning(null));
  };

  const columnDefs: ColDef[] = [
    { field: 'expertId', headerName: '#', maxWidth: 70 },
    { field: 'fullName', headerName: 'نام کارشناس' },
    { field: 'phoneNumber', headerName: 'موبایل' },
    {
      field: 'distanceKm',
      headerName: 'فاصله (کیلومتر)',
      cellRenderer: (params: any) => (
        <span>{params.data.distanceKm?.toFixed?.(1) ?? params.data.distanceKm} کیلومتر</span>
      ),
    },
    { field: 'activeAssignmentsCount', headerName: 'اعزام فعال' },
    {
      field: 'hasScheduleConflict',
      headerName: 'تداخل زمانی',
      cellRenderer: (params: any) => (
        <span className={params.data.hasScheduleConflict ? 'text-red-600' : 'text-green-600'}>
          {params.data.hasScheduleConflict ? 'دارد' : 'ندارد'}
        </span>
      ),
    },
    {
      field: 'avgRating',
      headerName: 'امتیاز',
      cellRenderer: (params: any) => <span>{params.data.avgRating ?? '—'}</span>,
    },
    {
      field: 'score',
      headerName: 'امتیاز سیستم',
      cellRenderer: (params: any) => (
        <span className="font-bold text-[#0047bc]">{params.data.score?.toFixed?.(1) ?? params.data.score}</span>
      ),
    },
    {
      field: 'action',
      headerName: 'عملیات',
      filter: false,
      cellRenderer: (params: any) => (
        <button
          className="bg-[#0047bc] text-xs py-2 cursor-pointer rounded-md px-3 outline-none text-white disabled:opacity-50"
          disabled={assigning === params.data.expertId}
          onClick={() => assignExpert(params.data.expertId)}
        >
          {assigning === params.data.expertId ? 'در حال تخصیص...' : 'تخصیص'}
        </button>
      ),
    },
  ];

  return (
    <Dialog
      className="w-full"
      onClose={() => setShowModal(false)}
      open={showModal}
      maxWidth={false}
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{ '& .MuiPaper-elevation': { width: '90%' } }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !py-3 px-4">
        <span>پیشنهاد و تخصیص کارشناس — سفارش #{orderId}</span>
      </DialogTitle>
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <CircularProgress />
          </div>
        ) : suggestions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">کارشناس پیشنهادی یافت نشد.</p>
        ) : (
          <div className="ag-theme-alpine w-full default-table">
            <AgGridReact
              rowData={suggestions}
              columnDefs={columnDefs}
              enableRtl={true}
              localeText={AG_GRID_LOCALE_FN}
              domLayout="autoHeight"
              rowHeight={55}
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
  );
};

export default AssignExpertModal;
