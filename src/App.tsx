import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminApp from './admin/AdminApp';
import FrontendApp from './frontend/FrontendApp';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<FrontendApp />} />
      </Routes>
    </BrowserRouter>
  );
}
