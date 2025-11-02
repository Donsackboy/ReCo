import React, { useState, useEffect } from 'react';
import { createAnimal, API_BASE } from '../../../../../../src/api';
// importación ya agrupada arriba



interface AnimalFormProps {
  onCreated?: () => void;
  onCancel?: () => void;
}

const AnimalForm: React.FC<AnimalFormProps> = ({ onCreated, onCancel }) => {
  // Obtener refugio del usuario autenticado
  const userStr = localStorage.getItem('user');
  const userObj = userStr ? JSON.parse(userStr) : null;
  const refugioId = userObj?.refugio?.id_refugio;
  const refugioNombre = userObj?.refugio?.nombre || '';
  const [form, setForm] = useState({
    nombre: '',
    edad: '',
    especie: '',
    descripcion: '',
    estado: 'disponible',
    sexo: '',
    tamano: '',
    busca_hogar_temporal: false,
    refugio: refugioId,
    fotos: [] as string[],
  });
  // Procesa imágenes seleccionadas y guarda URLs en form.fotos
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArr = Array.from(files).slice(0, 3); // máximo 3 imágenes
    const readers = fileArr.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(urls => {
      setForm(f => ({ ...f, fotos: urls }));
    });
  };

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
        sexo: form.sexo,
        tamano: form.tamano,
        busca_hogar_temporal: form.busca_hogar_temporal,
        refugio: Number(refugioId),
        fotos: form.fotos,
      };
      await createAnimal(data, token);
    setSuccess(true);
    setForm({
      nombre: '',
      edad: '',
      especie: '',
      descripcion: '',
      estado: 'disponible',
      sexo: '',
      tamano: '',
      busca_hogar_temporal: false,
      refugio: refugioId,
      fotos: [],
    });
    if (onCreated) onCreated();
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
    <div style={{ maxWidth: 520, margin: '0 auto', padding: 32, background: '#f6fff6', borderRadius: 18, boxShadow: '0 2px 18px #228b2233' }}>
      <h2 style={{ color: '#145214', marginBottom: 18, textAlign: 'center', letterSpacing: 1 }}>Registro de Animal</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
          <div>
            <label style={{ fontWeight: 600 }}>Nombre:</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre del animal" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #90EE90', fontSize: '1rem', marginTop: 4 }} required />
          </div>
          <div>
            <label style={{ fontWeight: 600 }}>Edad:</label>
            <input type="number" name="edad" value={form.edad} onChange={handleChange} placeholder="Edad" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #90EE90', fontSize: '1rem', marginTop: 4 }} />
          </div>
          <div>
            <label style={{ fontWeight: 600 }}>Especie:</label>
            <select name="especie" value={form.especie} onChange={handleChange} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #90EE90', fontSize: '1rem', marginTop: 4 }} required>
              <option value="">Selecciona especie</option>
              <option value="perro">Perro</option>
              <option value="gato">Gato</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 600 }}>Sexo:</label>
            <select name="sexo" value={form.sexo} onChange={handleChange} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #90EE90', fontSize: '1rem', marginTop: 4 }} required>
              <option value="">Selecciona sexo</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 600 }}>Tamaño:</label>
            <select name="tamano" value={form.tamano} onChange={handleChange} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #90EE90', fontSize: '1rem', marginTop: 4 }} required>
              <option value="">Selecciona tamaño</option>
              <option value="Pequeño">Pequeño</option>
              <option value="Pequeño-Grande">Pequeño-Grande</option>
              <option value="Media">Media</option>
              <option value="Mediano">Mediano</option>
              <option value="Mediano-Grande">Mediano-Grande</option>
              <option value="Grande">Grande</option>
              <option value="Gigante">Gigante</option>
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 600 }}>Estado:</label>
            <select name="estado" value={form.estado} onChange={handleChange} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #90EE90', fontSize: '1rem', marginTop: 4 }} required>
              <option value="disponible">Disponible</option>
              <option value="adoptado">Adoptado</option>
              <option value="en_hogar_temporal">En hogar temporal</option>
              <option value="buscando_nuevo_hogar_temporal">Buscando nuevo hogar temporal</option>
            </select>
          </div>
        </div>
        <hr style={{ margin: '18px 0', border: 'none', borderTop: '1.5px solid #90EE90' }} />
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600 }}>Descripción:</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} placeholder="Descripción del animal" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #90EE90', fontSize: '1rem', marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600 }}>
            <input type="checkbox" name="busca_hogar_temporal" checked={form.busca_hogar_temporal} onChange={handleChange} style={{ marginRight: 8 }} />
            ¿Busca hogar temporal?
          </label>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600 }}>Refugio:</label>
          <input type="text" value={refugioNombre} disabled style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #90EE90', background: '#eee', fontSize: '1rem', marginTop: 4 }} />
        </div>
        <hr style={{ margin: '18px 0', border: 'none', borderTop: '1.5px solid #90EE90' }} />
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600 }}>Fotos (máx 3):</label>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ marginTop: 8 }} />
          <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            {form.fotos.length === 0 ? (
              <div style={{ color: '#888', fontSize: 15 }}>No hay fotos seleccionadas.</div>
            ) : (
              form.fotos.map((foto, idx) => (
                <img key={idx} src={foto} alt={`Foto ${idx+1}`} style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 10, border: '2px solid #90EE90', boxShadow: '0 2px 8px #90EE9022' }} />
              ))
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
          <button type="submit" disabled={loading} style={{ background: '#228B22', color: '#fff', padding: '12px 32px', borderRadius: 10, border: 'none', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 8px #228b2233', width: '100%' }}>Guardar</button>
          <button type="button" onClick={onCancel} style={{ background: '#eee', color: '#228B22', padding: '12px 32px', borderRadius: 10, border: '1.5px solid #43ea6b', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 8px #43ea6b22', width: '100%' }}>Cancelar</button>
        </div>
        {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: 10 }}>¡Animal creado correctamente!</div>}
      </form>
    </div>
  );
};

export default AnimalForm;
