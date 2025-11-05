
import React, { useEffect, useState } from 'react';

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
}

// Array fijo de preguntas estándar para el formulario de adopción
const preguntasFormulario = [
  "¿Por qué quieres adoptar?",
  "¿Quién vivirá con el animal?",
  "¿Tienes otras mascotas?",
  "¿Tipo de vivienda?",
  "¿Experiencia previa con animales?",
  "¿Disponibilidad de tiempo para el animal?",
  "¿Qué harías si el animal se enferma?",
  "¿Qué harías si tienes que mudarte?",
  "¿Cómo planeas educar al animal?",
  "¿Qué harías si el animal tiene problemas de comportamiento?",
];

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
    // Guardar referencia para usar en handleCambiarEstado
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
    // Actualizar historial inmediatamente si está visible
    if (mostrarHistorial && typeof (window as any).fetchHistorial === 'function') {
      (window as any).fetchHistorial();
    }
  };

  return (
    <div>
      <h1 style={{ color: '#228B22', fontWeight: 800, fontSize: 32, marginBottom: 18 }}>Adopciones</h1>
      <div style={{ marginBottom: 18 }}>
        <button
          style={{ marginRight: 12, background: mostrarHistorial ? '#eee' : '#228B22', color: mostrarHistorial ? '#333' : '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}
          onClick={() => setMostrarHistorial(false)}
        >Pendientes</button>
        <button
          style={{ background: mostrarHistorial ? '#228B22' : '#eee', color: mostrarHistorial ? '#fff' : '#333', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}
          onClick={() => setMostrarHistorial(true)}
        >Historial</button>
      </div>
      {mostrarHistorial ? (
        historial.length === 0 ? (
          <div style={{textAlign: 'center', marginTop: '2rem'}}>
            <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="Sin historial" style={{width: '120px', opacity: 0.5}} />
            <h2 style={{color: '#888'}}>No hay historial de formularios aceptados o rechazados</h2>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {historial.map(solicitud => (
              <div key={solicitud.id_solicitud} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #43ea6b22', padding: 24, width: '100%', maxWidth: 500, position: 'relative', margin: '0 auto', marginBottom: 18, display: 'flex', alignItems: 'center' }}>
                {solicitud.foto_animal && (
                  <img src={solicitud.foto_animal} alt="Foto del animal" style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 12, marginRight: 18 }} />
                )}
                <div style={{ flex: 1 }}>
                  <span style={{ position: 'absolute', top: 18, right: 18, background: estadoColor[solicitud.estado] || '#999', color: '#fff', borderRadius: 8, padding: '4px 14px', fontWeight: 700, fontSize: 14 }}>{solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1)}</span>
                  <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Animal: <span style={{ fontWeight: 400 }}>{solicitud.animal_nombre}</span></div>
                  <div><strong>Solicitante:</strong> {solicitud.nombre}</div>
                  <div><strong>Fecha:</strong> {new Date(solicitud.fecha_solicitud).toLocaleString()}</div>
                  <button style={{ marginTop: 18, background: '#228B22', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleVerDetalle(solicitud)}>Ver detalles</button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : loading ? (
        <p>Cargando...</p>
      ) : adopciones.length === 0 ? (
        <div style={{textAlign: 'center', marginTop: '2rem'}}>
          <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="Bandeja vacía" style={{width: '120px', opacity: 0.5}} />
          <h2 style={{color: '#888'}}>No se han recibido formularios de adopción</h2>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {adopciones.map(solicitud => (
            <div key={solicitud.id_solicitud} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #43ea6b22', padding: 24, width: '100%', maxWidth: 500, position: 'relative', margin: '0 auto', marginBottom: 18, display: 'flex', alignItems: 'center' }}>
              {solicitud.foto_animal && (
                <img src={solicitud.foto_animal} alt="Foto del animal" style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 12, marginRight: 18 }} />
              )}
              <div style={{ flex: 1 }}>
                <span style={{ position: 'absolute', top: 18, right: 18, background: estadoColor[solicitud.estado] || '#999', color: '#fff', borderRadius: 8, padding: '4px 14px', fontWeight: 700, fontSize: 14 }}>{solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1)}</span>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Animal: <span style={{ fontWeight: 400 }}>{solicitud.animal_nombre}</span></div>
                <div><strong>Solicitante:</strong> {solicitud.nombre}</div>
                <div><strong>Fecha:</strong> {new Date(solicitud.fecha_solicitud).toLocaleString()}</div>
                <button style={{ marginTop: 18, background: '#228B22', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleVerDetalle(solicitud)}>Ver detalles</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {detalle && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 18, padding: 32, minWidth: 350, maxWidth: 500, boxShadow: '0 2px 24px #43ea6b44', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button style={{ position: 'absolute', top: 12, right: 12, background: '#eee', border: 'none', borderRadius: 8, padding: '4px 10px', fontWeight: 700, cursor: 'pointer' }} onClick={handleCerrarDetalle}>X</button>
            <h2 style={{ color: '#228B22', marginBottom: 12 }}>Formulario de Adopción</h2>
            {/* Foto del animal si está disponible */}
            {detalle.foto_animal && (
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <img src={detalle.foto_animal} alt="Foto del animal" style={{ maxWidth: '100%', maxHeight: 180, borderRadius: 12 }} />
              </div>
            )}
            <div style={{ marginBottom: 8 }}><strong>Animal:</strong> {detalle.animal_nombre}</div>
            <div style={{ marginBottom: 8 }}><strong>Solicitante:</strong> {detalle.nombre}</div>
            <div style={{ marginBottom: 8 }}><strong>Dirección:</strong> {detalle.direccion}</div>
            <div style={{ marginBottom: 8 }}><strong>Fecha nacimiento:</strong> {detalle.fecha_nacimiento}</div>
            <div style={{ marginBottom: 8 }}><strong>Teléfono:</strong> {detalle.telefono}</div>
            <div style={{ marginBottom: 8 }}><strong>Email:</strong> {detalle.email}</div>
            <div style={{ marginBottom: 8 }}><strong>Rol familia:</strong> {detalle.rol_familia}</div>
            <div style={{ marginBottom: 8 }}><strong>Estado:</strong> <span style={{ color: estadoColor[detalle.estado] || '#999', fontWeight: 700 }}>{detalle.estado.charAt(0).toUpperCase() + detalle.estado.slice(1)}</span></div>
            <div style={{ marginBottom: 8 }}><strong>Fecha solicitud:</strong> {new Date(detalle.fecha_solicitud).toLocaleString()}</div>
            <div style={{ marginBottom: 12 }}>
              <strong>Respuestas del formulario:</strong>
              <ul style={{ marginTop: 6, marginLeft: 18 }}>
                {detalle.respuestas && detalle.respuestas.map((r: string, i: number) => (
                  <li key={i} style={{ marginBottom: 4 }}>
                    <strong>{preguntasFormulario[i] || `Pregunta ${i + 1}`}:</strong> {r}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Anotaciones / Observaciones:</strong>
              <textarea
                value={anotacionesEdit}
                onChange={e => setAnotacionesEdit(e.target.value)}
                rows={3}
                style={{ width: '100%', marginTop: 4, borderRadius: 8, padding: 8, border: '1px solid #ccc' }}
                placeholder="Agrega anotaciones aquí..."
              />
            </div>
            <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}>
              <strong>Cambiar estado:</strong>
              <select value={estadoNuevo} onChange={e => setEstadoNuevo(e.target.value)} style={{ marginLeft: 8, padding: '4px 10px', borderRadius: 6 }}>
                <option value="pendiente">Pendiente</option>
                <option value="aceptada">Aceptada</option>
                <option value="rechazada">Rechazada</option>
              </select>
              <button style={{ marginLeft: 12, background: '#228B22', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 600, cursor: 'pointer' }} onClick={handleCambiarEstado} disabled={actualizando}>{actualizando ? 'Actualizando...' : 'Guardar'}</button>
              <button style={{ marginLeft: 8, background: '#eee', color: '#333', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 600, cursor: 'pointer' }} onClick={handleCerrarDetalle}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionAdopciones;
