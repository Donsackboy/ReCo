import React, { useState, useEffect } from 'react';
import { getAnimales, createVacunaAdmin } from '../../api/ApiAdmin';

const CrearVacunaAdmin: React.FC = () => {
  const [animales, setAnimales] = useState<any[]>([]);
  const [animalId, setAnimalId] = useState('');
  const [vacuna, setVacuna] = useState({
    nombre: '',
    descripcion: '',
    frecuencia: '',
    obligatoria: false,
    precio: 0,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    getAnimales(token)
      .then(setAnimales)
      .catch(() => setError('Error al cargar animales'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: string | boolean | number = value;
    if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    }
    setVacuna(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const token = localStorage.getItem('token');
    if (!token || !animalId) {
      setError('Selecciona un animal y asegúrate de estar logueado');
      setLoading(false);
      return;
    }
    try {
      await createVacunaAdmin(token, Number(animalId), vacuna);
      setSuccess('Vacuna creada exitosamente');
      setVacuna({ nombre: '', descripcion: '', frecuencia: '', obligatoria: false, precio: 0 });
    } catch {
      setError('Error al crear vacuna');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', background: '#f0fff4', borderRadius: 18, boxShadow: '0 2px 12px #43ea6b22', padding: 32 }}>
      <h2 style={{ color: '#145214', marginBottom: 18 }}>Crear vacuna para animal</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label style={{ fontWeight: 600 }}>Selecciona el animal</label>
        <select value={animalId} onChange={e => setAnimalId(e.target.value)} required style={{ padding: 8, borderRadius: 8, border: '1.5px solid #43ea6b' }}>
          <option value="">Elige un animal</option>
          {animales.map(a => (
            <option key={a.id} value={a.id}>{a.nombre} ({a.especie})</option>
          ))}
        </select>
        <label style={{ fontWeight: 600 }}>Nombre de la vacuna</label>
        <input name="nombre" value={vacuna.nombre} onChange={handleChange} required style={{ padding: 8, borderRadius: 8, border: '1.5px solid #43ea6b' }} />
        <label style={{ fontWeight: 600 }}>Descripción</label>
        <input name="descripcion" value={vacuna.descripcion} onChange={handleChange} style={{ padding: 8, borderRadius: 8, border: '1.5px solid #43ea6b' }} />
        <label style={{ fontWeight: 600 }}>Frecuencia</label>
        <input name="frecuencia" value={vacuna.frecuencia} onChange={handleChange} style={{ padding: 8, borderRadius: 8, border: '1.5px solid #43ea6b' }} />
        <label style={{ fontWeight: 600 }}>Obligatoria</label>
        <input type="checkbox" name="obligatoria" checked={vacuna.obligatoria} onChange={handleChange} />
        <label style={{ fontWeight: 600 }}>Precio sugerido</label>
        <input type="number" name="precio" value={vacuna.precio} onChange={handleChange} min={0} style={{ padding: 8, borderRadius: 8, border: '1.5px solid #43ea6b' }} />
        <button type="submit" disabled={loading} style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 0', fontWeight: 700, fontSize: '1.08rem', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px #43ea6b22', marginTop: 12 }}>
          Crear vacuna
        </button>
        {success && <div style={{ color: '#228B22', marginTop: 8 }}>{success}</div>}
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </form>
    </div>
  );
};

export default CrearVacunaAdmin;
