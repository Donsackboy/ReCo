import { useState } from 'react';
import { updateAnimal } from '../../../../../../src/api.js';

import type { Animal, Vacuna } from './AnimalList';

interface AnimalEditPerfilProps {
  animal: Animal;
  onClose: () => void;
  onSave: (updated?: Animal) => void;
}

export default function AnimalEditPerfil({ animal, onClose, onSave }: AnimalEditPerfilProps) {
  // Mover foto actual a la izquierda
  const handleMoveFotoLeft = () => {
    if (form.fotos.length < 2 || currentFoto === 0) return;
    setForm(f => {
      const fotos = [...f.fotos];
      [fotos[currentFoto - 1], fotos[currentFoto]] = [fotos[currentFoto], fotos[currentFoto - 1]];
      return { ...f, fotos };
    });
    setCurrentFoto(prev => Math.max(0, prev - 1));
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
  // Mover foto actual a la izquierda
  const [form, setForm] = useState({
    nombre: animal.nombre || '',
    edad: animal.edad || '',
    especie: animal.especie || '',
    descripcion: animal.descripcion || '',
    estado: animal.estado || 'disponible',
    sexo: animal.sexo || '',
    tamano: animal.tamano || '',
    fecha_ingreso: animal.fecha_ingreso || '',
    fecha_cumpleanos: animal.fecha_cumpleanos || '',
    ubicacion_actual: animal.ubicacion_actual || 'refugio',
    busca_hogar_temporal: animal.busca_hogar_temporal || false,
    refugio: animal.refugio,
    vacunas: (animal.vacunas as Vacuna[]) || [],
    fotos: Array.isArray((animal as any).fotos) ? (animal as any).fotos : [],
  });
  // Eliminar foto del array
  const handleRemoveFoto = (idx: number) => {
    setForm(f => ({ ...f, fotos: f.fotos.filter((_: string, i: number) => i !== idx) }));
    if (idx === currentFoto && currentFoto > 0) setCurrentFoto(currentFoto - 1);
    else if (idx === currentFoto && currentFoto === form.fotos.length - 1) setCurrentFoto(0);
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
      setCurrentFoto(form.fotos.length); // Muestra la última agregada
    });
  };

  // Carrusel de fotos
  const [currentFoto, setCurrentFoto] = useState(0);
  const handlePrevFoto = () => {
    setCurrentFoto(f => f === 0 ? form.fotos.length - 1 : f - 1);
  };
  const handleNextFoto = () => {
    setCurrentFoto(f => f === form.fotos.length - 1 ? 0 : f + 1);
  };
  const [fullscreenImg, setFullscreenImg] = useState<string | null>(null);
  const [vacuna, setVacuna] = useState<Vacuna>({ tipo: '', fecha: '', refuerzo: '', unica: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const name = target.name;
    const type = target.type;
    const value = target.value;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: (target as HTMLInputElement).checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Vacuna input change handler
  const handleVacunaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value } = e.target;
    if (type === 'checkbox') {
      setVacuna(v => ({ ...v, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setVacuna(v => ({ ...v, [name]: value }));
    }
  };

  // Add vacuna to list
  const handleAddVacuna = () => {
    if (!vacuna.tipo || !vacuna.fecha) return;
    setForm(f => ({ ...f, vacunas: [...f.vacunas, vacuna] }));
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
      // Enviar fechas como null si están vacías
      const dataToSend = {
        ...form,
        fecha_ingreso: form.fecha_ingreso ? form.fecha_ingreso : null,
        fecha_cumpleanos: form.fecha_cumpleanos ? form.fecha_cumpleanos : null,
      };
      await updateAnimal(animal.id_animal, dataToSend, token);
      setSuccess(true);
      if (onSave) onSave();
    } catch (err) {
      setError('Error al guardar cambios');
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(34,139,34,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        maxWidth: 1100,
        minWidth: 700,
        width: '90vw',
        minHeight: 700,
        background: '#f6fff6',
        borderRadius: 28,
        boxShadow: '0 8px 40px #228b2233',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Botón X de cerrar/cancelar arriba a la derecha */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 28,
            background: 'none',
            color: '#e74c3c',
            fontSize: '2.2rem',
            fontWeight: 900,
            border: 'none',
            cursor: 'pointer',
            zIndex: 10001,
            lineHeight: 1
          }}
          aria-label="Cerrar edición"
        >×</button>
        <div style={{ flex: 1, overflowY: 'auto', padding: 48 }}>
          <h2 style={{ color: '#145214', marginBottom: 18, textAlign: 'center', fontWeight: 800, letterSpacing: 1.5, fontSize: '2.2rem' }}>Editar Perfil de {form.nombre}</h2>
          <form onSubmit={handleSubmit} style={{ overflowY: 'auto', maxHeight: '70vh' }}>
            {/* FORMULARIO PRINCIPAL */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18, marginBottom: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontWeight: 600, color: '#145214', marginBottom: 2 }}>Ubicación actual:</label>
                <select name="ubicacion_actual" value={form.ubicacion_actual} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #90EE90', fontSize: '1rem', background: '#fff' }}>
                  <option value="refugio">Refugio</option>
                  <option value="hogar_temporal">Hogar temporal</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontWeight: 600, color: '#145214', marginBottom: 2 }}>Nombre:</label>
                <input name="nombre" value={form.nombre} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #90EE90', fontSize: '1rem', boxShadow: '0 1px 6px #90EE9022' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontWeight: 600, color: '#145214', marginBottom: 2 }}>Edad:</label>
                <input name="edad" value={form.edad} onChange={handleChange} type="number" min="0" style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #90EE90', fontSize: '1rem', boxShadow: '0 1px 6px #90EE9022' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontWeight: 600, color: '#145214', marginBottom: 2 }}>Tamaño:</label>
                <select name="tamano" value={form.tamano} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #90EE90', fontSize: '1rem', background: '#fff' }}>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontWeight: 600, color: '#145214', marginBottom: 2 }}>Fecha de ingreso:</label>
                <input name="fecha_ingreso" value={form.fecha_ingreso} onChange={handleChange} type="date" style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #90EE90', fontSize: '1rem', boxShadow: '0 1px 6px #90EE9022' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontWeight: 600, color: '#145214', marginBottom: 2 }}>Fecha de cumpleaños (opcional):</label>
                <input name="fecha_cumpleanos" value={form.fecha_cumpleanos} onChange={handleChange} type="date" style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #90EE90', fontSize: '1rem', boxShadow: '0 1px 6px #90EE9022' }} />
              </div>
            </div>
            {/* ...existing code... */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontWeight: 600, color: '#145214', marginBottom: 2 }}>Sexo:</label>
            <select name="sexo" value={form.sexo} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #90EE90', fontSize: '1rem', background: '#fff' }}>
              <option value="">Selecciona sexo</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontWeight: 600, color: '#145214', marginBottom: 2 }}>Estado:</label>
            <select name="estado" value={form.estado} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #90EE90', fontSize: '1rem', background: '#fff' }}>
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
            <input name="tipo" value={vacuna.tipo} onChange={e => handleVacunaChange(e)} placeholder="Tipo" style={{ width: 120, padding: 8, borderRadius: 8, border: '1.5px solid #90EE90', fontSize: '1rem' }} />
            <input name="fecha" value={vacuna.fecha} onChange={e => handleVacunaChange(e)} type="date" style={{ width: 120, padding: 8, borderRadius: 8, border: '1.5px solid #90EE90', fontSize: '1rem' }} />
            <input name="refuerzo" value={vacuna.refuerzo} onChange={e => handleVacunaChange(e)} placeholder="Próximo refuerzo" style={{ width: 120, padding: 8, borderRadius: 8, border: '1.5px solid #90EE90', fontSize: '1rem' }} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
              <input type="checkbox" name="unica" checked={vacuna.unica} onChange={e => handleVacunaChange(e)} /> Única
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
        {/* Gestión de fotos con carrusel */}
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
        <div style={{ marginTop: 32, display: 'flex', gap: 24, justifyContent: 'center' }}>
          <button type="submit" disabled={loading} style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px 38px', fontWeight: 800, fontSize: '1.12rem', cursor: 'pointer', boxShadow: '0 2px 12px #43ea6b33', transition: 'box-shadow 0.2s' }}>Guardar cambios</button>
          <button type="button" onClick={onClose} style={{ background: '#fff', color: '#228B22', border: '2px solid #43ea6b', borderRadius: '12px', padding: '14px 38px', fontWeight: 800, fontSize: '1.12rem', cursor: 'pointer', boxShadow: '0 2px 12px #43ea6b22', transition: 'box-shadow 0.2s' }}>Cancelar</button>
        </div>
        {error && <div style={{ color: 'red', marginTop: 14, textAlign: 'center', fontWeight: 600 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: 14, textAlign: 'center', fontWeight: 600 }}>¡Cambios guardados correctamente!</div>}
      </form>
    </div>
        </div>
    </div>
  );
}
