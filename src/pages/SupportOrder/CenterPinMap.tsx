import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapAddressParts {
  city: string;
  street: string;
  plaque: string;
}

interface CenterPinMapProps {
  latitude: number;
  longitude: number;
  onChange: (latitude: number, longitude: number) => void;
  onAddress?: (address: MapAddressParts) => void;
}

function formatAddress(data: any) {
  const address = data?.address;
  if (!address) return data?.display_name || '';
  const parts = [
    address.road || address.pedestrian || address.footway,
    address.neighbourhood,
    address.quarter,
    address.suburb,
    address.city || address.town || address.village,
    address.state,
  ].filter((part, index, list) => part && list.indexOf(part) === index);
  return parts.join('، ') || data.display_name || '';
}

function addressParts(data: any, text: string): MapAddressParts {
  const address = data?.address ?? {};
  return {
    city: String(address.city || address.town || address.village || address.state || ''),
    street: String(address.road || address.pedestrian || address.neighbourhood || text || ''),
    plaque: String(address.house_number || ''),
  };
}

export function CenterPinMap({ latitude, longitude, onChange, onAddress }: CenterPinMapProps) {
  const holder = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  const onAddressRef = useRef(onAddress);
  const startRef = useRef({ latitude, longitude });
  const lookupRef = useRef(0);
  const timerRef = useRef<number>();
  const [addressText, setAddressText] = useState('در حال دریافت آدرس...');
  onChangeRef.current = onChange;
  onAddressRef.current = onAddress;

  useEffect(() => {
    const node = holder.current;
    if (!node) return;
    const start = startRef.current;

    const map = L.map(node, {
      center: [start.latitude, start.longitude],
      zoom: 14,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    const publish = () => {
      const center = map.getCenter();
      onChangeRef.current(center.lat, center.lng);
      const lookupId = ++lookupRef.current;
      setAddressText('در حال دریافت آدرس...');
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(async () => {
        if (lookupId !== lookupRef.current) return;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${center.lat}&lon=${center.lng}&accept-language=fa`,
            { headers: { Accept: 'application/json' } }
          );
          const data = await response.json();
          if (lookupId !== lookupRef.current) return;
          const text = formatAddress(data) || 'آدرسی برای این نقطه پیدا نشد';
          setAddressText(text);
          onAddressRef.current?.(addressParts(data, text));
        } catch {
          if (lookupId !== lookupRef.current) return;
          setAddressText('آدرس این نقطه دریافت نشد');
        }
      }, 500);
    };

    map.on('movestart', () => setAddressText('در حال دریافت آدرس...'));
    map.on('moveend', publish);
    map.whenReady(() => {
      map.invalidateSize();
      publish();
    });

    return () => {
      window.clearTimeout(timerRef.current);
      map.remove();
    };
  }, []);

  return (
    <div className="md:col-span-2">
      <div className="mb-2 rounded-xl border border-card-border bg-brand-soft px-3 py-2">
        <span className="block text-xs text-black-opacity-50">آدرس انتخاب‌شده</span>
        <p className="text-sm text-primary mt-0.5 leading-relaxed">{addressText}</p>
      </div>
      <div className="relative h-72 overflow-hidden rounded-xl border border-card-border">
        <div ref={holder} dir="ltr" className="h-full w-full" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[1000] -translate-x-1/2 -translate-y-full">
          <svg width="32" height="42" viewBox="0 0 32 42" aria-hidden="true">
            <path
              d="M16 41s12-13.2 12-22A12 12 0 1 0 4 19c0 8.8 12 22 12 22z"
              fill="#0237fe"
              stroke="#fff"
              strokeWidth="2"
            />
            <circle cx="16" cy="18" r="4.5" fill="#fff" />
          </svg>
        </div>
      </div>
      <p className="mt-1 text-xs text-black-opacity-60">
        نشانگر وسط نقشه ثابت است. نقشه را جابه‌جا کنید تا نوک نشانگر روی آدرس مشتری باشد.
      </p>
    </div>
  );
}
