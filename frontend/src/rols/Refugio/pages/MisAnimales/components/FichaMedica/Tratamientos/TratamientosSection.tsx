import React from 'react';

interface TratamientosSectionProps {
  tratamientos: any[];
  setForm: React.Dispatch<React.SetStateAction<any>>;
}

const TratamientosSection: React.FC<TratamientosSectionProps> = ({ tratamientos }) => {
  return (
    <div className="section-card">
      <h3 className="section-title">Tratamientos</h3>
      {tratamientos.length === 0 ? (
        <div className="empty-state">
          <span role="img" aria-label="tratamiento" className="emoji">💊</span>
          No hay tratamientos activos
        </div>
      ) : (
        <ul>
          {tratamientos.map((t, i) => (
            <li key={i}>{t.tipo} — {t.fecha}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TratamientosSection;
