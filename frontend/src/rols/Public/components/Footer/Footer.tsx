import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src="/Images/reco-logo.png" alt="ReCo Logo" />
          <span className="footer-title">ReCo</span>
        </div>
        <div className="footer-info">
          <div className="footer-links">
            <a href="/" className="footer-link">Inicio</a>
            <a href="/refugios" className="footer-link">Refugios</a>
            <a href="/animales" className="footer-link">Animales</a>
            <a href="/donaciones" className="footer-link">Donaciones</a>
          </div>
          <div className="footer-contact">
            <span>Contacto:</span>
            <a href="mailto:contacto@reco.cl" className="footer-contact-link">contacto@reco.cl</a>
            <span>Tel: +56 9 1234 5678</span>
          </div>
        </div>
        <div className="footer-social">
          <a href="#" className="footer-social-icon" title="Instagram">
            <img src="/Images/instagram.svg" alt="Instagram" />
          </a>
          <a href="#" className="footer-social-icon" title="Facebook">
            <img src="/Images/facebook.svg" alt="Facebook" />
          </a>
          <a href="#" className="footer-social-icon" title="Twitter">
            <img src="/Images/twitter.svg" alt="Twitter" />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>Inspirando adopciones responsables y conectando refugios con familias amorosas.</span><br />
        <span>© {new Date().getFullYear()} ReCo. Todos los derechos reservados.</span>
      </div>
    </footer>
  );
}
