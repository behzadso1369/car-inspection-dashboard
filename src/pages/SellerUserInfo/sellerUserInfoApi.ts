import axios from 'axios';
import {
  SellerUserInfoItem,
  SellerUserInfoUpsertBody,
  SellerUserInfoUpsertResult,
} from '../../_models/response/sellerUserInfo/sellerUserInfo.response';

const SELLER_USER_INFO_BASE = 'https://api.carmacheck.com/api/SellerUserInfo';

function authHeaders() {
  const token = localStorage.getItem('accessToken') || '';
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

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

export async function listSellerUserInfo(params: {
  skip?: number;
  take?: number;
  phone?: string;
  adUrl?: string;
  isDealer?: boolean | '';
}): Promise<{ items: SellerUserInfoItem[]; total: number; skip: number; take: number }> {
  const query: Record<string, string | number> = {
    skip: params.skip ?? 0,
    take: params.take ?? 50,
  };
  if (params.phone?.trim()) query.phone = params.phone.trim();
  if (params.adUrl?.trim()) query.adUrl = params.adUrl.trim();
  if (params.isDealer === true || params.isDealer === false) {
    query.isDealer = String(params.isDealer);
  }

  const res = await axios.get(SELLER_USER_INFO_BASE, {
    params: query,
    headers: authHeaders(),
  });
  const data = assertSuccess(res.data);
  return {
    items: (data.resultObject ?? []) as SellerUserInfoItem[],
    total: Number(data.countData ?? 0),
    skip: Number(data.skip ?? query.skip),
    take: Number(data.take ?? query.take),
  };
}

export async function getSellerUserInfo(id: number): Promise<SellerUserInfoItem> {
  const res = await axios.get(`${SELLER_USER_INFO_BASE}/${id}`, {
    headers: authHeaders(),
  });
  const data = assertSuccess(res.data);
  return data.resultObject as SellerUserInfoItem;
}

export async function upsertSellerUserInfo(
  body: SellerUserInfoUpsertBody
): Promise<SellerUserInfoUpsertResult> {
  const res = await axios.post(SELLER_USER_INFO_BASE, body, {
    headers: authHeaders(),
  });
  const data = assertSuccess(res.data);
  return data.resultObject as SellerUserInfoUpsertResult;
}
