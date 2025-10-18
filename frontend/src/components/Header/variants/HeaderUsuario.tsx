import React, { useState } from 'react';
import Logo from '../shared/Logo';
import '../Header.css';

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
          {/* Logo */}
          <Logo onClick={onNavigateHome} />
          
          {/* Navegación central - Usuario NORMAL */}
          <nav className="center-nav">
            <ul className="nav-menu">
              <li className="nav-item">
                <a href="#adoptar" className="nav-link">
                  <span className="nav-icon">❤️</span>
                  <span className="nav-text">Adoptar</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#hogar-temporal" className="nav-link">
                  <span className="nav-icon">🏠</span>
                  <span className="nav-text">Hogar Temporal</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#mis-postulaciones" className="nav-link">
                  <span className="nav-icon">📋</span>
                  <span className="nav-text">Mis Postulaciones</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#eventos" className="nav-link">
                  <span className="nav-icon">🎪</span>
                  <span className="nav-text">Eventos</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#donar" className="nav-link">
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
              <img src="/Images/reco-logo.png" alt="ReCo" className="side-logo" />
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

export default HeaderUsuario;