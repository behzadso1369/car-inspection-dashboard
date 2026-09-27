import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { ListPageShell } from '../../components/list/ListPageShell';
import { DashboardCard } from '../../components/dashboard/DashboardCard';
import Button, { PrimaryButton, SecondaryButton } from '../../libs/button/button';
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
import { CenterPinMap } from './CenterPinMap';
import {
  errorText,
  formatToman,
  isValidPhone,
  supportOrderApi,
  toScheduledDate,
  toScheduledTime,
} from './supportOrderApi';

type StepId = 'customer' | 'car' | 'method' | 'user' | 'location' | 'time' | 'summary' | 'done';

const WIZARD: { id: Exclude<StepId, 'customer'>; label: string }[] = [
  { id: 'car', label: 'خودرو' },
  { id: 'method', label: 'کارشناسی' },
  { id: 'user', label: 'کاربر' },
  { id: 'location', label: 'محل' },
  { id: 'time', label: 'زمان' },
  { id: 'summary', label: 'خلاصه' },
  { id: 'done', label: 'پرداخت' },
];

const NEXT: Record<Exclude<StepId, 'done'>, StepId> = {
  customer: 'car',
  car: 'method',
  method: 'user',
  user: 'location',
  location: 'time',
  time: 'summary',
  summary: 'done',
};

const PREV: Partial<Record<StepId, StepId>> = {
  method: 'car',
  user: 'method',
  location: 'user',
  time: 'location',
  summary: 'time',
};

function isUrgentDateType(type: { name: string } | null) {
  return !!type && type.name.includes('فوری');
}

const inputStyle = {
  boxShadow: '0px 0px 0px 1px rgba(134, 143, 160, 0.16), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)',
};

function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-[#464F60]">
      {label}
      <input
        {...props}
        className="h-10 rounded-lg bg-white px-3 text-sm text-primary outline-none"
        style={inputStyle}
      />
    </label>
  );
}

function Stepper({ step }: { step: StepId }) {
  const current = WIZARD.findIndex((item) => item.id === step);
  return (
    <ol className="flex gap-2 overflow-x-auto pb-1">
      {WIZARD.map((item, index) => {
        const active = item.id === step;
        const done = current > index;
        return (
          <li
            key={item.id}
            className={`shrink-0 rounded-full px-3 py-1 text-xs ${
              active
                ? 'bg-brand text-white'
                : done
                ? 'bg-brand-soft text-brand'
                : 'bg-white text-black-opacity-50 border border-card-border'
            }`}
          >
            {index + 1}. {item.label}
          </li>
        );
      })}
    </ol>
  );
}

function ChoiceButton({
  active,
  disabled,
  title,
  description,
  meta,
  onClick,
}: {
  active: boolean;
  disabled?: boolean;
  title: string;
  description?: string;
  meta?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`text-right rounded-2xl border p-3 transition-colors ${
        active ? 'border-brand bg-brand-soft' : 'border-card-border bg-white hover:border-brand/40'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-bold text-primary">{title}</span>
        {meta ? <span className="text-xs text-brand shrink-0">{meta}</span> : null}
      </div>
      {description ? (
        <p className="text-xs text-black-opacity-60 mt-1 leading-relaxed">{description}</p>
      ) : null}
    </button>
  );
}

const SupportOrder: React.FunctionComponent = () => {
  const [step, setStep] = useState<StepId>('customer');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [search, setSearch] = useState('');
  const [hits, setHits] = useState<CarSearchHit[]>([]);
  const [groups, setGroups] = useState<CarGroupOption[]>([]);
  const [brandName, setBrandName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<CarGroupOption | null>(null);

  const [order, setOrder] = useState<SupportOrderCreated | null>(null);
  const [quote, setQuote] = useState<SupportMoveResult | null>(null);

  const [inspections, setInspections] = useState<InspectionOption[]>([]);
  const [inspection, setInspection] = useState<InspectionOption | null>(null);
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [location, setLocation] = useState<LocationOption | null>(null);
  const [city, setCity] = useState('تهران');
  const [street, setStreet] = useState('');
  const [plaque, setPlaque] = useState('');
  const [lat, setLat] = useState('35.6892');
  const [lng, setLng] = useState('51.3890');
  const [addressId, setAddressId] = useState<number | null>(null);

  const [dateTypes, setDateTypes] = useState<DateTypeOption[]>([]);
  const [dateType, setDateType] = useState<DateTypeOption | null>(null);
  const [days, setDays] = useState<DayOption[]>([]);
  const [day, setDay] = useState<DayOption | null>(null);
  const [hour, setHour] = useState('');

  const resetWizard = () => {
    setStep('customer');
    setError('');
    setCopied(false);
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    setSearch('');
    setHits([]);
    setGroups([]);
    setBrandName('');
    setSelectedGroup(null);
    setOrder(null);
    setQuote(null);
    setInspections([]);
    setInspection(null);
    setLocations([]);
    setLocation(null);
    setCity('تهران');
    setStreet('');
    setPlaque('');
    setLat('35.6892');
    setLng('51.3890');
    setAddressId(null);
    setDateTypes([]);
    setDateType(null);
    setDays([]);
    setDay(null);
    setHour('');
  };

  useEffect(() => {
    const query = search.trim();
    if (query.length < 2 || (step !== 'customer' && step !== 'car')) {
      setHits([]);
      return;
    }
    let cancel = false;
    const timer = window.setTimeout(() => {
      setLoading(true);
      supportOrderApi
        .search(query)
        .then((rows) => {
          if (!cancel) setHits(rows);
        })
        .catch((err) => {
          if (!cancel) setError(errorText(err));
        })
        .finally(() => {
          if (!cancel) setLoading(false);
        });
    }, 350);
    return () => {
      cancel = true;
      window.clearTimeout(timer);
    };
  }, [search, step]);

  useEffect(() => {
    if (step !== 'method' || !selectedGroup) return;
    let cancel = false;
    setLoading(true);
    supportOrderApi
      .inspections(selectedGroup.id)
      .then((rows) => {
        if (!cancel) setInspections(rows);
      })
      .catch((err) => {
        if (!cancel) setError(errorText(err));
      })
      .finally(() => {
        if (!cancel) setLoading(false);
      });
    return () => {
      cancel = true;
    };
  }, [step, selectedGroup]);

  useEffect(() => {
    if (step !== 'location') return;
    let cancel = false;
    setLoading(true);
    supportOrderApi
      .locations()
      .then((rows) => {
        if (!cancel) setLocations(rows);
      })
      .catch((err) => {
        if (!cancel) setError(errorText(err));
      })
      .finally(() => {
        if (!cancel) setLoading(false);
      });
    return () => {
      cancel = true;
    };
  }, [step]);

  useEffect(() => {
    if (step !== 'time') return;
    let cancel = false;
    setLoading(true);
    Promise.all([supportOrderApi.dateTypes(), supportOrderApi.days()])
      .then(([types, calendar]) => {
        if (cancel) return;
        setDateTypes(types);
        setDays(calendar);
      })
      .catch((err) => {
        if (!cancel) setError(errorText(err));
      })
      .finally(() => {
        if (!cancel) setLoading(false);
      });
    return () => {
      cancel = true;
    };
  }, [step]);

  const pickBrand = (hit: CarSearchHit) => {
    setBrandName(hit.name);
    setGroups([]);
    setError('');
    setLoading(true);
    supportOrderApi
      .groups(hit.id)
      .then(setGroups)
      .catch((err) => setError(errorText(err)))
      .finally(() => setLoading(false));
  };

  const pickGroup = (group: CarGroupOption) => {
    setSelectedGroup(group);
    setInspection(null);
    setError('');
  };

  const createOrder = () => {
    setError('');
    if (!firstName.trim() && !lastName.trim()) {
      setError('نام یا نام خانوادگی را وارد کنید.');
      return;
    }
    if (!isValidPhone(phoneNumber)) {
      setError('شماره موبایل باید با ۰۹ و ۹ رقم، یا با ۹۸ / +۹۸ باشد.');
      return;
    }
    if (!selectedGroup || selectedGroup.id <= 0) {
      setError('گروه خودرو را انتخاب کنید.');
      return;
    }
    setSubmitting(true);
    supportOrderApi
      .create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim().replace(/\s/g, ''),
        carGroupId: selectedGroup.id,
      })
      .then((created) => {
        setOrder(created);
        setStep('car');
      })
      .catch((err) => setError(errorText(err)))
      .finally(() => setSubmitting(false));
  };

  const goBack = () => {
    const previous = PREV[step];
    if (!previous) return;
    setError('');
    setStep(previous);
  };

  const continueCar = () => {
    if (!selectedGroup) {
      setError('گروه خودرو را انتخاب کنید.');
      return;
    }
    setError('');
    setStep(NEXT.car);
  };

  const continueMethod = () => {
    if (!inspection) {
      setError('روش کارشناسی را انتخاب کنید.');
      return;
    }
    setError('');
    setStep(NEXT.method);
  };

  const continueUser = () => {
    setError('');
    setStep(NEXT.user);
  };

  const continueLocation = () => {
    if (!location) {
      setError('محل کارشناسی را انتخاب کنید.');
      return;
    }
    if (location.onSite) {
      const latitude = Number(lat);
      const longitude = Number(lng);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        setError('نقطه آدرس را روی نقشه مشخص کنید.');
        return;
      }
    }
    setError('');
    setStep(NEXT.location);
  };

  const continueTime = () => {
    if (!dateType || !day) {
      setError('نوع زمان و روز را انتخاب کنید.');
      return;
    }
    if (!isUrgentDateType(dateType) && !hour) {
      setError('ساعت را انتخاب کنید.');
      return;
    }
    setError('');
    setStep(NEXT.time);
  };

  const submitPayment = async () => {
    if (!order || !selectedGroup || !inspection || !location || !dateType || !day) {
      setError('همه انتخاب‌های ویزارد را کامل کنید.');
      return;
    }
    if (!isUrgentDateType(dateType) && !hour) {
      setError('ساعت را انتخاب کنید.');
      return;
    }
    setError('');
    setSubmitting(true);
    let nextAddressId = addressId;
    if (location.onSite) {
      try {
        const createdId = await supportOrderApi.createAddress({
          title: 'انتخابی',
          city: city.trim() || 'تهران',
          street: street.trim() || 'انتخاب از نقشه',
          plaque: plaque.trim() || '-',
          lat: Number(lat),
          lng: Number(lng),
        });
        if (!createdId) {
          setError('آدرس ذخیره شد ولی شناسه آدرس برنگشت.');
          setSubmitting(false);
          return;
        }
        nextAddressId = createdId;
        setAddressId(createdId);
      } catch (err: any) {
        const denied = err?.response?.status === 401 || err?.response?.status === 403;
        setError(
          denied
            ? 'ساخت آدرس فقط با ورود خود مشتری ممکن است و با نشست پشتیبان پذیرفته نشد. کارشناسی در مرکز به آدرس نیاز ندارد.'
            : errorText(err)
        );
        setSubmitting(false);
        return;
      }
    }

    try {
      const result = await supportOrderApi.move({
        orderId: order.orderId,
        isBack: false,
        carGroupId: selectedGroup.id,
        carInspectionId: inspection.id,
        carInspectionTypeId: inspection.typeId,
        carInspectionLocationTypeId: location.id,
        ...(location.onSite && nextAddressId ? { addressId: nextAddressId } : {}),
        carInspectionDateTypeId: dateType.id,
        scheduledDate: toScheduledDate(day.date),
        ...(!isUrgentDateType(dateType) ? { scheduledTime: toScheduledTime(hour) } : {}),
      });
      setQuote(result);
      setStep('done');
    } catch (err) {
      setError(errorText(err));
    } finally {
      setSubmitting(false);
    }
  };

  const copyLink = async () => {
    if (!quote?.paymentUrl) return;
    try {
      await navigator.clipboard.writeText(quote.paymentUrl);
      setCopied(true);
    } catch {
      setError('کپی لینک در این مرورگر انجام نشد. لینک را دستی انتخاب کنید.');
    }
  };

  return (
    <ListPageShell
      title="سفارش تلفنی پشتیبانی"
      subtitle="پشتیبان سفارش را بدون کد تأیید می‌سازد. مشتری فقط لینک درگاه را می‌گیرد و خودش پرداخت می‌کند. کیف‌پول در این مسیر خاموش است."
      headerAction={
        step !== 'customer' ? (
          <Button title="سفارش جدید" active style={SecondaryButton} onClick={resetWizard} />
        ) : undefined
      }
    >
      <div className="space-y-3">
        {step !== 'customer' ? <Stepper step={step} /> : null}
        {order ? (
          <p className="text-xs text-black-opacity-60">
            سفارش <span className="font-bold text-primary">#{order.orderId.toLocaleString('fa-IR')}</span>
            {' — '}
            {order.fullName || `${firstName} ${lastName}`} — {order.phoneNumber || phoneNumber}
          </p>
        ) : null}
        {error ? (
          <div className="rounded-xl bg-red-50 text-red-700 text-sm px-4 py-3">{error}</div>
        ) : null}

        {step === 'customer' || step === 'car' ? (
          <DashboardCard title={step === 'customer' ? 'مشتری و خودرو' : 'انتخاب خودرو'}>
            {step === 'customer' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <Field label="نام" value={firstName} onChange={(e) => { setFirstName(e.target.value); setError(''); }} />
                <Field
                  label="نام خانوادگی"
                  value={lastName}
                  onChange={(e) => { setLastName(e.target.value); setError(''); }}
                />
                <Field
                  label="موبایل"
                  inputMode="tel"
                  dir="ltr"
                  placeholder="09121234567"
                  value={phoneNumber}
                  onChange={(e) => { setPhoneNumber(e.target.value); setError(''); }}
                />
              </div>
            ) : (
              <p className="text-sm text-black-opacity-60 mb-3">
                گروه خودرو روی سفارش نشسته است. همین انتخاب نگه داشته می‌شود و همراه بقیه اطلاعات، یک‌بار قبل از پرداخت فرستاده می‌شود.
              </p>
            )}

            <Field
              label="جستجوی برند یا خودرو"
              value={search}
              placeholder="حداقل دو حرف"
              onChange={(e) => setSearch(e.target.value)}
            />
            {loading ? (
              <div className="py-4 flex justify-center">
                <CircularProgress size={22} />
              </div>
            ) : null}
            {hits.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                {hits.map((hit) => (
                  <button
                    key={`${hit.isBrand ? 'b' : 'g'}-${hit.id}`}
                    type="button"
                    onClick={() => (hit.isBrand ? pickBrand(hit) : pickGroup(hit))}
                    className="flex items-center gap-3 rounded-xl border border-card-border bg-white px-3 py-2 text-right hover:border-brand/40"
                  >
                    {hit.image ? (
                      <img src={hit.image} alt="" className="w-8 h-8 object-contain" />
                    ) : null}
                    <span className="text-sm text-primary">{hit.name}</span>
                    <span className="mr-auto text-[11px] text-black-opacity-50">
                      {hit.isBrand ? 'برند' : 'خودرو'}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
            {brandName && groups.length > 0 ? (
              <div className="mt-4">
                <p className="text-xs text-black-opacity-60 mb-2">گروه‌های {brandName}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {groups.map((group) => (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => pickGroup(group)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                        selectedGroup?.id === group.id
                          ? 'border-brand bg-brand-soft text-primary'
                          : 'border-card-border bg-white'
                      }`}
                    >
                      {group.image ? (
                        <img src={group.image} alt="" className="w-7 h-7 object-contain" />
                      ) : null}
                      {group.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            {selectedGroup ? (
              <p className="mt-3 text-sm">
                انتخاب‌شده: <span className="font-bold text-primary">{selectedGroup.name}</span>
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2 mt-4">
              {step === 'customer' ? (
                <Button
                  title={submitting ? 'در حال ساخت...' : 'ساخت سفارش'}
                  active={!submitting}
                  style={PrimaryButton}
                  onClick={createOrder}
                />
              ) : (
                <Button title="ادامه" active style={PrimaryButton} onClick={continueCar} />
              )}
            </div>
          </DashboardCard>
        ) : null}

        {step === 'method' ? (
          <DashboardCard title="روش کارشناسی">
            {loading ? (
              <div className="py-8 flex justify-center">
                <CircularProgress size={22} />
              </div>
            ) : inspections.length === 0 ? (
              <p className="text-sm text-black-opacity-60">برای این خودرو روش کارشناسی پیدا نشد.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {inspections.map((item) => (
                  <ChoiceButton
                    key={item.id}
                    active={inspection?.id === item.id}
                    title={item.name}
                    meta={formatToman(item.price)}
                    description={item.features.join('، ')}
                    onClick={() => setInspection(item)}
                  />
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button title="بازگشت" active style={SecondaryButton} onClick={goBack} />
              <Button
                title="ادامه"
                active={!!inspection}
                style={PrimaryButton}
                onClick={continueMethod}
              />
            </div>
          </DashboardCard>
        ) : null}

        {step === 'user' ? (
          <DashboardCard title="اطلاعات کاربر">
            <p className="text-sm text-black-opacity-60 mb-3">
              نام و موبایل هنگام ساخت سفارش ذخیره شده است. این قدم فقط همان هویت را تأیید می‌کند و کد ورود ارسال نمی‌شود.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-surface px-3 py-2">
                <span className="block text-xs text-black-opacity-50">نام</span>
                {order?.fullName || '—'}
              </div>
              <div className="rounded-xl bg-surface px-3 py-2">
                <span className="block text-xs text-black-opacity-50">موبایل</span>
                <span dir="ltr">{order?.phoneNumber || '—'}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Button title="بازگشت" active style={SecondaryButton} onClick={goBack} />
              <Button title="ادامه" active style={PrimaryButton} onClick={continueUser} />
            </div>
          </DashboardCard>
        ) : null}

        {step === 'location' ? (
          <DashboardCard title="محل کارشناسی">
            {loading && locations.length === 0 ? (
              <div className="py-8 flex justify-center">
                <CircularProgress size={22} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {locations.map((item) => (
                  <ChoiceButton
                    key={item.id}
                    active={location?.id === item.id}
                    title={item.name}
                    description={item.description}
                    onClick={() => setLocation(item)}
                  />
                ))}
              </div>
            )}
            {location?.onSite ? (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <p className="md:col-span-2 text-xs text-black-opacity-60 leading-relaxed">
                  نقطه را روی نقشه مشخص کنید. عنوان آدرس «انتخابی» ثبت می‌شود و وارد کردن شهر، خیابان و پلاک لازم نیست.
                </p>
                <CenterPinMap
                  latitude={Number(lat)}
                  longitude={Number(lng)}
                  onChange={(nextLat, nextLng) => {
                    setLat(nextLat.toFixed(6));
                    setLng(nextLng.toFixed(6));
                  }}
                  onAddress={(address) => {
                    setCity(address.city);
                    setStreet(address.street);
                    setPlaque(address.plaque);
                  }}
                />
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button title="بازگشت" active style={SecondaryButton} onClick={goBack} />
              <Button
                title="ادامه"
                active={!!location}
                style={PrimaryButton}
                onClick={continueLocation}
              />
            </div>
          </DashboardCard>
        ) : null}

        {step === 'time' ? (
          <DashboardCard title="زمان کارشناسی">
            {loading && dateTypes.length === 0 ? (
              <div className="py-8 flex justify-center">
                <CircularProgress size={22} />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dateTypes.map((item) => (
                    <ChoiceButton
                      key={item.id}
                      active={dateType?.id === item.id}
                      title={item.name}
                      description={item.description}
                      meta={
                        item.extraCost
                          ? `+ ${formatToman(item.extraCost)}`
                          : item.maxMinutes
                          ? `تا ${item.maxMinutes.toLocaleString('fa-IR')} دقیقه`
                          : undefined
                      }
                      onClick={() => {
                        setDateType(item);
                        if (item.name.includes('فوری')) setHour('');
                      }}
                    />
                  ))}
                </div>
                <div>
                  <p className="text-xs text-black-opacity-60 mb-2">روز</p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {days.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        disabled={item.closed}
                        onClick={() => {
                          setDay(item);
                          setHour('');
                        }}
                        className={`shrink-0 rounded-xl border px-3 py-2 text-xs ${
                          day?.id === item.id
                            ? 'border-brand bg-brand-soft'
                            : 'border-card-border bg-white'
                        } ${item.closed ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        {item.title}
                        {item.holidayTitle ? ` — ${item.holidayTitle}` : ''}
                      </button>
                    ))}
                  </div>
                </div>
                {dateType && !isUrgentDateType(dateType) && day ? (
                  <div>
                    <p className="text-xs text-black-opacity-60 mb-2">ساعت</p>
                    <div className="flex flex-wrap gap-2">
                      {day.hours.map((item) => (
                        <button
                          key={item.display}
                          type="button"
                          disabled={item.disabled}
                          onClick={() => setHour(item.display)}
                          className={`rounded-lg border px-3 py-1.5 text-sm ${
                            hour === item.display
                              ? 'border-brand bg-brand text-white'
                              : 'border-card-border bg-white'
                          } ${item.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                          {item.display}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button title="بازگشت" active style={SecondaryButton} onClick={goBack} />
              <Button
                title="ادامه"
                active={!!dateType && !!day && (isUrgentDateType(dateType) || !!hour)}
                style={PrimaryButton}
                onClick={continueTime}
              />
            </div>
          </DashboardCard>
        ) : null}

        {step === 'summary' ? (
          <DashboardCard title="خلاصه سفارش">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <SummaryRow label="مشتری" value={order?.fullName || '—'} />
              <SummaryRow label="موبایل" value={order?.phoneNumber || '—'} />
              <SummaryRow label="خودرو" value={selectedGroup?.name || '—'} />
              <SummaryRow label="کارشناسی" value={inspection?.name || '—'} />
              <SummaryRow label="محل" value={location?.name || '—'} />
              <SummaryRow
                label="زمان"
                value={
                  !dateType || !day
                    ? '—'
                    : isUrgentDateType(dateType)
                    ? `${dateType.name}، ${day.title}`
                    : hour
                    ? `${dateType.name}، ${day.title}، ${hour}`
                    : `${dateType.name}، ${day.title}`
                }
              />
              <SummaryRow label="قیمت کارشناسی" value={formatToman(inspection?.price)} />
              {dateType?.extraCost ? (
                <SummaryRow label="هزینه نوع زمان" value={formatToman(dateType.extraCost)} />
              ) : null}
            </dl>
            <p className="text-xs text-black-opacity-60 mt-3 leading-relaxed">
              با ارسال لینک، خودرو، کارشناسی، محل و زمان با هم در یک درخواست ثبت می‌شود و پیامک درگاه برای همین موبایل می‌رود. مبلغ نهایی در پاسخ همین درخواست می‌آید.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Button title="بازگشت" active={!submitting} style={SecondaryButton} onClick={goBack} />
              <Button
                title={submitting ? 'در حال ساخت لینک...' : 'ارسال لینک پرداخت'}
                active={!submitting}
                style={PrimaryButton}
                onClick={submitPayment}
              />
            </div>
          </DashboardCard>
        ) : null}

        {step === 'done' && quote ? (
          <DashboardCard title="لینک پرداخت">
            <div
              className={`rounded-xl px-4 py-3 text-sm mb-3 ${
                quote.smsSent ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'
              }`}
            >
              {quote.smsSent
                ? `پیامک لینک پرداخت برای ${order?.phoneNumber || 'مشتری'} ارسال شد.`
                : 'سفارش ساخته شد ولی پیامک نرفت. لینک را از همین صفحه برای مشتری بفرستید.'}
            </div>
            <p className="text-sm mb-2">
              مبلغ درگاه: <span className="font-bold">{formatToman(quote.gatewayAmount || quote.finalPrice)}</span>
            </p>
            {quote.paymentUrl ? (
              <div className="rounded-xl border border-card-border bg-surface p-3 break-all text-sm dir-ltr text-left">
                {quote.paymentUrl}
              </div>
            ) : (
              <p className="text-sm text-black-opacity-60">لینک درگاه در پاسخ سرور نبود.</p>
            )}
            <p className="text-xs text-black-opacity-60 mt-3 leading-relaxed">
              نهایی شدن سفارش بعد از بازگشت درگاه، سمت سرور انجام می‌شود. پیامک «سفارش ثبت شد» هم بعد از پرداخت موفق می‌رود.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {quote.paymentUrl ? (
                <Button
                  title={copied ? 'کپی شد' : 'کپی لینک'}
                  active
                  style={PrimaryButton}
                  onClick={copyLink}
                />
              ) : null}
              <Button title="سفارش جدید" active style={SecondaryButton} onClick={resetWizard} />
              <NavLink
                to="/SiteOrder/list"
                className="rounded-md px-3 py-1 text-sm bg-white text-[#464F60] shadow-secondary"
              >
                سفارش‌های سایت
              </NavLink>
            </div>
          </DashboardCard>
        ) : null}
      </div>
    </ListPageShell>
  );
};

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface px-3 py-2">
      <dt className="text-xs text-black-opacity-50">{label}</dt>
      <dd className="text-primary mt-0.5">{value}</dd>
    </div>
  );
}

export default SupportOrder;
