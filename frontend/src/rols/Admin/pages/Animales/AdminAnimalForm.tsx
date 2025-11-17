import React, { useState } from 'react';

interface AdminAnimalFormProps {
  refugios: { id: number; nombre: string }[];
  onCreated?: () => void;
  onCancel?: () => void;
}

const AdminAnimalForm: React.FC<AdminAnimalFormProps> = ({ refugios, onCreated, onCancel }) => {
  const [form, setForm] = useState({
    nombre: '',
    edad: '',
    especie: '',
    descripcion: '',
    estado: 'disponible',
    sexo: '',
    tamano: '',
    busca_hogar_temporal: false,
    refugio: '',
    fotos: [] as string[],
    vacunas: [] as any[],
  });
  const [fotoInput, setFotoInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAddFoto = () => {
    if (!fotoInput) return;
    setForm(f => ({ ...f, fotos: [...(f.fotos || []), fotoInput] }));
    setFotoInput('');
  };

  const handleRemoveFoto = (idx: number) => {
    setForm(f => ({ ...f, fotos: (f.fotos || []).filter((_: any, i: number) => i !== idx) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      // Aquí deberías llamar a tu función de creación de animal en admin
      // await createAnimal(data, token);
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
        refugio: '',
        fotos: [],
        vacunas: [],
      });
      if (onCreated) onCreated();
    } catch (err: any) {
      setError(err.message || 'Error al crear animal');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: 32, background: '#f6fff6', borderRadius: 18, boxShadow: '0 2px 18px #228b2233' }}>
      <h2 style={{ color: '#145214', marginBottom: 18, textAlign: 'center', letterSpacing: 1 }}>Registro de Animal (Admin)</h2>
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
          <select name="refugio" value={form.refugio} onChange={handleChange} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #90EE90', fontSize: '1rem', marginTop: 4 }} required>
            <option value="">Selecciona refugio</option>
            {refugios.map(r => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </select>
        </div>
        <hr style={{ margin: '18px 0', border: 'none', borderTop: '1.5px solid #90EE90' }} />
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600 }}>Fotos (máx 3):</label>
          <input type="text" value={fotoInput} onChange={e => setFotoInput(e.target.value)} placeholder="URL de foto" style={{ marginTop: 8, width: '100%', padding: 8, borderRadius: 8, border: '1px solid #90EE90' }} />
          <button type="button" onClick={handleAddFoto} style={{ background: '#43a047', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 700, marginTop: 8 }}>Agregar foto</button>
          <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            {form.fotos.length === 0 ? (
              <div style={{ color: '#888', fontSize: 15 }}>No hay fotos seleccionadas.</div>
            ) : (
              form.fotos.map((foto, idx) => (
                <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                  <img src={foto} alt={`Foto ${idx+1}`} style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 10, border: '2px solid #90EE90', boxShadow: '0 2px 8px #90EE9022' }} />
                  <button type="button" style={{ position: 'absolute', top: 2, right: 2, background: '#e53935', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, fontSize: 14, cursor: 'pointer' }} onClick={() => handleRemoveFoto(idx)}>×</button>
                </div>
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

export default AdminAnimalForm;
