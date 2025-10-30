import React, { useState } from 'react';
import EventoCard from './EventoCard';

type Evento = {
  id: number;
  nombre: string;
  refugio: string;
  fecha: string;
  imagen: string;
  descripcion?: string;
  fotos?: string[];
  inscribible: boolean;
  region?: string;
  tipo?: string;
};
// Mock de eventos, en el futuro se obtendrán del backend
const eventos: Evento[] = [
  {
    id: 1,
    nombre: 'Jornada de Adopción',
    refugio: 'Refugio Esperanza',
    fecha: '2025-11-05',
    imagen: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80',
    descripcion: 'Ven a conocer a nuestros animales y ayúdanos a encontrarles un hogar. Habrá actividades, charlas y adopciones responsables.',
    fotos: [
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    ],
    inscribible: true,
    region: 'Metropolitana',
    tipo: 'Adopción',
  },
  {
    id: 2,
    nombre: 'Campaña de Vacunación',
    refugio: 'Refugio Patitas',
    fecha: '2025-11-12',
    imagen: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=400&q=80',
    descripcion: 'Vacunación gratuita para animales rescatados y de familias vulnerables. ¡Protege a tu mascota!',
    fotos: [
      'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1518715308788-3005759c61d4?auto=format&fit=crop&w=400&q=80',
    ],
    inscribible: false,
    region: 'Valparaíso',
    tipo: 'Vacunación',
  },
];

const regiones = ['Todas', 'Metropolitana', 'Valparaíso', 'Biobío', 'Araucanía'];
const tipos = ['Adopción', 'Vacunación', 'Charlas', 'Rescate', 'Difusión', 'Campaña', 'Otro'];


const getRefugios = () => {
  const set = new Set<string>();
  eventos.forEach(e => set.add(e.refugio));
  return Array.from(set);
};

const EventosPage: React.FC = () => {
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null);
  const [regionFiltro, setRegionFiltro] = useState('Todas');
  const [tipoFiltro, setTipoFiltro] = useState<string[]>([]);
  const [refugioFiltro, setRefugioFiltro] = useState('Todos');
  const [nombreFiltro, setNombreFiltro] = useState('');

  const refugios = ['Todos', ...getRefugios()];

  const eventosFiltrados = eventos.filter(e =>
    (regionFiltro === 'Todas' || e.region === regionFiltro) &&
    (refugioFiltro === 'Todos' || e.refugio === refugioFiltro) &&
    (nombreFiltro === '' || e.nombre.toLowerCase().includes(nombreFiltro.toLowerCase())) &&
    (tipoFiltro.length === 0 || tipoFiltro.includes(e.tipo || ''))
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '24px', display: 'flex', gap: '32px' }}>
      {/* Filtros laterales */}
      <aside style={{ minWidth: '260px', background: '#eaffea', borderRadius: '14px', boxShadow: '0 1px 8px #43ea6b22', padding: '24px', height: 'fit-content' }}>
        <h3 style={{ color: '#145214', marginBottom: '18px', fontSize: '1.12rem' }}>Filtrar eventos</h3>
        <div style={{ marginBottom: '18px' }}>
          <label style={{ color: '#145214', fontWeight: 500 }}>Región:</label><br />
          <select value={regionFiltro} onChange={e => setRegionFiltro(e.target.value)} style={{ width: '100%', padding: '6px 12px', borderRadius: 6, border: '1px solid #b2e2c9', marginTop: 4 }}>
            {regiones.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: '18px' }}>
          <label style={{ color: '#145214', fontWeight: 500 }}>Refugio:</label><br />
          <select value={refugioFiltro} onChange={e => setRefugioFiltro(e.target.value)} style={{ width: '100%', padding: '6px 12px', borderRadius: 6, border: '1px solid #b2e2c9', marginTop: 4 }}>
            {refugios.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: '18px' }}>
          <label style={{ color: '#145214', fontWeight: 500 }}>Nombre de evento:</label><br />
          <input type="text" value={nombreFiltro} onChange={e => setNombreFiltro(e.target.value)} placeholder="Buscar..." style={{ width: '100%', padding: '6px 12px', borderRadius: 6, border: '1px solid #b2e2c9', marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: '18px' }}>
          <label style={{ color: '#145214', fontWeight: 500 }}>Tipo de evento:</label><br />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
            {tipos.map(t => (
              <label key={t} style={{ color: '#228B22', fontWeight: 400 }}>
                <input
                  type="checkbox"
                  checked={tipoFiltro.includes(t)}
                  onChange={e => {
                    if (e.target.checked) {
                      setTipoFiltro([...tipoFiltro, t]);
                    } else {
                      setTipoFiltro(tipoFiltro.filter(tipo => tipo !== t));
                    }
                  }}
                  style={{ marginRight: 6 }}
                />
                {t}
              </label>
            ))}
          </div>
        </div>
      </aside>
      {/* Tarjetas de eventos */}
      <div style={{ flex: 1, display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {eventosFiltrados.map(evento => (
          <EventoCard key={evento.id} evento={evento} onClick={() => setEventoSeleccionado(evento)} />
        ))}
      </div>

      {eventoSeleccionado && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setEventoSeleccionado(null)}>
          <div style={{ background: '#fff', borderRadius: 18, maxWidth: 500, width: '90vw', padding: 32, boxShadow: '0 2px 24px #43ea6b44', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setEventoSeleccionado(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: '1.5rem', color: '#145214', cursor: 'pointer' }}>×</button>
            <h2 style={{ color: '#145214', marginBottom: 10 }}>{eventoSeleccionado.nombre}</h2>
            <div style={{ color: '#228B22', fontWeight: 500, marginBottom: 6 }}>Refugio: {eventoSeleccionado.refugio}</div>
            <div style={{ color: '#228B22', fontSize: '0.98rem', marginBottom: 12 }}>{eventoSeleccionado.fecha}</div>
            <div style={{ marginBottom: 14 }}>
              <img src={eventoSeleccionado.imagen} alt={eventoSeleccionado.nombre} style={{ width: '100%', borderRadius: 12, maxHeight: 180, objectFit: 'cover' }} />
            </div>
            {eventoSeleccionado.descripcion && (
              <div style={{ color: '#145214', marginBottom: 12 }}>{eventoSeleccionado.descripcion}</div>
            )}
            {eventoSeleccionado.fotos && eventoSeleccionado.fotos.length > 1 && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {eventoSeleccionado.fotos.map((foto, idx) => (
                  <img key={idx} src={foto} alt={`foto-${idx}`} style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 8, border: '2px solid #b2e2c9' }} />
                ))}
              </div>
            )}
            {eventoSeleccionado.inscribible ? (
              <button style={{ background: '#43ea6b', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontSize: '1rem' }}>
                Inscribirse
              </button>
            ) : (
              <div style={{ color: '#b2e2c9', fontWeight: 500, fontSize: '0.98rem' }}>No requiere inscripción</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventosPage;
