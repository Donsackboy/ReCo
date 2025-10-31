import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../Public/components/Header/shared/Logo';
import "./Header/HamburgerMenu.css";
import "./Header/HeaderLayout.css";
import "./Header/NavMenu.css";
import "./Header/UserProfile.css";
import "./Header/Logo.css";

interface HeaderAdminProps {
  onNavigateHome?: () => void;
  adminName?: string;
  onLogout?: () => void;
}


const HeaderAdmin: React.FC<HeaderAdminProps> = ({ 
  adminName = "Admin",
  onLogout 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/admin');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isAdminMode = window.location.pathname.startsWith('/admin');
  return (
    <header className="header">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <Logo onClick={handleLogoClick} />
          </div>
          <nav className="center-nav">
            <ul className="nav-menu">
              {isAdminMode ? (
                <>
                  <li className="nav-item">
                    <a href="#admin-dashboard" className="nav-link">
                      <span className="nav-icon">📈</span>
                      <span className="nav-text">Dashboard</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="#gestionar-refugios" className="nav-link">
                      <span className="nav-icon">🏛️</span>
                      <span className="nav-text">Refugios</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="#usuarios" className="nav-link">
                      <span className="nav-icon">👥</span>
                      <span className="nav-text">Usuarios</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="#verificar-comprobantes" className="nav-link">
                      <span className="nav-icon">✅</span>
                      <span className="nav-text">Verificaciones</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="#reportes" className="nav-link">
                      <span className="nav-icon">📊</span>
                      <span className="nav-text">Reportes</span>
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <a href="/refugios" className="nav-link">
                      <span className="nav-text">Refugios</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="/animales" className="nav-link">
                      <span className="nav-text">Animales</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="/hogares-temporales" className="nav-link">
                      <span className="nav-text">Hogares Temporales</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="/donaciones" className="nav-link">
                      <span className="nav-text">Donaciones</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="/eventos" className="nav-link">
                      <span className="nav-text">Eventos</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="/voluntariado" className="nav-link">
                      <span className="nav-text">Voluntariado</span>
                    </a>
                  </li>
                </>
              )}
            </ul>
          </nav>
          <div className="hamburger-container">
            <div className="auth-buttons desktop-auth">
              <button
                className={`user-profile admin-profile admin-switch${location.pathname.startsWith('/admin') ? ' admin-on' : ' admin-off'}`}
                onClick={() => {
                  if (location.pathname.startsWith('/admin')) {
                    navigate('/');
                  } else {
                    navigate('/admin');
                  }
                }}
                aria-label={location.pathname.startsWith('/admin') ? 'Cambiar a modo público' : 'Cambiar a modo admin'}
              >
                <span className="user-icon">
                  {location.pathname.startsWith('/admin') ? '⚡' : '⚡'}
                </span>
                <span className="user-name">{adminName}</span>
                <span className="admin-badge">Admin</span>
                <span className="switch-indicator"></span>
              </button>
              <button onClick={onLogout} className="btn-logout">
                <span className="auth-icon">🚪</span>
                <span className="auth-text">Cerrar Sesión</span>
              </button>
            </div>
            <button className="hamburger-btn" onClick={toggleMenu}>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>

        {/* Overlay para cerrar menú */}
        {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}

        {/* Menú lateral */}
        <div className={`side-menu ${isMenuOpen ? 'side-menu-open' : ''}`}>
          <div className="side-menu-header admin-header">
            <div className="side-menu-logo">
              <img src="/Images/reco-logo.png" alt="ReCo" className="side-logo" />
              <div className="user-info">
                <span className="side-logo-text">⚡ {adminName}</span>
                <span className="user-role admin-role">Administrador</span>
              </div>
            </div>
            <button className="close-btn" onClick={closeMenu}>
              <span className="close-icon">×</span>
            </button>
          </div>
          <ul className="side-menu-items">
            {/* Gestión principal */}
            <li className="side-menu-category">
              <span className="category-title">📈 PANEL ADMINISTRATIVO</span>
            </li>
            <li className="side-menu-item">
              <a href="#admin-dashboard" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">📈</span>
                Dashboard General
              </a>
            </li>
            <li className="side-menu-item">
              <a href="#estadisticas" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">📊</span>
                Estadísticas
              </a>
            </li>
            
            {/* Gestión de entidades */}
            <li className="side-menu-category">
              <span className="category-title">🏛️ GESTIÓN</span>
            </li>
            <li className="side-menu-item">
              <a href="#gestionar-refugios" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">🏛️</span>
                Gestionar Refugios
              </a>
            </li>
            <li className="side-menu-item">
              <a href="#usuarios" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">👥</span>
                Gestionar Usuarios
              </a>
            </li>
            <li className="side-menu-item">
              <a href="#catalogo-servicios" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">🏥</span>
                Catálogo Servicios
              </a>
            </li>
            
            {/* Verificaciones */}
            <li className="side-menu-category">
              <span className="category-title">✅ VERIFICACIONES</span>
            </li>
            <li className="side-menu-item">
              <a href="#verificar-comprobantes" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">✅</span>
                Verificar Comprobantes
              </a>
            </li>
            <li className="side-menu-item">
              <a href="#aprobar-refugios" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">🏠</span>
                Aprobar Refugios
              </a>
            </li>
            
            {/* Reportes */}
            <li className="side-menu-category">
              <span className="category-title">📊 REPORTES</span>
            </li>
            <li className="side-menu-item">
              <a href="#reportes" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">📊</span>
                Reportes Generales
              </a>
            </li>
            <li className="side-menu-item">
              <a href="#finanzas" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">💰</span>
                Reportes Financieros
              </a>
            </li>
            
            {/* Separador */}
            <hr className="side-menu-separator" />
            
            {/* Configuración y salir */}
            <li className="side-menu-item">
              <a href="#configuracion-sistema" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">⚙️</span>
                Configuración Sistema
              </a>
            </li>
            <li className="side-menu-item">
              <a href="#mi-perfil" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">👤</span>
                Mi Perfil
              </a>
            </li>
            <li className="side-menu-item">
              <button onClick={() => { onLogout?.(); closeMenu(); }} className="btn-logout">
                <span className="side-menu-icon">🚪</span>
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default HeaderAdmin;