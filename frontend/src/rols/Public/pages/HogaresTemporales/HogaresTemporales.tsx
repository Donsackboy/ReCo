import React from 'react';
import { useNavigate } from 'react-router-dom';
import { animales } from '../Animales/animalesData';

const regiones = [
  'Arica y Parinacota',
  'Tarapacá',
  'Antofagasta',
  'Atacama',
  'Coquimbo',
  'Valparaíso',
  'Metropolitana',
  'O’Higgins',
  'Maule',
  'Ñuble',
  'Biobío',
  'Araucanía',
  'Los Ríos',
  'Los Lagos',
  'Aysén',
  'Magallanes',
];
const regionesConTodas = ['Todas', ...regiones];

const especies = ['Perro', 'Gato', 'Conejo', 'Ave', 'Otro'];

export default function HogaresTemporales() {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: '1400px', margin: '40px auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '40px', flexWrap: 'wrap' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto 32px auto', background: '#f0fff4', borderRadius: '18px', boxShadow: '0 2px 12px #43ea6b22', padding: '32px' }}>
        <h2 style={{ color: '#145214', marginBottom: '18px' }}>¿Qué es un hogar temporal?</h2>
        <p style={{ color: '#228B22', fontSize: '1.08rem', marginBottom: '18px' }}>
          Un hogar temporal es diferente a la adopción: es una familia o persona que acoge a un animal rescatado por un refugio durante un periodo limitado, generalmente mientras se recupera de una operación, enfermedad, o hasta encontrar un hogar definitivo.<br /><br />
        </p>
        <ul style={{ color: '#145214', fontSize: '1.05rem', marginLeft: '18px', marginBottom: '18px' }}>
          <li>Ayudas a la recuperación física y emocional de animales vulnerables.</li>
          <li>El refugio cubre gastos médicos y alimentación, salvo acuerdo distinto.</li>
          <li>Puedes elegir qué tipo de animales y de qué regiones puedes recibir.</li>
          <li>El compromiso es temporal y puedes indicar tu disponibilidad.</li>
        </ul>
        <span style={{ color: '#cf0505ff', fontWeight: 500, fontSize: '1.08rem', display: 'block', marginBottom: '18px' }}><b>Importante:</b> El animal que está en hogar temporal puede ser adoptado en cualquier momento por otra familia o por el propio hogar temporal si así lo desea. Postularse como hogar temporal no implica adopción, pero sí ayuda a que el animal esté en un ambiente seguro y amoroso mientras espera.</span>
        <div style={{ color: '#228B22', fontSize: '1.02rem', marginBottom: '8px' }}>
          Si quieres postularte como hogar temporal, haz clic en el botón de abajo.
        </div>
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '18px' }}>
        <button
          onClick={() => navigate('/hogares-temporales/registro')}
          style={{
            background: 'linear-gradient(90deg, #43ea6b 0%, #228B22 100%)',
            color: '#fff',
            fontWeight: 700,
            borderRadius: 14,
            padding: '16px 40px',
            textDecoration: 'none',
            boxShadow: '0 2px 12px #43ea6b55',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.18rem',
            letterSpacing: 0.5,
            transition: 'background 0.2s',
            marginTop: 8,
            marginBottom: 8,
            outline: 'none',
          }}
          onMouseOver={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #228B22 0%, #43ea6b 100%)')}
          onMouseOut={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #43ea6b 0%, #228B22 100%)')}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
              <path d="M12 19l7-7-7-7" />
            </svg>
            Postúlate como hogar temporal aquí
          </span>
        </button>
      </div>
      <section style={{ flex: 1, minWidth: 340 }}>
        {/* Sección animales publicados */}
        <h2 style={{ color: '#145214', marginBottom: '18px' }}>Animales que necesitan hogar temporal</h2>
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {animales.filter(animal => animal.estado === 'buscando_nuevo_hogar_temporal').map(animal => (
            <div key={animal.id} style={{ background: '#f0fff4', borderRadius: '18px', boxShadow: '0 4px 18px #43ea6b33', width: '300px', padding: '0 0 28px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
              onClick={() => navigate(`/animales/${animal.id}`)}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 8px 32px #43ea6b55'}
              onMouseOut={e => e.currentTarget.style.boxShadow = '0 4px 18px #43ea6b33'}
            >
              <img src={animal.imagenes?.[0] || '/Images/animales/placeholder.png'} alt={animal.nombre} style={{ width: '100%', height: '250px', objectFit: 'cover', borderTopLeftRadius: '18px', borderTopRightRadius: '18px' }} />
              <div style={{ padding: '22px', width: '100%' }}>
                <h3 style={{ color: '#145214', marginBottom: '10px', fontSize: '1.35rem' }}>{animal.nombre}</h3>
                <div style={{ color: '#228B22', fontWeight: 600, fontSize: '1.12rem' }}>{animal.tamano} • {animal.edad} años</div>
                <div style={{ color: '#b2e2c9', fontSize: '1.08rem', marginBottom: '12px' }}>{animal.region}</div>
                <div style={{ color: '#145214', fontSize: '1.08rem', marginBottom: '12px' }}><b>Motivo:</b> {animal.motivo_cambio_hogar_temporal}</div>
                <div style={{ color: '#228B22', fontSize: '1.05rem', marginBottom: '12px' }}>Refugio: {animal.refugio}</div>
                <div style={{ color: '#145214', fontSize: '1.05rem' }}><b>Bio:</b> {animal.resena}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
