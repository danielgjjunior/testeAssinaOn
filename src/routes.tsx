import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import NotFoundPage from './pages/NotFound/NotFound';

const AppRoutes: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
  );
};

export default AppRoutes;
