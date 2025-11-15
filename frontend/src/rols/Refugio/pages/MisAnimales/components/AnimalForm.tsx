// ...existing code...
import React, { useState } from 'react';
import { createAnimal } from '../../../api/ApiRefugio';
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
    tipo_edad: 'anios',
    especie: '',
    descripcion: '',
    estado: 'disponible',
    sexo: '',
    tamano: '',
    busca_hogar_temporal: false,
    refugio: refugioId,
    fotos: [] as string[],
  });

  // Carrusel de fotos y gestión avanzada
  const [currentFoto, setCurrentFoto] = useState(0);
  const [fullscreenImg, setFullscreenImg] = useState<string | null>(null);

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
    Promise.all(readers).then((urls: string[]) => {
      setForm((f: typeof form) => ({ ...f, fotos: [...f.fotos, ...urls].slice(0, 3) }));
      setCurrentFoto(form.fotos.length); // Muestra la última agregada
    });
  };

  // Mover foto actual a la izquierda
  const handleMoveFotoLeft = () => {
    if (form.fotos.length < 2 || currentFoto === 0) return;
    setForm((f: typeof form) => {
      const fotos = [...f.fotos];
      [fotos[currentFoto - 1], fotos[currentFoto]] = [fotos[currentFoto], fotos[currentFoto - 1]];
      return { ...f, fotos };
    });
    setCurrentFoto((prev: number) => Math.max(0, prev - 1));
  };
  // Carrusel: ir a la foto anterior
  const handlePrevFoto = () => {
    setCurrentFoto((f: number) => f === 0 ? form.fotos.length - 1 : f - 1);
  };
  // Carrusel: ir a la foto siguiente
  const handleNextFoto = () => {
    setCurrentFoto((f: number) => f === form.fotos.length - 1 ? 0 : f + 1);
  };

  // Mover foto actual a la derecha
  const handleMoveFotoRight = () => {
    if (form.fotos.length < 2 || currentFoto === form.fotos.length - 1) return;
    setForm(f => {
      const fotos = [...f.fotos];
      [fotos[currentFoto + 1], fotos[currentFoto]] = [fotos[currentFoto], fotos[currentFoto + 1]];
      return { ...f, fotos };
    });
    setCurrentFoto(prev => Math.min(form.fotos.length - 1, prev + 1));
  };

  // Eliminar foto del array
  const handleRemoveFoto = (idx: number) => {
    setForm((f: typeof form) => ({ ...f, fotos: f.fotos.filter((_: string, i: number) => i !== idx) }));
    if (idx === currentFoto && currentFoto > 0) setCurrentFoto(currentFoto - 1);
    else if (idx === currentFoto && currentFoto === form.fotos.length - 1) setCurrentFoto(0);
  };

  if (!refugioId) {
    return <div style={{ color: 'red', padding: 20 }}>Error: Tu usuario no tiene un refugio asociado. No puedes crear animales.</div>;
  }
  // Cargar refugios al montar el componente
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Obtener token del localStorage (ajusta si usas otro método)
  const token = localStorage.getItem('token') || '';

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
        tipo_edad: form.tipo_edad,
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
        tipo_edad: 'años',
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
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="number" name="edad" value={form.edad} onChange={handleChange} placeholder="Edad" min={0} style={{ width: '60%', padding: 10, borderRadius: 8, border: '1px solid #90EE90', fontSize: '1rem', marginTop: 4 }} />
              <select name="tipo_edad" value={form.tipo_edad} onChange={handleChange} style={{ width: '40%', padding: 10, borderRadius: 8, border: '1px solid #90EE90', fontSize: '1rem', marginTop: 4 }}>
                <option value="años">Años</option>
                <option value="meses">Meses</option>
              </select>
            </div>
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
        {/* Gestión de fotos con carrusel avanzado */}
        <div style={{ marginBottom: 18 }}>
          <h3 style={{ color: '#145214', fontWeight: 700, marginBottom: 10, fontSize: '1.3rem' }}>Fotos del animal</h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, marginBottom: 12, width: '100%' }}>
            {form.fotos.length === 0 ? (
              <div style={{ color: '#888', fontSize: 15 }}>No hay fotos registradas.</div>
            ) : (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: 270, height: 240, borderRadius: 18, boxShadow: '0 2px 12px #90EE9022', border: '2.5px solid #90EE90', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  {/* Left arrow */}
                  {form.fotos.length > 1 && (
                    <button type="button" onClick={handlePrevFoto} style={{ position: 'absolute', left: -80, top: '50%', transform: 'translateY(-50%)', background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '50%', width: 48, height: 48, fontWeight: 700, fontSize: '2rem', cursor: 'pointer', boxShadow: '0 1px 6px #43ea6b22', zIndex: 2 }}>{'<'}</button>
                  )}
                  <img
                    src={form.fotos[currentFoto]}
                    alt={`Foto ${currentFoto+1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 18, transition: 'transform 0.2s', cursor: 'pointer' }}
                    onClick={() => setFullscreenImg(form.fotos[currentFoto])}
                  />
                  <button type="button" onClick={() => handleRemoveFoto(currentFoto)} style={{ position: 'absolute', top: 8, right: 8, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '50%', width: 28, height: 28, fontWeight: 700, fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 1px 6px #e74c3c22', transition: 'box-shadow 0.2s', zIndex: 2 }}>×</button>
                  <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', background: '#fff', color: '#145214', borderRadius: 8, padding: '2px 10px', fontWeight: 600, fontSize: 14, boxShadow: '0 1px 6px #90EE9022', zIndex: 2 }}>{currentFoto+1} / {form.fotos.length}</div>
                  {/* Right arrow */}
                  {form.fotos.length > 1 && (
                    <button type="button" onClick={handleNextFoto} style={{ position: 'absolute', right: -80, top: '50%', transform: 'translateY(-50%)', background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '50%', width: 48, height: 48, fontWeight: 700, fontSize: '2rem', cursor: 'pointer', boxShadow: '0 1px 6px #43ea6b22', zIndex: 2 }}>{'>'}</button>
                  )}
                </div>
                {/* Modal de pantalla completa */}
                {fullscreenImg && (
                  <div
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      width: '100vw',
                      height: '100vh',
                      background: 'rgba(0,0,0,0.85)',
                      zIndex: 10000,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onClick={() => setFullscreenImg(null)}
                  >
                    <img
                      src={fullscreenImg}
                      alt="Foto animal pantalla completa"
                      style={{
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        borderRadius: 24,
                        boxShadow: '0 4px 32px #000a',
                        border: '4px solid #90EE90',
                      }}
                    />
                    <button
                      onClick={() => setFullscreenImg(null)}
                      style={{
                        position: 'absolute',
                        top: 32,
                        right: 48,
                        background: 'none',
                        color: '#fff',
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        zIndex: 10001,
                        textShadow: '0 2px 8px #000a',
                      }}
                    >×</button>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, marginBottom: 8 }}>
                  <button type="button" onClick={handleMoveFotoLeft} disabled={currentFoto === 0} style={{ background: currentFoto === 0 ? '#eee' : '#43ea6b', color: currentFoto === 0 ? '#aaa' : '#fff', border: 'none', borderRadius: '8px', padding: '6px 18px', fontWeight: 700, fontSize: '1.08rem', cursor: currentFoto === 0 ? 'not-allowed' : 'pointer', boxShadow: '0 1px 6px #43ea6b22' }}>← Mover</button>
                  <button type="button" onClick={handleMoveFotoRight} disabled={currentFoto === form.fotos.length - 1} style={{ background: currentFoto === form.fotos.length - 1 ? '#eee' : '#43ea6b', color: currentFoto === form.fotos.length - 1 ? '#aaa' : '#fff', border: 'none', borderRadius: '8px', padding: '6px 18px', fontWeight: 700, fontSize: '1.08rem', cursor: currentFoto === form.fotos.length - 1 ? 'not-allowed' : 'pointer', boxShadow: '0 1px 6px #43ea6b22' }}>Mover →</button>
                </div>
              </div>
            )}
            {form.fotos.length < 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <input type="file" accept="image/*" multiple onChange={handleAddFotos} style={{ width: 90, marginBottom: 4 }} />
                <div style={{ fontSize: 13, color: '#888' }}>Agregar foto</div>
              </div>
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
