import axios from 'axios';
import { API_BASE } from '../../config/api/base-url';
import { getAccessToken } from '../../utils/auth-role';
import { AdminPayment } from '../../_models/response/payment/adminPayment';

const authHeaders = () => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function deliverInstallment(paymentId: number) {
  const res = await axios.post(
    `${API_BASE}payment/installment/deliver/${paymentId}`,
    null,
    { headers: authHeaders() }
  );
  return res.data as {
    isSuccess: boolean;
    statusMessage?: string;
    resultObject?: { id: number; deliveredAt?: string; message?: string };
  };
}

export async function refundInstallment(paymentId: number, amountToman?: number) {
  const body: { paymentId: number; amountToman?: number } = { paymentId };
  if (amountToman != null && !Number.isNaN(amountToman)) body.amountToman = amountToman;
  const res = await axios.post(`${API_BASE}payment/installment/refund`, body, {
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
  });
  return res.data as { isSuccess: boolean; statusMessage?: string; resultObject?: AdminPayment };
}

export async function reverseInstallment(paymentId: number) {
  const res = await axios.post(
    `${API_BASE}payment/installment/reverse/${paymentId}`,
    null,
    { headers: authHeaders() }
  );
  return res.data as { isSuccess: boolean; statusMessage?: string; resultObject?: AdminPayment };
}
