import React from 'react';

const GeneralSection: React.FC = () => {
  return (
    <div className="section-card">
      <h3 className="section-title">Información general</h3>
      <p style={{ color: '#666', fontSize: '1rem' }}>
        Aquí puedes registrar o consultar información médica general del animal.
      </p>
    </div>
  );
};

export default GeneralSection;
