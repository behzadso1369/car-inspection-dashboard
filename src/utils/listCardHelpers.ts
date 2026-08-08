import { ColDef } from 'ag-grid-community';
import { CardAction, CardField } from '../types/list';

const SKIP_FIELDS = new Set(['action', 'actions', 'image', 'imagePath', 'rowDrag']);

/**
 * Build simple card fields from AG Grid columnDefs for mobile fallback.
 */
export function cardFieldsFromColDefs(
  columnDefs: ColDef[],
  options?: {
    primaryField?: string;
    badgeField?: string;
    maxBodyFields?: number;
    valueOverrides?: Record<string, (row: any) => any>;
  }
): CardField<any>[] {
  const {
    primaryField,
    badgeField,
    maxBodyFields = 6,
    valueOverrides = {},
  } = options ?? {};

  const usable = columnDefs.filter((col) => {
    const field = String(col.field ?? '');
    if (!field || SKIP_FIELDS.has(field)) return false;
    if (col.headerName === 'عملیات') return false;
    return true;
  });

  const fields: CardField<any>[] = [];
  let bodyCount = 0;

  usable.forEach((col, index) => {
    const field = String(col.field);
    const isPrimary =
      field === primaryField || (!primaryField && index === 0);
    const isBadge = field === badgeField;

    if (!isPrimary && !isBadge) {
      if (bodyCount >= maxBodyFields) return;
      bodyCount += 1;
    }

    fields.push({
      key: field,
      label: col.headerName || field,
      primary: isPrimary,
      badge: isBadge,
      badgeTone: isBadge ? () => 'info' : undefined,
      getValue: (row: any) => {
        if (valueOverrides[field]) return valueOverrides[field](row);
        const value = getNested(row, field);
        if (value === null || value === undefined || value === '') return '—';
        if (typeof value === 'boolean') return value ? 'بله' : 'خیر';
        return String(value);
      },
    });
  });

  return fields;
}

function getNested(obj: any, path: string) {
  if (!obj) return undefined;
  if (path in obj) return obj[path];
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

export function defaultEditDeleteActions(handlers: {
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  editLabel?: string;
  deleteLabel?: string;
}): CardAction<any>[] {
  const actions: CardAction<any>[] = [];
  if (handlers.onEdit) {
    actions.push({
      key: 'edit',
      label: handlers.editLabel ?? 'ویرایش',
      variant: 'ghost',
      onClick: handlers.onEdit,
    });
  }
  if (handlers.onDelete) {
    actions.push({
      key: 'delete',
      label: handlers.deleteLabel ?? 'حذف',
      variant: 'danger',
      onClick: handlers.onDelete,
    });
  }
  return actions;
}
