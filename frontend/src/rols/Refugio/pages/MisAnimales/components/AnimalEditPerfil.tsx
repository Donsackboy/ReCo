import { useState } from 'react';
import { updateAnimal } from '../../../../../../src/api.js';

import type { Animal, Vacuna } from './AnimalList';

interface AnimalEditPerfilProps {
  animal: Animal;
  onClose: () => void;
  onSave: (updated?: Animal) => void;
}

export default function AnimalEditPerfil({ animal, onClose, onSave }: AnimalEditPerfilProps) {
  const [form, setForm] = useState({
    nombre: animal.nombre || '',
    edad: animal.edad || '',
    especie: animal.especie || '',
    descripcion: animal.descripcion || '',
    estado: animal.estado || 'disponible',
    sexo: animal.sexo || '',
    tamano: animal.tamano || '',
    busca_hogar_temporal: animal.busca_hogar_temporal || false,
    refugio: animal.refugio,
    vacunas: (animal.vacunas as Vacuna[]) || [],
    fotos: Array.isArray((animal as any).fotos) ? (animal as any).fotos : [],
  });
  // Eliminar foto del array
  const handleRemoveFoto = (idx: number) => {
    setForm(f => ({ ...f, fotos: f.fotos.filter((_: string, i: number) => i !== idx) }));
  };

  // Agregar nuevas fotos (máx 3 en total)
  const handleAddFotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const restantes = 3 - form.fotos.length;
    const fileArr = Array.from(files).slice(0, restantes);
    const readers = fileArr.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(urls => {
      setForm(f => ({ ...f, fotos: [...f.fotos, ...urls].slice(0, 3) }));
    });
  };
  const [vacuna, setVacuna] = useState<Vacuna>({ tipo: '', fecha: '', refuerzo: '', unica: false });
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

  const handleVacunaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setVacuna({ ...vacuna, [name]: e.target.checked });
    } else {
      setVacuna({ ...vacuna, [name]: value });
    }
  };

  const handleAddVacuna = () => {
    if (!vacuna.tipo || !vacuna.fecha) return;
    setForm({ ...form, vacunas: [...form.vacunas, vacuna] });
    setVacuna({ tipo: '', fecha: '', refuerzo: '', unica: false });
  };

  const handleRemoveVacuna = (idx: number) => {
    setForm({ ...form, vacunas: form.vacunas.filter((_, i: number) => i !== idx) });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const token = localStorage.getItem('token');
      await updateAnimal(animal.id_animal, form, token);
      setSuccess(true);
      if (onSave) onSave();
    } catch (err) {
      setError('Error al guardar cambios');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 1000, minWidth: 650, margin: '0 auto', padding: 48, background: '#f6fff6', borderRadius: 20, boxShadow: '0 6px 32px #228b2233', fontFamily: 'Segoe UI, Arial, sans-serif' }}>
      <h2 style={{ color: '#145214', marginBottom: 5, textAlign: 'center', fontWeight: 800, letterSpacing: 1.5, fontSize: '2.2rem' }}>Editar Perfil de {form.nombre}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32, marginBottom: 24 }}>
          <div>
            <label style={{ fontWeight: 600, color: '#145214' }}>Nombre:</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 10, border: '1.5px solid #90EE90', fontSize: '1rem', marginTop: 4, boxShadow: '0 1px 6px #90EE9022' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, color: '#145214' }}>Edad:</label>
            <input name="edad" value={form.edad} onChange={handleChange} type="number" min="0" style={{ width: '100%', padding: 10, borderRadius: 10, border: '1.5px solid #90EE90', fontSize: '1rem', marginTop: 4, boxShadow: '0 1px 6px #90EE9022' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, color: '#145214' }}>Especie:</label>
            <select name="especie" value={form.especie} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 10, border: '1.5px solid #90EE90', fontSize: '1rem', marginTop: 4, background: '#fff' }}>
              <option value="">Selecciona especie</option>
              <option value="perro">Perro</option>
              <option value="gato">Gato</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 600, color: '#145214' }}>Sexo:</label>
            <select name="sexo" value={form.sexo} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 10, border: '1.5px solid #90EE90', fontSize: '1rem', marginTop: 4, background: '#fff' }}>
              <option value="">Selecciona sexo</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 600, color: '#145214' }}>Tamaño:</label>
            <select name="tamano" value={form.tamano} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 10, border: '1.5px solid #90EE90', fontSize: '1rem', marginTop: 4, background: '#fff' }}>
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
            <label style={{ fontWeight: 600, color: '#145214' }}>Estado:</label>
            <select name="estado" value={form.estado} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 10, border: '1.5px solid #90EE90', fontSize: '1rem', marginTop: 4, background: '#fff' }}>
              <option value="disponible">Disponible</option>
              <option value="adoptado">Adoptado</option>
              <option value="en_hogar_temporal">En hogar temporal</option>
              <option value="buscando_nuevo_hogar_temporal">Buscando nuevo hogar temporal</option>
            </select>
          </div>
        </div>
        <hr style={{ margin: '20px 0', border: 'none', borderTop: '2px solid #90EE90' }} />
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600, color: '#145214' }}>Descripción:</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} style={{ width: '100%', padding: 10, borderRadius: 10, border: '1.5px solid #90EE90', fontSize: '1rem', marginTop: 4, boxShadow: '0 1px 6px #90EE9022' }} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600, color: '#145214' }}>
            <input type="checkbox" name="busca_hogar_temporal" checked={form.busca_hogar_temporal} onChange={handleChange} style={{ marginRight: 8 }} />
            ¿Busca hogar temporal?
          </label>
        </div>
        <hr style={{ margin: '20px 0', border: 'none', borderTop: '2px solid #90EE90' }} />
        <div style={{ marginBottom: 18 }}>
          <h3 style={{ color: '#145214', fontWeight: 700, marginBottom: 10, fontSize: '1.3rem' }}>Vacunas</h3>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <input name="tipo" value={vacuna.tipo} onChange={handleVacunaChange} placeholder="Tipo" style={{ width: 120, padding: 8, borderRadius: 8, border: '1.5px solid #90EE90', fontSize: '1rem' }} />
            <input name="fecha" value={vacuna.fecha} onChange={handleVacunaChange} type="date" style={{ width: 120, padding: 8, borderRadius: 8, border: '1.5px solid #90EE90', fontSize: '1rem' }} />
            <input name="refuerzo" value={vacuna.refuerzo} onChange={handleVacunaChange} placeholder="Próximo refuerzo" style={{ width: 120, padding: 8, borderRadius: 8, border: '1.5px solid #90EE90', fontSize: '1rem' }} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
              <input type="checkbox" name="unica" checked={vacuna.unica} onChange={handleVacunaChange} /> Única
            </label>
            <button type="button" onClick={handleAddVacuna} style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 18px', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', boxShadow: '0 2px 8px #43ea6b22', transition: 'box-shadow 0.2s' }}>Agregar</button>
          </div>
          <ul style={{ marginTop: 8 }}>
            {form.vacunas.length === 0 ? (
              <li style={{ color: '#888' }}>No hay vacunas registradas.</li>
            ) : (
              form.vacunas.map((v: Vacuna, idx: number) => (
                <li key={idx} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#eafbe7', borderRadius: 8, padding: '6px 12px' }}>
                  <span style={{ color: '#145214' }}><strong>{v.tipo}</strong> {v.unica ? '(única aplicación)' : ''} - Fecha: {v.fecha} {v.refuerzo ? `• Próximo refuerzo: ${v.refuerzo}` : ''}</span>
                  <button type="button" onClick={() => handleRemoveVacuna(idx)} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '8px', padding: '4px 10px', fontWeight: 700, fontSize: '0.98rem', cursor: 'pointer', marginLeft: 12, boxShadow: '0 1px 6px #e74c3c22', transition: 'box-shadow 0.2s' }}>Eliminar</button>
                </li>
              ))
            )}
          </ul>
        </div>
        <hr style={{ margin: '20px 0', border: 'none', borderTop: '2px solid #90EE90' }} />
        {/* Gestión de fotos */}
        <div style={{ marginBottom: 18 }}>
          <h3 style={{ color: '#145214', fontWeight: 700, marginBottom: 10, fontSize: '1.3rem' }}>Fotos del animal</h3>
          <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
            {form.fotos.length === 0 ? (
              <div style={{ color: '#888', fontSize: 15 }}>No hay fotos registradas.</div>
            ) : (
              form.fotos.map((foto: string, idx: number) => (
                <div key={idx} style={{ position: 'relative', borderRadius: 12, boxShadow: '0 2px 8px #90EE9022', border: '2px solid #90EE90', overflow: 'hidden', width: 90, height: 90, background: '#fff' }}>
                  <img src={foto} alt={`Foto ${idx+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12, transition: 'transform 0.2s' }} />
                  <button type="button" onClick={() => handleRemoveFoto(idx)} style={{ position: 'absolute', top: 4, right: 4, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '50%', width: 26, height: 26, fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 1px 6px #e74c3c22', transition: 'box-shadow 0.2s' }}>×</button>
                </div>
              ))
            )}
            {form.fotos.length < 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <input type="file" accept="image/*" multiple onChange={handleAddFotos} style={{ width: 90, marginBottom: 4 }} />
                <div style={{ fontSize: 13, color: '#888' }}>Agregar foto</div>
              </div>
            )}
          </div>
        </div>
        <div style={{ marginTop: 32, display: 'flex', gap: 24, justifyContent: 'center' }}>
          <button type="submit" disabled={loading} style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px 38px', fontWeight: 800, fontSize: '1.12rem', cursor: 'pointer', boxShadow: '0 2px 12px #43ea6b33', transition: 'box-shadow 0.2s' }}>Guardar cambios</button>
          <button type="button" onClick={onClose} style={{ background: '#fff', color: '#228B22', border: '2px solid #43ea6b', borderRadius: '12px', padding: '14px 38px', fontWeight: 800, fontSize: '1.12rem', cursor: 'pointer', boxShadow: '0 2px 12px #43ea6b22', transition: 'box-shadow 0.2s' }}>Cancelar</button>
        </div>
        {error && <div style={{ color: 'red', marginTop: 14, textAlign: 'center', fontWeight: 600 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: 14, textAlign: 'center', fontWeight: 600 }}>¡Cambios guardados correctamente!</div>}
      </form>
    </div>
  );
}
