// Enrutador principal para las páginas
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './rols/Public/components/Header/Header';
import Footer from './rols/Public/components/Footer/Footer';
import Home from './rols/Public/pages/Home/Home.tsx';
import RefugiosList from './rols/Public/pages/Refugios/Refugios.tsx';
import Animales from './rols/Public/pages/Animales/Animales.tsx';
import AnimalPerfil from './rols/Public/pages/Animales/AnimalPerfil.tsx';
import AnimalPerfilRefugio from './rols/Refugio/AnimalPerfil.tsx';
import HogaresTemporales from './rols/Public/pages/HogaresTemporales/HogaresTemporales.tsx';
import DonacionesPage from './rols/Public/pages/Donaciones/Donaciones.tsx';
import EventosPage from './rols/Public/pages/Eventos/Eventos.tsx';
import VoluntariadoPage from './rols/Public/pages/Voluntariado/Voluntariado.tsx';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
  <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/refugios" element={<RefugiosList />} />
            <Route path="/animales" element={<Animales />} />
              <Route path="/animales/:id" element={<AnimalPerfil />} />
              {/* Ruta para perfil editable solo para refugio, condicionar con lógica de autenticación en el futuro */}
              <Route path="/refugio/animal/:id" element={<AnimalPerfilRefugio />} />
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
