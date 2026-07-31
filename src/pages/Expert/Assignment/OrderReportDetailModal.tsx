import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, CircularProgress } from '@mui/material';
import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import Button, { SecondaryButton } from '../../../libs/button/button';
import moment from 'jalali-moment';

interface OrderReportDetailModalProps extends React.PropsWithChildren {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  orderId: number;
}

const zoneStatusLabels: Record<string, { label: string; color: string }> = {
  Ok: { label: 'سالم', color: 'bg-green-100 text-green-800' },
  Painted: { label: 'رنگ‌شده', color: 'bg-orange-100 text-orange-800' },
  Damaged: { label: 'آسیب‌دیده', color: 'bg-red-100 text-red-800' },
  Replaced: { label: 'تعویض‌شده', color: 'bg-purple-100 text-purple-800' },
  NotChecked: { label: 'بررسی‌نشده', color: 'bg-gray-100 text-gray-600' },
};

const OrderReportDetailModal: React.FunctionComponent<OrderReportDetailModalProps> = ({
  showModal,
  setShowModal,
  orderId,
}) => {
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showModal && orderId) {
      setLoading(true);
      instance
        .get(ApiHelper.get('OrderReportDetail'), { params: { orderId } })
        .then((res: any) => {
          setDetail(res?.data?.resultObject);
        })
        .finally(() => setLoading(false));
    }
  }, [showModal, orderId]);

  const bodyReport = detail?.bodyReport;
  const assignment = detail?.assignment;

  return (
    <Dialog
      className="w-full"
      onClose={() => setShowModal(false)}
      open={showModal}
      maxWidth={false}
      PaperProps={{ sx: { borderRadius: '12px', background: '#fff' } }}
      sx={{ '& .MuiPaper-elevation': { width: '85%', maxHeight: '90vh' } }}
    >
      <DialogTitle className="w-full flex items-center gap-3 border-b !py-3 px-4">
        <span>جزئیات گزارش سفارش #{orderId}</span>
      </DialogTitle>
      <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
        {loading ? (
          <div className="flex justify-center py-12">
            <CircularProgress />
          </div>
        ) : !detail ? (
          <p className="text-center text-gray-500 py-8">اطلاعاتی یافت نشد.</p>
        ) : (
          <div className="space-y-6">
            {assignment && (
              <section className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-primary mb-3">وضعیت اعزام</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 block">کارشناس</span>
                    <span>{assignment.expertName || '—'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">وضعیت</span>
                    <span>{assignment.statusText || assignment.status || '—'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">تاریخ تخصیص</span>
                    <span>
                      {assignment.assignedAt
                        ? moment(assignment.assignedAt).locale('fa').format('YYYY/MM/DD HH:mm')
                        : '—'}
                    </span>
                  </div>
                </div>
              </section>
            )}

            {bodyReport && (
              <>
                <section className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-bold text-primary mb-3">اطلاعات خودرو</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500 block">خودرو</span>
                      <span>{bodyReport.carDisplayName || '—'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">رنگ</span>
                      <span>{bodyReport.carColor || '—'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">شاسی</span>
                      <span>{bodyReport.chassisNumber || '—'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">پلاک</span>
                      <span>{bodyReport.plateNumber || '—'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">نتیجه کلی</span>
                      <span>{bodyReport.overallResult || '—'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">وضعیت گزارش</span>
                      <span>{bodyReport.status || '—'}</span>
                    </div>
                  </div>
                  {bodyReport.summaryNote && (
                    <p className="mt-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {bodyReport.summaryNote}
                    </p>
                  )}
                </section>

                {bodyReport.zones?.length > 0 && (
                  <section className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold text-primary mb-3">گزارش بدنه — زون‌ها</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="text-right p-2">زون</th>
                            <th className="text-right p-2">وضعیت</th>
                            <th className="text-right p-2">یادداشت</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bodyReport.zones.map((zone: any) => {
                            const statusInfo = zoneStatusLabels[zone.status] || {
                              label: zone.status,
                              color: 'bg-gray-100',
                            };
                            return (
                              <tr key={zone.id || zone.code} className="border-b">
                                <td className="p-2">{zone.nameFa || zone.code}</td>
                                <td className="p-2">
                                  <span className={`text-xs py-1 px-2 rounded-md ${statusInfo.color}`}>
                                    {statusInfo.label}
                                  </span>
                                </td>
                                <td className="p-2 text-gray-600">{zone.note || '—'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}
              </>
            )}

            {!bodyReport && !assignment && (
              <p className="text-gray-500 text-sm">هنوز گزارش یا اعزامی ثبت نشده است.</p>
            )}
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

export default OrderReportDetailModal;
