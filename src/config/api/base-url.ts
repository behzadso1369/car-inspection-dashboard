/** Origin for Carmacheck API and uploaded assets (no trailing slash). */
export const API_ORIGIN = 'https://api-test.carmacheck.com';

export const ADMIN_API_BASE = `${API_ORIGIN}/api/admin/`;

export const API_BASE = `${API_ORIGIN}/api/`;

export const publicAssetUrl = (path?: string | null): string | null => {
  if (!path) return null;
  const clean = path.replace(/\\/g, '/').replace(/^\/+/, '');
  if (/^https?:\/\//i.test(clean)) return clean;
  return `${API_ORIGIN}/${clean}`;
};
