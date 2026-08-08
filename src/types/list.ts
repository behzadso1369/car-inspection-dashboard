import { ReactNode } from 'react';

export type CardBadgeTone = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface CardField<T = any> {
  key: string;
  label: string;
  getValue: (row: T) => ReactNode;
  primary?: boolean;
  badge?: boolean;
  badgeTone?: (row: T) => CardBadgeTone;
  hideOnCard?: boolean;
}

export interface CardAction<T = any> {
  key: string;
  label: string;
  onClick: (row: T) => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  hidden?: (row: T) => boolean;
}
