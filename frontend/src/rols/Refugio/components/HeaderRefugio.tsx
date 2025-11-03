import React, { useState } from 'react';
import Logo from '../../Public/components/Header/shared/Logo';
import '../../Public/components/Header/Logo.css';
import '../../Public/components/Header/NavMenu.css';
import '../../Public/components/Header/UserProfile.css';
import '../../Public/components/Header/HamburgerMenu.css';
import '../../Public/components/Header/AuthButtons.css';
import '../../Public/components/Header/HeaderLayout.css';

  
interface HeaderRefugioProps {
  onNavigateHome?: () => void;
  refugioNombre?: string;
  onLogout?: () => void;
}

const HeaderRefugio: React.FC<HeaderRefugioProps> = ({ 
  onNavigateHome, 
  refugioNombre = "Mi Refugio",
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
    <header className="header header-layout">
      <nav className="navbar">
        <div className="nav-container">
          {/* Logo */}
          <Logo onClick={onNavigateHome} />
          {/* Navegación central - Usuario REFUGIO */}
          <nav className="center-nav">
            <ul className="nav-menu">
              <li className="nav-item">
                <a href="/refugio/dashboard" className="nav-link">
                  <span className="nav-icon">📊</span>
                  <span className="nav-text">Dashboard</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="/refugio/mis-animales" className="nav-link">
                  <span className="nav-icon">🐕</span>
                  <span className="nav-text">Mis Animales</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="/refugio/postulaciones" className="nav-link">
                  <span className="nav-icon">📋</span>
                  <span className="nav-text">Postulaciones</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="/refugio/mis-eventos" className="nav-link">
                  <span className="nav-icon">🎪</span>
                  <span className="nav-text">Mis Eventos</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="/refugio/donaciones" className="nav-link">
                  <span className="nav-icon">💰</span>
                  <span className="nav-text">Donaciones</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="/refugio/historial-medico" className="nav-link">
                  <span className="nav-icon">🏥</span>
                  <span className="nav-text">Historial Médico</span>
                </a>
              </li>
            </ul>
          </nav>
          {/* Perfil de refugio y menú */}
          <div className="hamburger-container">
            <div className="auth-buttons desktop-auth">
              <div className="user-profile">
                <span className="user-icon">🏠</span>
                <span className="user-name">{refugioNombre}</span>
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
          <div className="side-menu-header">
            <div className="side-menu-logo">
              <img src="/Images/reco-logo.png" alt="ReCo" className="side-logo" />
              <div className="user-info">
                <span className="side-logo-text">🏠 {refugioNombre}</span>
                <span className="user-role">Refugio</span>
              </div>
            </div>
            <button className="close-btn" onClick={closeMenu}>
              <span className="close-icon">×</span>
            </button>
          </div>
          <ul className="side-menu-items">
            <li className="side-menu-item">
              <a href="/refugio/dashboard" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">📊</span>
                Dashboard
              </a>
            </li>
            <li className="side-menu-item">
              <a href="/refugio/mis-animales" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">🐕</span>
                Mis Animales
              </a>
            </li>
            <li className="side-menu-item">
              <a href="/refugio/postulaciones" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">📋</span>
                Postulaciones
              </a>
            </li>
            <li className="side-menu-item">
              <a href="/refugio/mis-eventos" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">🎪</span>
                Mis Eventos
              </a>
            </li>
            <li className="side-menu-item">
              <a href="/refugio/donaciones" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">💰</span>
                Donaciones
              </a>
            </li>
            <li className="side-menu-item">
              <a href="/refugio/historial-medico" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">🏥</span>
                Historial Médico
              </a>
            </li>
            <li className="side-menu-item">
              <a href="#voluntarios" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">🤝</span>
                  Mis Voluntarios
              </a>
            </li>
              <li className="side-menu-item">
                <a href="/refugio/inscritos-evento" className="side-menu-link" onClick={closeMenu}>
                  <span className="side-menu-icon">📋</span>
                  Inscritos Evento
                </a>
              </li>
            <li className="side-menu-item">
              <a href="/refugio/necesidades" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">📝</span>
                Necesidades
              </a>
            </li>
            
            {/* Separador */}
            <hr className="side-menu-separator" />
            
            {/* Configuración y salir */}
            <li className="side-menu-item">
              <a href="#mi-perfil" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">⚙️</span>
                Mi Perfil
              </a>
            </li>
            <li className="side-menu-item">
              <button
                onClick={() => {
                  closeMenu();
                  setTimeout(() => { onLogout?.(); }, 100);
                }}
                className="side-menu-link logout-btn"
              >
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

export default HeaderRefugio;