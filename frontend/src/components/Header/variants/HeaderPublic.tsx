import React, { useState } from 'react';
import Logo from '../shared/Logo';
import '../Header.css';

interface HeaderPublicProps {
  onNavigateHome?: () => void;
}

const HeaderPublic: React.FC<HeaderPublicProps> = ({ onNavigateHome }) => {
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
          
          {/* Navegación central - Usuario NO logueado */}
          <nav className="center-nav">
            <ul className="nav-menu">
              <li className="nav-item">
                <a href="#refugios" className="nav-link">
                  <span className="nav-icon">🏠</span>
                  <span className="nav-text">Refugios</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#animales" className="nav-link">
                  <span className="nav-icon">🐾</span>
                  <span className="nav-text">Animales</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#hogares-temporales" className="nav-link">
                  <span className="nav-icon">🏡</span>
                  <span className="nav-text">Hogares Temporales</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#donaciones" className="nav-link">
                  <span className="nav-icon">💝</span>
                  <span className="nav-text">Donaciones</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#eventos" className="nav-link">
                  <span className="nav-icon">🎪</span>
                  <span className="nav-text">Eventos</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#voluntariado" className="nav-link">
                  <span className="nav-icon">🤝</span>
                  <span className="nav-text">Voluntariado</span>
                </a>
              </li>
            </ul>
          </nav>
          
          {/* Botones de autenticación */}
          <div className="hamburger-container">
            <div className="auth-buttons desktop-auth">
              <a href="#login" className="btn-login">
                <span className="auth-icon">👤</span>
                <span className="auth-text">Iniciar Sesión</span>
              </a>
              <a href="#register" className="btn-register">
                <span className="auth-icon">✨</span>
                <span className="auth-text">Registrarse</span>
              </a>
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
              <span className="side-logo-text">ReCo</span>
            </div>
            <button className="close-btn" onClick={closeMenu}>
              <span className="close-icon">×</span>
            </button>
          </div>
          <ul className="side-menu-items">
            <li className="side-menu-item">
              <a href="#refugios" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">🏠</span>
                Refugios
              </a>
            </li>
            <li className="side-menu-item">
              <a href="#animales" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">🐾</span>
                Animales
              </a>
            </li>
            <li className="side-menu-item">
              <a href="#hogares-temporales" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">🏡</span>
                Hogares Temporales
              </a>
            </li>
            <li className="side-menu-item">
              <a href="#donaciones" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">💝</span>
                Donaciones
              </a>
            </li>
            <li className="side-menu-item">
              <a href="#eventos" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">🎪</span>
                Eventos
              </a>
            </li>
            <li className="side-menu-item">
              <a href="#voluntariado" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">🤝</span>
                Voluntariado
              </a>
            </li>
            
            {/* Separador */}
            <hr className="side-menu-separator" />
            
            {/* Autenticación en menú móvil */}
            <li className="side-menu-item">
              <a href="#login" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">👤</span>
                Iniciar Sesión
              </a>
            </li>
            <li className="side-menu-item">
              <a href="#register" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">✨</span>
                Registrarse
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default HeaderPublic;