import { Navigate, Route, Routes } from 'react-router-dom';
import SellerUserInfoList from './SellerUserInfoList';
import SellerUserInfoDetail from './SellerUserInfoDetail';
import SellerUserInfoManualForm from './SellerUserInfoManualForm';

const SellerUserInfoRoute: React.FunctionComponent = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="list" replace />} />
      <Route path="list" element={<SellerUserInfoList />} />
      <Route path="manual" element={<SellerUserInfoManualForm />} />
      <Route path=":id" element={<SellerUserInfoDetail />} />
    </Routes>
  );
};

export default SellerUserInfoRoute;
