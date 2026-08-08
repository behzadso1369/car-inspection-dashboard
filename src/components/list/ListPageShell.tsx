import { ReactNode } from 'react';

export interface ListPageShellProps {
  title: string;
  subtitle?: string;
  headerAction?: ReactNode;
  searchSlot?: ReactNode;
  children: ReactNode;
  pagination?: ReactNode;
}

export function ListPageShell({
  title,
  subtitle,
  headerAction,
  searchSlot,
  children,
  pagination,
}: ListPageShellProps) {
  return (
    <div className={`w-full ${pagination ? 'pb-[7.5rem] sm:pb-28 lg:pb-24' : 'pb-4'}`}>
      <div className="bg-white border border-card-border rounded-2xl p-4 mb-3 shadow-card relative overflow-hidden">
        <span className="absolute top-0 right-0 w-1.5 h-full bg-brand" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pr-2">
          <div className="min-w-0">
            <h1 className="text-primary text-lg sm:text-xl font-bold !font-peydaBold">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-black-opacity-60 mt-1 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && (
            <div className="shrink-0 w-full sm:w-auto">{headerAction}</div>
          )}
        </div>
      </div>

      {searchSlot && (
        <div className="mb-3 bg-white border border-card-border rounded-2xl p-3 sm:p-4 shadow-card overflow-x-auto">
          {searchSlot}
        </div>
      )}

      <div className="w-full">{children}</div>
      {pagination}
    </div>
  );
}

export default ListPageShell;
