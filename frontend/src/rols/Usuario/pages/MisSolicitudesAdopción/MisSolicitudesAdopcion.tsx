import React, { useEffect, useState } from 'react';
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
  // Puedes agregar otros campos si los usas en la UI
}

const MisSolicitudesAdopcion: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<SolicitudAdopcion[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
  fetch('/adopciones/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
        .then(async (res) => {
          console.log('Status fetch solicitudes adopción:', res.status);
          if (!res.ok) {
            // Intenta extraer mensaje de error si es posible
            let errorMsg = '';
            try {
              errorMsg = await res.text();
            } catch (e) {}
            console.error('Error en la respuesta del backend:', res.status, res.statusText, errorMsg);
            setLoading(false);
            return [];
          }
          return res.json();
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
            return (
              <li key={solicitud.id_solicitud} style={{ background: '#fff', marginBottom: 18, padding: 18, borderRadius: 12, boxShadow: '0 2px 8px #43ea6b22' }}>
                <strong>Animal:</strong> {solicitud.animal_nombre || solicitud.animal} <br />
                <strong>Estado:</strong> <span style={{ color: estadoColor, fontWeight: 'bold' }}>{estadoTexto}</span> <br />
                <strong>Fecha:</strong> {solicitud.fecha_solicitud}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MisSolicitudesAdopcion;
