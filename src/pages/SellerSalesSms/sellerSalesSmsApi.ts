import instance from '../../helper/interceptor';
import {
  SellerSalesSmsSettings,
  SellerSalesSmsTestBody,
  SellerSalesSmsTestResult,
  SellerSalesSmsUpdateBody,
} from '../../_models/response/sellerSalesSms/sellerSalesSms.response';

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

export async function getSellerSalesSmsSettings(): Promise<SellerSalesSmsSettings> {
  const res = await instance.get('seller-sales-sms');
  const data = assertSuccess(res.data);
  return data.resultObject as SellerSalesSmsSettings;
}

export async function updateSellerSalesSmsSettings(
  body: SellerSalesSmsUpdateBody
): Promise<SellerSalesSmsSettings> {
  const res = await instance.put('seller-sales-sms', body);
  const data = assertSuccess(res.data);
  return data.resultObject as SellerSalesSmsSettings;
}

export async function sendSellerSalesSmsTest(
  body: SellerSalesSmsTestBody
): Promise<SellerSalesSmsTestResult> {
  const res = await instance.post('seller-sales-sms/test', body);
  const data = assertSuccess(res.data);
  return data.resultObject as SellerSalesSmsTestResult;
}
