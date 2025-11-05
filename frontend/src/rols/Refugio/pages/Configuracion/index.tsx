import React, { useEffect, useState } from 'react';
import ConfiguracionRefugioForm from './ConfiguracionRefugioForm';

const ConfiguracionRefugio: React.FC = () => {
  const [refugio, setRefugio] = useState<any>(null);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8000/api/refugio/me', {
      headers: token ? { 'Authorization': `Token ${token}` } : {}
    })
      .then(res => {
        if (res.status === 401) {
          setError('No autorizado. Inicia sesión nuevamente.');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data && data.id_refugio) {
          setRefugio(data);
        } else if (!error && data) {
          setError('Refugio no encontrado');
        }
      })
      .catch(() => setError('Error al cargar datos del refugio'));
  }, []);

  const handleSave = async (form: any) => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'logo' && value instanceof File) {
          formData.append(key, value);
        } else if (key === 'redes_sociales') {
          // Convertir string separada por comas a lista JSON
          const redes = typeof value === 'string' ? value.split(',').map(r => r.trim()).filter(Boolean) : value;
          formData.append(key, JSON.stringify(redes));
        } else {
          formData.append(key, String(value));
        }
      }
    });
    try {
      const res = await fetch(`http://localhost:8000/api/refugio/me`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`
        },
        body: formData
      });
      if (res.ok) {
        // Tras guardar, recargar los datos del refugio para asegurar que el logo y los datos sean los más recientes
        const token = localStorage.getItem('token');
        fetch('http://localhost:8000/api/refugio/me', {
          headers: token ? { 'Authorization': `Token ${token}` } : {}
        })
          .then(res => res.json())
          .then(data => {
            setRefugio(data);
            setEditMode(false);
          });
      } else {
        let errorMsg = 'Error al guardar cambios';
        try {
          const errorData = await res.json();
          errorMsg = errorData?.error || JSON.stringify(errorData) || errorMsg;
        } catch {}
        setError(errorMsg);
      }
    } catch {
      setError('Error al guardar cambios');
    }
    setLoading(false);
  };

  if (error) return <div style={{ color: 'red', padding: 20 }}>{error}</div>;
  if (!refugio) return <div>Cargando...</div>;

  return (
    <div style={{ padding: 32, maxWidth: 500, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: 28, marginBottom: 24 }}>Mi Refugio</h2>
      {!editMode ? (
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          {refugio.logo && (
            <img src={refugio.logo} alt="Logo" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: '50%', marginBottom: 18, border: '2px solid #eee', background: '#fafafa' }} />
          )}
          <div style={{ width: '100%' }}>
            <p style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
              <span role="img" aria-label="refugio" style={{ marginRight: 8 }}>🏠</span>{refugio.nombre}
            </p>
            <p style={{ margin: '6px 0' }}><span role="img" aria-label="email">📧</span> <strong>Email:</strong> {refugio.correo_contacto}</p>
            <p style={{ margin: '6px 0' }}><span role="img" aria-label="direccion">📍</span> <strong>Dirección:</strong> {refugio.direccion}</p>
            <p style={{ margin: '6px 0' }}><span role="img" aria-label="region">🗺️</span> <strong>Región:</strong> {refugio.region}</p>
            <p style={{ margin: '6px 0' }}><span role="img" aria-label="comuna">🏢</span> <strong>Comuna:</strong> {refugio.comuna}</p>
            <p style={{ margin: '6px 0' }}><span role="img" aria-label="telefono">📞</span> <strong>Teléfono:</strong> {refugio.telefono}</p>
          </div>
          <button onClick={() => setEditMode(true)} style={{ marginTop: 18, padding: '10px 32px', background: 'linear-gradient(90deg,#2196f3,#21cbf3)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 16, boxShadow: '0 1px 6px rgba(33,150,243,0.12)', cursor: 'pointer', transition: 'background 0.2s' }}>Editar Refugio</button>
        </div>
      ) : (
        <ConfiguracionRefugioForm refugio={refugio} onSave={handleSave} />
      )}
      {loading && <div style={{ marginTop: 18, textAlign: 'center', color: '#2196f3', fontWeight: 500 }}>Guardando cambios...</div>}
    </div>
  );
};

export default ConfiguracionRefugio;
