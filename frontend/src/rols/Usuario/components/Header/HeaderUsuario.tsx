import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
              <div className="nav-logo" onClick={onNavigateHome}>
                <a href="/" className="logo-link">
                  <div className="logo-container">
                    <img src="/Images/reco-logo.png" alt="ReCo Logo" className="logo-image" />
                    <div className="logo-text-container">
                      <div className="logo-text-styled">ReCo</div>
                      <div className="logo-subtitle">REFUGIO CONECTADO</div>
                    </div>
                  </div>
                </a>
              </div>
          {/* Navegación central - Usuario NORMAL */}
          <nav className="center-nav">
            <ul className="nav-menu">
              <li className="nav-item">
              <Link to="/refugios" className="nav-link" onClick={closeMenu}>
                <span className="nav-icon"></span>
                Refugios
              </Link>
              </li>
              <li className="nav-item">
                
                <Link to="/animales" className="nav-link" onClick={closeMenu}>
                  <span className="nav-icon"></span>
                  <span className="nav-text">Animales</span>
                </Link>
              </li>
              {/* <li className="nav-item">
                <a href="#hogar-temporal" className="nav-link" onClick={closeMenu}>
                  <span className="nav-icon"></span>
                  <span className="nav-text">Hogar Temporal</span>
                </a>
              </li> */}
              <li className="nav-item">
              <Link to="/mis-solicitudes-adopcion" className="nav-link" onClick={closeMenu}>
                <span className="nav-icon"></span>
                Mis Solicitudes de Adopción
              </Link>
              </li>
              {/* <li className="nav-item">
                <a href="#eventos" className="nav-link" onClick={closeMenu}>
                  <span className="nav-icon"></span>
                  <span className="nav-text">Eventos</span>
                </a>
              </li> */}
            </ul>
          </nav>
          {/* Perfil de usuario y menú */}
          <div className="hamburger-container">
            <div className="auth-buttons desktop-auth">
              <div className="user-profile">
                <span className="user-icon">👤</span>
                <Link to="/mi-perfil" style={{ textDecoration: 'none' }}>
                  <button
                    className="user-name-btn"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2ecc40', // verde
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '1em',
                      padding: 0
                    }}
                  >
                    {userName}
                  </button>
                </Link>
              </div>
              <button onClick={onLogout} className="btn-logout">
                <span className="auth-icon"></span>
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
              <div className="user-info">
                <img src="/Images/reco-logo.png" alt="ReCo" className="side-logo" />
                <span className="side-logo-text">👤 {userName}</span>

              </div>
            </div>
            <button className="close-btn" onClick={closeMenu}>
              <span className="close-icon">×</span>
            </button>
          </div>
          <ul className="side-menu-items">
            {/* Botones principales de usuario */}
            <li className="side-menu-item">
              <Link to="/mis-solicitudes-adopcion" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon"></span>
                Mis Solicitudes de Adopción
              </Link>
            </li>
            {/* <li className="side-menu-item">
              <Link to="/mis-adopciones" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon"></span>
                Mis Mascotas
              </Link>
            </li> */}
            {/* <li className="side-menu-item">
              <Link to="/mis-donaciones" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon"></span>
                Mis Donaciones
              </Link>
            </li> */}
            {/* <li className="side-menu-item">
              <Link to="/mis-voluntariados" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon"></span>
                Mis Voluntariados
              </Link>
            </li> */}
            {/* Sección pública */}
            <hr className="side-menu-separator" style={{ borderColor: '#2ecc40', borderWidth: 2 }} />

            <li className="side-menu-category">
              <span className="category-title">🌐 ACCESO PÚBLICO</span>
            </li>
            <li className="side-menu-item">
              <Link to="/refugios" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon"></span>
                Refugios
              </Link>
            </li>
            <li className="side-menu-item">
              <Link to="/animales" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon"></span>
                Animales
              </Link>
            </li>
            {/* <li className="side-menu-item">
              <Link to="/hogares-temporales" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon"></span>
                Hogares Temporales
              </Link>
            </li> */}
            {/* <li className="side-menu-item">
              <Link to="/eventos" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon"></span>
                Eventos
              </Link>
            </li> */}
            <hr className="side-menu-separator" />
            {/* Configuración y salir */}
            <li className="side-menu-item">
              <Link to="/mi-perfil" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">👤</span>
                Mi Perfil
              </Link>
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