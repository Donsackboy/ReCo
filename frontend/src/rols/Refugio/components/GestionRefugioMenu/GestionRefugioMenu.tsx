import React from 'react';
import './GestionRefugioMenu.css';

interface GestionRefugioMenuProps {
  nombreRefugio: string;
}

const GestionRefugioMenu: React.FC<GestionRefugioMenuProps> = ({ nombreRefugio }) => {

  const handleButtonClick = (seccion: string) => {
    // Por ahora, solo muestra un mensaje. Más tarde, navegará a la sección correspondiente.
    alert(`Navegando a la sección: ${seccion} (Próximamente)`);
  };

  return (
    <div className="gestion-refugio-card menu-card">
      <h2 className="gestion-refugio-title">Gestionar Refugio: {nombreRefugio}</h2>
      <p className="gestion-refugio-subtitle">
        Selecciona una sección para administrar la información de tu refugio.
      </p>
      <div className="gestion-menu-buttons">
        <button className="gestion-button" onClick={() => handleButtonClick('Animales')}>
          <span role="img" aria-label="paw">🐾</span> Gestionar Animales
        </button>
        <button className="gestion-button" onClick={() => handleButtonClick('Eventos')}>
          <span role="img" aria-label="tada">🎉</span> Gestionar Eventos
        </button>
        <button className="gestion-button" onClick={() => handleButtonClick('Donaciones')}>
          <span role="img" aria-label="gift">💝</span> Ver Donaciones
        </button>
        {/* Agrega más botones aquí si es necesario */}
      </div>
    </div>
  );
};

export default GestionRefugioMenu;