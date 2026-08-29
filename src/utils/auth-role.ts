const ROLE_CLAIM =
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

export const EXPERT_HOME_PATH = '/expert/assignment';

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const toRoleList = (raw: unknown): string[] => {
  if (raw == null || raw === '') return [];
  const list = Array.isArray(raw) ? raw : [raw];
  return list.map((item) => String(item).trim().toLowerCase()).filter(Boolean);
};

export const getAccessToken = () =>
  localStorage.getItem('accessToken') || localStorage.getItem('token') || '';

export const getTokenRoles = (token?: string): string[] => {
  const jwt = token || getAccessToken();
  if (!jwt) return [];
  const payload = decodeJwtPayload(jwt);
  if (!payload) return [];
  return toRoleList(payload[ROLE_CLAIM] ?? payload.role);
};

export const persistRolesFromToken = (token: string) => {
  const roles = getTokenRoles(token);
  localStorage.setItem('role', roles[0] || '');
  localStorage.setItem('roles', JSON.stringify(roles));
  return roles;
};

export const isExpertRole = (token?: string) => getTokenRoles(token).includes('expert');

export const getDefaultPathForRole = (token?: string) =>
  isExpertRole(token) ? EXPERT_HOME_PATH : '/home';

export const isExpertAllowedPath = (pathname: string) => {
  const allowed = [EXPERT_HOME_PATH, '/profile'];
  return allowed.some((path) => pathname === path || pathname.startsWith(`${path}/`));
};

export const getRoleLabel = (token?: string) => {
  const roles = getTokenRoles(token);
  if (roles.includes('expert')) return 'کارشناس';
  if (roles.includes('superadmin') || roles.includes('superAdmin'.toLowerCase())) {
    return 'سوپرادمین';
  }
  if (roles.includes('admin')) return 'مدیر سیستم';
  return 'کاربر';
};

export const getVisibleRoutes = <T extends { path?: string; title?: string; children?: any[] }>(
  routes: T[]
): T[] => {
  if (!isExpertRole()) return routes;

  const expertGroup = routes.find((route) => route.path === 'expert');
  if (!expertGroup) return [];

  const assignment = expertGroup.children?.find(
    (child: { path?: string }) => child.path === 'expert/assignment'
  );

  return [
    {
      ...expertGroup,
      title: assignment?.title || 'تخصیص کارشناس',
      path: 'expert/assignment',
      children: undefined,
    },
  ];
};

export const clearAuthStorage = () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('language');
  localStorage.removeItem('role');
  localStorage.removeItem('roles');
  localStorage.removeItem('token');
  localStorage.removeItem('accessToken');
};
