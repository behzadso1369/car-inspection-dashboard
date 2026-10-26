export const VEHICLE_KIND_CAR = 1;
export const VEHICLE_KIND_MOTORCYCLE = 2;

type NamedValue = {
  name?: string | null;
  title?: string | null;
  motorcycleBrand?: { name?: string | null } | null;
  carBrand?: { name?: string | null } | null;
};

export function vehicleKindLabel(kind?: number | null, title?: string | null) {
  if (title) return title;
  if (kind === VEHICLE_KIND_MOTORCYCLE) return 'موتورسیکلت';
  if (kind === VEHICLE_KIND_CAR) return 'خودرو';
  return 'خودرو';
}

export function isMotorcycleOrder(source?: {
  vehicleKind?: number | null;
  vehicleKindTitle?: string | null;
  motorcycleGroup?: unknown;
  motorcycleInspectionType?: unknown;
} | null) {
  if (!source) return false;
  if (source.vehicleKind === VEHICLE_KIND_MOTORCYCLE) return true;
  if (source.vehicleKind === VEHICLE_KIND_CAR) return false;
  if (source.vehicleKindTitle?.includes('موتور')) return true;
  return source.motorcycleGroup != null || source.motorcycleInspectionType != null;
}

export function namedTitle(value?: NamedValue | string | null) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  const brand = value.motorcycleBrand?.name || value.carBrand?.name;
  const name = value.name || value.title;
  return [brand, name].filter(Boolean).join(' ');
}

export function orderModelName(row?: {
  vehicleKind?: number | null;
  vehicleKindTitle?: string | null;
  motorcycleGroup?: NamedValue | string | null;
  motorcycleInspection?: { motorcycleGroup?: NamedValue | null } | null;
  carGroup?: NamedValue | null;
  carName?: string | null;
} | null) {
  if (!row) return '';
  if (isMotorcycleOrder(row)) {
    return (
      namedTitle(row.motorcycleGroup) ||
      namedTitle(row.motorcycleInspection?.motorcycleGroup) ||
      row.carName ||
      namedTitle(row.carGroup) ||
      ''
    );
  }
  return namedTitle(row.carGroup) || row.carName || '';
}

export function orderInspectionName(row?: {
  vehicleKind?: number | null;
  vehicleKindTitle?: string | null;
  motorcycleInspectionType?: NamedValue | string | null;
  motorcycleInspection?: { motorcycleInspectionType?: NamedValue | null } | null;
  carInspectionType?: NamedValue | null;
  inspectionType?: string | null;
} | null) {
  if (!row) return '';
  if (isMotorcycleOrder(row)) {
    return (
      namedTitle(row.motorcycleInspectionType) ||
      namedTitle(row.motorcycleInspection?.motorcycleInspectionType) ||
      row.inspectionType ||
      namedTitle(row.carInspectionType) ||
      ''
    );
  }
  return namedTitle(row.carInspectionType) || row.inspectionType || '';
}

export function orderImagePath(row?: {
  vehicleKind?: number | null;
  vehicleKindTitle?: string | null;
  imagePath?: string | null;
  motorcycleGroup?: { imagePath?: string | null; motorcycleBrand?: { imagePath?: string | null } | null } | null;
  carGroup?: { imagePath?: string | null; carBrand?: { imagePath?: string | null } | null } | null;
} | null) {
  if (!row) return null;
  if (isMotorcycleOrder(row)) {
    return (
      row.motorcycleGroup?.imagePath ||
      row.motorcycleGroup?.motorcycleBrand?.imagePath ||
      row.imagePath ||
      null
    );
  }
  return row.carGroup?.imagePath || row.carGroup?.carBrand?.imagePath || row.imagePath || null;
}
