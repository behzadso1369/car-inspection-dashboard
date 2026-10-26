export type ShortLinkChannel = 'sms' | 'telegram' | 'instagram' | 'aparat' | 'divar';

export interface ShortLinkItem {
  id: number;
  code: string;
  shortUrl: string;
  targetUrl: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string | null;
  hasRecipient: boolean;
  isActive: boolean;
  createdAt: string;
  expiresAt: string | null;
  totalClicks: number;
  uniqueClicks: number;
  reservations: number;
  salesAmount: number;
}

export interface ShortLinkCreated {
  id: number;
  code: string;
  shortUrl: string;
  targetUrl: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string | null;
  expiresAt: string | null;
}

export interface ShortLinkBulkItem {
  phone: string;
  code: string;
  shortUrl: string;
  recipientRef: string;
}

export interface ShortLinkBulkResult {
  count: number;
  items: ShortLinkBulkItem[];
}

export interface ShortLinkCampaignRow {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  links: number;
  totalClicks: number;
  uniqueClicks: number;
  reservations: number;
  salesAmount: number;
  conversionRate: number;
}

export interface CreateShortLinkBody {
  targetPath?: string;
  channel: ShortLinkChannel;
  utmCampaign: string;
  utmContent?: string;
  expiresAt?: string | null;
}

export interface BulkShortLinkBody {
  targetPath?: string;
  channel: ShortLinkChannel;
  utmCampaign: string;
  utmContent?: string;
  phones: string[];
}
