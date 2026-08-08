import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, CircularProgress } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import { AG_GRID_LOCALE_FN } from '../../../utils/ag-grid-localize/localize';
import Button, { SecondaryButton } from '../../../libs/button/button';
import { useIsDesktop } from '../../../hooks/useBreakpoint';

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
  const isDesktop = useIsDesktop();

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
        <span className="font-bold text-brand">
          {params.data.score?.toFixed?.(1) ?? params.data.score}
        </span>
      ),
    },
    {
      field: 'action',
      headerName: 'عملیات',
      filter: false,
      cellRenderer: (params: any) => (
        <button
          className="bg-brand text-xs py-2 cursor-pointer rounded-md px-3 outline-none text-white disabled:opacity-50"
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
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: '#fff',
          width: 'min(96vw, 1100px)',
          m: 1.5,
          maxHeight: '92dvh',
        },
      }}
    >
      <DialogTitle className="w-full flex flex-col sm:flex-row sm:items-center gap-1 border-b !py-3 px-4">
        <span className="font-bold text-primary">پیشنهاد و تخصیص کارشناس</span>
        <span className="text-sm text-black-opacity-50">سفارش #{orderId}</span>
      </DialogTitle>
      <div className="p-3 sm:p-4 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-12">
            <CircularProgress sx={{ color: '#0237fe' }} />
          </div>
        ) : suggestions.length === 0 ? (
          <p className="text-center text-black-opacity-50 py-8">کارشناس پیشنهادی یافت نشد.</p>
        ) : isDesktop ? (
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
        ) : (
          <div className="flex flex-col gap-3">
            {suggestions.map((row) => (
              <article
                key={row.expertId}
                className="bg-surface border border-card-border rounded-2xl p-4"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-primary truncate !font-peydaBold">
                      {row.fullName || '—'}
                    </h3>
                    <p className="text-xs text-black-opacity-50 mt-0.5">{row.phoneNumber || '—'}</p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-brand bg-brand-soft px-2.5 py-1 rounded-lg">
                    {row.score?.toFixed?.(1) ?? row.score ?? '—'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <p className="text-[11px] text-black-opacity-50">فاصله</p>
                    <p>{row.distanceKm?.toFixed?.(1) ?? row.distanceKm ?? '—'} کیلومتر</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-black-opacity-50">اعزام فعال</p>
                    <p>{row.activeAssignmentsCount ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-black-opacity-50">تداخل زمانی</p>
                    <p className={row.hasScheduleConflict ? 'text-red-600' : 'text-green-600'}>
                      {row.hasScheduleConflict ? 'دارد' : 'ندارد'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-black-opacity-50">امتیاز</p>
                    <p>{row.avgRating ?? '—'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full min-h-[44px] rounded-xl bg-brand text-white text-sm font-medium disabled:opacity-50"
                  disabled={assigning === row.expertId}
                  onClick={() => assignExpert(row.expertId)}
                >
                  {assigning === row.expertId ? 'در حال تخصیص...' : 'تخصیص کارشناس'}
                </button>
              </article>
            ))}
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
