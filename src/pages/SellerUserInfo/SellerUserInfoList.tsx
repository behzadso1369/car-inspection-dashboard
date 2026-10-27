import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { AG_GRID_LOCALE_FN } from '../../utils/ag-grid-localize/localize';
import PaginationLib from '../../libs/pagination/pagination';
import { ListPageShell } from '../../components/list/ListPageShell';
import { ResponsiveDataView } from '../../components/list/ResponsiveDataView';
import { FixedPaginationBar } from '../../components/list/FixedPaginationBar';
import { CardAction, CardField } from '../../types/list';
import { SellerUserInfoItem } from '../../_models/response/sellerUserInfo/sellerUserInfo.response';
import { listSellerUserInfo } from './sellerUserInfoApi';
import {
  formatMileage,
  formatSellerDateTime,
  formatSellerPrice,
  salesSmsBadgeClass,
  salesSmsBadgeTone,
  salesSmsStatusLabel,
  sellerDisplayTitle,
} from './sellerUserInfoHelpers';
import { copyText } from '../ShortLink/shortLinkHelpers';
import { inputStyle } from '../ShortLink/shortLinkConstants';
import Button, { PrimaryButton, SecondaryButton } from '../../libs/button/button';
import { Link } from 'react-router-dom';

const PHONE_DEBOUNCE_MS = 400;

const SellerUserInfoList: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [count, setCount] = useState(0);
  const [rowData, setRowData] = useState<SellerUserInfoItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [phoneInput, setPhoneInput] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [adUrl, setAdUrl] = useState('');
  const [isDealer, setIsDealer] = useState<'' | 'true' | 'false'>('');

  const gridRef = useRef<any>();

  useEffect(() => {
    const t = window.setTimeout(() => {
      setPhoneFilter(phoneInput.trim());
      setPage(1);
    }, PHONE_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [phoneInput]);

  const load = useCallback(() => {
    setLoading(true);
    const skip = (page - 1) * rowsPerPage;
    listSellerUserInfo({
      skip,
      take: rowsPerPage,
      phone: phoneFilter,
      adUrl,
      isDealer: isDealer === '' ? '' : isDealer === 'true',
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
  }, [page, rowsPerPage, phoneFilter, adUrl, isDealer]);

  useEffect(() => {
    load();
  }, [load]);

  const openDetail = (row: SellerUserInfoItem) => {
    navigate(`/divar-sellers/${row.id}`);
  };

  const SmsBadge: React.FC<{ row: SellerUserInfoItem }> = ({ row }) => {
    const tone = salesSmsBadgeTone(row.salesSmsStatus);
    const title = row.salesSmsError?.trim() || undefined;
    return (
      <span
        className={`inline-flex text-xs px-2 py-0.5 rounded-full border ${salesSmsBadgeClass(tone)}`}
        title={title}
      >
        {salesSmsStatusLabel(row.salesSmsStatus)}
      </span>
    );
  };

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'شناسه',
        maxWidth: 90,
        valueFormatter: (p) => (p.value ?? '').toLocaleString('fa-IR'),
      },
      {
        field: 'car',
        headerName: 'خودرو',
        minWidth: 160,
        cellRenderer: (p: any) => {
          const row = p.data as SellerUserInfoItem;
          if (!row) return null;
          return (
            <div className="flex flex-col py-1 gap-0.5">
              <span className="font-medium text-sm">{sellerDisplayTitle(row)}</span>
              {row.isDealer ? (
                <span className="text-[10px] w-fit px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                  نمایشگاه
                </span>
              ) : null}
            </div>
          );
        },
      },
      {
        field: 'price',
        headerName: 'قیمت',
        minWidth: 130,
        valueFormatter: (p) => formatSellerPrice(p.value),
      },
      {
        field: 'phone',
        headerName: 'شماره',
        minWidth: 140,
        cellRenderer: (p: any) => {
          const phone = p.data?.phone ?? '';
          if (!phone) return '—';
          return (
            <div className="flex items-center gap-2 py-1 dir-ltr">
              <span className="text-sm">{phone}</span>
              <button
                type="button"
                className="text-brand text-xs shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  copyText(phone).catch(() => alert('کپی نشد'));
                }}
              >
                کپی
              </button>
            </div>
          );
        },
      },
      {
        field: 'neighborhood',
        headerName: 'محله',
        minWidth: 120,
        valueFormatter: (p) => p.value || '—',
      },
      {
        field: 'mileage',
        headerName: 'کارکرد',
        maxWidth: 120,
        valueFormatter: (p) => formatMileage(p.value),
      },
      {
        field: 'salesSmsStatus',
        headerName: 'پیامک فروش',
        minWidth: 120,
        cellRenderer: (p: any) => {
          const row = p.data as SellerUserInfoItem;
          if (!row) return null;
          return <SmsBadge row={row} />;
        },
      },
      {
        field: 'createdOn',
        headerName: 'تاریخ درج',
        minWidth: 150,
        valueFormatter: (p) => formatSellerDateTime(p.value),
      },
      {
        headerName: 'دیوار',
        maxWidth: 100,
        cellRenderer: (p: any) => {
          const url = p.data?.adUrl;
          if (!url) return '—';
          return (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              باز کردن
            </a>
          );
        },
      },
    ],
    []
  );

  const cardFields: CardField<SellerUserInfoItem>[] = useMemo(
    () => [
      {
        key: 'car',
        label: 'خودرو',
        primary: true,
        getValue: (row) => sellerDisplayTitle(row),
      },
      {
        key: 'dealer',
        label: 'نوع',
        badge: true,
        getValue: (row) => (row.isDealer ? 'نمایشگاه' : 'شخصی'),
      },
      {
        key: 'price',
        label: 'قیمت',
        getValue: (row) => formatSellerPrice(row.price),
      },
      {
        key: 'phone',
        label: 'شماره',
        getValue: (row) => row.phone || '—',
      },
      {
        key: 'sms',
        label: 'پیامک فروش',
        badge: true,
        badgeTone: (row) => {
          const t = salesSmsBadgeTone(row.salesSmsStatus);
          if (t === 'success') return 'success';
          if (t === 'danger') return 'danger';
          return 'default';
        },
        getValue: (row) => salesSmsStatusLabel(row.salesSmsStatus),
      },
      {
        key: 'created',
        label: 'تاریخ درج',
        getValue: (row) => formatSellerDateTime(row.createdOn),
      },
    ],
    []
  );

  const cardActions: CardAction<SellerUserInfoItem>[] = useMemo(
    () => [
      {
        key: 'detail',
        label: 'جزئیات',
        variant: 'primary',
        onClick: (row) => openDetail(row),
      },
      {
        key: 'copy-phone',
        label: 'کپی شماره',
        variant: 'secondary',
        hidden: (row) => !row.phone,
        onClick: (row) => copyText(row.phone!),
      },
    ],
    []
  );

  const filterBar = (
    <div className="flex flex-wrap gap-3 items-end">
      <label className="flex flex-col gap-1 text-xs text-[#464F60] min-w-[160px]">
        جستجوی شماره
        <input
          value={phoneInput}
          onChange={(e) => setPhoneInput(e.target.value)}
          className="h-9 rounded-lg px-2 text-sm"
          style={inputStyle}
          dir="ltr"
          placeholder="0912…"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-[#464F60] min-w-[200px] flex-1">
        لینک آگهی (دقیق)
        <input
          value={adUrl}
          onChange={(e) => {
            setAdUrl(e.target.value);
            setPage(1);
          }}
          className="h-9 rounded-lg px-2 text-sm"
          style={inputStyle}
          dir="ltr"
          placeholder="https://divar.ir/v/…"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-[#464F60] min-w-[140px]">
        نوع فروشنده
        <select
          value={isDealer}
          onChange={(e) => {
            setIsDealer(e.target.value as '' | 'true' | 'false');
            setPage(1);
          }}
          className="h-9 rounded-lg px-2 text-sm"
          style={inputStyle}
        >
          <option value="">همه</option>
          <option value="true">نمایشگاه‌دار</option>
          <option value="false">شخصی</option>
        </select>
      </label>
      <Button title="بروزرسانی" active style={SecondaryButton} onClick={load} />
    </div>
  );

  return (
    <ListPageShell
      title="فروشنده‌های دیوار"
      subtitle="آگهی‌های جمع‌شده از دیوار؛ وضعیت پیامک کارشناسی فروش را در هر ردیف ببینید. تنظیم قالب پیامک در منوی UTM است."
      headerAction={
        <Link to="/divar-sellers/manual">
          <Button title="ثبت / ویرایش دستی" active style={PrimaryButton} />
        </Link>
      }
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
          emptyMessage="رکوردی یافت نشد"
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
                rowStyle={{ cursor: 'pointer' }}
                onRowClicked={(e) => {
                  const row = e.data as SellerUserInfoItem | undefined;
                  if (row) openDetail(row);
                }}
              />
            </div>
          }
        />
      )}
    </ListPageShell>
  );
};

export default SellerUserInfoList;
