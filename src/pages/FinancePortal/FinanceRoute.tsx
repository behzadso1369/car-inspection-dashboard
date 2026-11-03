import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import FinanceLayout from './FinanceLayout';
import FinanceLogin from './FinanceLogin';
import FinancePayments from './FinancePayments';

const FinanceRoute: React.FunctionComponent = () => (
  <Routes>
    <Route path="login" element={<FinanceLogin />} />
    <Route element={<FinanceLayout />}>
      <Route index element={<Navigate to="payments" replace />} />
      <Route path="payments" element={<FinancePayments />} />
    </Route>
  </Routes>
);

export default FinanceRoute;
