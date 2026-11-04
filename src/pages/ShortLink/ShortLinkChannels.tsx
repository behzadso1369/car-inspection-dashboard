import React, { useCallback, useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { ListPageShell } from '../../components/list/ListPageShell';
import { DashboardCard } from '../../components/dashboard/DashboardCard';
import Button, { PrimaryButton, SecondaryButton } from '../../libs/button/button';
import {
  SaveShortLinkChannelBody,
  ShortLinkChannelRecord,
} from '../../_models/response/shortLink/shortLink.response';
import {
  activateShortLinkChannel,
  deactivateShortLinkChannel,
  deleteShortLinkChannel,
  errorText,
  listShortLinkChannels,
  saveShortLinkChannel,
} from './shortLinkApi';
import { Field } from './ShortLinkShared';
import { inputStyle } from './shortLinkConstants';
import { validateChannelForm } from './shortLinkHelpers';

const emptyForm = (): SaveShortLinkChannelBody => ({
  code: '',
  title: '',
  utmSource: '',
  utmMedium: '',
  sortOrder: 0,
  isActive: true,
});

function recordToForm(row: ShortLinkChannelRecord): SaveShortLinkChannelBody {
  return {
    code: row.code,
    title: row.title,
    utmSource: row.utmSource ?? '',
    utmMedium: row.utmMedium ?? '',
    sortOrder: row.sortOrder ?? 0,
    isActive: row.isActive,
  };
}

const ShortLinkChannels: React.FunctionComponent = () => {
  const [rows, setRows] = useState<ShortLinkChannelRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<SaveShortLinkChannelBody>(emptyForm());
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setListError(null);
    listShortLinkChannels(false)
      .then((items) => {
        setRows(
          [...items].sort(
            (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.id - b.id
          )
        );
      })
      .catch((err) => {
        setRows([]);
        setListError(errorText(err));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm());
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (row: ShortLinkChannelRecord) => {
    setEditId(row.id);
    setForm(recordToForm(row));
    setFormError(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;
    setFormOpen(false);
    setEditId(null);
    setFormError(null);
  };

  const onSave = async () => {
    setFormError(null);
    const body: SaveShortLinkChannelBody = {
      code: form.code.trim().toLowerCase(),
      title: form.title.trim(),
      utmSource: form.utmSource?.trim() || undefined,
      utmMedium: form.utmMedium?.trim() || undefined,
      sortOrder: Number(form.sortOrder) || 0,
      isActive: form.isActive !== false,
    };
    const validation = validateChannelForm(body);
    if (validation) {
      setFormError(validation);
      return;
    }

    setSaving(true);
    try {
      await saveShortLinkChannel(body, editId ?? undefined);
      setFormOpen(false);
      load();
    } catch (err: any) {
      setFormError(errorText(err));
    } finally {
      setSaving(false);
    }
  };

  const withBusy = async (id: number, fn: () => Promise<void>) => {
    setBusyId(id);
    try {
      await fn();
      load();
    } catch (err: any) {
      alert(errorText(err));
    } finally {
      setBusyId(null);
    }
  };

  const onToggleActive = (row: ShortLinkChannelRecord) => {
    if (busyId === row.id) return;
    if (row.isActive) {
      const ok = window.confirm(
        'کانال غیرفعال در ساخت لینک جدید قابل انتخاب نیست. ادامه می‌دهید؟'
      );
      if (!ok) return;
      withBusy(row.id, () => deactivateShortLinkChannel(row.id));
    } else {
      withBusy(row.id, () => activateShortLinkChannel(row.id));
    }
  };

  const onDelete = (row: ShortLinkChannelRecord) => {
    if (busyId === row.id) return;
    const ok = window.confirm(
      `حذف نرم «${row.title}» — لینک‌های قبلی با همان utm_source می‌مانند. ادامه؟`
    );
    if (!ok) return;
    withBusy(row.id, () => deleteShortLinkChannel(row.id));
  };

  return (
    <ListPageShell
      title="انواع کانال"
      subtitle="منبع select ساخت لینک — از API، نه لیست ثابت. utm_source و utm_medium از همین جدول."
      headerAction={
        <Button title="افزودن کانال" active style={PrimaryButton} onClick={openCreate} />
      }
    >
      <p className="text-xs text-sky-900 bg-sky-50 border border-sky-200 rounded-xl px-3 py-2 mb-3">
        پنج کانال اولیه در سرور seed می‌شوند؛ کانال جدید (مثل واتساپ) را اینجا اضافه کنید. برای
        مخفی کردن از select ساخت لینک، «خاموش» کافی است.
      </p>

      {listError ? (
        <p className="text-red-600 text-sm mb-3" role="alert">
          {listError}
        </p>
      ) : null}

      {loading && rows.length === 0 ? (
        <div className="flex justify-center py-12">
          <CircularProgress />
        </div>
      ) : (
        <DashboardCard title="لیست کانال‌ها">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[720px]">
              <thead>
                <tr className="bg-slate-50 text-black-opacity-70 border-b border-card-border">
                  <th className="text-right p-2">عنوان</th>
                  <th className="text-right p-2">کد</th>
                  <th className="text-right p-2">source</th>
                  <th className="text-right p-2">medium</th>
                  <th className="text-right p-2">ترتیب</th>
                  <th className="text-right p-2">وضعیت</th>
                  <th className="text-right p-2">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-black-opacity-50">
                      کانالی ثبت نشده
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="border-b border-card-border/60">
                      <td className="p-2">{row.title}</td>
                      <td className="p-2 dir-ltr text-left">{row.code}</td>
                      <td className="p-2 dir-ltr text-left">{row.utmSource}</td>
                      <td className="p-2 dir-ltr text-left">{row.utmMedium}</td>
                      <td className="p-2 tabular-nums">{row.sortOrder ?? 0}</td>
                      <td className="p-2">
                        {row.isActive ? (
                          <span className="text-emerald-600 text-xs">فعال</span>
                        ) : (
                          <span className="text-black-opacity-50 text-xs">غیرفعال</span>
                        )}
                      </td>
                      <td className="p-2">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="text-brand text-xs disabled:opacity-50"
                            disabled={busyId === row.id}
                            onClick={() => openEdit(row)}
                          >
                            ویرایش
                          </button>
                          <button
                            type="button"
                            className="text-amber-700 text-xs disabled:opacity-50"
                            disabled={busyId === row.id}
                            onClick={() => onToggleActive(row)}
                          >
                            {row.isActive ? 'خاموش' : 'روشن'}
                          </button>
                          <button
                            type="button"
                            className="text-red-600 text-xs disabled:opacity-50"
                            disabled={busyId === row.id}
                            onClick={() => onDelete(row)}
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      )}

      {formOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-5">
            <h3 className="text-lg font-bold text-primary mb-4">
              {editId ? 'ویرایش کانال' : 'افزودن کانال'}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <Field
                label="کد (channel) *"
                hint="^[a-z0-9_]+$ — حداکثر ۴۰"
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                dir="ltr"
                placeholder="whatsapp"
                disabled={!!editId}
              />
              <Field
                label="عنوان فارسی *"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="واتساپ"
              />
              <Field
                label="utm_source (اختیاری)"
                hint="خالی = همان code"
                value={form.utmSource ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, utmSource: e.target.value }))}
                dir="ltr"
              />
              <Field
                label="utm_medium (اختیاری)"
                hint="خالی = همان code — مثال sms / social"
                value={form.utmMedium ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, utmMedium: e.target.value }))}
                dir="ltr"
              />
              <Field
                label="ترتیب (sortOrder)"
                hint="۰ = آخر لیست"
                type="number"
                value={String(form.sortOrder ?? 0)}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))
                }
                dir="ltr"
              />
              <label className="flex items-center gap-2 text-sm text-[#464F60]">
                <input
                  type="checkbox"
                  checked={form.isActive !== false}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                />
                فعال در ساخت لینک
              </label>
            </div>

            {formError ? (
              <p className="text-red-600 text-sm mt-3" role="alert">
                {formError}
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                title={saving ? 'در حال ذخیره…' : 'ذخیره'}
                active={!saving}
                style={PrimaryButton}
                onClick={onSave}
              />
              <Button title="انصراف" active={!saving} style={SecondaryButton} onClick={closeForm} />
              {saving ? <CircularProgress size={22} /> : null}
            </div>
          </div>
        </div>
      ) : null}
    </ListPageShell>
  );
};

export default ShortLinkChannels;
