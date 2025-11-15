import React, { useEffect, useState } from 'react';
import { getFichaMedica } from '../../../../../Api/ApiRefugio';

interface GeneralSectionProps {
  animalId: number;
  token: string;
  ficha?: any;
  setFicha?: (data: any) => void;
}

const ESTADO_SALUD_OPCIONES = [
  { value: 'sano', label: 'Sano' },
  { value: 'en_tratamiento', label: 'En tratamiento' },
  { value: 'en_recuperacion', label: 'En recuperación' },
  { value: 'condicion_cronica', label: 'Condición crónica' },
];


const GeneralSection: React.FC<GeneralSectionProps> = ({ animalId, token, setFicha }) => {
  const [localFicha, setLocalFicha] = useState({
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

  useEffect(() => {
    async function fetchFicha() {
      setLoading(true);
      setError('');
      try {
        const data = await getFichaMedica(token, animalId);
        setLocalFicha({
          estado_salud: data.estado_salud || '',
          peso_actual: data.peso_actual || '',
          fecha_ultimo_control: data.fecha_ultimo_control || '',
          veterinario_responsable: data.veterinario_responsable || '',
          clinica: data.clinica || '',
          recomendaciones: data.recomendaciones || '',
          observaciones: data.observaciones || '',
        });
        if (setFicha) setFicha({
          estado_salud: data.estado_salud || '',
          peso_actual: data.peso_actual || '',
          fecha_ultimo_control: data.fecha_ultimo_control || '',
          veterinario_responsable: data.veterinario_responsable || '',
          clinica: data.clinica || '',
          recomendaciones: data.recomendaciones || '',
          observaciones: data.observaciones || '',
        });
      } catch (err) {
        setError('Error al obtener ficha médica');
      }
      setLoading(false);
    }
    if (animalId && token) fetchFicha();
  }, [animalId, token, setFicha]);

  // Sincroniza el estado local con el estado del modal solo después de renderizar
  useEffect(() => {
    if (setFicha) setFicha(localFicha);
  }, [localFicha, setFicha]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalFicha(f => ({ ...f, [name]: value }));
  };

  return (
    <div className="section-card">
      <h3 className="section-title">Información general</h3>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <div className="general-form">
          <div style={{ display: 'flex', gap: '16px', marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <label>Estado de salud</label>
              <select
                name="estado_salud"
                value={localFicha.estado_salud}
                onChange={handleChange}
                className="select-estado-salud"
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #b3d1f7',
                  background: '#f5fbff',
                  fontSize: '1rem',
                  color: localFicha.estado_salud ? '#1a4fa3' : '#888',
                  fontWeight: localFicha.estado_salud ? 'bold' : 'normal',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                  outline: 'none',
                  marginTop: '2px',
                  marginBottom: '2px',
                  transition: 'border-color 0.2s',
                  width: '100%',
                }}
              >
                <option value="" style={{ color: '#888', fontWeight: 'normal' }}>Seleccione...</option>
                {ESTADO_SALUD_OPCIONES.map(opt => (
                  <option key={opt.value} value={opt.value} style={{ color: '#1a4fa3', fontWeight: 'bold' }}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label>Peso actual (kg)</label>
              <input
                type="number"
                step="0.01"
                name="peso_actual"
                value={localFicha.peso_actual}
                onChange={handleChange}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #b3d1f7',
                  background: '#f5fbff',
                  fontSize: '1rem',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
          <div className="form-row">
            <label>Fecha última visita al veterinario</label>
            <input type="date" name="fecha_ultimo_control" value={localFicha.fecha_ultimo_control} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Veterinario responsable</label>
            <input type="text" name="veterinario_responsable" value={localFicha.veterinario_responsable} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Clínica responsable</label>
            <input type="text" name="clinica" value={localFicha.clinica} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Notas / Recomendaciones</label>
            <textarea name="recomendaciones" value={localFicha.recomendaciones} onChange={handleChange} />
          </div>
        </div>
      )}
    </div>
  );
}
export default GeneralSection;
