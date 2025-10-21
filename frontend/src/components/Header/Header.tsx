import React, { useState } from "react";
import "./Header.css";

import LoginModal from "../LoginModal";
import RegisterModal from "../RegisterModal";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const openLogin = () => {
    setShowLogin(true);
    closeMenu();
  };

  const openRegister = () => {
    setShowRegister(true);
    closeMenu();
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  const switchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const switchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

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
          {/* Logo y nombre - extremo izquierdo */}
          <div className="nav-logo">
            <a href="#inicio" className="logo-link">
              <div className="logo-container">
                <img
                  src="/Images/reco-logo.png"
                  alt="ReCo Logo"
                  className="logo-image"
                />
                <div className="logo-text-container">
                  <div className="logo-text-styled">ReCo</div>
                  <div className="logo-subtitle">REFUGIO CONECTADO</div>
                </div>
              </div>
            </a>
          </div>

          {/* Bloque central: Menú de navegación */}
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
                  <span className="nav-icon">🐕</span>
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
                  <span className="nav-icon">�</span>
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

          {/* Menú hamburguesa - extremo derecho (siempre visible) */}
          <div className="hamburger-container">
            <div className="auth-buttons desktop-auth">
              <button onClick={openLogin} className="btn-login">
                <span className="auth-icon">👤</span>
                <span className="auth-text">Iniciar Sesión</span>
              </button>
              <button onClick={openRegister} className="btn-register">
                <span className="auth-icon">✨</span>
                <span className="auth-text">Registrarse</span>
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
        <div className={`side-menu ${isMenuOpen ? "side-menu-open" : ""}`}>
          <div className="side-menu-header">
            <div className="side-menu-logo">
              <img
                src="/Images/reco-logo.png"
                alt="ReCo"
                className="side-logo"
              />
              <span className="side-logo-text">ReCo</span>
            </div>
            <button className="close-btn" onClick={closeMenu}>
              <span className="close-icon">×</span>
            </button>
          </div>
          <ul className="side-menu-items">
            <li className="side-menu-item">
              <a
                href="#refugios"
                className="side-menu-link"
                onClick={closeMenu}
              >
                <span className="side-menu-icon">🏠</span>
                Refugios
              </a>
            </li>
            <li className="side-menu-item">
              <a
                href="#animales"
                className="side-menu-link"
                onClick={closeMenu}
              >
                <span className="side-menu-icon">🐾</span>
                Animales
              </a>
            </li>
            <li className="side-menu-item">
              <a
                href="#hogares-temporales"
                className="side-menu-link"
                onClick={closeMenu}
              >
                <span className="side-menu-icon">🏡</span>
                Hogares Temporales
              </a>
            </li>
            <li className="side-menu-item">
              <a
                href="#donaciones"
                className="side-menu-link"
                onClick={closeMenu}
              >
                <span className="side-menu-icon">💝</span>
                Donaciones
              </a>
            </li>
            <li className="side-menu-item">
              <a href="#eventos" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">�</span>
                Eventos
              </a>
            </li>
            <li className="side-menu-item">
              <a
                href="#voluntariado"
                className="side-menu-link"
                onClick={closeMenu}
              >
                <span className="side-menu-icon">🤝</span>
                Voluntariado
              </a>
            </li>

            {/* Separador */}
            <hr className="side-menu-separator" />

            {/* Autenticación en menú móvil */}
            <li className="side-menu-item">
              <button onClick={openLogin} className="side-menu-link">
                <span className="side-menu-icon">👤</span>
                Iniciar Sesión
              </button>
              <button onClick={openRegister} className="side-menu-link">
                <span className="side-menu-icon">✨</span>
                Registrarse
              </button>
            </li>
          </ul>
        </div>

        <LoginModal
          isOpen={showLogin}
          onClose={closeModals}
          onSwitchToRegister={switchToRegister}
        />
        <RegisterModal
          isOpen={showRegister}
          onClose={closeModals}
          onSwitchToLogin={switchToLogin}
        />
      </nav>
    </header>
  );
}

export default Header;
