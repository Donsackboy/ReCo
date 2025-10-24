import React, { useState } from 'react';

const DonarInsumo = () => {
  const [tipo, setTipo] = useState('comida');
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [envio, setEnvio] = useState('blueexpress');
  const [seguimiento, setSeguimiento] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div style={{ maxWidth: '500px', margin: '40px auto', background: '#eaffea', borderRadius: '18px', boxShadow: '0 2px 12px #43ea6b22', padding: '32px', textAlign: 'center' }}>
        <h2 style={{ color: '#228B22' }}>¡Donación registrada!</h2>
        <p>Tu donación de insumos ha sido recibida. El refugio verá el estado en su bandeja de donaciones.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', background: '#f0fff4', borderRadius: '18px', boxShadow: '0 2px 12px #43ea6b22', padding: '32px' }}>
      <h2 style={{ color: '#145214', marginBottom: '18px' }}>Donación de Insumos</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <label style={{ fontWeight: 600, color: '#228B22', marginBottom: '2px' }}>Tipo de insumo</label>
        <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1.5px solid #43ea6b', fontSize: '1rem' }}>
          <option value="comida">Comida</option>
          <option value="ropa">Ropa</option>
          <option value="juguetes">Juguetes</option>
          <option value="medicamentos">Medicamentos</option>
          <option value="otros">Otros</option>
        </select>
        <label style={{ fontWeight: 600, color: '#228B22', marginBottom: '2px' }}>Descripción</label>
        <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1.5px solid #43ea6b', fontSize: '1rem', minHeight: '60px' }} placeholder="Ej: 10kg de alimento, 2 mantas, etc." />
        <label style={{ fontWeight: 600, color: '#228B22', marginBottom: '2px' }}>Cantidad</label>
        <input type="text" value={cantidad} onChange={e => setCantidad(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1.5px solid #43ea6b', fontSize: '1rem' }} />
        <label style={{ fontWeight: 600, color: '#228B22', marginBottom: '2px' }}>Método de envío</label>
        <select value={envio} onChange={e => setEnvio(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1.5px solid #43ea6b', fontSize: '1rem' }}>
          <option value="blueexpress">BlueExpress</option>
          <option value="correos">Correos de Chile</option>
          <option value="retiro">Retiro en refugio</option>
          <option value="otro">Otro</option>
        </select>
        {(envio === 'blueexpress' || envio === 'correos' || envio === 'otro') && (
          <div>
            <label style={{ fontWeight: 600, color: '#228B22', marginBottom: '2px' }}>Número de seguimiento (si aplica)</label>
            <input type="text" value={seguimiento} onChange={e => setSeguimiento(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1.5px solid #43ea6b', fontSize: '1rem' }} />
          </div>
        )}
        <button type="submit" style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 0', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 8px #43ea6b22', marginTop: '12px' }}>Donar insumo</button>
      </form>
    </div>
  );
};

export default DonarInsumo;
