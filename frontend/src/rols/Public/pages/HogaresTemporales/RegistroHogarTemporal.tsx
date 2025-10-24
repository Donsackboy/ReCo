import React, { useState } from 'react';

const regiones = ['Metropolitana', 'Valparaíso', 'Biobío', 'Araucanía'];
const especies = ['Perro', 'Gato', 'Conejo', 'Otro'];

export default function RegistroHogarTemporal() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    region: '',
    especies: [] as string[],
    detalles: '',
  });
  const [enviado, setEnviado] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  const handleEspecieChange = (especie: string) => {
    setForm(f => f.especies.includes(especie)
      ? { ...f, especies: f.especies.filter(e => e !== especie) }
      : { ...f, especies: [...f.especies, especie] });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
  };

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', background: '#f0fff4', borderRadius: '18px', boxShadow: '0 2px 12px #43ea6b22', padding: '32px' }}>
      <h2 style={{ color: '#145214', marginBottom: '18px' }}>Postúlate como hogar temporal</h2>
      {enviado ? (
        <div style={{ background: '#eaffea', borderRadius: 14, boxShadow: '0 1px 8px #43ea6b22', padding: 32, textAlign: 'center' }}>
          <h3 style={{ color: '#145214' }}>¡Gracias por tu postulación!</h3>
          <p style={{ color: '#228B22' }}>Tu información será revisada por los refugios y podrán contactarte si necesitan un hogar temporal en tu región.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: '#f0fff4', borderRadius: 14, boxShadow: '0 2px 12px #43ea6b22', padding: 32 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#145214', fontWeight: 500 }}>Nombre:</label><br />
            <input type="text" name="nombre" value={form.nombre} onChange={handleFormChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #b2e2c9', marginTop: 4 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#145214', fontWeight: 500 }}>Email de contacto:</label><br />
            <input type="email" name="email" value={form.email} onChange={handleFormChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #b2e2c9', marginTop: 4 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#145214', fontWeight: 500 }}>Región donde aceptas animales:</label><br />
            <select name="region" value={form.region} onChange={handleFormChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #b2e2c9', marginTop: 4 }}>
              <option value="">Selecciona...</option>
              {regiones.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#145214', fontWeight: 500 }}>Tipo de animales que aceptas:</label><br />
            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
              {especies.map(e => (
                <label key={e} style={{ color: '#228B22', fontWeight: 400 }}>
                  <input
                    type="checkbox"
                    checked={form.especies.includes(e)}
                    onChange={() => handleEspecieChange(e)}
                    style={{ marginRight: 6 }}
                  />
                  {e}
                </label>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#145214', fontWeight: 500 }}>Detalles (opcional):</label><br />
            <textarea name="detalles" value={form.detalles} onChange={handleFormChange} rows={3} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #b2e2c9', marginTop: 4 }} />
          </div>
          <button type="submit" style={{ background: '#43ea6b', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontSize: '1rem' }}>Postularme</button>
        </form>
      )}
    </div>
  );
}
