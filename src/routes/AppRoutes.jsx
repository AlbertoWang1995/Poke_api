import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Detail from '../pages/Detail';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pokemon/:id" element={<Detail />} />
      <Route path="*" element={<div>404 - Página no encontrada</div>} />
    </Routes>
  );
}



