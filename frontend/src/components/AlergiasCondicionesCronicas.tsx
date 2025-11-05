import React, { useEffect, useState } from 'react';

interface AlergiaCondicion {
  id: number;
  tipo: 'alergia' | 'condicion_cronica';
  nombre: string;
  descripcion?: string;
  fecha_diagnostico?: string;
}

interface Props {
  animalId: number;
}

const API_BASE = import.meta.env.VITE_API_BASE;

const AlergiasCondicionesCronicas: React.FC<Props> = ({ animalId }) => {
  const [items, setItems] = useState<AlergiaCondicion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ tipo: 'alergia', nombre: '', descripcion: '', fecha_diagnostico: '' });

  const token = localStorage.getItem('token');

  const fetchItems = () => {
    setLoading(true);
    fetch(`${API_BASE}/animales/${animalId}/alergias-condiciones/`, {
      headers: { 'Authorization': `Token ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        // Maneja array directo o paginado
        if (Array.isArray(data)) {
          setItems(data);
        } else if (data.results && Array.isArray(data.results)) {
          setItems(data.results);
        } else {
          setItems([]);
        }
      })
      .catch(() => {
        setItems([]);
        alert('Error al consultar alergias y condiciones.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, [animalId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setLoading(true);
    fetch(`${API_BASE}/animales/${animalId}/alergias-condiciones/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(form),
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al guardar alergia/condición');
        setForm({ tipo: 'alergia', nombre: '', descripcion: '', fecha_diagnostico: '' });
        fetchItems();
      })
      .catch(() => {
        alert('No se pudo guardar la alergia o condición.');
        setLoading(false);
      });
  };

  const handleEdit = (item: AlergiaCondicion) => {
    setEditId(item.id);
    setForm({
      tipo: item.tipo,
      nombre: item.nombre,
      descripcion: item.descripcion || '',
      fecha_diagnostico: item.fecha_diagnostico || '',
    });
  };

  const handleUpdate = () => {
    if (editId == null) return;
    setLoading(true);
    fetch(`${API_BASE}/animales/${animalId}/alergias-condiciones/${editId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(form),
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al actualizar alergia/condición');
        setEditId(null);
        setForm({ tipo: 'alergia', nombre: '', descripcion: '', fecha_diagnostico: '' });
        fetchItems();
      })
      .catch(() => {
        alert('No se pudo actualizar la alergia o condición.');
        setLoading(false);
      });
  };

  const handleDelete = (id: number) => {
    setLoading(true);
    fetch(`${API_BASE}/animales/${animalId}/alergias-condiciones/${id}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Token ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al eliminar alergia/condición');
        fetchItems();
      })
      .catch(() => {
        alert('No se pudo eliminar la alergia o condición.');
        setLoading(false);
      });
  };

  return (
    <div style={{ background: '#e3f2fd', border: '2px solid #90caf9', borderRadius: 14, padding: 18, marginBottom: 8, boxShadow: '0 2px 8px rgba(144,202,249,0.08)' }}>
      <h3 style={{ marginBottom: 8, color: '#1976d2', fontWeight: 700 }}>Alergias y Condiciones Crónicas</h3>
      {loading ? <p style={{ color: '#1976d2' }}>Cargando...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.length === 0 && <div style={{ color: '#888' }}>No hay registros.</div>}
          {items.map(item => (
            <div key={item.id} style={{ background: '#fff', border: '1.5px solid #90caf9', borderRadius: 10, padding: 12, boxShadow: '0 2px 8px rgba(144,202,249,0.08)', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontWeight: 600, color: '#1976d2', fontSize: 15 }}>
                {item.tipo === 'alergia' ? 'Alergia' : 'Condición crónica'}: {item.nombre}
              </div>
              {item.descripcion && <div style={{ color: '#1976d2', fontSize: 13 }}>Descripción: {item.descripcion}</div>}
              {item.fecha_diagnostico && <div style={{ color: '#1976d2', fontSize: 13 }}>Diagnóstico: {item.fecha_diagnostico}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <button onClick={() => handleEdit(item)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 600, cursor: 'pointer' }}>Editar</button>
                <button onClick={() => handleDelete(item.id)} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 600, cursor: 'pointer' }}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div
        style={{
          marginTop: 18,
          background: '#fff',
          border: '1.5px solid #90caf9',
          borderRadius: 10,
          padding: 14,
          boxShadow: '0 2px 8px rgba(144,202,249,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <h4 style={{ color: '#1976d2', fontWeight: 700 }}>{editId ? 'Editar' : 'Agregar'} registro</h4>
        <div
          style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            flexDirection: window.innerWidth < 700 ? 'column' : 'row',
          }}
        >
          <select name="tipo" value={form.tipo} onChange={handleChange} style={{ padding: 6, borderRadius: 6, border: '1.5px solid #90caf9', background: '#e3f2fd', fontSize: 15 }}>
            <option value="alergia">Alergia</option>
            <option value="condicion_cronica">Condición crónica</option>
          </select>
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" style={{ padding: 6, borderRadius: 6, border: '1.5px solid #90caf9', background: '#fff', fontSize: 15, minWidth: 120 }} />
          <input name="fecha_diagnostico" value={form.fecha_diagnostico} onChange={handleChange} placeholder="Fecha diagnóstico" style={{ padding: 6, borderRadius: 6, border: '1.5px solid #90caf9', background: '#fff', fontSize: 15, minWidth: 120 }} />
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" style={{ padding: 6, borderRadius: 6, border: '1.5px solid #90caf9', background: '#e3f2fd', fontSize: 15, minWidth: 180, minHeight: 40, resize: 'vertical' }} />
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          {editId ? (
            <>
              <button onClick={handleUpdate} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 600, cursor: 'pointer' }}>Guardar</button>
              <button onClick={() => { setEditId(null); setForm({ tipo: 'alergia', nombre: '', descripcion: '', fecha_diagnostico: '' }); }} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 600 }}>Cancelar</button>
            </>
          ) : (
            <button onClick={handleAdd} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 600, cursor: 'pointer' }}>Agregar</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlergiasCondicionesCronicas;
