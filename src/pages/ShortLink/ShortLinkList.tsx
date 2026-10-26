import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';
import { AG_GRID_LOCALE_FN } from '../../utils/ag-grid-localize/localize';
import PaginationLib from '../../libs/pagination/pagination';
import { CircularProgress } from '@mui/material';
import { ListPageShell } from '../../components/list/ListPageShell';
import { ResponsiveDataView } from '../../components/list/ResponsiveDataView';
import { FixedPaginationBar } from '../../components/list/FixedPaginationBar';
import { CardAction, CardField } from '../../types/list';
import { ShortLinkItem } from '../../_models/response/shortLink/shortLink.response';
import { deactivateShortLink, errorText, listShortLinks } from './shortLinkApi';
import { copyText } from './shortLinkHelpers';
import { formatToman } from '../SupportOrder/supportOrderApi';
import { CHANNEL_OPTIONS, inputStyle } from './shortLinkConstants';
import Button, { SecondaryButton } from '../../libs/button/button';

const ShortLinkList: React.FunctionComponent = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [count, setCount] = useState(0);
  const [rowData, setRowData] = useState<ShortLinkItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const [campaign, setCampaign] = useState('');
  const [source, setSource] = useState('');
  const [isActive, setIsActive] = useState<'' | 'true' | 'false'>('');

  const gridRef = useRef<any>();

  const load = useCallback(() => {
    setLoading(true);
    listShortLinks({
      campaign,
      source,
      isActive: isActive === '' ? '' : isActive === 'true',
      pageNumber: page,
      pageSize: rowsPerPage,
    })
      .then(({ items, total }) => {
        setRowData(items);
        setCount(total);
      })
      .catch(() => {
        setRowData([]);
        setCount(0);
      })
      .finally(() => setLoading(false));
  }, [campaign, source, isActive, page, rowsPerPage]);

  useEffect(() => {
    load();
  }, [load]);

  const onDeactivate = async (row: ShortLinkItem) => {
    if (!row.isActive || busyId === row.id) return;
    const ok = window.confirm(
      'با خاموش کردن این لینک، پیامک‌های قبلی با همین آدرس به صفحهٔ اصلی هدایت می‌شوند. ادامه می‌دهید؟'
    );
    if (!ok) return;
    setBusyId(row.id);
    try {
      await deactivateShortLink(row.id);
      load();
    } catch (err: any) {
      alert(errorText(err));
    } finally {
      setBusyId(null);
    }
  };

  const channelLabel = (sourceKey: string) =>
    CHANNEL_OPTIONS.find((c) => c.value === sourceKey)?.label ?? sourceKey;

  const campaignCell = (row: ShortLinkItem) => {
    const parts = [
      channelLabel(row.utmSource),
      row.utmCampaign,
      row.utmContent,
    ].filter(Boolean);
    return parts.join(' · ');
  };

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: 'shortUrl',
        headerName: 'لینک کوتاه',
        minWidth: 220,
        cellRenderer: (params: any) => {
          const url = params.data?.shortUrl ?? '';
          return (
            <div className="flex items-center gap-2 py-1">
              <span className="text-xs dir-ltr truncate">{url}</span>
              <button
                type="button"
                className="text-brand text-xs shrink-0"
                onClick={() => copyText(url)}
              >
                کپی
              </button>
            </div>
          );
        },
      },
      {
        headerName: 'کانال / کمپین',
        minWidth: 180,
        valueGetter: (p) => campaignCell(p.data),
      },
      {
        field: 'hasRecipient',
        headerName: 'یکتا / عمومی',
        maxWidth: 120,
        cellRenderer: (p: any) =>
          p.data?.hasRecipient ? (
            <span className="text-xs text-amber-700">شخصی (SMS)</span>
          ) : (
            <span className="text-xs text-black-opacity-60">عمومی</span>
          ),
      },
      {
        field: 'totalClicks',
        headerName: 'کلیک کل',
        maxWidth: 100,
        valueFormatter: (p) => (p.value ?? 0).toLocaleString('fa-IR'),
      },
      {
        field: 'uniqueClicks',
        headerName: 'کلیک یکتا',
        maxWidth: 110,
        valueFormatter: (p) => (p.value ?? 0).toLocaleString('fa-IR'),
      },
      {
        field: 'reservations',
        headerName: 'رزرو',
        maxWidth: 90,
        valueFormatter: (p) => (p.value ?? 0).toLocaleString('fa-IR'),
      },
      {
        field: 'salesAmount',
        headerName: 'فروش',
        minWidth: 130,
        valueFormatter: (p) => formatToman(p.value),
      },
      {
        field: 'isActive',
        headerName: 'وضعیت',
        maxWidth: 130,
        cellRenderer: (p: any) => {
          const row = p.data as ShortLinkItem;
          if (!row) return null;
          return (
            <div className="flex flex-col gap-1 py-1">
              {row.isActive ? (
                <span className="text-emerald-600 text-xs">فعال</span>
              ) : (
                <span className="text-black-opacity-50 text-xs">غیرفعال</span>
              )}
              {row.isActive ? (
                <button
                  type="button"
                  className="text-red-600 text-xs text-right disabled:opacity-50"
                  disabled={busyId === row.id}
                  onClick={() => onDeactivate(row)}
                >
                  {busyId === row.id ? '…' : 'خاموش'}
                </button>
              ) : null}
            </div>
          );
        },
      },
    ],
    [busyId]
  );

  const cardFields: CardField[] = useMemo(
    () => [
      {
        key: 'shortUrl',
        label: 'لینک کوتاه',
        primary: true,
        getValue: (row) => row.shortUrl,
      },
      {
        key: 'campaign',
        label: 'کانال / کمپین',
        getValue: (row) => campaignCell(row),
      },
      {
        key: 'clicks',
        label: 'کلیک',
        getValue: (row) =>
          `کل: ${(row.totalClicks ?? 0).toLocaleString('fa-IR')} · یکتا: ${(row.uniqueClicks ?? 0).toLocaleString('fa-IR')}`,
      },
      {
        key: 'reservations',
        label: 'رزرو / فروش',
        getValue: (row) =>
          `${(row.reservations ?? 0).toLocaleString('fa-IR')} رزرو · ${formatToman(row.salesAmount)}`,
      },
      {
        key: 'type',
        label: 'نوع',
        badge: true,
        getValue: (row) => (row.hasRecipient ? 'شخصی' : 'عمومی'),
      },
      {
        key: 'status',
        label: 'وضعیت',
        badge: true,
        badgeTone: (row) => (row.isActive ? 'success' : 'default'),
        getValue: (row) => (row.isActive ? 'فعال' : 'غیرفعال'),
      },
    ],
    []
  );

  const cardActions: CardAction<ShortLinkItem>[] = useMemo(
    () => [
      {
        key: 'copy',
        label: 'کپی لینک',
        variant: 'secondary',
        onClick: (row) => copyText(row.shortUrl),
      },
      {
        key: 'deactivate',
        label: 'خاموش',
        variant: 'danger',
        hidden: (row) => !row.isActive,
        onClick: (row) => onDeactivate(row),
      },
    ],
    [busyId]
  );

  const filterBar = (
    <div className="flex flex-wrap gap-3 items-end">
      <label className="flex flex-col gap-1 text-xs text-[#464F60] min-w-[140px]">
        کمپین
        <input
          value={campaign}
          onChange={(e) => {
            setCampaign(e.target.value);
            setPage(1);
          }}
          className="h-9 rounded-lg px-2 text-sm"
          style={inputStyle}
          dir="ltr"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-[#464F60] min-w-[120px]">
        کانال (source)
        <select
          value={source}
          onChange={(e) => {
            setSource(e.target.value);
            setPage(1);
          }}
          className="h-9 rounded-lg px-2 text-sm"
          style={inputStyle}
        >
          <option value="">همه</option>
          {CHANNEL_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs text-[#464F60] min-w-[120px]">
        وضعیت
        <select
          value={isActive}
          onChange={(e) => {
            setIsActive(e.target.value as '' | 'true' | 'false');
            setPage(1);
          }}
          className="h-9 rounded-lg px-2 text-sm"
          style={inputStyle}
        >
          <option value="">همه</option>
          <option value="true">فعال</option>
          <option value="false">غیرفعال</option>
        </select>
      </label>
      <Button title="اعمال فیلتر" active style={SecondaryButton} onClick={load} />
    </div>
  );

  return (
    <ListPageShell
      title="لیست لینک‌های کوتاه"
      subtitle="کلیک کل شامل پیش‌نمایش تلگرام است؛ برای ارزیابی کمپین از کلیک یکتا استفاده کنید."
      searchSlot={filterBar}
      pagination={
        <FixedPaginationBar>
          <PaginationLib
            count={count}
            page={page}
            rowsPerPage={rowsPerPage}
            setPage={setPage}
            setRowsPerPage={setRowsPerPage}
          />
        </FixedPaginationBar>
      }
    >
      {loading && rowData.length === 0 ? (
        <div className="flex justify-center py-12">
          <CircularProgress />
        </div>
      ) : (
        <ResponsiveDataView
          rowData={rowData}
          fields={cardFields}
          actions={cardActions}
          emptyMessage="لینکی یافت نشد"
          getRowKey={(row) => row.id}
          desktopView={
            <div className="ag-theme-alpine w-full default-table pb-4 pt-2">
              <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                localeText={AG_GRID_LOCALE_FN}
                defaultColDef={{ flex: 1, minWidth: 100 }}
                domLayout="autoHeight"
                enableRtl
                rowHeight={56}
                headerHeight={48}
                animateRows
              />
            </div>
          }
        />
      )}
    </ListPageShell>
  );
};

export default ShortLinkList;
