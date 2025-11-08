import React, { useState, useEffect } from 'react';
import './FichaMedica.css';
import GeneralSection from './GeneralSection/GeneralSection';
import { updateFichaMedica } from 'src/api';
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
  const [ficha, setFicha] = useState<any>({
    estado_salud: '',
    peso_actual: '',
    fecha_ultimo_control: '',
    veterinario_responsable: '',
    clinica: '',
    recomendaciones: '',
    observaciones: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      await updateFichaMedica(localStorage.getItem('token') || '', Number(animalId), ficha);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1800);
    } catch (err) {
      setError('Error al guardar ficha médica');
    }
    setLoading(false);
  };

  return (
    <div className="ficha-overlay">
      <div className="ficha-modal">
        <div className="ficha-medica-content">
          <h2 className="ficha-title">Ficha Médica del Animal</h2>

          <GeneralSection animalId={Number(animalId)} token={localStorage.getItem('token') || ''} ficha={ficha} setFicha={setFicha} />

          <VacunasSection
            especie={especie ?? ''}
            animalId={Number(animalId)}
            token={localStorage.getItem('token') || ''}
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
            <button className="button-primary" onClick={handleSave} disabled={loading}>Guardar cambios</button>
            <button className="button-secondary" onClick={onClose}>Cancelar</button>
            {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
          </div>
          {showSuccess && (
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#f8fbfd',
              color: '#1976d2',
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              padding: '24px 36px',
              fontSize: '1.15rem',
              fontWeight: 500,
              zIndex: 9999,
              textAlign: 'center',
              border: '1px solid #e3eaf3',
              animation: 'fadeInOut 1.8s',
              letterSpacing: '0.5px',
            }}>
              <span role="img" aria-label="check" style={{ fontSize: '1.7rem', marginRight: 10, verticalAlign: 'middle' }}>✅</span>
              <span style={{ verticalAlign: 'middle' }}>Ficha médica guardada con éxito</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FichaMedicaModal;
