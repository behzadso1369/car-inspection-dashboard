import { CircularProgress } from '@mui/material';
import { CardAction, CardField } from '../../types/list';
import { MobileDataCard } from './MobileDataCard';

export interface DataCardListProps<T = any> {
  rowData: T[];
  fields: CardField<T>[];
  actions?: CardAction<T>[];
  loading?: boolean;
  emptyMessage?: string;
  getRowKey?: (row: T, index: number) => string | number;
}

export function DataCardList<T>({
  rowData,
  fields,
  actions,
  loading = false,
  emptyMessage = 'موردی یافت نشد',
  getRowKey = (_row, index) => index,
}: DataCardListProps<T>) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <CircularProgress size={36} />
      </div>
    );
  }

  if (!rowData?.length) {
    return (
      <div className="bg-white border border-dashed border-card-border rounded-2xl py-14 px-4 text-center">
        <p className="text-black-opacity-60 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 pb-2">
      {rowData.map((row, index) => (
        <MobileDataCard
          key={getRowKey(row, index)}
          row={row}
          fields={fields}
          actions={actions}
        />
      ))}
    </div>
  );
}

export default DataCardList;
