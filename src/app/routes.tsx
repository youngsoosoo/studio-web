import { Route, Routes } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { ProjectDetailPage } from '../pages/ProjectDetailPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/projects/:id" element={<ProjectDetailPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
