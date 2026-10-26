import { ShortLinkItem } from '../../_models/response/shortLink/shortLink.response';

/** مسیر فرود seller-sales-sms بدون اسلش اول — مثل car-inspection */
export function landingPathFromTargetUrl(targetUrl: string): string {
  try {
    const path = new URL(targetUrl).pathname.replace(/^\/+/, '');
    return path || 'car-inspection';
  } catch {
    return 'car-inspection';
  }
}

export function utmFieldsFromShortLink(link: ShortLinkItem) {
  return {
    landingPath: landingPathFromTargetUrl(link.targetUrl),
    utmSource: link.utmSource ?? '',
    utmMedium: link.utmMedium ?? '',
    utmCampaign: link.utmCampaign ?? '',
    utmContent: link.utmContent ?? '',
  };
}

export function campaignKey(source: string, medium: string, campaign: string) {
  return `${source}\t${medium}\t${campaign}`;
}

export function parseCampaignKey(key: string) {
  const [utmSource, utmMedium, utmCampaign] = key.split('\t');
  return { utmSource, utmMedium, utmCampaign };
}
