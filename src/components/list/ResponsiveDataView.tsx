import { ReactNode } from 'react';
import { useIsDesktop } from '../../hooks/useBreakpoint';
import { CardAction, CardField } from '../../types/list';
import { DataCardList } from './DataCardList';

export interface ResponsiveDataViewProps<T = any> {
  rowData: T[];
  fields: CardField<T>[];
  actions?: CardAction<T>[];
  loading?: boolean;
  emptyMessage?: string;
  getRowKey?: (row: T, index: number) => string | number;
  desktopView: ReactNode;
}

export function ResponsiveDataView<T>({
  rowData,
  fields,
  actions,
  loading,
  emptyMessage,
  getRowKey,
  desktopView,
}: ResponsiveDataViewProps<T>) {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return <>{desktopView}</>;
  }

  return (
    <DataCardList
      rowData={rowData}
      fields={fields}
      actions={actions}
      loading={loading}
      emptyMessage={emptyMessage}
      getRowKey={getRowKey}
    />
  );
}

export default ResponsiveDataView;
