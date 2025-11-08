import React, { useState, useEffect } from 'react';
import './FichaMedica.css';
import GeneralSection from './GeneralSection/GeneralSection';
import VacunasSection from './Vacunas/VacunasSection';
import CirugiasSection from './Cirugias/CirugiasSection';
import TratamientosSection from './Tratamientos/TratamientosSection';
import AlergiasCondicionesSection from './AlegiasyCondicionesCronicas/AlegiasCondicionesSection';

interface FichaMedicaModalProps {
  animalId: number | string;
  onClose: () => void;
  especie?: string;
}

const FichaMedicaModal: React.FC<FichaMedicaModalProps> = ({ animalId, onClose, especie }) => {
  const [form, setForm] = useState<any>({
    vacunas: [],
    cirugias: [],
    tratamientos: [],
    alergias: [],
    archivos: []
  });

  const handleSave = () => {
    console.log('Guardando ficha médica...', form);
    alert('Ficha médica guardada (simulación)');
  };

  return (
    <div className="ficha-overlay">
      <div className="ficha-modal">
        <div className="ficha-medica-content">
          <h2 className="ficha-title">Ficha Médica del Animal</h2>

          <GeneralSection />

          <VacunasSection
            especie={especie ?? ''}
            vacunas={form.vacunas}
            setForm={setForm}
          />

          <CirugiasSection
            cirugias={form.cirugias}
            setForm={setForm}
          />

          <TratamientosSection
            tratamientos={form.tratamientos}
            setForm={setForm}
          />

          <AlergiasCondicionesSection
            alergias={form.alergias}
            setForm={setForm}
            animalId={animalId}
          />

          {/* Archivos adjuntos */}
          <div className="section-card">
            <h3 className="section-title">Archivos adjuntos</h3>
            {(form.archivos?.length ?? 0) === 0 && (
              <div className="empty-state">
                <span role="img" aria-label="archivo" className="emoji">📎</span>
                No hay archivos adjuntos
              </div>
            )}
            <div style={{ color: '#888' }}>(Funcionalidad de archivos pendiente)</div>
          </div>

          <div className="actions-row">
            <button className="button-primary" onClick={handleSave}>Guardar cambios</button>
            <button className="button-secondary" onClick={onClose}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FichaMedicaModal;
