import axios from 'axios';
import instance from '../../helper/interceptor';
import {
  BulkShortLinkBody,
  CreateShortLinkBody,
  ShortLinkBulkResult,
  ShortLinkCampaignRow,
  ShortLinkCreated,
  ShortLinkItem,
} from '../../_models/response/shortLink/shortLink.response';

const ADMIN_BASE = 'https://api.carmacheck.com/api/admin';

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

export async function createShortLink(body: CreateShortLinkBody): Promise<ShortLinkCreated> {
  const res = await instance.post('short-links', body);
  const data = assertSuccess(res.data);
  return data.resultObject as ShortLinkCreated;
}

export async function listShortLinks(params: {
  campaign?: string;
  source?: string;
  isActive?: boolean | '';
  pageNumber?: number;
  pageSize?: number;
}): Promise<{ items: ShortLinkItem[]; total: number }> {
  const query: Record<string, string | number | boolean> = {
    pageNumber: params.pageNumber ?? 1,
    pageSize: params.pageSize ?? 50,
  };
  if (params.campaign?.trim()) query.campaign = params.campaign.trim();
  if (params.source?.trim()) query.source = params.source.trim();
  if (params.isActive === true || params.isActive === false) {
    query.isActive = params.isActive;
  }

  const res = await instance.get('short-links', { params: query });
  const data = assertSuccess(res.data);
  return {
    items: (data.resultObject ?? []) as ShortLinkItem[],
    total: Number(data.countData ?? 0),
  };
}

export async function deactivateShortLink(id: number): Promise<void> {
  const res = await instance.post(`short-links/${id}/deactivate`);
  assertSuccess(res.data);
}

export async function listCampaigns(params: {
  from?: string;
  to?: string;
}): Promise<ShortLinkCampaignRow[]> {
  const res = await instance.get('short-links/campaigns', { params });
  const data = assertSuccess(res.data);
  return (data.resultObject ?? []) as ShortLinkCampaignRow[];
}

export async function bulkShortLinksPreview(body: BulkShortLinkBody): Promise<ShortLinkBulkResult> {
  const res = await instance.post('short-links/bulk?format=json', body);
  const data = assertSuccess(res.data);
  return data.resultObject as ShortLinkBulkResult;
}

export async function downloadBulkCsv(body: BulkShortLinkBody): Promise<void> {
  const token = localStorage.getItem('accessToken') || '';
  const res = await axios.post(`${ADMIN_BASE}/short-links/bulk`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  });

  const blob = res.data as Blob;
  const type = res.headers['content-type'] || '';
  if (type.includes('application/json') || type.includes('text/json')) {
    const text = await blob.text();
    let message = 'خطا در ساخت گروهی';
    try {
      const json = JSON.parse(text);
      message = json.statusMessage || message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  let filename = 'short-links.csv';
  const disposition = res.headers['content-disposition'];
  if (disposition) {
    const utf8 = /filename\*=UTF-8''([^;]+)/i.exec(disposition);
    if (utf8?.[1]) {
      filename = decodeURIComponent(utf8[1]);
    } else {
      const plain = /filename="?([^";]+)"?/i.exec(disposition);
      if (plain?.[1]) filename = plain[1];
    }
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
