import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import FunnelName from './pages/FunnelName.jsx';
import FunnelRegion from './pages/FunnelRegion.jsx';
import FunnelJob from './pages/FunnelJob.jsx';
import FunnelIncome from './pages/FunnelIncome.jsx';
import Result from './pages/Result.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/funnel/name" element={<FunnelName />} />
      <Route path="/funnel/region" element={<FunnelRegion />} />
      <Route path="/funnel/job" element={<FunnelJob />} />
      <Route path="/funnel/income" element={<FunnelIncome />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  );
}
