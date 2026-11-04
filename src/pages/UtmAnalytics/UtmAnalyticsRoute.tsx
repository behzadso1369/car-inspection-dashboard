import { Navigate, Route, Routes } from 'react-router-dom';
import UtmAnalyticsDashboard from './UtmAnalyticsDashboard';
import UtmAnalyticsChannels from './UtmAnalyticsChannels';
import UtmAnalyticsBehavior from './UtmAnalyticsBehavior';
import UtmAnalyticsVisits from './UtmAnalyticsVisits';

const UtmAnalyticsRoute: React.FunctionComponent = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<UtmAnalyticsDashboard />} />
      <Route path="channels" element={<UtmAnalyticsChannels />} />
      <Route path="behavior" element={<UtmAnalyticsBehavior />} />
      <Route path="visits" element={<UtmAnalyticsVisits />} />
    </Routes>
  );
};

export default UtmAnalyticsRoute;
