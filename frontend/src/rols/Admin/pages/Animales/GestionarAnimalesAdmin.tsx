
import React, { useEffect, useState } from 'react';

interface Refugio {
  id: number;
  nombre: string;
}

interface Vacuna {
  tipo: string;
  fecha: string;
  refuerzo?: string;
  unica?: boolean;
}

interface Animal {
  id?: number;
  nombre: string;
  especie: string;
  edad: string;
  sexo: string;
  refugio: number;
  refugio_nombre?: string;
  imagenes?: string[];
  resena?: string;
  esterilizado?: boolean;
  desparasitado?: boolean;
  salud?: string;
  vacunas?: Vacuna[];
}

const GestionarAnimalesAdmin: React.FC = () => {
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [refugios, setRefugios] = useState<Refugio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Animal>({ nombre: '', especie: '', edad: '', sexo: '', refugio: 0, imagenes: [], resena: '', esterilizado: false, desparasitado: false, salud: '', vacunas: [] });
  const [vacunaForm, setVacunaForm] = useState<Vacuna>({ tipo: '', fecha: '' });
  const [fotoInput, setFotoInput] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    Promise.all([
      fetch(import.meta.env.VITE_API_BASE + '/animales/', { headers: { 'Authorization': `Token ${token}` } }).then(res => res.json()),
      fetch(import.meta.env.VITE_API_BASE + '/public/refugios/').then(res => res.json())
    ]).then(([animalesData, refugiosData]) => {
      setAnimales(animalesData);
      setRefugios(refugiosData);
      setLoading(false);
    }).catch(() => {
      setError('Error al cargar datos');
      setLoading(false);
    });
  }, []);

  const handleEliminar = (id: number) => {
    if (!window.confirm('¿Seguro que quieres eliminar este animal?')) return;
    const token = localStorage.getItem('token');
  fetch(import.meta.env.VITE_API_BASE + `/animales/${id}/`, { method: 'DELETE', headers: { 'Authorization': `Token ${token}` } })
      .then(res => {
        if (res.ok) {
          setAnimales(animales.filter(a => a.id !== id));
        } else {
          alert('Error al eliminar');
        }
      });
  };

  const handleEdit = (animal: Animal) => {
    // Asegura que los campos estén inicializados correctamente
    setForm({
      nombre: animal.nombre || '',
      especie: animal.especie || '',
      edad: animal.edad || '',
      sexo: animal.sexo || '',
      refugio: animal.refugio || 0,
      imagenes: animal.imagenes ? [...animal.imagenes] : [],
      resena: animal.resena || '',
      esterilizado: !!animal.esterilizado,
      desparasitado: !!animal.desparasitado,
      salud: animal.salud || '',
      vacunas: animal.vacunas ? [...animal.vacunas] : [],
    });
    setEditId(animal.id!);
    setModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as any;
    if (type === 'checkbox') {
      setForm(f => ({ ...f, [name]: checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleAddVacuna = () => {
    if (!vacunaForm.tipo || !vacunaForm.fecha) return;
    setForm(f => ({ ...f, vacunas: [...(f.vacunas || []), vacunaForm] }));
    setVacunaForm({ tipo: '', fecha: '' });
  };

  const handleRemoveVacuna = (idx: number) => {
    setForm(f => ({ ...f, vacunas: (f.vacunas || []).filter((_, i) => i !== idx) }));
  };

  const handleAddFoto = () => {
    if (!fotoInput) return;
    setForm(f => ({ ...f, imagenes: [...(f.imagenes || []), fotoInput] }));
    setFotoInput('');
  };

  const handleRemoveFoto = (idx: number) => {
    setForm(f => ({ ...f, imagenes: (f.imagenes || []).filter((_, i) => i !== idx) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.refugio) return alert('Completa todos los campos');
    const token = localStorage.getItem('token');
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? import.meta.env.VITE_API_BASE + `/animales/${editId}/` : import.meta.env.VITE_API_BASE + '/animales/';
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        if (editId) {
          setAnimales(animales.map(a => a.id === editId ? data : a));
        } else {
          setAnimales([...animales, data]);
        }
        setForm({ nombre: '', especie: '', edad: '', sexo: '', refugio: 0 });
        setEditId(null);
        setModalOpen(false);
      });
  };

  if (loading) return <div>Cargando animales...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="gestion-animales-admin" style={{ padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ color: '#43a047', fontWeight: 800, fontSize: 32 }}>Gestionar Animales</h2>
        <button onClick={() => { setModalOpen(true); setEditId(null); setForm({ nombre: '', especie: '', edad: '', sexo: '', refugio: 0 }); }} style={{ background: '#7b1fa2', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '12px 28px', fontSize: 17, cursor: 'pointer' }}>
          <span style={{ fontSize: 20, marginRight: 8 }}>➕</span> Crear animal
        </button>
      </div>
      <div className="lista-animales-admin" style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px #43a04722' }}>
        <h2 style={{ color: '#43a047', marginBottom: 12 }}>
          Animales registrados <span style={{ color: '#228B22', fontWeight: 700, fontSize: '1.1em' }}>({animales.length})</span>
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#eaffea' }}>
              <th style={{ padding: 10, borderBottom: '1px solid #bdbdbd' }}>Nombre</th>
              <th style={{ padding: 10, borderBottom: '1px solid #bdbdbd' }}>Especie</th>
              <th style={{ padding: 10, borderBottom: '1px solid #bdbdbd' }}>Edad</th>
              <th style={{ padding: 10, borderBottom: '1px solid #bdbdbd' }}>Sexo</th>
              <th style={{ padding: 10, borderBottom: '1px solid #bdbdbd' }}>Refugio</th>
              <th style={{ padding: 10, borderBottom: '1px solid #bdbdbd' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {animales.map(animal => (
              <tr key={animal.id}>
                <td style={{ padding: 10 }}>{animal.nombre}</td>
                <td style={{ padding: 10 }}>{animal.especie}</td>
                <td style={{ padding: 10 }}>{animal.edad}</td>
                <td style={{ padding: 10 }}>{animal.sexo}</td>
                <td style={{ padding: 10 }}>{refugios.find(r => r.id === animal.refugio)?.nombre || animal.refugio}</td>
                <td style={{ padding: 10 }}>
                  <button className="btn-editar" style={{ marginRight: 8 }} onClick={() => handleEdit(animal)}>Editar</button>
                  <button className="btn-eliminar" onClick={() => handleEliminar(animal.id!)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para crear/editar animal */}
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 16, minWidth: 350, maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(67,160,71,0.12)', position: 'relative' }}>
            <h2 style={{ color: '#43a047', fontWeight: 700, marginBottom: 18, textAlign: 'center', fontSize: 28 }}>{editId ? 'Editar Animal' : 'Crear Animal'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 18 }}>
              <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required style={{ padding: 10, borderRadius: 8, border: '1px solid #bdbdbd' }} />
              <input name="especie" value={form.especie} onChange={handleChange} placeholder="Especie" required style={{ padding: 10, borderRadius: 8, border: '1px solid #bdbdbd' }} />
              <input name="edad" value={form.edad} onChange={handleChange} placeholder="Edad" required style={{ padding: 10, borderRadius: 8, border: '1px solid #bdbdbd' }} />
              <select name="sexo" value={form.sexo} onChange={handleChange} required style={{ padding: 10, borderRadius: 8, border: '1px solid #bdbdbd' }}>
                <option value="">Sexo</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
              <select name="refugio" value={form.refugio} onChange={handleChange} required style={{ padding: 10, borderRadius: 8, border: '1px solid #bdbdbd' }}>
                <option value="">Selecciona refugio</option>
                {refugios.map(r => (
                  <option key={r.id} value={r.id}>{r.nombre}</option>
                ))}
              </select>
              <textarea name="resena" value={form.resena} onChange={handleChange} placeholder="Reseña del animal" style={{ padding: 10, borderRadius: 8, border: '1px solid #bdbdbd', minHeight: 60 }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-animal-admin-checkbox-row">
                  <label htmlFor="esterilizado" style={{ marginRight: 12 }}>Esterilizado</label>
                  <input type="checkbox" name="esterilizado" checked={!!form.esterilizado} onChange={handleChange} id="esterilizado" />
                </div>
                <div className="form-animal-admin-checkbox-row">
                  <label htmlFor="desparasitado" style={{ marginRight: 12}}>Desparasitado</label>
                  <input type="checkbox" name="desparasitado" checked={!!form.desparasitado} onChange={handleChange} id="desparasitado" />
                </div>
              </div>
              <input name="salud" value={form.salud} onChange={handleChange} placeholder="Salud" style={{ padding: 10, borderRadius: 8, border: '1px solid #bdbdbd' }} />
              {/* Fotos */}
              <div>
                <label>Fotos:</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                  {(form.imagenes || []).length === 0 && <span style={{ color: '#888' }}>No hay fotos agregadas</span>}
                  {(form.imagenes || []).map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                      <img src={img} alt={`foto-${idx}`} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #bdbdbd', boxShadow: '0 2px 8px #43a04722', cursor: 'pointer' }} />
                      <button type="button" style={{ position: 'absolute', top: 2, right: 2, background: '#e53935', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, fontSize: 14, cursor: 'pointer' }} onClick={() => handleRemoveFoto(idx)}>×</button>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                  <input type="text" value={fotoInput} onChange={e => setFotoInput(e.target.value)} placeholder="URL de foto" style={{ padding: 6, borderRadius: 6, border: '1px solid #bdbdbd', width: 180 }} />
                  <button type="button" onClick={handleAddFoto} style={{ background: '#43a047', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 700 }}>Agregar foto</button>
                </div>
              </div>
              {/* Vacunas */}
              <div>
                <label>Vacunas:</label>
                <div style={{ marginBottom: 8 }}>
                  {(form.vacunas || []).map((vac, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span>{vac.tipo} ({vac.fecha})</span>
                      <button type="button" style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 6, padding: '2px 8px', fontWeight: 700 }} onClick={() => handleRemoveVacuna(idx)}>Eliminar</button>
                    </div>
                  ))}
                  <input name="tipo" value={vacunaForm.tipo} onChange={e => setVacunaForm(v => ({ ...v, tipo: e.target.value }))} placeholder="Tipo de vacuna" style={{ padding: 6, borderRadius: 6, border: '1px solid #bdbdbd', width: 120 }} />
                  <input name="fecha" type="date" value={vacunaForm.fecha} onChange={e => setVacunaForm(v => ({ ...v, fecha: e.target.value }))} style={{ padding: 6, borderRadius: 6, border: '1px solid #bdbdbd', width: 120 }} />
                  <button type="button" onClick={handleAddVacuna} style={{ background: '#43a047', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 700 }}>Agregar vacuna</button>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8 }}>
                <button type="submit" className="btn-editar" style={{ background: '#43a047', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700 }}>{editId ? 'Guardar cambios' : 'Crear animal'}</button>
                <button type="button" className="btn-eliminar" style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700 }} onClick={() => { setForm({ nombre: '', especie: '', edad: '', sexo: '', refugio: 0, imagenes: [], resena: '', esterilizado: false, desparasitado: false, salud: '', vacunas: [] }); setEditId(null); setModalOpen(false); }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionarAnimalesAdmin;
