import React from 'react';

export default function InfoHogarTemporal() {
  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', background: '#f0fff4', borderRadius: '18px', boxShadow: '0 2px 12px #43ea6b22', padding: '32px' }}>
      <h2 style={{ color: '#145214', marginBottom: '18px' }}>¿Qué es un hogar temporal?</h2>
      <p style={{ color: '#228B22', fontSize: '1.08rem', marginBottom: '18px' }}>
        Un hogar temporal es una familia o persona que acoge a un animal rescatado por un refugio durante un periodo limitado, generalmente mientras se recupera de una operación, enfermedad, o hasta encontrar un hogar definitivo.
      </p>
      <ul style={{ color: '#145214', fontSize: '1.05rem', marginLeft: '18px', marginBottom: '18px' }}>
        <li>Ayudas a la recuperación física y emocional de animales vulnerables.</li>
        <li>Puedes elegir qué tipo de animales y de qué regiones puedes recibir.</li>
        <li>El compromiso es temporal y puedes indicar tu disponibilidad.</li>
      </ul>
      <div style={{ color: '#228B22', fontSize: '1.02rem', marginBottom: '8px' }}>
        Si quieres postularte como hogar temporal, completa el formulario en la siguiente página.
      </div>
    </div>
  );
}
