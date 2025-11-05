import React from 'react';

interface EditarAnimalModalProps {
  open: boolean;
  onClose: () => void;
  animal: any;
  refugios: any[];
  onSave: (animal: any) => void;
  // Puedes agregar más props si necesitas
}

const EditarAnimalModal: React.FC<EditarAnimalModalProps> = ({ open, onClose, animal, refugios, onSave }) => {
  const [form, setForm] = React.useState<any>(null);
  const [vacunaForm, setVacunaForm] = React.useState({ tipo: '', fecha: '' });
  const [fotoInput, setFotoInput] = React.useState('');
  React.useEffect(() => {
    if (animal && typeof animal.refugio === 'string') {
      setForm({ ...animal, refugio: Number(animal.refugio) });
    } else {
      setForm(animal);
    }
  }, [animal]);

  if (!open || !form) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as any;
    setForm((f: any) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAddVacuna = () => {
    if (!vacunaForm.tipo || !vacunaForm.fecha) return;
    setForm((f: any) => ({ ...f, vacunas: [...(f.vacunas || []), vacunaForm] }));
    setVacunaForm({ tipo: '', fecha: '' });
  };

  const handleRemoveVacuna = (idx: number) => {
    setForm((f: any) => ({ ...f, vacunas: (f.vacunas || []).filter((_: any, i: number) => i !== idx) }));
  };

  const handleAddFoto = () => {
    if (!fotoInput) return;
    setForm((f: any) => ({ ...f, imagenes: [...(f.imagenes || []), fotoInput] }));
    setFotoInput('');
  };

  const handleRemoveFoto = (idx: number) => {
    setForm((f: any) => ({ ...f, imagenes: (f.imagenes || []).filter((_: any, i: number) => i !== idx) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', padding: 32, borderRadius: 16, minWidth: 350, maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(67,160,71,0.12)', position: 'relative' }}>
        <h2 style={{ color: '#43a047', fontWeight: 700, marginBottom: 18, textAlign: 'center', fontSize: 28 }}>Editar Animal</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 18 }}>
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required style={{ padding: 10, borderRadius: 8, border: '1px solid #bdbdbd' }} />
          <input name="especie" value={form.especie} onChange={handleChange} placeholder="Especie" required style={{ padding: 10, borderRadius: 8, border: '1px solid #bdbdbd' }} />
          <input name="edad" value={form.edad} onChange={handleChange} placeholder="Edad" required style={{ padding: 10, borderRadius: 8, border: '1px solid #bdbdbd' }} />
          <select name="sexo" value={form.sexo} onChange={handleChange} required style={{ padding: 10, borderRadius: 8, border: '1px solid #bdbdbd' }}>
            <option value="">Sexo</option>
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>
          <div>
            <label htmlFor="refugio" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
              Refugio actual: <span style={{ color: '#43a047', fontWeight: 700 }}>
                {refugios.find(r => r.id === Number(form.refugio))?.nombre || refugios.find(r => r.id === form.refugio)?.nombre || 'Sin refugio'}
              </span>
            </label>
            <select name="refugio" id="refugio" value={form.refugio} onChange={handleChange} required style={{ padding: 10, borderRadius: 8, border: '1px solid #bdbdbd', width: '100%' }}>
              <option value="">Selecciona refugio</option>
              {refugios.map(r => (
                <option key={r.id} value={r.id}>{r.nombre}</option>
              ))}
            </select>
          </div>
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
              {(form.imagenes || []).map((img: string, idx: number) => (
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
              {(form.vacunas || []).map((vac: any, idx: number) => (
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
            <button type="submit" className="btn-editar" style={{ background: '#43a047', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700 }}>Guardar cambios</button>
            <button type="button" className="btn-eliminar" style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700 }} onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarAnimalModal;
