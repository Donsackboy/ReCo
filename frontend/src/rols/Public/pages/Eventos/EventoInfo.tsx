import React from 'react';
import { Evento } from './types';

interface EventoInfoProps {
  evento: Evento;
  onClose: () => void;
}

const EventoInfo: React.FC<EventoInfoProps> = ({ evento, onClose }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
    <div style={{ background: '#fff', borderRadius: 18, maxWidth: 500, width: '90vw', padding: 32, boxShadow: '0 2px 24px #43ea6b44', position: 'relative' }} onClick={e => e.stopPropagation()}>
      <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: '1.5rem', color: '#145214', cursor: 'pointer' }}>×</button>
      <h2 style={{ color: '#145214', marginBottom: 10 }}>{evento.nombre}</h2>
      <div style={{ color: '#228B22', fontWeight: 500, marginBottom: 6 }}>Refugio: {evento.refugio}</div>
      <div style={{ color: '#228B22', fontSize: '0.98rem', marginBottom: 12 }}>{evento.fecha}</div>
      <div style={{ color: '#b2e2c9', fontWeight: 500, fontSize: '0.98rem', marginBottom: 12 }}>{evento.region} • {evento.tipo}</div>
      <div style={{ marginBottom: 14 }}>
        <img src={evento.imagen} alt={evento.nombre} style={{ width: '100%', borderRadius: 12, maxHeight: 180, objectFit: 'cover' }} />
      </div>
      {evento.descripcion && (
        <div style={{ color: '#145214', marginBottom: 12 }}>{evento.descripcion}</div>
      )}
      {evento.fotos && evento.fotos.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {evento.fotos.map((foto, idx) => (
            <img key={idx} src={foto} alt={`foto-${idx}`} style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 8, border: '2px solid #b2e2c9' }} />
          ))}
        </div>
      )}
      {evento.inscribible ? (
        <button style={{ background: '#43ea6b', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontSize: '1rem' }}>
          Inscribirse
        </button>
      ) : (
        <div style={{ color: '#b2e2c9', fontWeight: 500, fontSize: '0.98rem' }}>No requiere inscripción</div>
      )}
    </div>
  </div>
);

export default EventoInfo;
