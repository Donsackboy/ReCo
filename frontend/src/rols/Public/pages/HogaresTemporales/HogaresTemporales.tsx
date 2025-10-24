import React, { useState } from 'react';

// Mock de animales publicados por refugios para hogar temporal
const animales = [
  {
    id: 1,
    nombre: 'Luna',
    especie: 'Perro',
    edad: '2 años',
    motivo: 'Recuperación post-cirugía',
    region: 'Metropolitana',
    imagen: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80',
    refugio: 'Refugio Esperanza',
  },
  {
    id: 2,
    nombre: 'Milo',
    especie: 'Gato',
    edad: '1 año',
    motivo: 'Recuperación por desnutrición',
    region: 'Valparaíso',
    imagen: 'https://images.unsplash.com/photo-1518715308788-300e1e1e21c5?auto=format&fit=crop&w=400&q=80',
    refugio: 'Refugio Patitas',
  },
];

const regiones = [
  'Metropolitana',
  'Valparaíso',
  'Biobío',
  'Araucanía',
  'O’Higgins',
  'Maule',
  'Los Lagos',
  'Antofagasta',
];

const especies = ['Perro', 'Gato', 'Conejo', 'Ave', 'Otro'];

export default function HogaresTemporales() {
  const [form, setForm] = useState<{
    nombre: string;
    email: string;
    region: string;
    especies: string[];
    detalles: string;
  }>({
    nombre: '',
    email: '',
    region: '',
    especies: [],
    detalles: '',
  });
  const [enviado, setEnviado] = useState(false);

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleEspecieChange(especie: string) {
    setForm(f => {
      const especies = f.especies.includes(especie)
        ? f.especies.filter(e => e !== especie)
        : [...f.especies, especie];
      return { ...f, especies };
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviado(true);
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '40px', flexWrap: 'wrap' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto 32px auto', background: '#f0fff4', borderRadius: '18px', boxShadow: '0 2px 12px #43ea6b22', padding: '32px' }}>
        <h2 style={{ color: '#145214', marginBottom: '18px' }}>¿Qué es un hogar temporal?</h2>
        <p style={{ color: '#228B22', fontSize: '1.08rem', marginBottom: '18px' }}>
          Un hogar temporal es una familia o persona que acoge a un animal rescatado por un refugio durante un periodo limitado, generalmente mientras se recupera de una operación, enfermedad, o hasta encontrar un hogar definitivo.
        </p>
        <ul style={{ color: '#145214', fontSize: '1.05rem', marginLeft: '18px', marginBottom: '18px' }}>
          <li>Ayudas a la recuperación física y emocional de animales vulnerables.</li>
          <li>El refugio cubre gastos médicos y alimentación, salvo acuerdo distinto.</li>
          <li>Puedes elegir qué tipo de animales y de qué regiones puedes recibir.</li>
          <li>El compromiso es temporal y puedes indicar tu disponibilidad.</li>
        </ul>
        <div style={{ color: '#228B22', fontSize: '1.02rem', marginBottom: '8px' }}>
          Si quieres postularte como hogar temporal, completa el formulario en la siguiente página.
        </div>
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: '16px', marginBottom: '18px' }}>
        <a href="/hogares-temporales/registro" style={{ background: '#43ea6b', color: '#fff', fontWeight: 700, borderRadius: 8, padding: '10px 22px', textDecoration: 'none', boxShadow: '0 1px 6px #43ea6b22', border: 'none' }}>Postúlate aquí</a>
      </div>
      <section style={{ flex: 1, minWidth: 340 }}>
        {/* Sección animales publicados */}
        <h2 style={{ color: '#145214', marginBottom: '18px' }}>Animales que necesitan hogar temporal</h2>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {animales.map(animal => (
            <div key={animal.id} style={{ background: '#f0fff4', borderRadius: '14px', boxShadow: '0 2px 12px #43ea6b22', width: '260px', padding: '0 0 18px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={animal.imagen} alt={animal.nombre} style={{ width: '100%', height: '140px', objectFit: 'cover', borderTopLeftRadius: '14px', borderTopRightRadius: '14px' }} />
              <div style={{ padding: '14px', width: '100%' }}>
                <h3 style={{ color: '#145214', marginBottom: '6px', fontSize: '1.08rem' }}>{animal.nombre}</h3>
                <div style={{ color: '#228B22', fontWeight: 500 }}>{animal.especie} • {animal.edad}</div>
                <div style={{ color: '#b2e2c9', fontSize: '0.98rem', marginBottom: '8px' }}>{animal.region}</div>
                <div style={{ color: '#145214', fontSize: '0.98rem', marginBottom: '8px' }}>{animal.motivo}</div>
                <div style={{ color: '#228B22', fontSize: '0.95rem' }}>Refugio: {animal.refugio}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section style={{ flex: 1, minWidth: 340 }}>
        {/* Sección formulario de postulación */}
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
      </section>
    </div>
  );
}
