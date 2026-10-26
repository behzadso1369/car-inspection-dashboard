import { Navigate, Route, Routes } from 'react-router-dom';
import ShortLinkRoute from '../ShortLink/ShortLinkRoute';
import SellerSalesSmsSettings from '../SellerSalesSms/SellerSalesSmsSettings';

const UtmRoute: React.FunctionComponent = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="short-link/list" replace />} />
      <Route path="short-link/*" element={<ShortLinkRoute />} />
      <Route path="seller-sales-sms" element={<SellerSalesSmsSettings />} />
    </Routes>
  );
};

export default UtmRoute;
