export type UtmBreakdownGroupBy =
  | 'campaign'
  | 'source'
  | 'medium'
  | 'content'
  | 'sourceMedium';

export interface UtmQueryFilters {
  from?: string;
  to?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  eventType?: string;
  path?: string;
  shortCode?: string;
  ref?: string;
  includeBots?: boolean;
}

export interface UtmOverview {
  from: string;
  to: string;
  totalVisits: number;
  humanVisits: number;
  botVisits: number;
  shortClicks: number;
  hits: number;
  uniqueVisitors: number;
  attributedOrders: number;
  paidOrders: number;
  salesAmount: number;
  conversionRate: number;
  paidConversionRate: number;
}

export interface UtmBreakdownRow {
  groupKey: string;
  campaign?: string | null;
  source?: string | null;
  medium?: string | null;
  content?: string | null;
  sourceMedium?: string | null;
  visits: number;
  uniqueVisitors: number;
  shortClicks: number;
  hits: number;
  attributedOrders: number;
  paidOrders: number;
  salesAmount: number;
  conversionRate: number;
}

export interface UtmPathRow {
  path: string;
  kind: string;
  kindTitle: string;
  visits: number;
  uniqueVisitors: number;
  shortClicks: number;
  hits: number;
}

export interface UtmFunnelStep {
  title: string;
  key?: string;
  visits: number;
  uniqueVisitors: number;
  percentOfPrevious: number;
  percentOfFirst: number;
}

export interface UtmJourneyRow {
  sequence: string;
  sequenceTitle: string;
  visitors: number;
  visits: number;
  percentOfVisitors: number;
  avgDurationMinutes: number;
}

export interface UtmDailyRow {
  date: string;
  day?: string;
  visits: number;
  uniqueVisitors: number;
  shortClicks?: number;
  hits?: number;
  humanVisits?: number;
}

export interface UtmHourRow {
  hour: number;
  visits: number;
  uniqueVisitors: number;
  shortClicks?: number;
  hits?: number;
}

export interface UtmFilterOptions {
  sources: string[];
  mediums: string[];
  campaigns: string[];
  contents: string[];
  eventTypes: string[];
  shortCodes: string[];
}

export interface UtmVisitRow {
  id?: number;
  ipHash: string;
  eventType: string;
  path: string;
  kind?: string | null;
  kindTitle?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  shortCode?: string | null;
  ref?: string | null;
  isBot?: boolean;
  visitedAt?: string | null;
  createdAt?: string | null;
}

export interface UtmVisitorTimeline {
  ipHash: string;
  events: UtmVisitRow[];
  totalEvents?: number;
}
