import React from 'react';

interface CirugiasSectionProps {
  cirugias: any[];
  setForm: React.Dispatch<React.SetStateAction<any>>;
}

const CirugiasSection: React.FC<CirugiasSectionProps> = ({ cirugias }) => {
  return (
    <div className="section-card">
      <h3 className="section-title">Cirugías</h3>
      {cirugias.length === 0 ? (
        <div className="empty-state">
          <span role="img" aria-label="cirugia" className="emoji">🩺</span>
          No hay cirugías registradas
        </div>
      ) : (
        <ul>
          {cirugias.map((c, i) => (
            <li key={i}>{c.tipo} — {c.fecha}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CirugiasSection;
