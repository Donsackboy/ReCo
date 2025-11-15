// Colores para los estados de la solicitud
const estadoColor: Record<string, string> = {
  pendiente: '#999',
  aceptada: '#4caf50',
  rechazada: '#f44336',
};
import React, { useEffect, useState } from 'react';
import { preguntasAdopcion } from '../../../../utils/preguntasAdopcion';
import { useNavigate } from 'react-router-dom';

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

const MisSolicitudesAdopcion: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<SolicitudAdopcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [detalle, setDetalle] = useState<SolicitudAdopcion | null>(null);
  const [fotoGrande, setFotoGrande] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetch('http://localhost:8000/api/adopciones/', {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then(async (res) => {
        console.log('Status fetch solicitudes adopción:', res.status);
        if (!res.ok) {
          let errorMsg = '';
          try {
            errorMsg = await res.text();
          } catch (e) {}
          console.error('Error en la respuesta del backend:', res.status, res.statusText, errorMsg);
          setLoading(false);
          return [];
        }
        // Intenta parsear como JSON, si falla muestra error claro
        try {
          return await res.json();
        } catch (e) {
          const text = await res.text();
          console.error('La respuesta no es JSON:', text);
          setLoading(false);
          return [];
        }
      })
      .then((data) => {
        console.log('Respuesta solicitudes adopción:', data);
        setSolicitudes(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error en fetch solicitudes adopción:', err);
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="mis-solicitudes-adopcion-container" style={{ maxWidth: 700, margin: '40px auto', background: '#f0fff4', borderRadius: 18, boxShadow: '0 2px 12px #43ea6b22', padding: 32 }}>
      <h2 style={{ color: '#145214', marginBottom: 18 }}>Mis Solicitudes de Adopción</h2>
      {solicitudes.length === 0 ? (
        <div style={{ color: '#888', fontWeight: 500 }}>No has enviado solicitudes de adopción.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {solicitudes.map((solicitud) => {
            let estadoColor = '#999';
            let estadoTexto = 'Pendiente';
            if (solicitud.estado === 'aceptada') {
              estadoColor = '#4caf50';
              estadoTexto = 'Aceptada';
            } else if (solicitud.estado === 'rechazada') {
              estadoColor = '#f44336';
              estadoTexto = 'Rechazada';
            }
            // Formatear fecha
            let fechaFormateada = solicitud.fecha_solicitud;
            try {
              const fecha = new Date(solicitud.fecha_solicitud);
              fechaFormateada = fecha.toLocaleDateString('es-CL', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
              });
            } catch {}

            return (
              <li key={solicitud.id_solicitud} style={{
                background: 'linear-gradient(135deg, #eafff2 0%, #f8fff8 100%)',
                marginBottom: 24,
                padding: '22px 28px',
                borderRadius: 18,
                boxShadow: '0 4px 16px #43ea6b22',
                border: '1.5px solid #43ea6b44',
                fontSize: '1.08em',
                fontFamily: 'inherit',
                transition: 'box-shadow 0.2s',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                minHeight: 120,
              }}>
                {/* Etiqueta estado en la esquina superior derecha */}
                <span style={{
                  position: 'absolute',
                  top: 18,
                  right: 28,
                  background: estadoColor,
                  color: '#fff',
                  fontWeight: 600,
                  borderRadius: 8,
                  padding: '6px 18px',
                  fontSize: '1em',
                  boxShadow: '0 1px 4px #43ea6b22',
                  zIndex: 2,
                }}>{estadoTexto}</span>
                <div style={{ flex: '0 0 120px', minWidth: 120, textAlign: 'center' }}>
                  <img
                    src={solicitud.foto_principal || solicitud.foto_animal || 'https://cdn-icons-png.flaticon.com/512/616/616408.png'}
                    alt="Animal"
                    style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 16, boxShadow: '0 2px 8px #43ea6b22', background: '#fff', cursor: 'pointer' }}
                    onClick={() => setFotoGrande(solicitud.foto_principal || solicitud.foto_animal || 'https://cdn-icons-png.flaticon.com/512/616/616408.png')}
                  />
                </div>
                      {/* Modal foto grande */}
                      {fotoGrande && (
                        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(34, 153, 84, 0.18)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ position: 'relative', background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #43ea6b44', padding: 18 }}>
                            <button onClick={() => setFotoGrande(null)} style={{ position: 'absolute', top: 10, right: 10, background: '#eee', border: 'none', borderRadius: 8, fontSize: 22, fontWeight: 700, color: '#229954', cursor: 'pointer', width: 36, height: 36, zIndex: 10 }}>×</button>
                            <img src={fotoGrande} alt="Foto animal grande" style={{ maxWidth: '70vw', maxHeight: '70vh', borderRadius: 14, boxShadow: '0 2px 8px #43ea6b22', background: '#fff' }} />
                          </div>
                        </div>
                      )}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, color: '#229954', fontSize: '1.25em' }}>🐾 {solicitud.animal_nombre || solicitud.animal}</span>
                  </div>
                  <div style={{ color: '#555', marginBottom: 6 }}>
                    <span style={{ fontWeight: 500 }}>Fecha solicitud:</span> {fechaFormateada}
                  </div>
                  {solicitud.anotaciones && (
                    <div style={{ color: '#888', fontSize: '0.97em', marginTop: 8 }}>
                      <span style={{ fontWeight: 500 }}>Anotaciones:</span> {solicitud.anotaciones}
                    </div>
                  )}
                  <button
                    style={{ marginTop: 10, background: '#229954', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 4px #43ea6b22' }}
                    onClick={() => setDetalle(solicitud)}
                  >Ver detalles</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Modal de detalles con scroll y equis arriba derecha */}
      {detalle && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(34, 153, 84, 0.13)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #43ea6b44', padding: '32px 28px', maxWidth: 520, width: '100%', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setDetalle(null)} style={{ position: 'sticky', top: 0, right: 0, float: 'right', background: '#eee', border: 'none', borderRadius: 8, fontSize: 22, fontWeight: 700, color: '#229954', cursor: 'pointer', width: 36, height: 36, marginLeft: 'auto', marginBottom: 8, zIndex: 10 }}>×</button>
            <h3 style={{ color: '#229954', fontWeight: 800, marginBottom: 18, textAlign: 'center' }}>
              Solicitud de adopción de {detalle.animal_nombre || detalle.animal}
            </h3>
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <img
                src={detalle.foto_principal || detalle.foto_animal || 'https://cdn-icons-png.flaticon.com/512/616/616408.png'}
                alt="Animal"
                style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 14, boxShadow: '0 2px 8px #43ea6b22', background: '#fff' }}
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <div><strong>Solicitante:</strong> {detalle.nombre}</div>
              <div><strong>Dirección:</strong> {detalle.direccion}</div>
              <div><strong>Fecha nacimiento:</strong> {detalle.fecha_nacimiento}</div>
              <div><strong>Teléfono:</strong> {detalle.telefono}</div>
              <div><strong>Email:</strong> {detalle.email}</div>
              <div><strong>Rol familia:</strong> {detalle.rol_familia}</div>
              <div><strong>Estado:</strong> <span style={{ color: estadoColor[detalle.estado], fontWeight: 700 }}>{detalle.estado}</span></div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <h4 style={{ color: '#229954', fontWeight: 700, marginBottom: 8 }}>Respuestas del formulario</h4>
              <ul style={{ paddingLeft: 0, margin: 0 }}>
                {detalle.respuestas.map((r, i) => (
                  <li key={i} style={{ marginBottom: '1.2rem', borderRadius: '12px', boxShadow: '0 1px 6px #43ea6b22', background: '#eafbe7', padding: '0.8rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ background: '#a5d6a7', borderRadius: '8px', padding: '0.6rem 1rem', fontWeight: 700, color: '#205c20', fontSize: '1.11rem', letterSpacing: '0.01em', boxShadow: '0 1px 4px #43ea6b22' }}>
                      {preguntasAdopcion[i] || `Pregunta ${i + 1}`}
                    </div>
                    <div style={{ background: '#fff', borderRadius: '8px', padding: '0.6rem 1rem', fontWeight: 500, color: '#388e3c', fontSize: '1.01rem', marginTop: '0.2rem', border: '1px solid #e0e0e0' }}>
                      {r}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {detalle.anotaciones && (
              <div style={{ color: '#888', fontSize: '0.97em', marginTop: 8 }}>
                <span style={{ fontWeight: 500 }}>Anotaciones:</span> {detalle.anotaciones}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MisSolicitudesAdopcion;
