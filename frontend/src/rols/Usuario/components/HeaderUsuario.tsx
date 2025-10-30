import React, { useState } from 'react';
import Logo from '../../Public/components/Header/shared/Logo';
import './Header.css';

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
    <header className="header-usuario">
      <nav className="navbar-usuario">
        <div className="nav-container-usuario">
          {/* Logo a la izquierda */}
          <Logo onClick={onNavigateHome} className="nav-logo-usuario" />
          {/* Navegación central - Usuario NORMAL */}
          <nav className="center-nav-usuario">
            <ul className="nav-menu-usuario">
              <li className="nav-item-usuario">
                <a href="#adoptar" className="nav-link-usuario">
                  <span className="nav-icon-usuario">❤️</span>
                  <span className="nav-text-usuario">Adoptar</span>
                </a>
              </li>
              <li className="nav-item-usuario">
                <a href="#hogar-temporal" className="nav-link-usuario">
                  <span className="nav-icon-usuario">🏠</span>
                  <span className="nav-text-usuario">Hogar Temporal</span>
                </a>
              </li>
              <li className="nav-item-usuario">
                <a href="#mis-postulaciones" className="nav-link-usuario">
                  <span className="nav-icon-usuario">📋</span>
                  <span className="nav-text-usuario">Mis Postulaciones</span>
                </a>
              </li>
              <li className="nav-item-usuario">
                <a href="#eventos" className="nav-link-usuario">
                  <span className="nav-icon-usuario">🎪</span>
                  <span className="nav-text-usuario">Eventos</span>
                </a>
              </li>
              <li className="nav-item-usuario">
                <a href="#donar" className="nav-link-usuario">
                  <span className="nav-icon-usuario">💝</span>
                  <span className="nav-text-usuario">Donar</span>
                </a>
              </li>
            </ul>
          </nav>
          {/* Perfil de usuario y menú */}
          <div className="hamburger-container-usuario">
            <div className="auth-buttons-usuario desktop-auth-usuario">
              <div className="user-profile-usuario">
                <span className="user-icon-usuario">👤</span>
                <span className="user-name-usuario">{userName}</span>
              </div>
              <button onClick={onLogout} className="btn-logout-usuario">
                <span className="auth-icon-usuario">🚪</span>
                <span className="auth-text-usuario">Cerrar Sesión</span>
              </button>
            </div>
            <button className="hamburger-btn-usuario" onClick={toggleMenu}>
              <span className="hamburger-line-usuario"></span>
              <span className="hamburger-line-usuario"></span>
              <span className="hamburger-line-usuario"></span>
            </button>
          </div>
        </div>
        {/* Overlay para cerrar menú */}
        {isMenuOpen && <div className="menu-overlay-usuario" onClick={closeMenu}></div>}
        {/* Menú lateral */}
        <div className={`side-menu-usuario ${isMenuOpen ? 'side-menu-usuario-open' : ''}`}>
          <div className="side-menu-header-usuario">
            <div className="side-menu-logo-usuario">
              <img src="/Images/reco-logo.png" alt="ReCo" className="side-logo-usuario" />
              <div className="user-info-usuario">
                <span className="side-logo-text-usuario">👤 {userName}</span>
                <span className="user-role-usuario">Usuario</span>
              </div>
            </div>
            <button className="close-btn-usuario" onClick={closeMenu}>
              <span className="close-icon-usuario">×</span>
            </button>
          </div>
          <ul className="side-menu-items-usuario">
            <li className="side-menu-item-usuario">
              <a href="#adoptar" className="side-menu-link-usuario" onClick={closeMenu}>
                <span className="side-menu-icon-usuario">❤️</span>
                Adoptar Mascota
              </a>
            </li>
            <li className="side-menu-item-usuario">
              <a href="#hogar-temporal" className="side-menu-link-usuario" onClick={closeMenu}>
                <span className="side-menu-icon-usuario">🏠</span>
                Ser Hogar Temporal
              </a>
            </li>
            <li className="side-menu-item-usuario">
              <a href="#mis-postulaciones" className="side-menu-link-usuario" onClick={closeMenu}>
                <span className="side-menu-icon-usuario">📋</span>
                Mis Postulaciones
              </a>
            </li>
            <li className="side-menu-item-usuario">
              <a href="#mis-adopciones" className="side-menu-link-usuario" onClick={closeMenu}>
                <span className="side-menu-icon-usuario">🐾</span>
                Mis Mascotas
              </a>
            </li>
            <li className="side-menu-item-usuario">
              <a href="#eventos" className="side-menu-link-usuario" onClick={closeMenu}>
                <span className="side-menu-icon-usuario">🎪</span>
                Eventos
              </a>
            </li>
            <li className="side-menu-item-usuario">
              <a href="#donar" className="side-menu-link-usuario" onClick={closeMenu}>
                <span className="side-menu-icon-usuario">💝</span>
                Hacer Donación
              </a>
            </li>
            <li className="side-menu-item-usuario">
              <a href="#mis-donaciones" className="side-menu-link-usuario" onClick={closeMenu}>
                <span className="side-menu-icon-usuario">💰</span>
                Mis Donaciones
              </a>
            </li>
            <li className="side-menu-item-usuario">
              <a href="#voluntariado" className="side-menu-link-usuario" onClick={closeMenu}>
                <span className="side-menu-icon-usuario">🤝</span>
                Ser Voluntario
              </a>
            </li>
            {/* Separador */}
            <hr className="side-menu-separator-usuario" />
            {/* Configuración y salir */}
            <li className="side-menu-item-usuario">
              <a href="#mi-perfil" className="side-menu-link-usuario" onClick={closeMenu}>
                <span className="side-menu-icon-usuario">⚙️</span>
                Mi Perfil
              </a>
            </li>
            <li className="side-menu-item-usuario">
              <a href="#configuracion" className="side-menu-link-usuario" onClick={closeMenu}>
                <span className="side-menu-icon-usuario">🔧</span>
                Configuración
              </a>
            </li>
            <li className="side-menu-item-usuario">
              <button onClick={() => { onLogout?.(); closeMenu(); }} className="side-menu-link-usuario logout-btn-usuario">
                <span className="side-menu-icon-usuario">🚪</span>
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