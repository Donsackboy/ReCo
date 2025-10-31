import React, { useState, useEffect } from 'react';
import { createAnimal, API_BASE } from '../../../../../../src/api';
// importación ya agrupada arriba



const AnimalForm: React.FC = () => {
  // Obtener refugio del usuario autenticado
  const userStr = localStorage.getItem('user');
  const userObj = userStr ? JSON.parse(userStr) : null;
  const refugioId = userObj?.refugio?.id_refugio;
  const refugioNombre = userObj?.refugio?.nombre || '';
  const [form, setForm] = useState({ nombre: '', edad: '', especie: '', descripcion: '', estado: 'disponible', busca_hogar_temporal: false, refugio: refugioId });

  if (!refugioId) {
    return <div style={{ color: 'red', padding: 20 }}>Error: Tu usuario no tiene un refugio asociado. No puedes crear animales.</div>;
  }
  // Cargar refugios al montar el componente
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Obtener token del localStorage (ajusta si usas otro método)
  const token = localStorage.getItem('token');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      // Obtener id_refugio del usuario autenticado (ajusta según tu lógica)
      const data = {
        nombre: form.nombre,
        edad: form.edad ? parseInt(form.edad) : null,
        especie: form.especie,
        descripcion: form.descripcion,
        estado: form.estado,
        busca_hogar_temporal: form.busca_hogar_temporal,
        refugio: Number(refugioId),
      };
      await createAnimal(data, token);
    setSuccess(true);
    setForm({ nombre: '', edad: '', especie: '', descripcion: '', estado: 'disponible', busca_hogar_temporal: false, refugio: refugioId });
    } catch (err: any) {
      if (err.response) {
        const data = await err.response.json();
        setError(JSON.stringify(data));
      } else {
        setError(err.message || 'Error al crear animal');
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 24, background: '#f6fff6', borderRadius: 12, boxShadow: '0 2px 12px #228b2233' }}>
      <h2>Crear/Editar Animal</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Nombre:</label>
          <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre del animal" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #90EE90' }} required />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Edad:</label>
          <input type="number" name="edad" value={form.edad} onChange={handleChange} placeholder="Edad" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #90EE90' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Especie:</label>
          <select name="especie" value={form.especie} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #90EE90' }} required>
            <option value="">Selecciona especie</option>
            <option value="perro">Perro</option>
            <option value="gato">Gato</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        {/* Foto y otros campos avanzados se agregan luego */}
        <div style={{ marginBottom: 12 }}>
          <label>Descripción:</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} placeholder="Descripción del animal" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #90EE90' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Estado:</label>
          <select name="estado" value={form.estado} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #90EE90' }} required>
            <option value="disponible">Disponible</option>
            <option value="adoptado">Adoptado</option>
            <option value="en_hogar_temporal">En hogar temporal</option>
            <option value="buscando_nuevo_hogar_temporal">Buscando nuevo hogar temporal</option>
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            <input type="checkbox" name="busca_hogar_temporal" checked={form.busca_hogar_temporal} onChange={handleChange} />
            &nbsp;¿Busca hogar temporal?
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Refugio:</label>
          <input type="text" value={refugioNombre} disabled style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #90EE90', background: '#eee' }} />
        </div>
        <button type="submit" disabled={loading} style={{ background: '#228B22', color: '#fff', padding: '10px 24px', borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer' }}>Guardar</button>
        {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: 10 }}>¡Animal creado correctamente!</div>}
      </form>
    </div>
  );
};

export default AnimalForm;
