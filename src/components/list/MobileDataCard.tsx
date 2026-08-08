import { ReactNode } from 'react';
import { CardAction, CardBadgeTone, CardField } from '../../types/list';

const toneClasses: Record<CardBadgeTone, string> = {
  default: 'bg-light text-primary',
  success: 'bg-emerald-50 text-mid-green',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-mid-red',
  info: 'bg-secondary-opacity-20 text-brand',
};

const actionClasses: Record<NonNullable<CardAction['variant']>, string> = {
  primary: 'bg-brand text-white hover:bg-brand/90 border-transparent',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 border-transparent',
  ghost: 'bg-white text-primary border-card-border hover:bg-surface',
  danger: 'bg-mid-red text-white hover:bg-red-600 border-transparent',
};

export interface MobileDataCardProps<T = any> {
  row: T;
  fields: CardField<T>[];
  actions?: CardAction<T>[];
  getRowKey?: (row: T) => string | number;
}

export function MobileDataCard<T>({
  row,
  fields,
  actions = [],
}: MobileDataCardProps<T>) {
  const visibleFields = fields.filter((f) => !f.hideOnCard);
  const primary = visibleFields.find((f) => f.primary);
  const badgeField = visibleFields.find((f) => f.badge);
  const bodyFields = visibleFields.filter((f) => !f.primary && !f.badge);
  const visibleActions = actions.filter((a) => !a.hidden?.(row));

  const renderValue = (value: ReactNode) => {
    if (value === null || value === undefined || value === '') return '—';
    return value;
  };

  return (
    <article className="bg-white border border-card-border rounded-2xl p-4 shadow-card active:shadow-card-hover transition-shadow relative overflow-hidden">
      <span className="absolute top-0 right-0 w-1 h-full bg-brand/70" />
      <header className="flex items-start justify-between gap-3 mb-3 pr-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-primary text-base font-bold truncate !font-peydaBold">
            {renderValue(primary ? primary.getValue(row) : '—')}
          </h3>
          {primary?.label && (
            <p className="text-[11px] text-black-opacity-50 mt-0.5">
              {primary.label}
            </p>
          )}
        </div>
        {badgeField && (
          <span
            className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium max-w-[40%] truncate ${
              toneClasses[badgeField.badgeTone?.(row) ?? 'default']
            }`}
          >
            {renderValue(badgeField.getValue(row))}
          </span>
        )}
      </header>

      {bodyFields.length > 0 && (
        <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
          {bodyFields.map((field) => (
            <div key={field.key} className="min-w-0">
              <p className="text-[11px] text-black-opacity-50 mb-0.5">
                {field.label}
              </p>
              <div className="text-sm text-dark break-words">
                {renderValue(field.getValue(row))}
              </div>
            </div>
          ))}
        </div>
      )}

      {visibleActions.length > 0 && (
        <footer className="mt-4 pt-3 border-t border-card-border grid grid-cols-1 sm:grid-cols-3 gap-2">
          {visibleActions.map((action) => (
            <button
              key={action.key}
              type="button"
              onClick={() => action.onClick(row)}
              className={`w-full min-h-[44px] px-3 rounded-xl text-sm font-medium border transition-colors ${
                actionClasses[action.variant ?? 'primary']
              }`}
            >
              {action.label}
            </button>
          ))}
        </footer>
      )}
    </article>
  );
}

export default MobileDataCard;
