// Enrutador principal para las páginas
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './rols/Public/components/Header/Header';
import HeaderAdmin from './rols/Admin/components/HeaderAdmin';
import Footer from './rols/Public/components/Footer/Footer';

// Admin
import AdminDashboard from './rols/Admin/pages/AdminDashboard';
import GestionarUsuarios from './rols/Admin/pages/Usuarios/GestionarUsuarios.tsx';
import GestionarRefugios from './rols/Admin/pages/Refugios/GestionarRefugios.tsx';
import Verificaciones from './rols/Admin/pages/Verificaciones/Verificaciones.tsx';

import { Navigate } from 'react-router-dom';
import Home from './rols/Public/pages/Home/Home.tsx';
import RefugiosList from './rols/Public/pages/Refugios/Refugios.tsx';
import Animales from './rols/Public/pages/Animales/Animales.tsx';
import AnimalPerfil from './rols/Public/pages/Animales/AnimalPerfil.tsx';
import AnimalPerfilRefugio from './rols/Refugio/AnimalPerfil.tsx';
import HogaresTemporales from './rols/Public/pages/HogaresTemporales/HogaresTemporales.tsx';
import RegistroHogarTemporal from './rols/Public/pages/HogaresTemporales/RegistroHogarTemporal.tsx';
import DonacionesPage from './rols/Public/pages/Donaciones/Donaciones.tsx';
import EventosPage from './rols/Public/pages/Eventos/Eventos.tsx';
import VoluntariadoPage from './rols/Public/pages/Voluntariado/Voluntariado.tsx';
import AdopcionForm from './rols/Public/pages/Animales/AdopcionForm.tsx';
import DonarVacuna from './rols/Public/pages/Animales/DonarVacuna.tsx';
import DonarMonetaria from './rols/Public/pages/Donaciones/DonarMonetaria.tsx';
import DonarInsumo from './rols/Public/pages/Donaciones/DonarInsumo.tsx';
import DonarServicio from './rols/Public/pages/Donaciones/DonarServicio.tsx';
import RefugioPerfil from './rols/Public/pages/Refugios/RefugioPerfil.tsx';

export default function AppRouter() {
  // Logout handler para admin
  const handleAdminLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };
  // Intent: elegir el header según el tipo de usuario guardado en localStorage
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  })();

  const isAdmin = user && user.tipo_usuario === 'admin';

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route
          path="/*"
          element={
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
                  <Route path="/refugio/:id" element={<RefugioPerfil />} />
                  <Route path="/hogares-temporales" element={<HogaresTemporales />} />
                  <Route path="/hogares-temporales/registro" element={<RegistroHogarTemporal />} />
                  <Route path="/donaciones" element={<DonacionesPage />} />
                  <Route path="/eventos" element={<EventosPage />} />
                  <Route path="/voluntariado" element={<VoluntariadoPage />} />
                  <Route path="/adopcion" element={<AdopcionForm />} />
                  <Route path="/donar-vacuna" element={<DonarVacuna />} />
                  <Route path="/donar-monetaria" element={<DonarMonetaria />} />
                  <Route path="/donar-insumo" element={<DonarInsumo />} />
                  <Route path="/donar-servicio" element={<DonarServicio />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
        {/* Ruta admin protegida con header admin */}
        <Route
          path="/admin/*"
          element={
            isAdmin ? (
              <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <HeaderAdmin adminName={user?.username} onLogout={handleAdminLogout} />
                <main className="admin-main" style={{ flex: 1 }}>
                  <Routes>
                    <Route path="" element={<AdminDashboard />} />
                    <Route path="gestionar-refugios" element={<GestionarRefugios />} />
                    <Route path="gestionar-usuarios" element={<GestionarUsuarios />} />
                    <Route path="verificaciones" element={<Verificaciones />} />
                    {/* <Route path="" */}
                  </Routes>
                </main>
                <Footer />
              </div>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
