import axios from 'axios';
import instance from '../../helper/interceptor';
import {
  CarGroupOption,
  CarSearchHit,
  DateTypeOption,
  DayOption,
  InspectionOption,
  LocationOption,
  SupportMoveResult,
  SupportOrderCreated,
} from '../../_models/response/order/supportOrder.response';

const SITE = 'https://api.carmacheck.com/api';

export function field(obj: any, name: string) {
  if (obj == null || typeof obj !== 'object') return undefined;
  if (obj[name] !== undefined && obj[name] !== null) return obj[name];
  const pascal = name.charAt(0).toUpperCase() + name.slice(1);
  return obj[pascal];
}

export function asList(resultObject: any, key: string): any[] {
  if (Array.isArray(resultObject)) return resultObject;
  if (!resultObject || typeof resultObject !== 'object') return [];
  const camel = key.charAt(0).toLowerCase() + key.slice(1);
  const value = resultObject[key] ?? resultObject[camel];
  return Array.isArray(value) ? value : [];
}

export function unwrap(res: any) {
  const data = res?.data ?? res;
  if (data?.isSuccess === false) {
    const error: any = new Error(data.statusMessage || 'عملیات ناموفق بود');
    error.statusMessage = data.statusMessage;
    throw error;
  }
  return data?.resultObject;
}

export function errorText(err: any) {
  return (
    err?.response?.data?.statusMessage ||
    err?.response?.data?.message ||
    err?.statusMessage ||
    err?.message ||
    'خطا در ارتباط با سرور'
  );
}

export function imageUrl(path?: string | null) {
  if (!path) return '';
  const clean = String(path).replace(/\\/g, '/');
  if (clean.startsWith('http')) return clean;
  return `https://api.carmacheck.com/${clean.replace(/^\/+/, '')}`;
}

export function formatToman(value?: number | null) {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount)) return '—';
  return `${amount.toLocaleString('fa-IR')} تومان`;
}

export function isValidPhone(value: string) {
  const phone = value.trim().replace(/\s/g, '');
  return /^09\d{9}$/.test(phone) || /^\+989\d{9}$/.test(phone) || /^989\d{9}$/.test(phone);
}

export function toScheduledDate(iso: string) {
  return `${String(iso).slice(0, 10)}T00:00:00`;
}

export function toScheduledTime(display: string) {
  const [hh = '00', mm = '00', ss = '00'] = String(display).split(':');
  return `${hh.padStart(2, '0')}:${mm.padStart(2, '0')}:${ss.padStart(2, '0')}`;
}

function mapSearchHit(item: any): CarSearchHit {
  const flag = field(item, 'isCarBrand');
  return {
    id: Number(field(item, 'id')),
    name: String(field(item, 'name') ?? ''),
    image: imageUrl(field(item, 'imagePath')),
    isBrand: flag === 1 || flag === true || flag === '1',
  };
}

function mapGroup(item: any): CarGroupOption {
  return {
    id: Number(field(item, 'id')),
    name: String(field(item, 'name') ?? ''),
    image: imageUrl(field(item, 'imagePath')),
  };
}

function mapInspection(item: any): InspectionOption {
  const features = field(item, 'features');
  return {
    id: Number(field(item, 'id')),
    typeId: Number(field(item, 'inspectionTypeId')),
    name: String(field(item, 'inspectionTypeName') ?? ''),
    price: Number(field(item, 'ourPrice') ?? 0),
    features: Array.isArray(features)
      ? features.map((feature: any) => String(field(feature, 'name') ?? '')).filter(Boolean)
      : [],
  };
}

function mapLocation(item: any): LocationOption {
  const name = String(field(item, 'name') ?? '');
  return {
    id: Number(field(item, 'id')),
    name,
    description: String(field(item, 'locationTypeDescription') ?? ''),
    onSite: name.includes('در محل'),
  };
}

function mapDateType(item: any): DateTypeOption {
  const maxMinutes = field(item, 'maxMinutes');
  return {
    id: Number(field(item, 'id')),
    name: String(field(item, 'name') ?? ''),
    description: String(field(item, 'inspectionTypeDescription') ?? ''),
    extraCost: Number(field(item, 'additionalCost') ?? 0),
    maxMinutes: maxMinutes == null ? null : Number(maxMinutes),
  };
}

function mapDay(item: any): DayOption {
  const hours = field(item, 'hours');
  return {
    id: Number(field(item, 'id')),
    title: String(field(item, 'title') ?? ''),
    date: String(field(item, 'date') ?? ''),
    closed: Boolean(field(item, 'isClosed') || field(item, 'isHoliday')),
    holidayTitle: String(field(item, 'holidayTitle') ?? ''),
    hours: Array.isArray(hours)
      ? hours.map((hour: any) => ({
          display: String(field(hour, 'display') ?? ''),
          disabled: Boolean(field(hour, 'isDisabled')),
          extraCost: Number(field(hour, 'additionalCost') ?? 0),
        }))
      : [],
  };
}

export function readCreated(raw: any): SupportOrderCreated {
  return {
    orderId: Number(field(raw, 'orderId')),
    userId: String(field(raw, 'userId') ?? ''),
    fullName: String(field(raw, 'fullName') ?? ''),
    phoneNumber: String(field(raw, 'phoneNumber') ?? ''),
  };
}

export function readMove(raw: any): SupportMoveResult {
  const paymentUrl = field(raw, 'paymentUrl');
  return {
    isEndFlow: Boolean(field(raw, 'isEndFlow')),
    orderId: Number(field(raw, 'orderId') ?? 0),
    discountCode: field(raw, 'discountCode') ?? null,
    price: Number(field(raw, 'price') ?? 0),
    discount: Number(field(raw, 'discount') ?? 0),
    finalPrice: Number(field(raw, 'finalPrice') ?? 0),
    paymentUrl: paymentUrl ? String(paymentUrl) : null,
    trackId: field(raw, 'trackId') ?? null,
    paymentId: field(raw, 'paymentId') ?? null,
    requiresPayment: Boolean(field(raw, 'requiresPayment')),
    paidFullyByWallet: Boolean(field(raw, 'paidFullyByWallet')),
    walletAmountUsed: Number(field(raw, 'walletAmountUsed') ?? 0),
    gatewayAmount: Number(field(raw, 'gatewayAmount') ?? 0),
    smsSent: Boolean(field(raw, 'smsSent')),
  };
}

export function addressIdFrom(raw: any): number | null {
  if (typeof raw === 'number' && raw > 0) return raw;
  const id = field(raw, 'addressId') ?? field(raw, 'id');
  const parsed = Number(id);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

const site = axios.create();

export const supportOrderApi = {
  search(terms: string) {
    return site
      .get(`${SITE}/Site/SearchWithAllData`, { params: { Terms: terms } })
      .then((res) => asList(unwrap(res), 'Results').map(mapSearchHit));
  },
  groups(brandId: number) {
    return site
      .get(`${SITE}/Site/GetCarGroupWithBrandId`, { params: { CarBrandId: brandId } })
      .then((res) => asList(unwrap(res), 'CarGroups').map(mapGroup));
  },
  inspections(carGroupId: number) {
    return site
      .get(`${SITE}/Site/GetCarInspectionData`, { params: { CarGroupId: carGroupId } })
      .then((res) => asList(unwrap(res), 'CarInspectionPage').map(mapInspection));
  },
  locations() {
    return site
      .get(`${SITE}/Site/GetCarInspectionLocationData`)
      .then((res) => asList(unwrap(res), 'CarInspectionLocationPage').map(mapLocation));
  },
  dateTypes() {
    return site
      .get(`${SITE}/Site/GetCarInspectionDateType`)
      .then((res) => asList(unwrap(res), 'CarInspectionDateTypes').map(mapDateType));
  },
  days() {
    return site
      .get(`${SITE}/Site/GetCarInspectionDateAndTime`)
      .then((res) => asList(unwrap(res), 'Days').map(mapDay));
  },
  create(body: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    carGroupId: number;
  }) {
    return instance
      .post(`${SITE}/OrderSite/Support/Create`, body)
      .then((res) => readCreated(unwrap(res)));
  },
  move(body: Record<string, unknown>) {
    return instance
      .post(`${SITE}/OrderSite/Support/Move`, body)
      .then((res) => readMove(unwrap(res)));
  },
  createAddress(body: {
    title: string;
    city: string;
    street: string;
    plaque: string;
    lat: number;
    lng: number;
  }) {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || '';
    return site
      .post(`${SITE}/User/CreateUserAddress`, body, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => addressIdFrom(unwrap(res)));
  },
};
