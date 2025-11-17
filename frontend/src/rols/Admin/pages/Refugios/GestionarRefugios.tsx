import React, { useState, useEffect } from 'react';
import { regionesComunasChile, regionesChile } from '../../../../utils/regionesComunasChile';

const GestionarRefugios: React.FC = () => {
  // Comunas por región ahora importadas
  const comunasPorRegion = regionesComunasChile;
  // Estado para comuna en edición
  const [editComuna, setEditComuna] = useState<string>('');
  const [refugios, setRefugios] = useState<any[]>([]);
  const [animales, setAnimales] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [editRefugio, setEditRefugio] = useState<any | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const fetchRefugiosYAnimales = async () => {
      const token = localStorage.getItem('token');
      const refugiosRes = await fetch(`${import.meta.env.VITE_API_BASE}/admin/refugios/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (refugiosRes.ok) {
        const refugiosData = await refugiosRes.json();
        setRefugios(refugiosData);
      }
      // Animales
      const animalesRes = await fetch(`${import.meta.env.VITE_API_BASE}/animales/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (animalesRes.ok) {
        const animalesData = await animalesRes.json();
        setAnimales(animalesData);
      }
    };
    fetchRefugiosYAnimales();
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
  // regionesChile ahora importado desde utils

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
    persona_contacto: '',
  });
  const [error, setError] = useState('');

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
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
      const data = await response.json();
      if (response.ok) {
        alert('Refugio creado correctamente');
        setModalOpen(false);
        setNuevoRefugio({
          nombre: '', direccion: '', correo_contacto: '', telefono: '', descripcion: '', comuna: '', region: '', regionCustom: '', usarRegionCustom: false, username: '', email: '', password: '', confirmPassword: '', persona_contacto: ''
        });
        // Actualizar la lista de refugios automáticamente
        if (data.refugio) {
          setRefugios(prev => [...prev, data.refugio]);
        }
      } else {
        setError(data.error || JSON.stringify(data));
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };
  return (
    <div style={{ padding: 32, background: 'linear-gradient(135deg,#e8f5e9 60%,#fffde7 100%)', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
        <span style={{ fontSize: 38, color: '#43a047', background: '#fff', borderRadius: '50%', boxShadow: '0 2px 8px #43a04722', padding: 8 }}>🏡</span>
        <h1 style={{ color: '#43a047', fontWeight: 800, fontSize: 32, margin: 0 }}>Gestionar Refugios</h1>
      </div>
      <p style={{ color: '#388e3c', fontSize: '1.15em', marginBottom: 24 }}>Aquí podrás buscar, editar y eliminar refugios del sistema.</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
        <div style={{ background: 'linear-gradient(90deg,#43a047,#ffb300)', color: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #43a04733', padding: '1em 2em', minWidth: 180, display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: '2em' }}>🏡</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1em' }}>Total Refugios</div>
            <div style={{ fontSize: '1.8em', fontWeight: 800 }}>{refugios.length}</div>
          </div>
        </div>
        <input
          type="text"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar refugio por nombre, comuna o región..."
          style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #bdbdbd', minWidth: 260, fontSize: 16, boxShadow: '0 1px 4px #43a04711' }}
        />
  <button onClick={handleOpenModal} style={{ background: '#7b1fa2', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '12px 28px', fontSize: 17, cursor: 'pointer' }}>
          <span style={{ fontSize: 20, marginRight: 8 }}>➕</span> Crear Refugio
        </button>
      </div>

      {/* Tabla de refugios */}
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #43a04722', padding: '1.5em 1em', marginTop: 8 }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr style={{ background: 'linear-gradient(90deg,#e8f5e9,#fffde7)', color: '#388e3c' }}>
              <th style={{ padding: '14px 10px', border: 'none', fontWeight: 700, fontSize: 17, borderTopLeftRadius: 12 }}>Nombre</th>
              <th style={{ padding: '14px 10px', border: 'none', fontWeight: 700, fontSize: 17 }}>Comuna</th>
              <th style={{ padding: '14px 10px', border: 'none', fontWeight: 700, fontSize: 17 }}>Región</th>
              <th style={{ padding: '14px 10px', border: 'none', fontWeight: 700, fontSize: 17 }}>Animales</th>
              <th style={{ padding: '14px 10px', border: 'none', fontWeight: 700, fontSize: 17, borderTopRightRadius: 12 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {refugiosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2em', color: '#888', fontSize: 18 }}>No se encontraron refugios.</td>
              </tr>
            ) : refugiosFiltrados.map(refugio => {
              const cantidadAnimales = animales.filter(a => {
                // Soporta animal.refugio como objeto, id_refugio como número o string
                if (a.id_refugio !== undefined) {
                  return String(a.id_refugio) === String(refugio.id_refugio);
                }
                if (a.refugio !== undefined) {
                  if (typeof a.refugio === 'object' && a.refugio !== null && a.refugio.id_refugio !== undefined) {
                    return String(a.refugio.id_refugio) === String(refugio.id_refugio);
                  }
                  return String(a.refugio) === String(refugio.id_refugio);
                }
                return false;
              }).length;
              return (
                <tr key={refugio.id_refugio} style={{ background: '#fff', transition: 'background 0.2s', borderRadius: 12, boxShadow: '0 1px 8px #43a04711', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#e8f5e9')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                >
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid #e0e0e0', fontWeight: 500 }}>{refugio.nombre}</td>
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid #e0e0e0' }}>{refugio.comuna}</td>
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid #e0e0e0' }}>{refugio.region}</td>
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid #e0e0e0', textAlign: 'center', fontWeight: 700, color: '#228B22' }}>{cantidadAnimales}</td>
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid #e0e0e0', textAlign: 'center' }}>
                    <button onClick={() => handleEditRefugio(refugio)} style={{ marginRight: 8, background: '#43a047', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 16 }} title="Editar"><span role="img" aria-label="editar">✏️</span></button>
                    <button onClick={() => setConfirmDeleteId(refugio.id_refugio)} style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 16 }} title="Eliminar"><span role="img" aria-label="eliminar">🗑️</span></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal de edición */}
      {editRefugio && (
          <>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ background: '#fff', padding: 32, borderRadius: 16, minWidth: 350, boxShadow: '0 8px 32px rgba(67,160,71,0.12)' }}>
                <h2 style={{ color: '#43a047', fontWeight: 700 }}>Editar Refugio</h2>
                <label style={{fontWeight:500}}>Nombre del refugio:
                  <input value={editRefugio.nombre} onChange={e => setEditRefugio({ ...editRefugio, nombre: e.target.value })} style={{ marginBottom: 8, padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', width: '100%' }} />
                </label>
                <label style={{fontWeight:500}}>Región:
                  <select
                    value={editRefugio.region}
                    onChange={e => {
                      setEditRefugio({ ...editRefugio, region: e.target.value });
                      setEditComuna('');
                    }}
                    style={{ marginBottom: 8, padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', width: '100%' }}
                  >
                    <option value="">Selecciona una región...</option>
                    {regionesChile.map((r: string) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </label>
                <label style={{fontWeight:500}}>Comuna:
                  <select
                    value={editComuna || editRefugio.comuna}
                    onChange={e => {
                      setEditComuna(e.target.value);
                      setEditRefugio({ ...editRefugio, comuna: e.target.value });
                    }}
                    style={{ marginBottom: 8, padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', width: '100%' }}
                    disabled={!editRefugio.region}
                  >
                    <option value="">Selecciona una comuna...</option>
                    {(comunasPorRegion[editRefugio.region] || []).map((c: string) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label style={{fontWeight:500}}>Dirección física:
                  <input value={editRefugio.direccion || ''} onChange={e => setEditRefugio({ ...editRefugio, direccion: e.target.value })} style={{ marginBottom: 8, padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', width: '100%' }} />
                </label>
                <label style={{fontWeight:500}}>Teléfono de contacto:
                  <input value={editRefugio.telefono || ''} onChange={e => setEditRefugio({ ...editRefugio, telefono: e.target.value })} style={{ marginBottom: 8, padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', width: '100%' }} />
                </label>
                <label style={{fontWeight:500}}>Correo de contacto del refugio:
                  <input value={editRefugio.correo_contacto || ''} onChange={e => setEditRefugio({ ...editRefugio, correo_contacto: e.target.value })} style={{ marginBottom: 8, padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', width: '100%' }} />
                </label>
                <label style={{fontWeight:500}}>Persona responsable/contacto principal:
                  <input value={editRefugio.persona_contacto || ''} onChange={e => setEditRefugio({ ...editRefugio, persona_contacto: e.target.value })} style={{ marginBottom: 8, padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', width: '100%' }} />
                </label>
                <label style={{fontWeight:500}}>Descripción del refugio:
                  <textarea value={editRefugio.descripcion || ''} onChange={e => setEditRefugio({ ...editRefugio, descripcion: e.target.value })} style={{ marginBottom: 8, padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', width: '100%', minHeight: 60, resize: 'vertical' }} />
                </label>
                <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center', gap: 16 }}>
                  <button onClick={handleSaveEdit} style={{ background: '#43a047', color: '#fff', fontWeight: 600, border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 16, cursor: 'pointer' }}>Guardar</button>
                  <button onClick={() => setEditRefugio(null)} style={{ background: '#eee', color: '#333', fontWeight: 600, border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 16, cursor: 'pointer' }}>Cancelar</button>
                </div>
              </div>
            </div>
          </>
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
            <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              {error && <div style={{color: 'red', marginBottom: 8, gridColumn: '1/3'}}>{error}</div>}
              <div>
                <label style={{ fontWeight: 500 }}>Nombre de usuario para logeo (acceso al sistema):
                  <input name="username" value={nuevoRefugio.username} onChange={handleChange} style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }} placeholder="Ej: refugiofeliz" />
                </label>
              </div>
              <div>
                <label style={{ fontWeight: 500 }}>Email para logeo (acceso al sistema):
                  <input name="email" type="email" value={nuevoRefugio.email} onChange={handleChange} style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }} placeholder="Ej: acceso@refugiofeliz.cl" />
                </label>
              </div>
              <div>
                <label style={{ fontWeight: 500 }}>Contraseña:
                  <input name="password" type="password" value={nuevoRefugio.password} onChange={handleChange} style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }} placeholder="Contraseña" />
                </label>
              </div>
              <div>
                <label style={{ fontWeight: 500 }}>Confirmar contraseña:
                  <input name="confirmPassword" type="password" value={nuevoRefugio.confirmPassword} onChange={handleChange} style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }} placeholder="Repite la contraseña" />
                </label>
              </div>
              <div>
                <label style={{ fontWeight: 500 }}>Nombre del refugio:
                  <input name="nombre" value={nuevoRefugio.nombre} onChange={handleChange} style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }} />
                </label>
              </div>
              <div>
                <label style={{ fontWeight: 500 }}>Dirección física:
                  <input name="direccion" value={nuevoRefugio.direccion} onChange={handleChange} style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }} />
                </label>
              </div>
              <div>
                <label style={{ fontWeight: 500 }}>Correo de contacto del refugio:
                  <input name="correo_contacto" value={nuevoRefugio.correo_contacto} onChange={handleChange} style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }} />
                </label>
              </div>
              <div>
                <label style={{ fontWeight: 500 }}>Teléfono de contacto:
                  <input name="telefono" value={nuevoRefugio.telefono} onChange={handleChange} style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }} />
                </label>
              </div>
              <div style={{ gridColumn: '1/3' }}>
                <label style={{ fontWeight: 500 }}>Descripción del refugio:
                  <textarea name="descripcion" value={nuevoRefugio.descripcion} onChange={handleChange} style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4, minHeight: 60, resize: 'vertical' }} />
                </label>
              </div>
              <div>
                <label style={{ fontWeight: 500 }}>Región:
                  {nuevoRefugio.usarRegionCustom ? (
                    <input
                      name="regionCustom"
                      value={nuevoRefugio.regionCustom}
                      onChange={handleChange}
                      placeholder="Escribe una región personalizada..."
                      style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }}
                    />
                  ) : (
                    <select
                      name="region"
                      value={nuevoRefugio.region}
                      onChange={e => {
                        const value = e.target.value;
                        setNuevoRefugio(prev => ({ ...prev, region: value, comuna: '' }));
                      }}
                      style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }}
                    >
                      <option value="">Selecciona una región...</option>
                      {regionesChile.map((r: string) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
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
              </div>
              <div>
                <label style={{ fontWeight: 500 }}>Comuna:
                  <select
                    name="comuna"
                    value={nuevoRefugio.comuna}
                    onChange={e => {
                      const value = e.target.value;
                      setNuevoRefugio(prev => ({ ...prev, comuna: value }));
                    }}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }}
                    disabled={!nuevoRefugio.region || nuevoRefugio.usarRegionCustom}
                  >
                    <option value="">Selecciona una comuna...</option>
                    {(comunasPorRegion[nuevoRefugio.region] || []).map((c: string) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div style={{ gridColumn: '1/3' }}>
                <label style={{ fontWeight: 500 }}>Persona responsable/contacto principal:
                  <input name="persona_contacto" value={nuevoRefugio.persona_contacto || ''} onChange={handleChange} style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }} />
                </label>
              </div>
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
