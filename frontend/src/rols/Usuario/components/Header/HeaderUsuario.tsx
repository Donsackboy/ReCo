import React, { useState } from 'react';
import Logo from '../../../Public/components/Header/shared/Logo';
import './UserProfile.css';
import './NavMenu.css';
import '../../../Public/components/Header/HeaderLayout.css';
import './HamburgerMenu.css';

interface HeaderUsuarioProps {
  onNavigateHome?: () => void;
  userName?: string;
  onLogout?: () => void;
}

const HeaderUsuario: React.FC<HeaderUsuarioProps> = ({ 
  onNavigateHome, 
  userName = "Usuario",
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
    <header className="header">
      <nav className="navbar">
        <div className="nav-container">
          {/* Logo a la izquierda */}
          <Logo onClick={onNavigateHome} className="nav-logo" />
          {/* Navegación central - Usuario NORMAL */}
          <nav className="center-nav">
            <ul className="nav-menu">
              <li className="nav-item">
                <a href="#adoptar" className="nav-link" onClick={closeMenu}>
                  <span className="nav-icon">❤️</span>
                  <span className="nav-text">Adoptar</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#hogar-temporal" className="nav-link" onClick={closeMenu}>
                  <span className="nav-icon">🏠</span>
                  <span className="nav-text">Hogar Temporal</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#mis-postulaciones" className="nav-link" onClick={closeMenu}>
                  <span className="nav-icon">📋</span>
                  <span className="nav-text">Mis Postulaciones</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="/mis-adopciones" className="nav-link" onClick={closeMenu}>
                  <span className="nav-icon">📄</span>
                  <span className="nav-text">Mis Adopciones</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#eventos" className="nav-link" onClick={closeMenu}>
                  <span className="nav-icon">🎪</span>
                  <span className="nav-text">Eventos</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#donar" className="nav-link" onClick={closeMenu}>
                  <span className="nav-icon">💝</span>
                  <span className="nav-text">Donar</span>
                </a>
              </li>
            </ul>
          </nav>
          {/* Perfil de usuario y menú */}
          <div className="hamburger-container">
            <div className="auth-buttons desktop-auth">
              <div className="user-profile">
                <span className="user-icon">👤</span>
                <span className="user-name">{userName}</span>
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
              <Logo className="side-logo" />
              <div className="user-info">
                <span className="side-logo-text">👤 {userName}</span>
                <span className="user-role">Usuario</span>
              </div>
            </div>
            <button className="close-btn" onClick={closeMenu}>
              <span className="close-icon">×</span>
            </button>
          </div>
          <ul className="side-menu-items">
            <li className="side-menu-item">
              <a href="#adoptar" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">❤️</span>
                Adoptar Mascota
              </a>
            </li>
            <li className="side-menu-item">
              <a href="#hogar-temporal" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">🏠</span>
                Ser Hogar Temporal
              </a>
            </li>
            <li className="side-menu-item">
              <a href="#mis-postulaciones" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">📋</span>
                Mis Postulaciones
              </a>
            </li>
            <li className="side-menu-item">
              <a href="/mis-adopciones" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">📄</span>
                Mis Adopciones
              </a>
            </li>
            <li className="side-menu-item">
              <a href="#mis-adopciones" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">🐾</span>
                Mis Mascotas
              </a>
            </li>
            <li className="side-menu-item">
              <a href="#eventos" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">🎪</span>
                Eventos
              </a>
            </li>
            <li className="side-menu-item">
              <a href="#donar" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">💝</span>
                Hacer Donación
              </a>
            </li>
            <li className="side-menu-item">
              <a href="#mis-donaciones" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">💰</span>
                Mis Donaciones
              </a>
            </li>
            <li className="side-menu-item">
              <a href="#voluntariado" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">🤝</span>
                Ser Voluntario
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
              <a href="#configuracion" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">🔧</span>
                Configuración
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


export default HeaderUsuario;