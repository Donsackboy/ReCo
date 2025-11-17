import { useState } from 'react';
const DonarMonetaria = () => {
  const [monto, setMonto] = useState('');
  const [destino, setDestino] = useState('refugio');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div style={{ maxWidth: '500px', margin: '40px auto', background: '#eaffea', borderRadius: '18px', boxShadow: '0 2px 12px #43ea6b22', padding: '32px', textAlign: 'center' }}>
        <h2 style={{ color: '#228B22' }}>¡Donación registrada!</h2>
        <p>Tu donación monetaria ha sido recibida. Pronto te contactaremos para confirmar el pago.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', background: '#f0fff4', borderRadius: '18px', boxShadow: '0 2px 12px #43ea6b22', padding: '32px' }}>
      <h2 style={{ color: '#145214', marginBottom: '18px' }}>Donación Monetaria</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <label style={{ fontWeight: 600, color: '#228B22', marginBottom: '2px' }}>Monto a donar</label>
        <input type="number" min="1000" step="500" value={monto} onChange={e => setMonto(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1.5px solid #43ea6b', fontSize: '1rem' }} placeholder="$" />
        <label style={{ fontWeight: 600, color: '#228B22', marginBottom: '2px' }}>Destino de la donación</label>
        <select value={destino} onChange={e => setDestino(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1.5px solid #43ea6b', fontSize: '1rem' }}>
          <option value="refugio">Refugio</option>
          <option value="animal">Animal específico</option>
          <option value="campana">Campaña especial</option>
        </select>
        <button type="submit" style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 0', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 8px #43ea6b22', marginTop: '12px' }}>Donar</button>
      </form>
    </div>
  );
};

export default DonarMonetaria;
