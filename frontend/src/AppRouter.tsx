// Enrutador principal para las páginas
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Refugios from './pages/Refugios/Refugios.tsx';
import Animales from './pages/Animales/Animales.tsx';
import HogaresTemporales from './pages/HogaresTemporales/HogaresTemporales.tsx';
import DonacionesPage from './pages/Donaciones/Donaciones';
import EventosPage from './pages/Eventos/Eventos';
import VoluntariadoPage from './pages/Voluntariado/Voluntariado';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/refugios" element={<Refugios />} />
          <Route path="/animales" element={<Animales />} />
          <Route path="/hogares-temporales" element={<HogaresTemporales />} />
          <Route path="/donaciones" element={<DonacionesPage />} />
          <Route path="/eventos" element={<EventosPage />} />
          <Route path="/voluntariado" element={<VoluntariadoPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
