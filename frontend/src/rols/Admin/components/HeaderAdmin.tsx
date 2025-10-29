import React, { useState } from 'react';
import Logo from '../../Public/components/Header/shared/Logo';
import "./HeaderAdmin.css";

interface HeaderAdminProps {
  onNavigateHome?: () => void;
  adminName?: string;
  onLogout?: () => void;
}

const HeaderAdmin: React.FC<HeaderAdminProps> = ({ 
  onNavigateHome, 
  adminName = "Admin",
  onLogout 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
  <header className="header-admin">
      <nav className="navbar">
        <div className="nav-container">
          {/* Logo */}
          <Logo onClick={onNavigateHome} />
          
          {/* Navegación central - ADMINISTRADOR */}
          <nav className="center-nav">
            <ul className="nav-menu">
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
            </ul>
          </nav>
          
          {/* Perfil de admin y menú */}
          <div className="hamburger-container">
            <div className="auth-buttons desktop-auth">
              <div className="user-profile admin-profile">
                <span className="user-icon">⚡</span>
                <span className="user-name">{adminName}</span>
                <span className="admin-badge">Admin</span>
              </div>
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
              <button onClick={() => { onLogout?.(); closeMenu(); }} className="side-menu-link logout-btn">
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