import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GestionRefugioMenu.css';

interface GestionRefugioMenuProps {
  nombreRefugio: string;
  animalesCount?: number;
  adopcionesPendientes?: number;
  hogarTemporalPendientes?: number;
}


const GestionRefugioMenu: React.FC<GestionRefugioMenuProps> = ({ nombreRefugio, animalesCount = 0, adopcionesPendientes = 0, hogarTemporalPendientes = 0 }) => {
  const navigate = useNavigate();

  const handleButtonClick = (seccion: string) => {
    if (seccion === 'Animales') {
      navigate('/refugio/animales');
    } else {
      alert(`Navegando a la sección: ${seccion} (Próximamente)`);
    }
  };

  return (
    <div className="gestion-refugio-card menu-card">
      <h2 className="gestion-refugio-title">Dashboard Refugio: {nombreRefugio}</h2>
      <div className="dashboard-counters" style={{ display: 'flex', gap: 32, marginBottom: 24, justifyContent: 'center' }}>
        <div className="dashboard-counter" style={{ background: '#e3f2fd', borderRadius: 14, padding: 18, minWidth: 120, textAlign: 'center', boxShadow: '0 2px 8px #1976d233' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#1976d2' }}>{animalesCount}</div>
          <div style={{ color: '#1976d2', fontWeight: 600 }}>Animales</div>
        </div>
        <div className="dashboard-counter" style={{ background: '#fffde7', borderRadius: 14, padding: 18, minWidth: 120, textAlign: 'center', boxShadow: '0 2px 8px #ffd60033' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#ffa726' }}>{adopcionesPendientes}</div>
          <div style={{ color: '#ffa726', fontWeight: 600 }}>Adopciones pendientes</div>
        </div>
        <div className="dashboard-counter" style={{ background: '#e8f5e9', borderRadius: 14, padding: 18, minWidth: 120, textAlign: 'center', boxShadow: '0 2px 8px #43a04733' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#43a047' }}>{hogarTemporalPendientes}</div>
          <div style={{ color: '#43a047', fontWeight: 600 }}>Hogar temporal pendientes</div>
        </div>
      </div>
      <p className="gestion-refugio-subtitle">
        Selecciona una sección para administrar la información de tu refugio.
      </p>
      <div className="gestion-menu-buttons">
        <button className="gestion-button" onClick={() => navigate('/refugio/animales')}>
          <span role="img" aria-label="paw">🐾</span> Gestionar Animales
        </button>
        <button className="gestion-button" onClick={() => navigate('/refugio/adopciones')}>
          <span role="img" aria-label="clipboard">�</span> Gestionar Adopciones
        </button>
        <button className="gestion-button" onClick={() => navigate('/refugio/hogar-temporal')}>
          <span role="img" aria-label="house">🏠</span> Hogares Temporales
        </button>
        <button className="gestion-button" onClick={() => handleButtonClick('Eventos')}>
          <span role="img" aria-label="tada">🎉</span> Gestionar Eventos
        </button>
        <button className="gestion-button" onClick={() => handleButtonClick('Donaciones')}>
          <span role="img" aria-label="gift">💝</span> Ver Donaciones
        </button>
      </div>
    </div>
  );
};

export default GestionRefugioMenu;