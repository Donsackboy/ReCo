import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { getAnimales } from '../../../../api';

import { regionesChile, regionesComunasChile as comunasPorRegion } from '../../../../utils/regionesComunasChile';
const regiones = regionesChile;
// comunasPorRegion is now used for dependent comuna select
const especies = ['Perro', 'Gato', 'Conejo', 'Ave', 'Otro'];

export default function RegistroHogarTemporal() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const animalId = params.get('animalId');
  const [animal, setAnimal] = useState<any>(null);

  useEffect(() => {
    if (animalId) {
      const token = localStorage.getItem('token');
      getAnimales(token).then(animales => {
        const found = animales.find((a: any) => a.id === Number(animalId));
        setAnimal(found || null);
      });
    }
  }, [animalId]);
  const [form, setForm] = useState<{
    nombre: string;
    email: string;
    telefono: string;
    regiones: string[];
    especies: string[];
    detalles: string;
    otrosAnimales: boolean;
    animalesHogar: { tipo: string; tamaño?: 'Grande' | 'Mediano' | 'Chico' | '' }[];
    vivienda: 'Casa' | 'Departamento' | '';
    preguntasExtra: string;
    direccion: string;
    motivoHogarTemporal?: string;
    experienciaAnimales?: string;
    accionProblemas?: string;
    disponibilidad?: string;
    regionHogarTemporal?: string;
    comunaHogarTemporal?: string;
  }>(
    {
      nombre: '',
      email: '',
      telefono: '',
      regiones: [],
      especies: [],
      detalles: '',
      otrosAnimales: false,
      animalesHogar: [],
      vivienda: '',
      preguntasExtra: '',
      direccion: '',
      motivoHogarTemporal: '',
      experienciaAnimales: '',
      accionProblemas: '',
      disponibilidad: '',
      regionHogarTemporal: '',
      comunaHogarTemporal: '',
    }
  );
  const [enviado, setEnviado] = useState(false);

  // Si hay animalId, no mostrar selección de regiones ni especies
  const mostrarSeleccion = !animal;

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    if (name === 'otrosAnimales') {
      const tieneAnimales = value === 'si';
      setForm(f => ({
        ...f,
        otrosAnimales: tieneAnimales,
        animalesHogar: tieneAnimales && f.animalesHogar.length === 0 ? [{ tipo: '', tamaño: '' }] : tieneAnimales ? f.animalesHogar : []
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  function handleRegionChange(region: string) {
    setForm(f => {
      const regiones = f.regiones.includes(region)
        ? f.regiones.filter(r => r !== region)
        : [...f.regiones, region];
      return { ...f, regiones };
    });
  }

  function handleEspecieChange(especie: string) {
    setForm(f => {
      const especies = f.especies.includes(especie)
        ? f.especies.filter(e => e !== especie)
        : [...f.especies, especie];
      return { ...f, especies };
    });
  }

  function handleAnimalesHogarChange(index: number, field: string, value: string) {
    setForm(f => {
      const animalesHogar = [...f.animalesHogar];
      animalesHogar[index] = { ...animalesHogar[index], [field]: value };
      return { ...f, animalesHogar };
    });
  }

  function handleAddAnimalHogar() {
    setForm(f => ({ ...f, animalesHogar: [...f.animalesHogar, { tipo: '', tamaño: '' }] }));
  }

  function handleRemoveAnimalHogar(index: number) {
    setForm(f => {
      const animalesHogar = [...f.animalesHogar];
      animalesHogar.splice(index, 1);
      return { ...f, animalesHogar };
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviado(true);
  }

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '32px', background: '#f0fff4', borderRadius: '18px', boxShadow: '0 2px 12px #43ea6b22' }}>
      <h2 style={{ color: '#145214', marginBottom: '18px' }}>Formulario de postulación hogar temporal</h2>
      {animal && (
        <div style={{ background: '#eaffea', borderRadius: 14, boxShadow: '0 1px 8px #43ea6b22', padding: 24, marginBottom: 18 }}>
          <h3 style={{ color: '#145214', marginBottom: 8 }}>Postulación para: {animal.nombre}</h3>
          <div style={{ color: '#228B22', fontSize: '1.08rem', marginBottom: 6 }}><b>Refugio:</b> {animal.refugio}</div>
          <div style={{ color: '#145214', fontSize: '1.05rem', marginBottom: 6 }}><b>Motivo:</b> {animal.motivo_cambio_hogar_temporal}</div>
        </div>
      )}
      {enviado ? (
        <div style={{ background: '#eaffea', borderRadius: 14, boxShadow: '0 1px 8px #43ea6b22', padding: 32, textAlign: 'center' }}>
          <h3 style={{ color: '#145214' }}>¡Gracias por tu postulación!</h3>
          <p style={{ color: '#228B22' }}>Tu información será revisada por los refugios y podrán contactarte si necesitan un hogar temporal en tu región.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: 'linear-gradient(135deg, #eaffea 0%, #f0fff4 100%)', borderRadius: 18, boxShadow: '0 4px 24px #43ea6b33', padding: 40, maxWidth: 1200, margin: '0 auto', border: '1.5px solid #b2e2c9' }}>
          <div style={{ marginBottom: 22 }}>
            <label style={{ color: '#145214', fontWeight: 600, fontSize: '1.08rem', letterSpacing: 0.5 }}>Nombre completo:</label><br />
            <input type="text" name="nombre" value={form.nombre} onChange={handleFormChange} required
              style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1.5px solid #b2e2c9', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s' }}
              placeholder="Ingresa tu nombre completo" />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ color: '#145214', fontWeight: 600, fontSize: '1.08rem', letterSpacing: 0.5 }}>Email:</label><br />
            <input type="email" name="email" value={form.email} onChange={handleFormChange} required
              style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1.5px solid #b2e2c9', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s' }}
              placeholder="Ingresa tu email" />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ color: '#145214', fontWeight: 600, fontSize: '1.08rem', letterSpacing: 0.5 }}>Teléfono de contacto:</label><br />
            <input type="tel" name="telefono" value={form.telefono || ''} onChange={handleFormChange} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #43ea6b', marginTop: 6, fontSize: '1rem', background: '#fff' }} placeholder="Ej: +56912345678" />
          </div>
          {mostrarSeleccion && (
            <>
              <div style={{ marginBottom: 22 }}>
                <label style={{ color: '#145214', fontWeight: 600, fontSize: '1.08rem', letterSpacing: 0.5 }}>Regiones de donde aceptas animales:</label><br />
                {regiones.map(region => (
                  <label key={region} style={{ display: 'block', marginBottom: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.regiones.includes(region)} onChange={() => handleRegionChange(region)}
                      style={{ marginRight: 10, cursor: 'pointer' }} />
                    <span style={{ color: '#145214', fontSize: '1rem' }}>{region}</span>
                  </label>
                ))}
              </div>
              <div style={{ marginBottom: 22 }}>
                <label style={{ color: '#145214', fontWeight: 600, fontSize: '1.08rem', letterSpacing: 0.5 }}>Tipo de animales que aceptas:</label><br />
                {especies.map(especie => (
                  <label key={especie} style={{ display: 'block', marginBottom: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.especies.includes(especie)} onChange={() => handleEspecieChange(especie)
                      } style={{ marginRight: 10, cursor: 'pointer' }} />
                    <span style={{ color: '#145214', fontSize: '1rem' }}>{especie}</span>
                  </label>
                ))}
              </div>
            </>
          )}
          <div style={{ marginBottom: 22 }}>
            <label style={{ color: '#145214', fontWeight: 600, fontSize: '1.08rem', letterSpacing: 0.5 }}>Dirección:</label><br />
            <input type="text" name="direccion" value={form.direccion || ''} onChange={handleFormChange} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #43ea6b', marginTop: 6, fontSize: '1rem', background: '#fff' }} />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ color: '#145214', fontWeight: 600, fontSize: '1.08rem', letterSpacing: 0.5 }}>Región donde está ubicado tu hogar temporal:</label><br />
              <select name="regionHogarTemporal" value={form.regionHogarTemporal || ''} onChange={handleFormChange} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #43ea6b', marginTop: 6, fontSize: '1rem', background: '#fff' }}>
                <option value="">Selecciona una región</option>
                {regiones.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={{ color: '#145214', fontWeight: 600, fontSize: '1.08rem', letterSpacing: 0.5 }}>Comuna donde está ubicado tu hogar temporal:</label><br />
              <select name="comunaHogarTemporal" value={form.comunaHogarTemporal || ''} onChange={handleFormChange} required disabled={!form.regionHogarTemporal} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #43ea6b', marginTop: 6, fontSize: '1rem', background: '#fff' }}>
                <option value="">Selecciona una comuna</option>
                {(comunasPorRegion[form.regionHogarTemporal || ''] || []).map((comuna: string) => (
                  <option key={comuna} value={comuna}>{comuna}</option>
                ))}
              </select>
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ color: '#145214', fontWeight: 600, fontSize: '1.08rem', letterSpacing: 0.5 }}>Tipo de vivienda:</label><br />
            <select name="vivienda" value={form.vivienda} onChange={handleFormChange}
              style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1.5px solid #b2e2c9', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s' }}>
              <option value="">Selecciona un tipo de vivienda</option>
              <option value="Casa">Casa</option>
              <option value="Departamento">Departamento</option>
            </select>
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ color: '#145214', fontWeight: 600, fontSize: '1.08rem', letterSpacing: 0.5 }}>¿Tienes otros animales en casa?</label><br />
            <select name="otrosAnimales" value={form.otrosAnimales ? 'si' : 'no'} onChange={handleFormChange}
              style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1.5px solid #b2e2c9', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s' }}>
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </div>
          {form.otrosAnimales && (
            <div style={{ marginBottom: 22 }}>
              <label style={{ color: '#145214', fontWeight: 600, fontSize: '1.08rem', letterSpacing: 0.5 }}>¿Qué animales tienes?</label><br />
              {form.animalesHogar.map((animal, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <select name="tipo" value={animal.tipo} onChange={e => handleAnimalesHogarChange(index, 'tipo', e.target.value)}
                    style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1.5px solid #b2e2c9', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s', marginRight: 10 }}>
                    <option value="">Selecciona un tipo de animal</option>
                    {especies.map(especie => (
                      <option key={especie} value={especie}>{especie}</option>
                    ))}
                  </select>
                  {animal.tipo === 'Perro' && (
                    <select name="tamaño" value={animal.tamaño} onChange={e => handleAnimalesHogarChange(index, 'tamaño', e.target.value)}
                      style={{ width: 120, padding: '10px', borderRadius: 10, border: '1.5px solid #b2e2c9', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s' }}>
                      <option value="">Tamaño</option>
                      <option value="Grande">Grande</option>
                      <option value="Mediano">Mediano</option>
                      <option value="Chico">Chico</option>
                    </select>
                  )}
                  {form.animalesHogar.length > 1 && index > 0 && (
                    <button type="button" onClick={() => handleRemoveAnimalHogar(index)}
                      style={{ background: '#ff6b6b', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 12px', fontSize: '0.9rem', cursor: 'pointer', marginLeft: 10 }}>
                      Eliminar
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={handleAddAnimalHogar}
                style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 16px', fontSize: '1rem', cursor: 'pointer' }}>
                + Agregar otro animal
              </button>
            </div>
          )}
          <div style={{ marginBottom: 22 }}>
            <label style={{ color: '#145214', fontWeight: 600, fontSize: '1.08rem', letterSpacing: 0.5 }}>¿Por qué quieres ser hogar temporal?</label><br />
            <textarea name="motivoHogarTemporal" value={form.motivoHogarTemporal || ''} onChange={handleFormChange}
              style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1.5px solid #b2e2c9', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s' }}
              placeholder="Cuéntanos tu motivación para ser hogar temporal" />
          </div>
          
          {!form.otrosAnimales && (
            <div style={{ marginBottom: 22 }}>
              <label style={{ color: '#145214', fontWeight: 600, fontSize: '1.08rem', letterSpacing: 0.5 }}>Si el animal se enferma o tiene problemas, ¿qué harás?</label><br />
              <textarea name="accionProblemas" value={form.accionProblemas || ''} onChange={handleFormChange}
                style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1.5px solid #b2e2c9', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s' }}
                placeholder="Explica cómo actuarías ante problemas de salud o comportamiento" />
            </div>
          )}
          <div style={{ marginBottom: 22 }}>
            <label style={{ color: '#145214', fontWeight: 600, fontSize: '1.08rem', letterSpacing: 0.5 }}>Disponibilidad para ser hogar temporal:</label><br />
            <select name="disponibilidad" value={form.disponibilidad || ''} onChange={handleFormChange} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #43ea6b', marginTop: 6, fontSize: '1rem', background: '#fff' }}>
              <option value="">Selecciona una opción</option>
              <option value="1 mes">1 mes</option>
              <option value="2 meses">2 meses</option>
              <option value="3 meses">3 meses</option>
              <option value="6 meses">6 meses</option>
              <option value="indefinida">Indefinida</option>
              <option value="otro">Otro (especificar en comentarios)</option>
            </select>
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ color: '#145214', fontWeight: 600, fontSize: '1.08rem', letterSpacing: 0.5 }}>Detalles adicionales:</label><br />
            <textarea name="detalles" value={form.detalles} onChange={handleFormChange}
              style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1.5px solid #b2e2c9', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s' }}
              placeholder="Ingresa detalles adicionales sobre tu disponibilidad y condiciones" />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ color: '#145214', fontWeight: 600, fontSize: '1.08rem', letterSpacing: 0.5 }}>Dudas o comentarios:</label><br />
            <textarea name="preguntasExtra" value={form.preguntasExtra} onChange={handleFormChange} rows={2} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #43ea6b', marginTop: 6, fontSize: '1rem', background: '#fff', resize: 'vertical' }} />
          </div>
          <button type="submit"
            style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: '#43ea6b', color: '#fff', fontSize: '1.1rem', cursor: 'pointer', transition: 'background 0.3s' }}>
            {enviado ? 'Enviando...' : 'Enviar postulación'}
          </button>
        </form>
      )}
    </div>
  );
}
