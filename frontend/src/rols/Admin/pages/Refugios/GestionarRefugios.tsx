import React, { useState } from 'react';

const GestionarRefugios: React.FC = () => {
  const [refugios, setRefugios] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [editRefugio, setEditRefugio] = useState<any | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  React.useEffect(() => {
    const fetchRefugios = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/admin/refugios/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRefugios(data);
      }
    };
    fetchRefugios();
  }, []);

  const refugiosFiltrados = refugios.filter(r =>
    r.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (r.comuna && r.comuna.toLowerCase().includes(busqueda.toLowerCase())) ||
    (r.region && r.region.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const handleDeleteRefugio = async (id: number) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_BASE}/admin/refugios/${id}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Token ${token}` }
    });
    if (response.ok) {
      setRefugios(refugios.filter(r => r.id_refugio !== id));
      setConfirmDeleteId(null);
    }
  };

  const handleEditRefugio = (refugio: any) => {
    setEditRefugio(refugio);
  };
  const handleSaveEdit = async () => {
    if (!editRefugio) return;
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_BASE}/admin/refugios/${editRefugio.id_refugio}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(editRefugio)
    });
    if (response.ok) {
      setRefugios(refugios.map(r => r.id_refugio === editRefugio.id_refugio ? editRefugio : r));
      setEditRefugio(null);
    }
  };
  const [modalOpen, setModalOpen] = useState(false);
  const regionesChile = [
    'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo', 'Valparaíso',
    'Metropolitana de Santiago', 'O’Higgins', 'Maule', 'Ñuble', 'Biobío', 'La Araucanía',
    'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes y Antártica Chilena'
  ];

  const [nuevoRefugio, setNuevoRefugio] = useState({
    nombre: '',
    direccion: '',
    correo_contacto: '',
    telefono: '',
    descripcion: '',
    comuna: '',
    region: '',
    regionCustom: '',
    usarRegionCustom: false,
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === 'usarRegionCustom') {
      setNuevoRefugio({ ...nuevoRefugio, usarRegionCustom: (e.target as HTMLInputElement).checked });
      return;
    }
    setNuevoRefugio({ ...nuevoRefugio, [name]: value });
  };

  const handleCrearRefugio = async () => {
    setError('');
    if (nuevoRefugio.password !== nuevoRefugio.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    const token = localStorage.getItem('token');
    const regionFinal = nuevoRefugio.usarRegionCustom ? nuevoRefugio.regionCustom : nuevoRefugio.region;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/admin/refugios/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          nombre: nuevoRefugio.nombre,
          direccion: nuevoRefugio.direccion,
          correo_contacto: nuevoRefugio.correo_contacto,
          telefono: nuevoRefugio.telefono,
          descripcion: nuevoRefugio.descripcion,
          comuna: nuevoRefugio.comuna,
          region: regionFinal,
          username: nuevoRefugio.username,
          email: nuevoRefugio.email,
          password: nuevoRefugio.password
        })
      });
      if (response.ok) {
        alert('Refugio creado correctamente');
        setModalOpen(false);
        setNuevoRefugio({
          nombre: '', direccion: '', correo_contacto: '', telefono: '', descripcion: '', comuna: '', region: '', regionCustom: '', usarRegionCustom: false, username: '', email: '', password: '', confirmPassword: ''
        });
      } else {
        setError('Error al crear refugio');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };
  return (
    <div style={{ padding: 24 }}>
      <h1>Gestionar Refugios</h1>
      <p>Aquí podrás buscar, editar y eliminar refugios del sistema.</p>
      <input
        type="text"
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        placeholder="Buscar refugio por nombre, comuna o región..."
        style={{ marginBottom: 16, padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', width: 300 }}
      />
      <button style={{ margin: '16px 0', padding: '8px 16px' }} onClick={handleOpenModal}>
        Crear Refugio
      </button>

      {/* Tabla de refugios */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16, boxShadow: '0 2px 12px rgba(67,160,71,0.08)' }}>
        <thead>
          <tr style={{ background: '#e8f5e9' }}>
            <th style={{ padding: 10, border: '1px solid #bdbdbd' }}>Nombre</th>
            <th style={{ padding: 10, border: '1px solid #bdbdbd' }}>Comuna</th>
            <th style={{ padding: 10, border: '1px solid #bdbdbd' }}>Región</th>
            <th style={{ padding: 10, border: '1px solid #bdbdbd' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {refugiosFiltrados.map(refugio => (
            <tr key={refugio.id_refugio} style={{ background: '#fff', transition: 'background 0.2s', boxShadow: '0 1px 4px rgba(67,160,71,0.04)' }}>
              <td style={{ padding: 10, border: '1px solid #bdbdbd', fontWeight: 500 }}>{refugio.nombre}</td>
              <td style={{ padding: 10, border: '1px solid #bdbdbd' }}>{refugio.comuna}</td>
              <td style={{ padding: 10, border: '1px solid #bdbdbd' }}>{refugio.region}</td>
              <td style={{ padding: 10, border: '1px solid #bdbdbd', textAlign: 'center' }}>
                <button onClick={() => handleEditRefugio(refugio)} style={{ marginRight: 8, background: '#43a047', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontWeight: 600 }} title="Editar"><span role="img" aria-label="editar">✏️</span></button>
                <button onClick={() => setConfirmDeleteId(refugio.id_refugio)} style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontWeight: 600 }} title="Eliminar"><span role="img" aria-label="eliminar">🗑️</span></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de edición */}
      {editRefugio && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 16, minWidth: 350, boxShadow: '0 8px 32px rgba(67,160,71,0.12)' }}>
            <h2 style={{ color: '#43a047', fontWeight: 700 }}>Editar Refugio</h2>
            <input value={editRefugio.nombre} onChange={e => setEditRefugio({ ...editRefugio, nombre: e.target.value })} style={{ marginBottom: 8, padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', width: '100%' }} />
            <input value={editRefugio.comuna} onChange={e => setEditRefugio({ ...editRefugio, comuna: e.target.value })} style={{ marginBottom: 8, padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', width: '100%' }} />
            <input value={editRefugio.region} onChange={e => setEditRefugio({ ...editRefugio, region: e.target.value })} style={{ marginBottom: 8, padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', width: '100%' }} />
            <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center', gap: 16 }}>
              <button onClick={handleSaveEdit} style={{ background: '#43a047', color: '#fff', fontWeight: 600, border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 16, cursor: 'pointer' }}>Guardar</button>
              <button onClick={() => setEditRefugio(null)} style={{ background: '#eee', color: '#333', fontWeight: 600, border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 16, cursor: 'pointer' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {confirmDeleteId && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 16, minWidth: 350, boxShadow: '0 8px 32px rgba(229,57,53,0.12)' }}>
            <h2 style={{ color: '#e53935', fontWeight: 700 }}>¿Eliminar refugio?</h2>
            <p>¿Estás seguro de que deseas eliminar este refugio? Esta acción no se puede deshacer.</p>
            <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center', gap: 16 }}>
              <button onClick={() => handleDeleteRefugio(confirmDeleteId!)} style={{ color: 'white', background: '#e53935', fontWeight: 600, border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 16, cursor: 'pointer' }}>Eliminar</button>
              <button onClick={() => setConfirmDeleteId(null)} style={{ background: '#eee', color: '#333', fontWeight: 600, border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 16, cursor: 'pointer' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 16, minWidth: 350, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', border: '2px solid #43a047', position: 'relative' }}>
            <h2 style={{ color: '#43a047', fontWeight: 700, marginBottom: 18, textAlign: 'center', fontSize: 28 }}>🌱 Crear Refugio</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {error && <div style={{color: 'red', marginBottom: 8}}>{error}</div>}
              <label style={{ fontWeight: 500 }}>Nombre de usuario:
                <input name="username" value={nuevoRefugio.username} onChange={handleChange} style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }} placeholder="Ej: refugiofeliz" />
              </label>
              <label style={{ fontWeight: 500 }}>Email:
                <input name="email" type="email" value={nuevoRefugio.email} onChange={handleChange} style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }} placeholder="Ej: contacto@refugiofeliz.cl" />
              </label>
              <label style={{ fontWeight: 500 }}>Contraseña:
                <input name="password" type="password" value={nuevoRefugio.password} onChange={handleChange} style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }} placeholder="Contraseña" />
              </label>
              <label style={{ fontWeight: 500 }}>Confirmar contraseña:
                <input name="confirmPassword" type="password" value={nuevoRefugio.confirmPassword} onChange={handleChange} style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }} placeholder="Repite la contraseña" />
              </label>
              <label style={{ fontWeight: 500 }}>Nombre:
                <input name="nombre" value={nuevoRefugio.nombre} onChange={handleChange} style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }} />
              </label>
              <label style={{ fontWeight: 500 }}>Dirección:
                <input name="direccion" value={nuevoRefugio.direccion} onChange={handleChange} style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }} />
              </label>
              <label style={{ fontWeight: 500 }}>Correo de contacto:
                <input name="correo_contacto" value={nuevoRefugio.correo_contacto} onChange={handleChange} style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }} />
              </label>
              <label style={{ fontWeight: 500 }}>Teléfono:
                <input name="telefono" value={nuevoRefugio.telefono} onChange={handleChange} style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }} />
              </label>
              <label style={{ fontWeight: 500 }}>Descripción:
                <textarea name="descripcion" value={nuevoRefugio.descripcion} onChange={handleChange} style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4, minHeight: 60, resize: 'vertical' }} />
              </label>
              <label style={{ fontWeight: 500 }}>Comuna:
                <input name="comuna" value={nuevoRefugio.comuna} onChange={handleChange} style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }} />
              </label>
              <label style={{ fontWeight: 500 }}>Región:
                {!nuevoRefugio.usarRegionCustom ? (
                  <select
                    name="region"
                    value={nuevoRefugio.region}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }}
                  >
                    <option value="">Selecciona una región...</option>
                    {regionesChile.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    name="regionCustom"
                    value={nuevoRefugio.regionCustom}
                    onChange={handleChange}
                    placeholder="Escribe una región personalizada..."
                    style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }}
                  />
                )}
                <div style={{ marginTop: 8 }}>
                  <label style={{ fontSize: 14 }}>
                    <input
                      type="checkbox"
                      name="usarRegionCustom"
                      checked={nuevoRefugio.usarRegionCustom}
                      onChange={handleChange}
                      style={{ marginRight: 6 }}
                    />
                    Escribir región personalizada
                  </label>
                </div>
              </label>
            </form>
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 16 }}>
              <button onClick={handleCrearRefugio} style={{ background: '#43a047', color: '#fff', fontWeight: 600, border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(67,160,71,0.12)' }}>Crear</button>
              <button onClick={handleCloseModal} style={{ background: '#eee', color: '#333', fontWeight: 600, border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 16, cursor: 'pointer' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionarRefugios;
