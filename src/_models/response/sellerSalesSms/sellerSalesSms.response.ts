export interface SellerSalesSmsSettings {
  id: number;
  isEnabled: boolean;
  templateId: number;
  templateTitle: string;
  name: string;
  title: string;
  amount: number;
  landingPath: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent?: string | null;
  landingUrl: string;
  shortUrl: string;
  smsLinkParameter?: string;
  shortLinkId?: number | null;
  lockedBody: string;
  editableFields?: string[];
}

export interface SellerSalesSmsUpdateBody {
  isEnabled?: boolean;
  name?: string;
  title?: string;
  amount?: number;
  landingPath?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  shortLinkId?: number | null;
}

export interface SellerSalesSmsTestBody {
  phone: string;
  name?: string;
  title?: string;
  shortLinkId?: number;
}

export interface SellerSalesSmsTestResult {
  sellerUserInfoId: number;
  phone: string;
  status: string;
  error: string | null;
  sent: boolean;
}
