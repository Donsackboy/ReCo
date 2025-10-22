// Enrutador principal para las páginas
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import RefugiosList from './pages/Refugios/Refugios';
import Animales from './pages/Animales/Animales.tsx';
import HogaresTemporales from './pages/HogaresTemporales/HogaresTemporales.tsx';
import DonacionesPage from './pages/Donaciones/Donaciones';
import EventosPage from './pages/Eventos/Eventos';
import VoluntariadoPage from './pages/Voluntariado/Voluntariado';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main className="main-content" style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/refugios" element={<RefugiosList />} />
            <Route path="/animales" element={<Animales />} />
            <Route path="/hogares-temporales" element={<HogaresTemporales />} />
            <Route path="/donaciones" element={<DonacionesPage />} />
            <Route path="/eventos" element={<EventosPage />} />
            <Route path="/voluntariado" element={<VoluntariadoPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
