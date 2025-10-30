// Enrutador principal para las páginas
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './rols/Public/components/Header/Header';
import HeaderUsuario from './rols/Usuario/components/HeaderUsuario';
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


//refugio

import HeaderRefugio from './rols/Refugio/components/HeaderRefugio.tsx';
import RefugioDashboard from './rols/Refugio/pages/RefugioDashboard/RefugioDashboard.tsx';



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
  const isUsuario = user && user.tipo_usuario === 'default';
  const isRefugio = user && user.tipo_usuario === 'refugio';

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
  <BrowserRouter>
    {/* AQUÍ VA LA LÓGICA DE SELECCIÓN DEL HEADER */}
    {isAdmin ? (
      // Si es Admin, muestra HeaderAdmin
      <HeaderAdmin adminName={user?.username} onLogout={handleLogout} />
    ) : isRefugio ? (
      // Si no es Admin PERO es Refugio, muestra HeaderRefugio
      <HeaderRefugio refugioNombre={user?.refugio_nombre || user?.username} onLogout={handleLogout} />
    ) : isUsuario ? (
      // Si no es Admin ni Refugio PERO es Usuario normal, muestra HeaderUsuario
      <HeaderUsuario userName={user?.username} onLogout={handleLogout} />
    ) : (
      // Si no es ninguno de los anteriores (es público), muestra Header (el público)
      <Header />
    )}
    {/* FIN DE LA LÓGICA DE SELECCIÓN DEL HEADER */}

    <main style={{ flex: 1, paddingTop: '80px' }}> {/* Padding para que el contenido no quede debajo del header fijo */}
      <Routes>
        {/* --- Rutas Públicas y Usuario --- */}
        <Route path="/" element={<Home />} />
        <Route path="/refugios" element={<RefugiosList />} />
        <Route path="/refugio/:id" element={<RefugioPerfil />} />
        <Route path="/animales" element={<Animales />} />
        <Route path="/animales/:id" element={<AnimalPerfil />} />
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

        {/* --- Rutas Admin --- */}
        <Route
          path="/admin/*"
          element={
            isAdmin ? (
              <Routes> {/* Rutas anidadas para admin */}
                <Route path="" element={<AdminDashboard />} />
                <Route path="gestionar-refugios" element={<GestionarRefugios />} />
                <Route path="gestionar-usuarios" element={<GestionarUsuarios />} />
                <Route path="verificaciones" element={<Verificaciones />} />
              </Routes>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* --- Rutas Refugio --- */}
        <Route
          path="/refugio/dashboard" // Define la URL para el dashboard del refugio
          element={
            isRefugio ? ( // Verifica si el usuario es de tipo refugio
              <RefugioDashboard /> // Si es, muestra el dashboard
            ) : (
              <Navigate to="/" replace /> // Si no, redirige a la página principal
            )
          }
        />
        {/* Puedes añadir más rutas específicas de refugio aquí en el futuro */}

      </Routes>
    </main>

    <Footer />
  </BrowserRouter>
);
}
