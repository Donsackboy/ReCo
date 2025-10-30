import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { animales } from './animalesData';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const preguntas = [
  '¿Ha tenido antes una mascota? ¿Durante cuánto tiempo? ¿Qué pasó con él/ellos?',
  '¿Qué tipo de vivienda tiene (casa, departamento, parcela)?',
  '¿En qué parte viviría el perro? ¿De cuanta superficie podría disfrutar? ¿Lo sacaran a pasear?',
  '¿Planea mudarse en el futuro? ¿Cómo lo haría si tiene una animalito a su cargo?',
  '¿Hay otro tipo de animales en casa?',
  '¿Conoce las tarifas de los veterinarios? ¿Están dispuestos a tener la cartilla de vacunaciones del perro al día, llevarlo al veterinario cuando se muestre enfermo, pagar por tratamientos, operaciones, etc.?',
  '¿Qué tipo de comida le daría y con que frecuencia?',
  '¿Qué piensa de la esterilización de perros domésticos?',
  '¿Por qué se decide por la vía de la adopción y no opta por comprar una mascota?',
  'Solicitamos un seguimiento post adopción. ¿Está usted dispuesto a contarnos, luego de la adopción como se adapta la mascota a su hogar?',
  '¿Piensa adoptar a algún otro perro, perro u otro animal después de este?',
  'Ante una inadaptación o problema de comportamiento en el perro que adopte, ¿qué hará usted?',
  '¿A través de qué medio nos ha conocido (otro adoptante, Instagram, Facebook, etc.)?',
  '¿Qué nombre tiene para el nuevo integrante?'
];

const AdopcionForm = () => {
  const query = useQuery();
  const animalId = query.get('animalId');
  const refugio = query.get('refugio');
  const animal = animales.find(a => String(a.id) === animalId);
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    fechaNacimiento: '',
    telefono: '',
    email: '',
    rolFamilia: '',
    respuestas: Array(preguntas.length).fill(''),
  });
  const [enviado, setEnviado] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleRespuesta = (idx, value) => {
    const nuevas = [...form.respuestas];
    nuevas[idx] = value;
    setForm({ ...form, respuestas: nuevas });
  };
  const handleSubmit = e => {
    e.preventDefault();
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div style={{ maxWidth: '650px', margin: '40px auto', background: '#eaffea', borderRadius: '18px', boxShadow: '0 2px 12px #43ea6b22', padding: '32px', textAlign: 'center' }}>
        <h2 style={{ color: '#228B22' }}>¡Solicitud enviada!</h2>
        <p>Tu solicitud de adopción ha sido enviada al refugio <strong>{refugio}</strong>.<br />Pronto te contactarán para continuar el proceso.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '650px', margin: '40px auto', background: '#f0fff4', borderRadius: '18px', boxShadow: '0 2px 12px #43ea6b22', padding: '32px' }}>
      <h2 style={{ color: '#145214', marginBottom: '18px' }}>Formulario de Adopción</h2>
      <p style={{ color: '#228B22', marginBottom: '18px', fontSize: '1.08rem' }}>
        El objetivo de este cuestionario es elegir la mejor familia para nuestros rescatados.<br />
        Relleno este formulario para optar a la adopción de <strong>{animal ? animal.nombre : 'este animal'}</strong>
      </p>
      {animal && (
        <div style={{ background: '#eaffea', borderRadius: '12px', padding: '16px', marginBottom: '18px', boxShadow: '0 1px 6px #43ea6b22' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <img src={animal.imagenes[0]} alt={animal.nombre} style={{ width: '250px', height: '250px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 1px 6px #43ea6b22' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#145214' }}>{animal.nombre}</div>
              <div style={{ color: '#228B22', fontSize: '1.08rem' }}>{animal.sexo} • {animal.edad} años • {animal.tamano}</div>
              <div style={{ color: '#145214', fontSize: '1rem' }}>Refugio: {animal.refugio} ({animal.region})</div>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <h3 style={{ color: '#145214', marginBottom: '8px' }}>Datos personales</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
          <div>
            <label style={{ fontWeight: 600, color: '#228B22', fontSize: '0.98rem' }}>Nombre y Apellidos</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} required style={{ width: '90%', padding: '6px', borderRadius: '7px', border: '1.2px solid #43ea6b', marginTop: '4px', fontSize: '0.98rem' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, color: '#228B22', fontSize: '0.98rem' }}>Dirección</label>
            <input name="direccion" value={form.direccion} onChange={handleChange} required style={{ width: '90%', padding: '6px', borderRadius: '7px', border: '1.2px solid #43ea6b', marginTop: '4px', fontSize: '0.98rem' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, color: '#228B22', fontSize: '0.98rem' }}>Fecha de Nacimiento</label>
            <input name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={handleChange} required style={{ width: '90%', padding: '6px', borderRadius: '7px', border: '1.2px solid #43ea6b', marginTop: '4px', fontSize: '0.98rem' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, color: '#228B22', fontSize: '0.98rem' }}>Teléfono</label>
            <input name="telefono" value={form.telefono} onChange={handleChange} required style={{ width: '90%', padding: '6px', borderRadius: '7px', border: '1.2px solid #43ea6b', marginTop: '4px', fontSize: '0.98rem' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, color: '#228B22', fontSize: '0.98rem' }}>E-mail de Contacto</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required style={{ width: '90%', padding: '6px', borderRadius: '7px', border: '1.2px solid #43ea6b', marginTop: '4px', fontSize: '0.98rem' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, color: '#228B22', fontSize: '0.98rem' }}>¿Cuál es su rol en la familia?</label>
            <input name="rolFamilia" value={form.rolFamilia} onChange={handleChange} required style={{ width: '90%', padding: '6px', borderRadius: '7px', border: '1.2px solid #43ea6b', marginTop: '4px', fontSize: '0.98rem' }} />
          </div>
        </div>
        <hr style={{ margin: '18px 0', border: 'none', borderTop: '1.5px solid #43ea6b22' }} />
        <h3 style={{ color: '#145214', marginBottom: '8px' }}>Preguntas</h3>
        {preguntas.map((pregunta, idx) => (
          <div key={idx}>
            <label style={{ fontWeight: 600, color: '#228B22', marginBottom: '2px' }}>{idx + 1}. {pregunta}</label>
            <textarea value={form.respuestas[idx]} onChange={e => handleRespuesta(idx, e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1.5px solid #43ea6b', marginTop: '4px', minHeight: '60px' }} />
          </div>
        ))}
        <button type="submit" style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 0', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 8px #43ea6b22', marginTop: '12px' }}>Enviar solicitud</button>
      </form>
      <div style={{ marginTop: '18px', color: '#228B22', fontSize: '0.98rem' }}>
        <strong>Refugio:</strong> {refugio}
      </div>
    </div>
  );
};

export default AdopcionForm;
