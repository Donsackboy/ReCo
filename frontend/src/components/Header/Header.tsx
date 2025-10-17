import React, { useState } from 'react';
import './Header.css';

function Header() {
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
          {/* Bloque izquierdo: Logo + Nombre */}
          <div className="nav-logo">
            <a href="#inicio" className="logo-link">
              <div className="logo-container">
                <img 
                  src="/Images/reco-logo.png" 
                  alt="ReCo Logo" 
                  className="logo-image"
                />
                <div className="logo-text-container">
                  <div className="logo-text-styled">
                    ReCo
                  </div>
                  <div className="logo-subtitle">
                    REFUGIO CONECTADO
                  </div>
                </div>
              </div>
            </a>
          </div>
          
          {/* Bloque central: Menú de navegación */}
          <nav className="center-nav">
            <ul className="nav-menu desktop-menu">
              <li className="nav-item">
                <a href="#animales" className="nav-link">Adoptar</a>
              </li>
              <li className="nav-item">
                <a href="#refugios" className="nav-link">Refugios</a>
              </li>
              <li className="nav-item">
                <a href="#donaciones" className="nav-link">Donar</a>
              </li>
              <li className="nav-item">
                <a href="#eventos" className="nav-link">Voluntariado</a>
              </li>
              <li className="nav-item">
                <a href="#hogares-temporales" className="nav-link">Hogar Temporal</a>
              </li>
            </ul>
          </nav>
          
          {/* Bloque derecho: Auth + Hamburger */}
          <div className="right-container">
            {/* Botones de autenticación */}
            <div className="auth-buttons desktop-auth">
              <a href="#login" className="btn-login">Iniciar Sesión</a>
              <a href="#register" className="btn-register">Registrarse</a>
            </div>

            {/* Botón hamburguesa */}
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
            <button className="close-btn" onClick={closeMenu}>
              <span className="close-icon">×</span>
            </button>
          </div>
          <ul className="side-menu-items">
            <li className="side-menu-item">
              <a href="#animales" className="side-menu-link" onClick={closeMenu}>
                🐕 Adoptar
              </a>
            </li>
            <li className="side-menu-item">
              <a href="#refugios" className="side-menu-link" onClick={closeMenu}>
                🏢 Refugios
              </a>
            </li>
            <li className="side-menu-item">
              <a href="#donaciones" className="side-menu-link" onClick={closeMenu}>
                💝 Donar
              </a>
            </li>
            <li className="side-menu-item">
              <a href="#eventos" className="side-menu-link" onClick={closeMenu}>
                � Voluntariado
              </a>
            </li>
            <li className="side-menu-item">
              <a href="#hogares-temporales" className="side-menu-link" onClick={closeMenu}>
                🏠 Hogar Temporal
              </a>
            </li>
            
            {/* Separador */}
            <hr className="side-menu-separator" />
            
            {/* Autenticación en menú móvil */}
            <li className="side-menu-item">
              <a href="#login" className="side-menu-link" onClick={closeMenu}>
                � Iniciar Sesión
              </a>
            </li>
            <li className="side-menu-item">
              <a href="#register" className="side-menu-link" onClick={closeMenu}>
                ✨ Registrarse
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;