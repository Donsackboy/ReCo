
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import "./HeaderLayout.css";
import "./Logo.css";
import "./NavMenu.css";
import "./UserProfile.css";
import "./HamburgerMenu.css";
import "./AuthButtons.css";

import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

function HeaderPublic() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [showRegister, setShowRegister] = useState(false);

  const openLogin = () => {
    setShowLogin(true);
    closeMenu();
  };
  const navigate = useNavigate();

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
        <div className="nav-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* Logo y nombre - extremo izquierdo */}
          <div className="nav-logo" style={{ marginLeft: '10px' }}>
            <Link to="/" className="logo-link" onClick={closeMenu}>
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
            </Link>
          </div>

          {/* Bloque central: Menú de navegación */}
          <nav className="center-nav" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/refugios" className="nav-link" onClick={closeMenu}>
                  <span className="nav-text">Refugios</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/animales" className="nav-link" onClick={closeMenu}>
                  <span className="nav-text">Animales</span>
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link to="/hogares-temporales" className="nav-link" onClick={closeMenu}>
                  <span className="nav-text">Hogares Temporales</span>
                </Link>
              </li> */}
              <li className="nav-item">
                <Link to="/donaciones" className="nav-link" onClick={closeMenu}>
                  <span className="nav-text">Donaciones</span>
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link to="/eventos" className="nav-link" onClick={closeMenu}>
                  <span className="nav-text">Eventos</span>
                </Link>
              </li> */}
              {/* <li className="nav-item">
                <a
                  href="#"
                  className="nav-link"
                  onClick={e => {
                    e.preventDefault();
                    const token = localStorage.getItem("token");
                    if (!token) {
                      setShowLogin(true);
                    } else {
                      navigate("/voluntariado");
                    }
                  }}
                >
                  <span className="nav-text">Voluntariado</span>
                </a>
              </li> */}
            </ul>
          </nav>

          {/* Menú hamburguesa y auth - extremo derecho */}
          <div className="hamburger-container" style={{ marginRight: '30px', display: 'flex', alignItems: 'center' }}>
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
            <Link to="/" className="side-menu-logo" onClick={closeMenu}>
              <img
                src="/Images/reco-logo.png"
                alt="ReCo"
                className="side-logo"
              />
              <span className="side-logo-text">ReCo</span>
            </Link>
            <button className="close-btn" onClick={closeMenu}>
              <span className="close-icon">×</span>
            </button>
          </div>
          <ul className="side-menu-items">
            <li className="side-menu-item">
              <Link to="/refugios" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">🏠</span>
                Refugios
              </Link>
            </li>
            <li className="side-menu-item">
              <Link to="/animales" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">🐾</span>
                Animales
              </Link>
            </li>
            {/* <li className="side-menu-item">
              <Link to="/hogares-temporales" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">🏡</span>
                Hogares Temporales
              </Link>
            </li> */}
            <li className="side-menu-item">
              <Link to="/donaciones" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">💝</span>
                Donaciones
              </Link>
            </li>
            {/* <li className="side-menu-item">
              <Link to="/eventos" className="side-menu-link" onClick={closeMenu}>
                <span className="side-menu-icon">�</span>
                Eventos
              </Link>
            </li> */}
            {/* <li className="side-menu-item">
              <a
                href="#"
                className="side-menu-link"
                onClick={e => {
                  e.preventDefault();
                  const token = localStorage.getItem("token");
                  if (!token) {
                    setShowLogin(true);
                  } else {
                    navigate("/voluntariado");
                  }
                }}
              >
                <span className="side-menu-icon">🤝</span>
                Voluntariado
              </a>
            </li> */}

            {/* Separador */}
            <hr className="side-menu-separator" />

            {/* Autenticación en menú móvil */}
            <li className="side-menu-item auth-buttons-container">
              <button onClick={openLogin} className="side-menu-link">
                <span className="side-menu-icon">👤</span>
                Iniciar Sesión
              </button>
            </li>
            <li className="side-menu-item auth-buttons-container">
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

export default HeaderPublic;