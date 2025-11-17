import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../../../Public/components/Header/Logo.css';
import '../../../Public/components/Header/NavMenu.css';
import '../../../Public/components/Header/UserProfile.css';
import '../../../Public/components/Header/HamburgerMenu.css';
import '../../../Public/components/Header/AuthButtons.css';
import '../../../Public/components/Header/HeaderLayout.css';

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
  const navigate = useNavigate();

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
          <div className="center-nav">
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/refugio/dashboard" className="nav-link" onClick={closeMenu}>
                  <span className="nav-icon"></span>
                  <span className="nav-text">Dashboard</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/refugio/mis-animales" className="nav-link" onClick={closeMenu}>
                  <span className="nav-icon"></span>
                  <span className="nav-text">Mis Animales</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/refugio/adopciones" className="nav-link" onClick={closeMenu}>
                  <span className="nav-icon"></span>
                  <span className="nav-text">Adopciones</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/refugio/historial-medico" className="nav-link" onClick={closeMenu}>
                  <span className="nav-icon"></span>
                  <span className="nav-text">Historial Médico</span>
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link to="/refugio/mis-eventos" className="nav-link" onClick={closeMenu}>
                  <span className="nav-icon"></span>
                  <span className="nav-text">Mis Eventos</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/refugio/donaciones" className="nav-link" onClick={closeMenu}>
                  <span className="nav-icon"></span>
                  <span className="nav-text">Donaciones</span>
                </Link>
              </li> */}
            </ul>
            <button className="user-profile" onClick={() => navigate('/refugio/configuracion')}>
              <span className="user-icon">🏠</span>
              <span className="auth-text">Mi Perfil</span>
            </button>
          </div>
          <button className="hamburger-btn" onClick={toggleMenu}>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
        {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
        <div className={`side-menu ${isMenuOpen ? 'side-menu-open' : ''}`}>
          <div className="side-menu-header">
            <div className="side-menu-logo">
              <img src="/Images/reco-logo.png" alt="ReCo" className="side-logo" />
              <div className="user-info">
                <span className="side-logo-text">🏠 {refugioNombre}</span>
              </div>
            </div>
            <button className="close-btn" onClick={closeMenu}>
              <span className="close-icon">×</span>
            </button>
          </div>
          <ul className="side-menu-items">
            {/* Orden correcto de botones principales de refugio */}
            <li className="side-menu-item">
              <Link to="/refugio/dashboard" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon"></span>
                Dashboard
              </Link>
            </li>
            <li className="side-menu-item">
              <Link to="/refugio/mis-animales" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon"></span>
                Mis Animales
              </Link>
            </li>
            <li className="side-menu-item">
              <Link to="/refugio/adopciones" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon"></span>
                Adopciones
              </Link>
            </li>
            <li className="side-menu-item">
              <Link to="/refugio/historial-medico" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon"></span>
                Historial Médico
              </Link>
            </li>
              <li className="side-menu-item">
                  <Link to="/refugio/donaciones-medicas" className="side-menu-link" onClick={closeMenu}>
                    <span className="side-menu-icon">💊</span>
                    Gestionar Donaciones Médicas
                  </Link>
                </li>
            {/* <li className="side-menu-item">
              <Link to="/refugio/mis-eventos" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon"></span>
                Mis Eventos
              </Link>
            </li>
            <li className="side-menu-item">
              <Link to="/refugio/inscritos-evento" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon"></span>
                Inscritos Evento
              </Link>
            </li>
            <li className="side-menu-item">
              <Link to="/refugio/donaciones" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon"></span>
                Donaciones
              </Link>
            </li>
            <li className="side-menu-item">
              <Link to="/refugio/necesidades" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon"></span>
                Necesidades
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
            <li className="side-menu-item">
              <Link to="/hogares-temporales" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon"></span>
                Hogares Temporales
              </Link>
            </li>
            {/*
            <li className="side-menu-item">
              <Link to="/eventos" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon"></span>
                Eventos
              </Link>
            </li>
            */}
            {/* Separador verde antes de perfil y cerrar sesión */}
            <hr className="side-menu-separator" style={{ borderColor: '#2ecc40', borderWidth: 2 }} />

            <li className="side-menu-item">
              <Link to="/refugio/configuracion" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon"></span>
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