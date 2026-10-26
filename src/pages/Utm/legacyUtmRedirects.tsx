import { Navigate, useLocation } from 'react-router-dom';

/** نگه‌داشتن بوکمارک‌های قدیمی قبل از گروه‌بندی زیر UTM */
export function LegacyShortLinkRedirect() {
  const { pathname } = useLocation();
  const rest = pathname.replace(/^\/short-link\/?/, '');
  const target = rest ? `/utm/short-link/${rest}` : '/utm/short-link/list';
  return <Navigate to={target} replace />;
}

export function LegacySellerSalesSmsRedirect() {
  return <Navigate to="/utm/seller-sales-sms" replace />;
}
