import React, { useEffect, useMemo, useState } from 'react';
import EventoCard from './EventoCard';
import type { Evento } from './types';
import { getEventosPublicos, inscribirseEnEvento } from '../../../../api';
import LoginModal from '../../components/Header/LoginModal';

const PLACEHOLDER_IMAGEN = 'https://images.unsplash.com/photo-1507149833265-60c372daea22?auto=format&fit=crop&w=800&q=80';

const formatFecha = (inicio: string, fin?: string) => {
  const fechaInicio = new Date(inicio);
  const fechaFin = fin ? new Date(fin) : null;

  if (Number.isNaN(fechaInicio.getTime())) {
    return 'Fecha por confirmar';
  }

  const opciones: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  const inicioFmt = fechaInicio.toLocaleString('es-CL', opciones);

  if (!fechaFin || Number.isNaN(fechaFin.getTime())) {
    return inicioFmt;
  }

  const mismoDia = fechaInicio.toDateString() === fechaFin.toDateString();

  if (mismoDia) {
    const finFmt = fechaFin.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    return `${inicioFmt} – ${finFmt}`;
  }

  const finFmt = fechaFin.toLocaleString('es-CL', opciones);
  return `${inicioFmt} / ${finFmt}`;
};

const normalizeText = (value?: string | null) => (value ? value.trim() : '');

interface EventoPublic {
  id_evento: number;
  nombre: string;
  descripcion?: string | null;
  lugar?: string | null;
  fecha_hora_inicio?: string | null;
  fecha_hora_fin?: string | null;
  es_voluntariado?: boolean | null;
  requiere_inscripcion?: boolean | null;
  refugio?: {
    id?: number | null;
    nombre?: string | null;
    region?: string | null;
  } | null;
  archivos?: Array<{
    id?: number;
    archivo?: string | null;
    tipo?: string | null;
  }>;
}

const mapEventoPublico = (evento: EventoPublic): Evento => {
  const archivos = Array.isArray(evento.archivos) ? evento.archivos : [];
  const fotoPrincipal = archivos.find(archivo => normalizeText(archivo?.tipo) === 'foto')?.archivo;
  const fotos = archivos
    .map(archivo => archivo?.archivo)
    .filter((url): url is string => Boolean(url));

  const refugioNombre = normalizeText(evento.refugio?.nombre) || 'Refugio';
  const region = normalizeText(evento.refugio?.region) || 'Sin región';
  const tipo = (evento.es_voluntariado ?? false) ? 'Voluntariado' : 'Actividad';
  const inicio = evento.fecha_hora_inicio ?? '';
  const fin = evento.fecha_hora_fin ?? evento.fecha_hora_inicio ?? '';

  return {
    id: evento.id_evento,
    nombre: evento.nombre,
    refugio: refugioNombre,
    fecha: formatFecha(inicio, fin),
    imagen: fotoPrincipal || fotos[0] || PLACEHOLDER_IMAGEN,
    descripcion: evento.descripcion || undefined,
    fotos: fotos.length > 0 ? fotos : undefined,
    inscribible: Boolean(evento.requiere_inscripcion),
    region,
    tipo,
  };
};

const EventosPage: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null);
  const [regionFiltro, setRegionFiltro] = useState('Todas');
  const [tipoFiltro, setTipoFiltro] = useState<string[]>([]);
  const [refugioFiltro, setRefugioFiltro] = useState('Todos');
  const [nombreFiltro, setNombreFiltro] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [eventoPendienteInscripcion, setEventoPendienteInscripcion] = useState<Evento | null>(null);
  const [inscripcionMensaje, setInscripcionMensaje] = useState<string | null>(null);
  const [inscripcionError, setInscripcionError] = useState<string | null>(null);
  const [inscribiendoId, setInscribiendoId] = useState<number | null>(null);
  const [inscritosTotales, setInscritosTotales] = useState<number | null>(null);
  const [eventosInscritos, setEventosInscritos] = useState<number[]>([]);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setLoading(true);
        const data = await getEventosPublicos({ upcoming: 'true' });
        const mapped = Array.isArray(data) ? data.map(mapEventoPublico) : [];
        setEventos(mapped);
        setError(null);
      } catch (err) {
        console.error('Error al obtener eventos públicos:', err);
        setError('No pudimos cargar los eventos. Intenta nuevamente más tarde.');
        setEventos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  useEffect(() => {
    setInscripcionMensaje(null);
    setInscripcionError(null);
    setInscritosTotales(null);
  }, [eventoSeleccionado?.id]);

  const regiones = useMemo(() => {
    const values = new Set<string>();
    eventos.forEach(evento => {
      if (evento.region) {
        values.add(evento.region);
      }
    });
    return ['Todas', ...Array.from(values).sort()];
  }, [eventos]);

  const tiposDisponibles = useMemo(() => {
    const values = new Set<string>();
    eventos.forEach(evento => {
      if (evento.tipo) {
        values.add(evento.tipo);
      }
    });
    return Array.from(values).sort();
  }, [eventos]);

  const refugios = useMemo(() => {
    const values = new Set<string>();
    eventos.forEach(evento => {
      if (evento.refugio) {
        values.add(evento.refugio);
      }
    });
    return ['Todos', ...Array.from(values).sort()];
  }, [eventos]);

  const eventosFiltrados = useMemo(() => (
    eventos.filter(evento =>
      (regionFiltro === 'Todas' || evento.region === regionFiltro) &&
      (refugioFiltro === 'Todos' || evento.refugio === refugioFiltro) &&
      (nombreFiltro === '' || evento.nombre.toLowerCase().includes(nombreFiltro.toLowerCase())) &&
      (tipoFiltro.length === 0 || (evento.tipo && tipoFiltro.includes(evento.tipo)))
    )
  ), [eventos, regionFiltro, refugioFiltro, nombreFiltro, tipoFiltro]);

  const intentarInscripcion = async (evento: Evento) => {
    const token = localStorage.getItem('token');

    if (!token) {
      setEventoPendienteInscripcion(evento);
      setShowLoginModal(true);
      return;
    }

    try {
      setInscribiendoId(evento.id);
      setInscripcionMensaje(null);
      setInscripcionError(null);
      const data = await inscribirseEnEvento(evento.id, token);

      setEventosInscritos(prev => (
        prev.includes(evento.id) ? prev : [...prev, evento.id]
      ));

      if (typeof data?.inscritos_total === 'number') {
        setInscritosTotales(data.inscritos_total);
      } else {
        setInscritosTotales(null);
      }

      setInscripcionMensaje(data?.detail ?? 'Inscripción registrada con éxito.');
    } catch (err) {
      const status = typeof err === 'object' && err !== null && 'status' in err ? (err as { status?: number }).status : undefined;
      const message = err instanceof Error ? err.message : 'No pudimos completar la inscripción. Intenta nuevamente.';

      if (status === 400 || status === 409) {
        setEventosInscritos(prev => (
          prev.includes(evento.id) ? prev : [...prev, evento.id]
        ));
        setInscripcionMensaje(message);
        setInscripcionError(null);
        return;
      }

      if (status === 401) {
        localStorage.removeItem('token');
        setEventoPendienteInscripcion(evento);
        setShowLoginModal(true);
        setInscripcionMensaje(null);
        setInscripcionError(null);
        return;
      }

      setInscripcionError(message);
    } finally {
      setInscribiendoId(null);
    }
  };

  const handleInscribirseClick = (evento: Evento) => {
    if (eventosInscritos.includes(evento.id)) {
      setInscripcionMensaje('Ya estás inscrito en este evento.');
      setInscripcionError(null);
      return;
    }
    intentarInscripcion(evento);
  };

  const handleLoginSuccess = () => {
    if (eventoPendienteInscripcion) {
      const eventoAInscribir = eventoPendienteInscripcion;
      setEventoPendienteInscripcion(null);
      intentarInscripcion(eventoAInscribir);
    }
  };

  const cerrarLoginModal = () => {
    setShowLoginModal(false);
    setEventoPendienteInscripcion(null);
  };

  const yaInscrito = eventoSeleccionado ? eventosInscritos.includes(eventoSeleccionado.id) : false;
  const inscripcionEnProceso = eventoSeleccionado ? inscribiendoId === eventoSeleccionado.id : false;

  const renderContenido = () => {
    if (loading) {
      return <p style={{ color: '#145214', fontWeight: 600 }}>Cargando eventos...</p>;
    }

    if (error) {
      return <p style={{ color: '#c62828', fontWeight: 600 }}>{error}</p>;
    }

    if (eventosFiltrados.length === 0) {
      return <p style={{ color: '#145214', fontWeight: 600 }}>No encontramos eventos con los filtros seleccionados.</p>;
    }

    return eventosFiltrados.map(evento => (
      <EventoCard key={evento.id} evento={evento} onClick={() => setEventoSeleccionado(evento)} />
    ));
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '24px', display: 'flex', gap: '32px' }}>
      {/* Filtros laterales */}
      <aside style={{ minWidth: '260px', background: '#eaffea', borderRadius: '14px', boxShadow: '0 1px 8px #43ea6b22', padding: '24px', height: 'fit-content' }}>
        <h3 style={{ color: '#145214', marginBottom: '18px', fontSize: '1.12rem' }}>Filtrar eventos</h3>
        <div style={{ marginBottom: '18px' }}>
          <label style={{ color: '#145214', fontWeight: 500 }}>Región:</label><br />
          <select value={regionFiltro} onChange={e => setRegionFiltro(e.target.value)} style={{ width: '100%', padding: '6px 12px', borderRadius: 6, border: '1px solid #b2e2c9', marginTop: 4 }}>
            {regiones.map(region => <option key={region} value={region}>{region}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: '18px' }}>
          <label style={{ color: '#145214', fontWeight: 500 }}>Refugio:</label><br />
          <select value={refugioFiltro} onChange={e => setRefugioFiltro(e.target.value)} style={{ width: '100%', padding: '6px 12px', borderRadius: 6, border: '1px solid #b2e2c9', marginTop: 4 }}>
            {refugios.map(refugio => <option key={refugio} value={refugio}>{refugio}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: '18px' }}>
          <label style={{ color: '#145214', fontWeight: 500 }}>Nombre de evento:</label><br />
          <input type="text" value={nombreFiltro} onChange={e => setNombreFiltro(e.target.value)} placeholder="Buscar..." style={{ width: '100%', padding: '6px 12px', borderRadius: 6, border: '1px solid #b2e2c9', marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: '18px' }}>
          <label style={{ color: '#145214', fontWeight: 500 }}>Tipo de evento:</label><br />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
            {tiposDisponibles.length === 0 ? (
              <span style={{ color: '#228B22', fontSize: '0.9rem' }}>Sin tipos disponibles</span>
            ) : (
              tiposDisponibles.map(tipo => (
                <label key={tipo} style={{ color: '#228B22', fontWeight: 400 }}>
                  <input
                    type="checkbox"
                    checked={tipoFiltro.includes(tipo)}
                    onChange={e => {
                      if (e.target.checked) {
                        setTipoFiltro(prev => [...prev, tipo]);
                      } else {
                        setTipoFiltro(prev => prev.filter(valor => valor !== tipo));
                      }
                    }}
                    style={{ marginRight: 6 }}
                  />
                  {tipo}
                </label>
              ))
            )}
          </div>
        </div>
      </aside>
      {/* Tarjetas de eventos */}
      <div style={{ flex: 1, display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {renderContenido()}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {inscripcionMensaje && (
                  <div style={{ color: '#145214', background: '#eaffea', borderRadius: 8, padding: '10px 12px', fontWeight: 500 }}>
                    {inscripcionMensaje}
                  </div>
                )}
                {inscripcionError && (
                  <div style={{ color: '#c62828', background: '#ffe6e6', borderRadius: 8, padding: '10px 12px', fontWeight: 500 }}>
                    {inscripcionError}
                  </div>
                )}
                {typeof inscritosTotales === 'number' && (
                  <div style={{ color: '#228B22', fontWeight: 500 }}>
                    Personas inscritas: {inscritosTotales}
                  </div>
                )}
                <button
                  onClick={() => handleInscribirseClick(eventoSeleccionado)}
                  disabled={inscripcionEnProceso || yaInscrito}
                  style={{
                    background: yaInscrito ? '#b2e2c9' : '#43ea6b',
                    color: '#fff',
                    fontWeight: 700,
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 24px',
                    cursor: inscripcionEnProceso || yaInscrito ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                    transition: 'background 0.2s ease',
                  }}
                >
                  {inscripcionEnProceso ? 'Inscribiendo...' : yaInscrito ? 'Ya inscrito' : 'Inscribirme'}
                </button>
              </div>
            ) : (
              <div style={{ color: '#b2e2c9', fontWeight: 500, fontSize: '0.98rem' }}>No requiere inscripción</div>
            )}
          </div>
        </div>
      )}
      <LoginModal
        isOpen={showLoginModal}
        onClose={cerrarLoginModal}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default EventosPage;
