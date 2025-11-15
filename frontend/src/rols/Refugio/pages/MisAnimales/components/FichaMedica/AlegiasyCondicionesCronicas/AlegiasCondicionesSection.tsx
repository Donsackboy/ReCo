import React from 'react';

interface AlergiasCondicionesSectionProps {
  alergias: any[];
  setForm: React.Dispatch<React.SetStateAction<any>>;
  animalId: number | string;
}

const AlergiasCondicionesSection: React.FC<AlergiasCondicionesSectionProps> = ({
  alergias,
  animalId
}) => {
  return (
    <div className="section-card">
      <h3 className="section-title">Alergias y condiciones crónicas</h3>
      {alergias.length === 0 ? (
        <div className="empty-state">
          <span role="img" aria-label="alergia" className="emoji">🌿</span>
          No hay alergias ni condiciones crónicas registradas
        </div>
      ) : (
        <ul>
          {alergias.map((a, i) => (
            <li key={i}>{a.nombre}</li>
          ))}
        </ul>
      )}
      <div style={{ color: '#888', marginTop: 6 }}>Animal ID: {animalId}</div>
    </div>
  );
};

export default AlergiasCondicionesSection;
