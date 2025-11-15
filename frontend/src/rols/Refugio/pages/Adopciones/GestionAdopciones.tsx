import React, { useEffect, useState } from 'react';
import './GestionAdopciones.css';
import { preguntasAdopcion } from '../../../../utils/preguntasAdopcion';

interface SolicitudAdopcion {
  id_solicitud: number;
  animal: string;
  animal_nombre?: string;
  estado: string;
  fecha_solicitud: string;
  nombre: string;
  direccion: string;
  fecha_nacimiento: string;
  telefono: string;
  email: string;
  rol_familia: string;
  respuestas: string[];
  anotaciones?: string | null;
  usuario: number;
  foto_animal?: string;
  foto_principal?: string;
}

// Usamos preguntasAdopcion del archivo utils

const estadoColor: Record<string, string> = {
  pendiente: '#ffa726',
  aceptada: '#4caf50',
  rechazada: '#f44336',
};

const GestionAdopciones: React.FC = () => {
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [historial, setHistorial] = useState<SolicitudAdopcion[]>([]);
  const [adopciones, setAdopciones] = useState<SolicitudAdopcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [detalle, setDetalle] = useState<SolicitudAdopcion | null>(null);
  const [anotacionesEdit, setAnotacionesEdit] = useState<string>("");
  const [estadoNuevo, setEstadoNuevo] = useState<string>('');
  const [actualizando, setActualizando] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    let interval: number;

    const fetchAdopciones = () => {
      if (token) {
        fetch(`${import.meta.env.VITE_API_BASE}/refugio/solicitudes-adopcion-pendientes/`, {
          headers: { 'Authorization': `Token ${token}` },
        })
          .then(async res => {
            if (!res.ok) throw new Error('Error al obtener adopciones');
            return res.json();
          })
          .then(data => {
            setAdopciones(Array.isArray(data) ? data : data.results || []);
            setLoading(false);
          })
          .catch(() => {
            setAdopciones([]);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    };

    const fetchHistorial = () => {
      if (token) {
        fetch(`${import.meta.env.VITE_API_BASE}/refugio/historial-solicitudes-adopcion/`, {
          headers: { 'Authorization': `Token ${token}` },
        })
          .then(async res => {
            if (!res.ok) throw new Error('Error al obtener historial');
            return res.json();
          })
          .then(data => {
            setHistorial(Array.isArray(data) ? data : data.results || []);
          })
          .catch(() => {
            setHistorial([]);
          });
      }
    };

    (window as any).fetchHistorial = fetchHistorial;
    fetchAdopciones();
    fetchHistorial();

    interval = window.setInterval(() => {
      fetchAdopciones();
      if (mostrarHistorial) fetchHistorial();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleVerDetalle = (solicitud: SolicitudAdopcion) => {
    setDetalle(solicitud);
    setEstadoNuevo(solicitud.estado);
    setAnotacionesEdit(solicitud.anotaciones || "");
  };

  const handleCerrarDetalle = () => {
    setDetalle(null);
    setEstadoNuevo('');
  };

  const handleCambiarEstado = async () => {
    if (!detalle) return;
    setActualizando(true);
    const token = localStorage.getItem('token');
    await fetch(`${import.meta.env.VITE_API_BASE}/refugio/solicitud-adopcion/${detalle.id_solicitud}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify({ estado: estadoNuevo, anotaciones: anotacionesEdit }),
    });
    setActualizando(false);
    setDetalle({ ...detalle, estado: estadoNuevo, anotaciones: anotacionesEdit });
    setAdopciones(prev => prev.map(s =>
      s.id_solicitud === detalle.id_solicitud
        ? { ...s, estado: estadoNuevo, anotaciones: anotacionesEdit }
        : s
    ));
    if (mostrarHistorial && typeof (window as any).fetchHistorial === 'function') {
      (window as any).fetchHistorial();
    }
  };

  return (
    <div className="gestion-adopciones">
      <div className="header-adopciones">
        <h1 className="titulo">Gestión de Adopciones</h1>

        <div className="botones-toggle">
          <button
            className={`boton-toggle ${!mostrarHistorial ? 'activo' : ''}`}
            onClick={() => setMostrarHistorial(false)}
          >
            Pendientes
          </button>
          <button
            className={`boton-toggle ${mostrarHistorial ? 'activo' : ''}`}
            onClick={() => setMostrarHistorial(true)}
          >
            Historial
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : mostrarHistorial ? (
        historial.length === 0 ? (
          <div className="mensaje-vacio">
            <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="Sin historial" />
            <h2>No hay historial de solicitudes</h2>
          </div>
        ) : (
          <div className="grid-solicitudes">
            {historial.map(solicitud => (
              <div key={solicitud.id_solicitud} className="tarjeta-solicitud tarjeta-flex">
                <div className="foto-animal-wrapper">
                  <img
                    src={solicitud.foto_principal || solicitud.foto_animal || 'https://cdn-icons-png.flaticon.com/512/616/616408.png'}
                    alt="Animal"
                    className="foto-animal"
                  />
                </div>
                <div className="contenido-solicitud">
                  <span className="estado" style={{ background: estadoColor[solicitud.estado] }}>
                    {solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1)}
                  </span>
                  <div className="animal-nombre">🐾 {solicitud.animal_nombre}</div>
                  <div><strong>Solicitante:</strong> {solicitud.nombre}</div>
                  <div><strong>Fecha:</strong> {new Date(solicitud.fecha_solicitud).toLocaleString()}</div>
                  <button className="boton-ver" style={{ fontSize: '0.92rem', padding: '6px 14px', alignSelf: 'flex-start', marginTop: '8px', marginLeft: '0' }} onClick={() => handleVerDetalle(solicitud)}>Ver detalles</button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : adopciones.length === 0 ? (
        <div className="mensaje-vacio">
          <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="Bandeja vacía" />
          <h2>No hay solicitudes pendientes</h2>
        </div>
      ) : (
        <div className="grid-solicitudes">
            {adopciones.map(solicitud => (
              <div key={solicitud.id_solicitud} className="tarjeta-solicitud tarjeta-flex">
                <div className="foto-animal-wrapper">
                  <img
                    src={solicitud.foto_principal || solicitud.foto_animal || 'https://cdn-icons-png.flaticon.com/512/616/616408.png'}
                    alt="Animal"
                    className="foto-animal"
                  />
                </div>
                <div className="contenido-solicitud">
                  <span className="estado" style={{ background: estadoColor[solicitud.estado] }}>
                    {solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1)}
                  </span>
                  <div className="animal-nombre">🐾 {solicitud.animal_nombre}</div>
                  <div><strong>Solicitante:</strong> {solicitud.nombre}</div>
                  <div><strong>Fecha:</strong> {new Date(solicitud.fecha_solicitud).toLocaleString()}</div>
                  <button className="boton-ver" style={{ fontSize: '0.92rem', padding: '6px 14px', alignSelf: 'flex-start', marginTop: '8px', marginLeft: '0' }} onClick={() => handleVerDetalle(solicitud)}>Ver detalles</button>
                </div>
              </div>
          ))}
        </div>
      )}

      {detalle && (
        <div className="modal-fondo">
          <div className="modal-detalle" style={{ maxWidth: '1000px', width: '100%' }}>
            <button className="boton-cerrar" onClick={handleCerrarDetalle}>×</button>
            <h2 style={{ color: '#2e7d32', fontWeight: 800, marginBottom: '1.2rem', textAlign: 'center' }}>
              Formulario de adopción de {detalle.animal_nombre || 'animal'}
            </h2>

            <div style={{ display: 'flex', gap: '2.2rem', alignItems: 'flex-start', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
              <div className="detalle-info" style={{ background: '#f4f8f4', borderRadius: '12px', padding: '1rem 1.2rem', boxShadow: '0 1px 4px rgba(46,125,50,0.07)', minWidth: '260px', flex: '1 1 320px' }}>
                <div><span style={{ fontWeight: 600 }}>Solicitante:</span> {detalle.nombre}</div>
                <div><span style={{ fontWeight: 600 }}>Dirección:</span> {detalle.direccion}</div>
                <div><span style={{ fontWeight: 600 }}>Fecha nacimiento:</span> {detalle.fecha_nacimiento}</div>
                <div><span style={{ fontWeight: 600 }}>Teléfono:</span> {detalle.telefono}</div>
                <div><span style={{ fontWeight: 600 }}>Email:</span> {detalle.email}</div>
                <div><span style={{ fontWeight: 600 }}>Rol familia:</span> {detalle.rol_familia}</div>
                <div><span style={{ fontWeight: 600 }}>Estado:</span> <span style={{ color: estadoColor[detalle.estado], fontWeight: 700 }}>{detalle.estado}</span></div>
              </div>
              <div style={{ textAlign: 'center', flex: '0 0 220px', minWidth: '180px' }}>
                <img src={detalle.foto_principal || detalle.foto_animal || 'https://cdn-icons-png.flaticon.com/512/616/616408.png'} alt="Animal" style={{ maxWidth: '180px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(46,125,50,0.12)' }} />
                <div style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '0.7rem', color: '#2e7d32' }}>🐾 {detalle.animal_nombre}</div>
              </div>
            </div>

            <div className="detalle-respuestas" style={{ marginBottom: '1.2rem' }}>
              <h4 style={{ color: '#388e3c', fontWeight: 700, marginBottom: '0.7rem' }}>Respuestas del formulario</h4>
              <ul style={{ paddingLeft: 0, margin: 0 }}>
                {detalle.respuestas.map((r, i) => (
                  <li key={i} style={{ marginBottom: '1.2rem', borderRadius: '12px', boxShadow: '0 1px 6px rgba(46,125,50,0.09)', background: '#eafbe7', padding: '0.8rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ background: '#a5d6a7', borderRadius: '8px', padding: '0.6rem 1rem', fontWeight: 700, color: '#205c20', fontSize: '1.11rem', letterSpacing: '0.01em', boxShadow: '0 1px 4px rgba(46,125,50,0.07)' }}>
                      {preguntasAdopcion[i] || `Pregunta ${i + 1}`}
                    </div>
                    <div style={{ background: '#fff', borderRadius: '8px', padding: '0.6rem 1rem', fontWeight: 500, color: '#388e3c', fontSize: '1.01rem', marginTop: '0.2rem', border: '1px solid #e0e0e0' }}>
                      {r}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="detalle-anotaciones" style={{ marginBottom: '1.2rem' }}>
              <strong style={{ color: '#388e3c' }}>Anotaciones:</strong>
              <textarea
                value={anotacionesEdit}
                onChange={e => setAnotacionesEdit(e.target.value)}
                rows={3}
                placeholder="Agrega anotaciones..."
                style={{ width: '100%', marginTop: '0.5rem', padding: '0.6rem', borderRadius: '8px', border: '1px solid #b2dfdb', fontSize: '1rem', background: '#f9fdf9' }}
              />
            </div>

            <div className="detalle-acciones" style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <select value={estadoNuevo} onChange={e => setEstadoNuevo(e.target.value)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #43a047', fontWeight: 600 }}>
                <option value="pendiente">Pendiente</option>
                <option value="aceptada">Aceptada</option>
                <option value="rechazada">Rechazada</option>
              </select>
              <button onClick={handleCambiarEstado} disabled={actualizando} style={{ background: '#43a047', color: '#fff', borderRadius: '8px', padding: '0.5rem 1.2rem', fontWeight: 600, border: 'none', transition: 'background 0.3s' }}>
                {actualizando ? 'Actualizando...' : 'Guardar'}
              </button>
              <button className="btn-secundario" onClick={handleCerrarDetalle} style={{ background: '#e0e0e0', color: '#333', borderRadius: '8px', padding: '0.5rem 1.2rem', fontWeight: 600, border: 'none' }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionAdopciones;
