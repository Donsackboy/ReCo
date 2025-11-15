// frontend/src/rols/Refugio/pages/MisEventos/EventoForm.tsx

import React, { useState, useEffect } from 'react';
import './MisEventos.css';
import type { EventoRefugio, EventoRefugioPayload } from './types';

interface EventoFormProps {
  evento: EventoRefugio | null; // El evento a editar, o null si es para crear
  onSave: (eventoData: EventoRefugioPayload) => void;
  onClose: () => void;
}

// Función para formatear fechas de Django (YYYY-MM-DDTHH:MM:SS) a (YYYY-MM-DDTHH:MM)
const formatDateTimeForInput = (isoDate: string | undefined): string => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return '';
  
  // Asegurarnos de que la fecha y hora sean correctas
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};


const EventoForm: React.FC<EventoFormProps> = ({ evento, onSave, onClose }) => {
  const [formData, setFormData] = useState<EventoRefugioPayload>({
    nombre: '',
    lugar: '',
    descripcion: '',
    fecha_hora_inicio: '',
    fecha_hora_fin: '',
    es_voluntariado: false,
    requiere_inscripcion: false,
    archivos: [] as File[],
  });
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (evento) {
      setFormData({
        nombre: evento.nombre,
        lugar: evento.lugar,
        descripcion: evento.descripcion,
        fecha_hora_inicio: formatDateTimeForInput(evento.fecha_hora_inicio),
        fecha_hora_fin: formatDateTimeForInput(evento.fecha_hora_fin),
        es_voluntariado: evento.es_voluntariado,
        requiere_inscripcion: evento.requiere_inscripcion,
        archivos: [] as File[],
      });
    } else {
      setFormData({
        nombre: '',
        lugar: '',
        descripcion: '',
        fecha_hora_inicio: '',
        fecha_hora_fin: '',
        es_voluntariado: false,
        requiere_inscripcion: false,
        archivos: [] as File[],
      });
    }
  }, [evento]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      if (name === 'es_voluntariado') {
        setFormData(prev => ({
          ...prev,
          es_voluntariado: checked,
          requiere_inscripcion: checked ? true : false,
        }));
      }
    } else if (type === 'file') {
      const files = (e.target as HTMLInputElement).files;
      setFormData(prev => ({ ...prev, archivos: files ? Array.from(files) : [] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validación de fechas
    if (!formData.fecha_hora_inicio || !formData.fecha_hora_fin) {
      setError('Las fechas de inicio y fin son obligatorias.');
      return;
    }
    if (new Date(formData.fecha_hora_fin) <= new Date(formData.fecha_hora_inicio)) {
      setError('La fecha de fin debe ser posterior a la fecha de inicio.');
      return;
    }

    // Si es voluntariado, requiere inscripción es true
    const payload: EventoRefugioPayload = {
      ...formData,
      requiere_inscripcion: formData.es_voluntariado ? true : formData.requiere_inscripcion,
    };
    onSave(payload);
  };

  return (
    <div className="necesidad-modal-overlay"> {/* Estilo reutilizado de Necesidades */}
      <div className="necesidad-modal-content"> {/* Estilo reutilizado de Necesidades */}
        <h2>{evento ? 'Editar Evento' : 'Crear Nuevo Evento'}</h2>
        <form onSubmit={handleSubmit} className="necesidad-form"> {/* Estilo reutilizado de Necesidades */}
          
          <div className="form-group">
            <label htmlFor="nombre">Nombre del Evento</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lugar">Lugar (Dirección)</label>
            <input
              type="text"
              id="lugar"
              name="lugar"
              value={formData.lugar}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fecha_hora_inicio">Fecha y Hora de Inicio</label>
              <input
                type="datetime-local"
                id="fecha_hora_inicio"
                name="fecha_hora_inicio"
                value={formData.fecha_hora_inicio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fecha_hora_fin">Fecha y Hora de Fin</label>
              <input
                type="datetime-local"
                id="fecha_hora_fin"
                name="fecha_hora_fin"
                value={formData.fecha_hora_fin}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Switch único de voluntariado */}
          <div className="form-group form-switch-group">
            <input
              type="checkbox"
              id="es_voluntariado"
              name="es_voluntariado"
              className="form-switch"
              checked={formData.es_voluntariado}
              onChange={handleChange}
            />
            <label htmlFor="es_voluntariado" style={{marginBottom:0, marginLeft:8, fontWeight:500}}>Voluntariado</label>
            <span className={`switch-status${formData.es_voluntariado ? ' active' : ''}`}>{formData.es_voluntariado ? 'Activo' : 'Inactivo'}</span>
          </div>

          {/* Campo para fotos y videos */}
          <div className="form-group">
            <label htmlFor="archivos">Fotos y/o Videos</label>
            <input
              type="file"
              id="archivos"
              name="archivos"
              accept="image/*,video/*"
              multiple
              onChange={handleChange}
            />
            {formData.archivos && formData.archivos.length > 0 && (
              <ul style={{marginTop: 8}}>
                {formData.archivos.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>

          {error && <p className="form-error-message">{error}</p>}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancelar</button>
            <button type="submit" className="btn btn-primary">{evento ? 'Actualizar' : 'Crear'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventoForm;