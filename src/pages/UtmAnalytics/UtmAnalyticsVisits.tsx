import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { ListPageShell } from '../../components/list/ListPageShell';
import { ResponsiveDataView } from '../../components/list/ResponsiveDataView';
import { FixedPaginationBar } from '../../components/list/FixedPaginationBar';
import PaginationLib from '../../libs/pagination/pagination';
import { CardField } from '../../types/list';
import { UtmAnalyticsFilters } from './UtmAnalyticsFilters';
import { useUtmReportFilters } from './useUtmReportFilters';
import { errorText, fetchUtmVisitor, fetchUtmVisits } from './utmAnalyticsApi';
import { EVENT_TYPE_LABELS, formatDateTimeFa } from './utmAnalyticsHelpers';
import { UtmVisitRow } from '../../_models/response/utm/utmAnalytics.response';
import { UtmKindChip } from './UtmKindChip';
import { UtmVisitorDialog } from './UtmVisitorDialog';

const UtmAnalyticsVisits: React.FunctionComponent = () => {
  const { form, appliedFilters, filterOptions, applyFilters, clearFilters } =
    useUtmReportFilters();
  const { register, control, setValue, watch } = form;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState(0);
  const [rows, setRows] = useState<UtmVisitRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [visitorOpen, setVisitorOpen] = useState(false);
  const [visitorLoading, setVisitorLoading] = useState(false);
  const [visitorEvents, setVisitorEvents] = useState<UtmVisitRow[]>([]);
  const [selectedHash, setSelectedHash] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchUtmVisits(appliedFilters, page, pageSize)
      .then(({ items, total: count }) => {
        setRows(items);
        setTotal(count);
      })
      .catch((err) => {
        setRows([]);
        setTotal(0);
        setError(errorText(err));
      })
      .finally(() => setLoading(false));
  }, [appliedFilters, page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  const openVisitor = useCallback(
    (ipHash: string) => {
      setSelectedHash(ipHash);
      setVisitorOpen(true);
      setVisitorLoading(true);
      setVisitorEvents([]);
      fetchUtmVisitor(ipHash, appliedFilters)
        .then((timeline) => setVisitorEvents(timeline.events))
        .catch(() => setVisitorEvents([]))
        .finally(() => setVisitorLoading(false));
    },
    [appliedFilters]
  );

  const cardFields: CardField<UtmVisitRow>[] = useMemo(
    () => [
      {
        key: 'time',
        label: 'زمان',
        primary: true,
        getValue: (row) => formatDateTimeFa(row.visitedAt ?? row.createdAt),
      },
      {
        key: 'event',
        label: 'رویداد',
        getValue: (row) => EVENT_TYPE_LABELS[row.eventType] ?? row.eventType,
      },
      {
        key: 'path',
        label: 'مسیر',
        getValue: (row) => (
          <span className="dir-ltr text-left break-all text-xs">{row.path}</span>
        ),
      },
      {
        key: 'campaign',
        label: 'کمپین',
        getValue: (row) => row.utmCampaign || '—',
      },
      {
        key: 'ip',
        label: 'ipHash',
        getValue: (row) => (
          <button
            type="button"
            className="text-brand underline dir-ltr text-xs"
            onClick={() => openVisitor(row.ipHash)}
          >
            {row.ipHash}
          </button>
        ),
      },
    ],
    [openVisitor]
  );

  return (
    <ListPageShell
      title="لاگ بازدید UTM"
      subtitle="صفحه‌بندی حداکثر ۱۰۰ — کلیک روی ipHash برای تایم‌لاین بازدیدکننده"
      searchSlot={
        <UtmAnalyticsFilters
          register={register}
          control={control}
          setValue={setValue}
          watch={watch}
          filterOptions={filterOptions}
          loading={loading}
          onApply={() => {
            setPage(1);
            applyFilters();
          }}
          onClear={() => {
            setPage(1);
            clearFilters();
          }}
        />
      }
      pagination={
        <FixedPaginationBar>
          <PaginationLib
            count={total}
            page={page}
            rowsPerPage={pageSize}
            setPage={setPage}
            setRowsPerPage={setPageSize}
          />
        </FixedPaginationBar>
      }
    >
      {loading && rows.length === 0 ? (
        <div className="flex justify-center py-24">
          <CircularProgress sx={{ color: '#0f766e' }} />
        </div>
      ) : error ? (
        <div className="bg-white border border-card-border rounded-2xl p-8 text-center shadow-card">
          <p className="text-primary font-bold">{error}</p>
        </div>
      ) : (
        <ResponsiveDataView
          rowData={rows}
          fields={cardFields}
          loading={loading}
          emptyMessage="بازدیدی در این فیلتر نیست"
          getRowKey={(row, index) => row.id ?? `${row.ipHash}-${index}`}
          desktopView={
            <div className="overflow-x-auto bg-white border border-card-border rounded-2xl shadow-card">
              <table className="w-full text-sm border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50 text-black-opacity-70">
                    <th className="p-3 text-right border-b border-card-border">زمان</th>
                    <th className="p-3 text-right border-b border-card-border">رویداد</th>
                    <th className="p-3 text-right border-b border-card-border">مسیر</th>
                    <th className="p-3 text-right border-b border-card-border">نوع</th>
                    <th className="p-3 text-right border-b border-card-border">UTM</th>
                    <th className="p-3 text-right border-b border-card-border">ipHash</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.id ?? `${row.ipHash}-${index}`} className="hover:bg-slate-50/80">
                      <td className="p-3 border-b border-card-border text-xs whitespace-nowrap">
                        {formatDateTimeFa(row.visitedAt ?? row.createdAt)}
                      </td>
                      <td className="p-3 border-b border-card-border text-xs">
                        {EVENT_TYPE_LABELS[row.eventType] ?? row.eventType}
                      </td>
                      <td className="p-3 border-b border-card-border">
                        <span className="dir-ltr text-left break-all text-xs inline-block max-w-[320px]">
                          {row.path}
                        </span>
                      </td>
                      <td className="p-3 border-b border-card-border">
                        {row.kind ? <UtmKindChip kind={row.kind} title={row.kindTitle} /> : '—'}
                      </td>
                      <td className="p-3 border-b border-card-border">
                        <span className="dir-ltr text-left text-xs">
                          {[row.utmSource, row.utmMedium, row.utmCampaign]
                            .filter(Boolean)
                            .join(' / ') || '—'}
                        </span>
                      </td>
                      <td className="p-3 border-b border-card-border">
                        <button
                          type="button"
                          className="text-brand underline dir-ltr text-xs"
                          onClick={() => openVisitor(row.ipHash)}
                        >
                          {row.ipHash}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        />
      )}

      <UtmVisitorDialog
        open={visitorOpen}
        ipHash={selectedHash}
        loading={visitorLoading}
        events={visitorEvents}
        onClose={() => setVisitorOpen(false)}
      />
    </ListPageShell>
  );
};

export default UtmAnalyticsVisits;
