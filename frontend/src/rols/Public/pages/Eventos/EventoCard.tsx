import React from 'react';
import type { Evento } from './types';

interface EventoCardProps {
  evento: Evento;
  onClick: (evento: Evento) => void;
}

const EventoCard: React.FC<EventoCardProps> = ({ evento, onClick }) => (
  <div
    style={{
      background: '#f0fff4',
      borderRadius: '16px',
      boxShadow: '0 2px 12px #43ea6b22',
      width: '320px',
      padding: '0 0 18px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'box-shadow 0.2s',
    }}
    onClick={() => onClick(evento)}
  >
    <img
      src={evento.imagen}
      alt={evento.nombre}
      style={{
        width: '100%',
        height: '180px',
        objectFit: 'cover',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
      }}
    />
    <div style={{ padding: '16px', width: '100%' }}>
      <h3 style={{ color: '#145214', marginBottom: '8px', fontSize: '1.18rem' }}>{evento.nombre}</h3>
      <div style={{ color: '#228B22', fontWeight: 500, marginBottom: '6px' }}>Refugio: {evento.refugio}</div>
      <div style={{ color: '#228B22', fontSize: '0.98rem', marginBottom: '12px' }}>{evento.fecha}</div>
      <div style={{ color: '#b2e2c9', fontWeight: 500, fontSize: '0.98rem' }}>{evento.region} • {evento.tipo}</div>
    </div>
  </div>
);

export default EventoCard;
