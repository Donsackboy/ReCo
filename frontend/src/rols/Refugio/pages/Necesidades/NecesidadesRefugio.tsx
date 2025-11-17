import React, { useState } from 'react';
import './NecesidadesRefugio.css';
import { useEffect } from 'react';
import { getNecesidadesRefugio, createNecesidadRefugio, updateNecesidadRefugio, deleteNecesidadRefugio } from '../../api/apiRefugio';

type TipoNecesidad = 'alimento' | 'medicamento' | 'servicio' | 'articulo' | 'otro';
type Prioridad = 'baja' | 'media' | 'alta' | 'urgente';
type Estado = 'activa' | 'cumplida' | 'cancelada';
interface Necesidad {
  id: number;
  tipo: TipoNecesidad;
  descripcion: string;
  monto_necesario: number;
  monto_recaudado: number;
  prioridad: Prioridad;
  estado: Estado;
  fecha_limite?: string;
  imagen_url?: string;
}

const NecesidadesRefugio: React.FC = () => {
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  // Obtener token del usuario
  const token = localStorage.getItem('token') || '';
  const [lista, setLista] = useState<Necesidad[]>([]);
  // Cargar todas las necesidades altiro desde el backend
  useEffect(() => {
    async function fetchNecesidades() {
      if (!token) return;
      try {
        const data = await getNecesidadesRefugio(token);
        setLista(data);
      } catch (error) {
        console.error('Error al cargar necesidades:', error);
      }
    }
    fetchNecesidades();
  }, []);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Necesidad>>({});
  const handleDelete = (id: number) => {
    if (!token) return;
    deleteNecesidadRefugio(id, token)
      .then(() => {
        setLista(l => l.filter(n => n.id !== id));
        if (editId === id) {
          setEditId(null);
          setEditForm({});
        }
      })
      .catch((_err: unknown) => alert('Error al eliminar necesidad'));
  };

  const startEdit = (n: Necesidad) => {
    setEditId(n.id);
    setEditForm({ ...n });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(f => ({ ...f, [name]: name === 'monto_necesario' || name === 'monto_recaudado' ? Number(value) : value }));
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.descripcion?.trim() || !editId) return;
    if (!token) return;
    const editData = {
      ...editForm,
      fecha_limite: editForm.fecha_limite ? editForm.fecha_limite : null,
    };
    updateNecesidadRefugio(editId, editData, token)
      .then((updated: Necesidad) => {
        setLista(l => l.map(n => n.id === editId ? updated : n));
        setEditId(null);
        setEditForm({});
      })
      .catch((_err: unknown) => alert('Error al editar necesidad'));
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditForm({});
  };
  const [form, setForm] = useState({
    tipo: 'alimento' as TipoNecesidad,
    descripcion: '',
    monto_necesario: 0,
    monto_recaudado: 0,
    prioridad: 'media' as Prioridad,
    estado: 'activa' as Estado,
    fecha_limite: '',
    imagen_url: '',
  });
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file' && name === 'imagen_url') {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setImagenFile(file);
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagenPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setImagenPreview(null);
      }
    } else {
      setForm(f => ({ ...f, [name]: name === 'monto_necesario' || name === 'monto_recaudado' ? Number(value) : value }));
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.descripcion.trim()) return;
    if (!token) return;
    let imagenUrl = form.imagen_url;
    if (imagenFile) {
      // Subir imagen al backend
      const data = new FormData();
      data.append('file', imagenFile);
      fetch('/api/upload-image/', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      })
        .then(res => res.json())
        .then(res => {
          imagenUrl = res.url;
          crearNecesidadConImagen(imagenUrl);
        })
        .catch(() => alert('Error al subir imagen'));
    } else {
      crearNecesidadConImagen(imagenUrl);
    }

    function crearNecesidadConImagen(url: string) {
      const formData = {
        ...form,
        fecha_limite: form.fecha_limite ? form.fecha_limite : null,
        imagen_url: url,
      };
      createNecesidadRefugio(formData, token)
        .then((nueva: Necesidad) => {
          setLista(l => [...l, nueva]);
          setForm({
            tipo: 'alimento',
            descripcion: '',
            monto_necesario: 0,
            monto_recaudado: 0,
            prioridad: 'media',
            estado: 'activa',
            fecha_limite: '',
            imagen_url: '',
          });
          setImagenFile(null);
          setImagenPreview(null);
          setShowForm(false);
        })
        .catch((_err: unknown) => alert('Error al crear necesidad'));
    }
  };

  return (
    <div className="necesidades-container">
      <h1 className="necesidades-title">Necesidades del Refugio</h1>
      <button
        className="crear-btn"
        onClick={() => setShowForm(true)}
        style={{ display: showForm ? 'none' : 'block', marginBottom: '1.5rem' }}
      >
        Crear necesidad
      </button>
      {showForm && (
        <form onSubmit={handleAdd} className="necesidad-form">
          <label>
            Tipo de necesidad
            <select name="tipo" value={form.tipo} onChange={handleChange}>
              <option value="alimento">Alimento</option>
              <option value="medicamento">Medicamento</option>
              <option value="servicio">Servicio</option>
              <option value="articulo">Artículo</option>
              <option value="otro">Otro</option>
            </select>
          </label>
          <label>
            Descripción
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción de la necesidad (ej: 2 camas grandes, remedio X, etc.)" rows={2} required />
          </label>
          <label>
            Monto necesario
            <input name="monto_necesario" type="number" min={0} value={form.monto_necesario} onChange={handleChange} placeholder="Monto necesario (opcional)" />
          </label>
          <label>
            Monto recaudado
            <input name="monto_recaudado" type="number" min={0} value={form.monto_recaudado} onChange={handleChange} placeholder="Monto recaudado (opcional)" />
          </label>
          <label>
            Estado
            <select name="estado" value={form.estado} onChange={handleChange}>
              <option value="activa">Activa</option>
              <option value="cumplida">Cumplida</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </label>
          <label>
            Fecha límite
            <input name="fecha_limite" type="date" value={form.fecha_limite} onChange={handleChange} />
          </label>
          <label>
            Imagen
            <input name="imagen_url" type="file" accept="image/*" onChange={handleChange} />
            {imagenPreview && (
              <img src={imagenPreview} alt="Previsualización" className="imagen-preview" />
            )}
          </label>
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button type="submit" className="agregar-btn">Agregar necesidad</button>
            <button type="button" className="cancelar-btn" onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </form>
      )}

  <h2 className="lista-title">Lista de necesidades</h2>
      {lista.length === 0 ? (
        <p className="no-necesidades">No hay necesidades registradas aún.</p>
      ) : (
        <ul className="necesidades-list">
          {lista.map(n => (
            <li key={n.id} className="necesidad-item">
              {editId === n.id ? (
                <form onSubmit={handleEditSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  <select name="tipo" value={editForm.tipo} onChange={handleEditChange} style={{ padding: '0.5rem', borderRadius: 5 }}>
                    <option value="alimento">Alimento</option>
                    <option value="medicamento">Medicamento</option>
                    <option value="servicio">Servicio</option>
                    <option value="articulo">Artículo</option>
                    <option value="otro">Otro</option>
                  </select>
                  <textarea name="descripcion" value={editForm.descripcion} onChange={handleEditChange} rows={2} style={{ padding: '0.5rem', borderRadius: 5 }} />
                  <input name="monto_necesario" type="number" min={0} value={editForm.monto_necesario} onChange={handleEditChange} placeholder="Monto necesario" style={{ padding: '0.5rem', borderRadius: 5 }} />
                  <input name="monto_recaudado" type="number" min={0} value={editForm.monto_recaudado} onChange={handleEditChange} placeholder="Monto recaudado" style={{ padding: '0.5rem', borderRadius: 5 }} />
                  <select name="prioridad" value={editForm.prioridad} onChange={handleEditChange} style={{ padding: '0.5rem', borderRadius: 5 }}>
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                  <select name="estado" value={editForm.estado} onChange={handleEditChange} style={{ padding: '0.5rem', borderRadius: 5 }}>
                    <option value="activa">Activa</option>
                    <option value="cumplida">Cumplida</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                  <input name="fecha_limite" type="date" value={editForm.fecha_limite || ''} onChange={handleEditChange} style={{ padding: '0.5rem', borderRadius: 5 }} />
                  <input name="imagen_url" value={editForm.imagen_url || ''} onChange={handleEditChange} placeholder="URL de imagen" style={{ padding: '0.5rem', borderRadius: 5 }} />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button type="submit" style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: 5, padding: '0.5rem 1.2rem', fontWeight: 500, cursor: 'pointer' }}>Guardar</button>
                    <button type="button" onClick={handleEditCancel} style={{ background: '#ccc', color: '#333', border: 'none', borderRadius: 5, padding: '0.5rem 1.2rem', fontWeight: 500, cursor: 'pointer' }}>Cancelar</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="necesidad-tags">
                    <span className="tag tipo">{n.tipo}</span>
                    <span className="tag prioridad">{n.prioridad}</span>
                    <span className="tag estado">{n.estado}</span>
                    {n.fecha_limite && <span className="tag fecha">Límite: {n.fecha_limite}</span>}
                  </div>
                  <strong className="necesidad-desc">{n.descripcion}</strong>
                  <div className="necesidad-montos">
                    <span><strong>Monto necesario:</strong> ${n.monto_necesario}</span>{' '}
                    <span><strong>Recaudado:</strong> ${n.monto_recaudado}</span>
                  </div>
                  {n.imagen_url && <img src={n.imagen_url} alt="img" className="necesidad-img" />}
                  <div className="necesidad-actions">
                    <button onClick={() => startEdit(n)} className="editar-btn">Editar</button>
                    <button onClick={() => handleDelete(n.id)} className="eliminar-btn">Eliminar</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NecesidadesRefugio;
