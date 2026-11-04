import instance from '../../helper/interceptor';
import {
  UtmBreakdownGroupBy,
  UtmBreakdownRow,
  UtmDailyRow,
  UtmFilterOptions,
  UtmFunnelStep,
  UtmHourRow,
  UtmJourneyRow,
  UtmOverview,
  UtmPathRow,
  UtmQueryFilters,
  UtmVisitRow,
  UtmVisitorTimeline,
} from '../../_models/response/utm/utmAnalytics.response';

function assertSuccess(data: any) {
  if (data?.isSuccess === false) {
    const error: any = new Error(data.statusMessage || 'عملیات ناموفق بود');
    error.statusMessage = data.statusMessage;
    throw error;
  }
  return data;
}

export function errorText(err: any) {
  return (
    err?.response?.data?.statusMessage ||
    err?.statusMessage ||
    err?.message ||
    'خطا در ارتباط با سرور'
  );
}

function buildParams(filters: UtmQueryFilters): Record<string, string | boolean> {
  const params: Record<string, string | boolean> = {};
  if (filters.from) params.from = filters.from;
  if (filters.to) params.to = filters.to;
  if (filters.source?.trim()) params.source = filters.source.trim();
  if (filters.medium?.trim()) params.medium = filters.medium.trim();
  if (filters.campaign?.trim()) params.campaign = filters.campaign.trim();
  if (filters.content?.trim()) params.content = filters.content.trim();
  if (filters.eventType?.trim()) params.eventType = filters.eventType.trim();
  if (filters.path?.trim()) params.path = filters.path.trim();
  if (filters.shortCode?.trim()) params.shortCode = filters.shortCode.trim();
  if (filters.ref?.trim()) params.ref = filters.ref.trim();
  if (filters.includeBots) params.includeBots = true;
  return params;
}

function num(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeOverview(raw: any): UtmOverview {
  return {
    from: raw?.from ?? '',
    to: raw?.to ?? '',
    totalVisits: num(raw?.totalVisits),
    humanVisits: num(raw?.humanVisits),
    botVisits: num(raw?.botVisits),
    shortClicks: num(raw?.shortClicks),
    hits: num(raw?.hits),
    uniqueVisitors: num(raw?.uniqueVisitors),
    attributedOrders: num(raw?.attributedOrders),
    paidOrders: num(raw?.paidOrders),
    salesAmount: num(raw?.salesAmount),
    conversionRate: num(raw?.conversionRate),
    paidConversionRate: num(raw?.paidConversionRate),
  };
}

function normalizeBreakdownRow(raw: any): UtmBreakdownRow {
  return {
    groupKey: raw?.groupKey ?? raw?.GroupKey ?? '(بدون مقدار)',
    campaign: raw?.campaign ?? null,
    source: raw?.source ?? null,
    medium: raw?.medium ?? null,
    content: raw?.content ?? null,
    sourceMedium: raw?.sourceMedium ?? null,
    visits: num(raw?.visits),
    uniqueVisitors: num(raw?.uniqueVisitors),
    shortClicks: num(raw?.shortClicks),
    hits: num(raw?.hits),
    attributedOrders: num(raw?.attributedOrders),
    paidOrders: num(raw?.paidOrders),
    salesAmount: num(raw?.salesAmount),
    conversionRate: num(raw?.conversionRate),
  };
}

function normalizePathRow(raw: any): UtmPathRow {
  return {
    path: raw?.path ?? '—',
    kind: raw?.kind ?? 'other',
    kindTitle: raw?.kindTitle ?? raw?.kind ?? 'سایر',
    visits: num(raw?.visits),
    uniqueVisitors: num(raw?.uniqueVisitors),
    shortClicks: num(raw?.shortClicks),
    hits: num(raw?.hits),
  };
}

function normalizeFunnelStep(raw: any): UtmFunnelStep {
  return {
    title: raw?.title ?? '—',
    key: raw?.key ?? raw?.stepKey,
    visits: num(raw?.visits),
    uniqueVisitors: num(raw?.uniqueVisitors),
    percentOfPrevious: num(raw?.percentOfPrevious),
    percentOfFirst: num(raw?.percentOfFirst),
  };
}

function normalizeJourneyRow(raw: any): UtmJourneyRow {
  return {
    sequence: raw?.sequence ?? '',
    sequenceTitle: raw?.sequenceTitle ?? raw?.sequence ?? '—',
    visitors: num(raw?.visitors),
    visits: num(raw?.visits),
    percentOfVisitors: num(raw?.percentOfVisitors),
    avgDurationMinutes: num(raw?.avgDurationMinutes),
  };
}

function normalizeDailyRow(raw: any): UtmDailyRow {
  return {
    date: raw?.date ?? raw?.day ?? '',
    day: raw?.day,
    visits: num(raw?.visits),
    uniqueVisitors: num(raw?.uniqueVisitors),
    shortClicks: raw?.shortClicks == null ? undefined : num(raw.shortClicks),
    hits: raw?.hits == null ? undefined : num(raw.hits),
    humanVisits: raw?.humanVisits == null ? undefined : num(raw.humanVisits),
  };
}

function normalizeHourRow(raw: any): UtmHourRow {
  return {
    hour: num(raw?.hour),
    visits: num(raw?.visits),
    uniqueVisitors: num(raw?.uniqueVisitors),
    shortClicks: raw?.shortClicks == null ? undefined : num(raw.shortClicks),
    hits: raw?.hits == null ? undefined : num(raw.hits),
  };
}

function normalizeVisitRow(raw: any): UtmVisitRow {
  return {
    id: raw?.id,
    ipHash: raw?.ipHash ?? '—',
    eventType: raw?.eventType ?? '—',
    path: raw?.path ?? '—',
    kind: raw?.kind ?? null,
    kindTitle: raw?.kindTitle ?? null,
    utmSource: raw?.utmSource ?? raw?.source ?? null,
    utmMedium: raw?.utmMedium ?? raw?.medium ?? null,
    utmCampaign: raw?.utmCampaign ?? raw?.campaign ?? null,
    utmContent: raw?.utmContent ?? raw?.content ?? null,
    shortCode: raw?.shortCode ?? null,
    ref: raw?.ref ?? null,
    isBot: Boolean(raw?.isBot),
    visitedAt: raw?.visitedAt ?? raw?.createdAt ?? null,
    createdAt: raw?.createdAt ?? null,
  };
}

export async function fetchUtmOverview(filters: UtmQueryFilters): Promise<UtmOverview> {
  const res = await instance.get('utm/overview', { params: buildParams(filters) });
  const data = assertSuccess(res.data);
  return normalizeOverview(data.resultObject ?? {});
}

export async function fetchUtmBreakdown(
  filters: UtmQueryFilters,
  groupBy: UtmBreakdownGroupBy = 'campaign'
): Promise<UtmBreakdownRow[]> {
  const res = await instance.get('utm/breakdown', {
    params: { ...buildParams(filters), groupBy },
  });
  const data = assertSuccess(res.data);
  const list = data.resultObject ?? [];
  return Array.isArray(list) ? list.map(normalizeBreakdownRow) : [];
}

export async function fetchUtmPaths(
  filters: UtmQueryFilters,
  top = 40
): Promise<UtmPathRow[]> {
  const res = await instance.get('utm/paths', {
    params: { ...buildParams(filters), top },
  });
  const data = assertSuccess(res.data);
  const list = data.resultObject ?? [];
  return Array.isArray(list) ? list.map(normalizePathRow) : [];
}

export async function fetchUtmFunnel(filters: UtmQueryFilters): Promise<UtmFunnelStep[]> {
  const res = await instance.get('utm/funnel', { params: buildParams(filters) });
  const data = assertSuccess(res.data);
  const list = data.resultObject ?? [];
  return Array.isArray(list) ? list.map(normalizeFunnelStep) : [];
}

export async function fetchUtmJourneys(
  filters: UtmQueryFilters,
  top = 30
): Promise<UtmJourneyRow[]> {
  const res = await instance.get('utm/journeys', {
    params: { ...buildParams(filters), top },
  });
  const data = assertSuccess(res.data);
  const list = data.resultObject ?? [];
  return Array.isArray(list) ? list.map(normalizeJourneyRow) : [];
}

export async function fetchUtmDaily(filters: UtmQueryFilters): Promise<UtmDailyRow[]> {
  const res = await instance.get('utm/daily', { params: buildParams(filters) });
  const data = assertSuccess(res.data);
  const list = data.resultObject ?? [];
  return Array.isArray(list) ? list.map(normalizeDailyRow) : [];
}

export async function fetchUtmHours(filters: UtmQueryFilters): Promise<UtmHourRow[]> {
  const res = await instance.get('utm/hours', { params: buildParams(filters) });
  const data = assertSuccess(res.data);
  const list = data.resultObject ?? [];
  return Array.isArray(list) ? list.map(normalizeHourRow) : [];
}

export async function fetchUtmFilters(params: {
  from?: string;
  to?: string;
}): Promise<UtmFilterOptions> {
  const res = await instance.get('utm/filters', { params });
  const data = assertSuccess(res.data);
  const raw = data.resultObject ?? {};
  const asStrings = (key: string) => {
    const value = raw[key];
    return Array.isArray(value) ? value.map(String) : [];
  };
  return {
    sources: asStrings('sources'),
    mediums: asStrings('mediums'),
    campaigns: asStrings('campaigns'),
    contents: asStrings('contents'),
    eventTypes: asStrings('eventTypes'),
    shortCodes: asStrings('shortCodes'),
  };
}

export async function fetchUtmVisits(
  filters: UtmQueryFilters,
  pageNumber: number,
  pageSize: number
): Promise<{ items: UtmVisitRow[]; total: number }> {
  const size = Math.min(Math.max(pageSize, 1), 100);
  const res = await instance.get('utm/visits', {
    params: {
      ...buildParams(filters),
      pageNumber,
      pageSize: size,
    },
  });
  const data = assertSuccess(res.data);
  const list = data.resultObject ?? [];
  return {
    items: Array.isArray(list) ? list.map(normalizeVisitRow) : [],
    total: num(data.countData),
  };
}

export async function fetchUtmVisitor(ipHash: string, filters: UtmQueryFilters): Promise<UtmVisitorTimeline> {
  const encoded = encodeURIComponent(ipHash);
  const res = await instance.get(`utm/visitors/${encoded}`, {
    params: buildParams(filters),
  });
  const data = assertSuccess(res.data);
  const raw = data.resultObject ?? {};
  const eventsRaw = Array.isArray(raw) ? raw : raw.events ?? raw.timeline ?? [];
  const events = Array.isArray(eventsRaw) ? eventsRaw.map(normalizeVisitRow) : [];
  return {
    ipHash: raw.ipHash ?? ipHash,
    events,
    totalEvents: num(raw.totalEvents, events.length),
  };
}
