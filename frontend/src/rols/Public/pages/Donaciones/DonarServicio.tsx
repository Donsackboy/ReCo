import React, { useState } from 'react';

const servicios = [
  'Transporte',
  'Veterinario',
  'Difusión en redes',
  'Fotografía',
  'Educación/Charlas',
  'Otro',
];

const DonarServicio: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [servicio, setServicio] = useState('');
  const [detalle, setDetalle] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar al backend
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div style={{ maxWidth: 500, margin: '40px auto', background: '#f0fff4', borderRadius: 14, boxShadow: '0 2px 12px #43ea6b22', padding: 32, textAlign: 'center' }}>
        <h2 style={{ color: '#145214' }}>¡Gracias por tu ofrecimiento!</h2>
        <p style={{ color: '#228B22' }}>Tu servicio será registrado y el refugio podrá contactarte si lo necesita.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', background: '#f0fff4', borderRadius: 14, boxShadow: '0 2px 12px #43ea6b22', padding: 32 }}>
      <h2 style={{ color: '#145214', marginBottom: 18 }}>Donar Servicio</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#145214', fontWeight: 500 }}>Nombre:</label><br />
          <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #b2e2c9', marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#145214', fontWeight: 500 }}>Email de contacto:</label><br />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #b2e2c9', marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#145214', fontWeight: 500 }}>Tipo de servicio:</label><br />
          <select value={servicio} onChange={e => setServicio(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #b2e2c9', marginTop: 4 }}>
            <option value="">Selecciona...</option>
            {servicios.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#145214', fontWeight: 500 }}>Detalle (opcional):</label><br />
          <textarea value={detalle} onChange={e => setDetalle(e.target.value)} rows={3} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #b2e2c9', marginTop: 4 }} />
        </div>
        <button type="submit" style={{ background: '#43ea6b', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontSize: '1rem' }}>Ofrecer servicio</button>
      </form>
    </div>
  );
};

export default DonarServicio;
