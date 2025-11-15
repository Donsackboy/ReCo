import UsuarioPerfil from './rols/Usuario/pages/ConfirguracionPerfil/UsuarioPerfil';
import Voluntarios from './rols/Refugio/pages/Voluntarios';
import InscritosEvento from './rols/Refugio/pages/InscritosEvento';
import Necesidades from './rols/Refugio/pages/Necesidades/NecesidadesRefugio';
// Enrutador principal para las páginas
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HeaderPublic from './rols/Public/components/Header/HeaderPublic';
import HeaderUsuario from './rols/Usuario/components/Header/HeaderUsuario';
import HeaderAdmin from './rols/Admin/components/Header/HeaderAdmin';
import Footer from './rols/Public/components/Footer/Footer';

// Admin
import AdminDashboard from './rols/Admin/pages/AdminDashboard';
import GestionarUsuarios from './rols/Admin/pages/Usuarios/GestionarUsuarios.tsx';
import GestionarRefugios from './rols/Admin/pages/Refugios/GestionarRefugios.tsx';
import Verificaciones from './rols/Admin/pages/Verificaciones/Verificaciones.tsx';
import HistorialSolicitudes from './rols/Admin/pages/Verificaciones/HistorialSolicitudes.tsx';
import GestionarAnimalesAdmin from './rols/Admin/pages/Animales/GestionarAnimalesAdmin';

import { Navigate } from 'react-router-dom';
import Home from './rols/Public/pages/Home/Home.tsx';
import PostulacionRefugio from './rols/Public/pages/PostulacionRefugio';
import RefugiosList from './rols/Public/pages/Refugios/Refugios.tsx';
import Animales from './rols/Public/pages/Animales/Animales.tsx';
import AnimalPerfil from './rols/Public/pages/Animales/AnimalPerfil.tsx';
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

import MisAdopciones from './rols/Usuario/pages/MisAdopciones.tsx';

import MisSolicitudesAdopcion from './rols/Usuario/pages/MisSolicitudesAdopción/MisSolicitudesAdopcion.tsx';

//refugio
import HeaderRefugio from './rols/Refugio/components/Header/HeaderRefugio.tsx';
import Dashboard from './rols/Refugio/pages/Dashboard/index';
import MisAnimales from './rols/Refugio/pages/MisAnimales';
import GestionAdopciones from './rols/Refugio/pages/Adopciones/GestionAdopciones.tsx';
import MisEventos from './rols/Refugio/pages/MisEventos';
import Donaciones from './rols/Refugio/pages/Donaciones';
import HistorialMedicoRefugio from './rols/Refugio/pages/HistorialMedico/HistorialMedicoRefugio';
import ConfiguracionRefugio from './rols/Refugio/pages/Configuracion';



function AppRouterContent() {
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
    <>
      {/* AQUÍ VA LA LÓGICA DE SELECCIÓN DEL HEADER */}
      {isAdmin ? (
        <HeaderAdmin adminName={user?.username} onLogout={handleLogout} />
      ) : isRefugio ? (
        <HeaderRefugio refugioNombre={user?.refugio_nombre || user?.username} onLogout={handleLogout} />
      ) : isUsuario ? (
        <HeaderUsuario userName={user?.username} onLogout={handleLogout} />
      ) : (
        <HeaderPublic />
      )}
      {/* FIN DE LA LÓGICA DE SELECCIÓN DEL HEADER */}

      <main style={{ flex: 1, paddingTop: '80px' }}>
        <Routes>
          {/* --- Rutas Públicas y Usuario --- */}
          <Route path="/" element={<Home />} />
          <Route path="/refugios" element={<RefugiosList />} />
          <Route path="/postulacion-refugio" element={<PostulacionRefugio />} />
          <Route path="/refugio/:id" element={<RefugioPerfil />} />
          <Route path="/animales" element={<Animales />} />
          <Route path="/mis-animales" element={<MisAnimales />} />
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

          {/* Ruta para ver y editar perfil de usuario */}
          <Route path="/mi-perfil" element={<UsuarioPerfil />} />

          {/* Ruta para Mis Adopciones */}
          <Route path="/mis-adopciones" element={<MisAdopciones />} />
          <Route path="/mis-solicitudes-adopcion" element={<MisSolicitudesAdopcion />} />

          {/* --- Rutas Admin --- */}
          <Route
            path="/admin/*"
            element={
              isAdmin ? (
                <Routes>
                  <Route path="" element={<AdminDashboard />} />
                  <Route path="gestionar-refugios" element={<GestionarRefugios />} />
                  <Route path="gestionar-usuarios" element={<GestionarUsuarios />} />
                  <Route path="verificaciones" element={<Verificaciones />} />
                  <Route path="verificaciones/historial" element={<HistorialSolicitudes />} />
                  <Route path="verificaciones/historial" element={<HistorialSolicitudes />} />
                  <Route path="animales" element={<GestionarAnimalesAdmin />} />
                </Routes>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* --- Rutas Refugio --- */}
          <Route path="/refugio/dashboard" element={isRefugio ? (<Dashboard />) : (<Navigate to="/" replace />)} />
          <Route path="/refugio/mis-animales" element={isRefugio ? (<MisAnimales />) : (<Navigate to="/" replace />)} />
          <Route path="/refugio/adopciones" element={isRefugio ? (<GestionAdopciones />) : (<Navigate to="/" replace />)} />
          <Route path="/refugio/mis-eventos" element={isRefugio ? (<MisEventos />) : (<Navigate to="/" replace />)} />
          <Route path="/refugio/donaciones" element={isRefugio ? (<Donaciones />) : (<Navigate to="/" replace />)} />
          <Route path="/refugio/historial-medico" element={isRefugio ? (<HistorialMedicoRefugio />) : (<Navigate to="/" replace />)} />

          <Route path="/refugio/voluntarios" element={isRefugio ? (<Voluntarios />) : (<Navigate to="/" replace />)} />
          <Route path="/refugio/inscritos-evento" element={isRefugio ? (<InscritosEvento />) : (<Navigate to="/" replace />)} />
          <Route path="/refugio/necesidades" element={isRefugio ? (<Necesidades />) : (<Navigate to="/" replace />)} />
          <Route path="/refugio/configuracion" element={isRefugio ? (<ConfiguracionRefugio />) : (<Navigate to="/" replace />)} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppRouterContent />
    </BrowserRouter>
  );
}
