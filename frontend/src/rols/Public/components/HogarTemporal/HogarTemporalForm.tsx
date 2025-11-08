import React from 'react';

interface AnimalHogar {
  tipo: string;
  tamaño?: 'Grande' | 'Mediano' | 'Chico' | '';
}

interface HogarTemporalFormProps {
  form: {
    nombre: string;
    email: string;
    regiones: string[];
    especies: string[];
    detalles: string;
    otrosAnimales: boolean;
    animalesHogar: AnimalHogar[];
    vivienda: 'Casa' | 'Departamento' | '';
    preguntasExtra: string;
    direccion: string;
  };
  regiones: string[];
  especies: string[];
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleRegionChange: (region: string) => void;
  handleEspecieChange: (especie: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleAnimalesHogarChange: (index: number, field: string, value: string) => void;
  handleAddAnimalHogar: () => void;
  handleRemoveAnimalHogar: (index: number) => void;
  ocultarSeleccion?: boolean;
}

const HogarTemporalForm: React.FC<HogarTemporalFormProps> = ({
  form,
  regiones,
  especies,
  handleFormChange,
  handleRegionChange,
  handleEspecieChange,
  handleSubmit,
  handleAnimalesHogarChange,
  handleAddAnimalHogar,
  handleRemoveAnimalHogar,
  ocultarSeleccion = false,
}) => {
  const regionesConTodas = ['Todas', ...(regiones || [])];
  const tiposAnimales = ['Perro', 'Gato', 'Conejo', 'Ave', 'Otro'];
  const tamañosPerro = ['Grande', 'Mediano', 'Chico'];

  return (
    <form onSubmit={handleSubmit} style={{ background: 'linear-gradient(135deg, #eaffea 0%, #f0fff4 100%)', borderRadius: 18, boxShadow: '0 4px 24px #43ea6b33', padding: 40, maxWidth: 1200, margin: '0 auto', border: '1.5px solid #b2e2c9' }}>
      <div style={{ marginBottom: 22 }}>
        <label style={{ color: '#145214', fontWeight: 600, fontSize: '1.08rem', letterSpacing: 0.5 }}>Nombre completo:</label><br />
        <input type="text" name="nombre" value={form.nombre} onChange={handleFormChange} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #43ea6b', marginTop: 6, fontSize: '1rem', background: '#fff' }} />
      </div>
      <div style={{ marginBottom: 22 }}>
        <label style={{ color: '#145214', fontWeight: 600, fontSize: '1.08rem', letterSpacing: 0.5 }}>Email de contacto:</label><br />
        <input type="email" name="email" value={form.email} onChange={handleFormChange} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #43ea6b', marginTop: 6, fontSize: '1rem', background: '#fff' }} />
      </div>
      {!ocultarSeleccion && (
        <>
          <div style={{ marginBottom: 22 }}>
            <label style={{ color: '#145214', fontWeight: 600, fontSize: '1.08rem', letterSpacing: 0.5 }}>Regiones de donde aceptas animales:</label><br />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8, maxHeight: 320, overflowY: 'auto' }}>
              {regionesConTodas.map(r => (
                <label key={r} style={{ color: r === 'Todas' ? '#43ea6b' : '#228B22', fontWeight: r === 'Todas' ? 700 : 400, fontSize: r === 'Todas' ? '1.05rem' : '1rem', background: r === 'Todas' ? '#eaffea' : 'none', borderRadius: 6, padding: r === 'Todas' ? '2px 8px' : '0', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={r === 'Todas'
                      ? form.regiones.length === regiones.length
                      : form.regiones.includes(r)}
                    onChange={() => {
                      if (r === 'Todas') {
                        if (form.regiones.length === regiones.length) {
                          handleFormChange({ target: { name: 'regiones', value: [] } } as any);
                        } else {
                          handleFormChange({ target: { name: 'regiones', value: [...regiones] } } as any);
                        }
                      } else {
                        handleRegionChange(r);
                      }
                    }}
                    style={{ marginRight: 8 }}
                  />
                  {r}
                </label>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ color: '#145214', fontWeight: 600, fontSize: '1.08rem', letterSpacing: 0.5 }}>Tipo de animales que aceptas:</label><br />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {especies.map(e => (
                <label key={e} style={{ color: '#228B22', fontWeight: 400, fontSize: '1rem', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={form.especies.includes(e)}
                    onChange={() => handleEspecieChange(e)}
                    style={{ marginRight: 8 }}
                  />
                  {e}
                </label>
              ))}
            </div>
          </div>
        </>
      )}
      <div style={{ marginBottom: 22 }}>
        <label style={{ color: '#145214', fontWeight: 600, fontSize: '1.08rem', letterSpacing: 0.5 }}>Detalles (opcional):</label><br />
        <textarea name="detalles" value={form.detalles} onChange={handleFormChange} rows={3} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #43ea6b', marginTop: 6, fontSize: '1rem', background: '#fff', resize: 'vertical' }} />
      </div>
      <div style={{ marginBottom: 22 }}>
        <label style={{ color: '#145214', fontWeight: 600, fontSize: '1.08rem' }}>¿Tienes otros animales en tu hogar?</label><br />
        <label style={{ marginRight: 18 }}>
          <input type="radio" name="otrosAnimales" value="true" checked={form.otrosAnimales === true} onChange={() => handleFormChange({ target: { name: 'otrosAnimales', value: true } } as any)} /> Sí
        </label>
        <label>
          <input type="radio" name="otrosAnimales" value="false" checked={form.otrosAnimales === false} onChange={() => handleFormChange({ target: { name: 'otrosAnimales', value: false } } as any)} /> No
        </label>
      </div>
      {form.otrosAnimales === true && (
        <div style={{ marginBottom: 22 }}>
          <label style={{ color: '#145214', fontWeight: 600, fontSize: '1.08rem' }}>Animales en tu hogar:</label><br />
          {form.animalesHogar.map((animal, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
              <select name="tipo" value={animal.tipo} onChange={e => handleAnimalesHogarChange(idx, 'tipo', e.target.value)} style={{ padding: 6, borderRadius: 6, border: '1.5px solid #43ea6b', fontSize: '1rem' }}>
                <option value="">Tipo...</option>
                {tiposAnimales.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {animal.tipo === 'Perro' && (
                <select name="tamaño" value={animal.tamaño || ''} onChange={e => handleAnimalesHogarChange(idx, 'tamaño', e.target.value)} style={{ padding: 6, borderRadius: 6, border: '1.5px solid #43ea6b', fontSize: '1rem' }}>
                  <option value="">Tamaño...</option>
                  {tamañosPerro.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              )}
              {animal.tipo !== 'Perro' && (
                <input type="text" name="tamaño" value={animal.tamaño || ''} onChange={e => handleAnimalesHogarChange(idx, 'tamaño', e.target.value)} style={{ display: 'none' }} />
              )}
              <button type="button" onClick={() => handleRemoveAnimalHogar(idx)} style={{ background: '#ff6b6b', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>Eliminar</button>
            </div>
          ))}
          <button type="button" onClick={handleAddAnimalHogar} style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>Agregar animal</button>
        </div>
      )}
      <div style={{ marginBottom: 22 }}>
        <label style={{ color: '#145214', fontWeight: 600, fontSize: '1.08rem' }}>Tipo de vivienda:</label><br />
        <select name="vivienda" value={form.vivienda} onChange={handleFormChange} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #43ea6b', marginTop: 6, fontSize: '1rem', background: '#fff' }}>
          <option value="">Selecciona...</option>
          <option value="Casa">Casa</option>
          <option value="Departamento">Departamento</option>
        </select>
      </div>
      <div style={{ marginBottom: 22 }}>
        <label style={{ color: '#145214', fontWeight: 600, fontSize: '1.08rem' }}>¿Quieres agregar algo más relevante para tu postulación?</label><br />
        <textarea name="preguntasExtra" value={form.preguntasExtra} onChange={handleFormChange} rows={2} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #43ea6b', marginTop: 6, fontSize: '1rem', background: '#fff', resize: 'vertical' }} />
      </div>
      <div style={{ marginBottom: 22 }}>
        <label style={{ color: '#145214', fontWeight: 600, fontSize: '1.08rem', letterSpacing: 0.5 }}>Dirección:</label><br />
        <input type="text" name="direccion" value={form.direccion || ''} onChange={handleFormChange} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #43ea6b', marginTop: 6, fontSize: '1rem', background: '#fff' }} />
      </div>
      <button type="submit" style={{ background: 'linear-gradient(90deg, #43ea6b 0%, #228B22 100%)', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 10, padding: '12px 32px', cursor: 'pointer', fontSize: '1.08rem', boxShadow: '0 2px 8px #43ea6b33', transition: 'background 0.2s' }}>Postularme</button>
    </form>
  );
};

export default HogarTemporalForm;
