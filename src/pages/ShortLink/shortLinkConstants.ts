import { ShortLinkChannel } from '../../_models/response/shortLink/shortLink.response';

export const UTM_CAMPAIGN_PATTERN = /^[a-z0-9_]+$/;

export const CHANNEL_OPTIONS: {
  value: ShortLinkChannel;
  label: string;
}[] = [
  { value: 'sms', label: 'پیامک' },
  { value: 'telegram', label: 'تلگرام' },
  { value: 'instagram', label: 'اینستاگرام' },
  { value: 'aparat', label: 'آپارات' },
  { value: 'divar', label: 'دیوار' },
];

export const BULK_PHONE_LIMIT = 1000;

export const inputStyle = {
  boxShadow:
    '0px 0px 0px 1px rgba(134, 143, 160, 0.16), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)',
};
