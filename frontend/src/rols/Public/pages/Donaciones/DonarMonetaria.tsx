import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type RefugioBancario = {
  id_refugio: number;
  nombre: string;
  region: string;
  banco?: string;
  tipo_cuenta?: string;
  numero_cuenta?: string;
  rut_titular?: string;
  titular_cuenta?: string;
  email_bancario?: string;
};
const DonarMonetaria = () => {
  const [monto, setMonto] = useState('');
  const [copiado, setCopiado] = useState(false);
  const [refugios, setRefugios] = useState<RefugioBancario[]>([]);
  const [selectedRefugio, setSelectedRefugio] = useState<string>('');
  const [enviado, setEnviado] = useState(false);
  const navigate = useNavigate();
  const [confirmar, setConfirmar] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Detectar si estamos en desarrollo o producción
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const backendUrl = isDev
      ? 'http://localhost:8000/api/refugios-bancarios/'
      : '/api/refugios-bancarios/';
    fetch(backendUrl)
      .then(res => res.json())
      .then(data => {
        setRefugios(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setConfirmar(true);
  };

  const handleConfirmar = () => {
    setEnviado(true);
  };
  const refugioSeleccionado = refugios.find((r) => r.id_refugio === parseInt(selectedRefugio));

  if (enviado) {
    return (
      <div style={{ maxWidth: '500px', margin: '40px auto', background: '#eaffea', borderRadius: '18px', boxShadow: '0 2px 12px #43ea6b22', padding: '32px', textAlign: 'center' }}>
        <h2 style={{ color: '#228B22' }}>¡Donación registrada!</h2>
        <p>Tu donación monetaria ha sido registrada correctamente. El refugio podrá visualizar el monto informado en su panel de control.</p>
        <div style={{ marginTop: '18px', color: '#145214', fontWeight: 500 }}>
          <b>Monto informado:</b> ${monto}
        </div>
        {refugioSeleccionado && (
          <div style={{ marginTop: '10px', color: '#228B22' }}>
            <b>Refugio:</b> {refugioSeleccionado.nombre}
          </div>
        )}
        <button onClick={() => navigate('/')} style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 32px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', marginTop: '24px', boxShadow: '0 2px 8px #43ea6b22' }}>Volver al inicio</button>
      </div>
    );
  }

  if (confirmar) {
    return (
      <div style={{ maxWidth: '500px', margin: '40px auto', background: '#fffbe6', borderRadius: '18px', boxShadow: '0 2px 12px #43ea6b22', padding: '32px', textAlign: 'center' }}>
        <h2 style={{ color: '#145214', marginBottom: '18px' }}>Confirmar Donación</h2>
        <div style={{ color: '#228B22', fontSize: '1.08rem', marginBottom: '18px' }}>
          <b>Monto a donar:</b> ${monto}
        </div>
        {refugioSeleccionado && (
          <div style={{ color: '#228B22', fontSize: '1.08rem', marginBottom: '18px' }}>
            <b>Refugio:</b> {refugioSeleccionado.nombre}
          </div>
        )}
        <div style={{ background: '#ffeaea', borderRadius: '10px', padding: '12px', color: '#b22222', fontSize: '0.98rem', marginBottom: '18px' }}>
          <b>Importante:</b> Verifica que el monto ingresado coincida exactamente con el monto que transferirás al refugio. <br />
          Si el monto no coincide, el refugio podría no poder registrar correctamente tu donación.
        </div>
        <button onClick={handleConfirmar} style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 32px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 8px #43ea6b22', marginTop: '12px' }}>Confirmar y registrar donación</button>
        <button onClick={() => setConfirmar(false)} style={{ background: '#fff', color: '#228B22', border: '1.5px solid #43ea6b', borderRadius: '10px', padding: '10px 32px', fontWeight: 600, fontSize: '1.08rem', cursor: 'pointer', marginTop: '12px', marginLeft: '12px' }}>Editar datos</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', background: '#f0fff4', borderRadius: '18px', boxShadow: '0 2px 12px #43ea6b22', padding: '32px' }}>
      <h2 style={{ color: '#145214', marginBottom: '18px' }}>Donación Monetaria</h2>
      <div style={{ background: '#fffbe6', borderRadius: '10px', padding: '12px', marginBottom: '18px', color: '#145214', fontSize: '0.98rem', boxShadow: '0 1px 6px #43ea6b22' }}>
        <b>Importante:</b> El monto es obligatorio y se solicita para que el refugio pueda dar seguimiento correcto a sus recursos financieros. <br />
        <span style={{ color: '#228B22' }}>Tu donación es anónima, pero el dato del monto ayuda al refugio a gestionar y controlar sus ingresos de manera responsable.</span>
        <br />Por favor, ingresa el monto que transferirás para que el refugio pueda llevar un control adecuado de sus recursos.
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', color: '#228B22' }}>Cargando refugios...</div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <label style={{ fontWeight: 600, color: '#228B22', marginBottom: '2px' }}>Monto a donar <span style={{ color: 'red' }}>*</span></label>
          <input type="number" min="1000" step="500" value={monto} onChange={e => setMonto(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1.5px solid #43ea6b', fontSize: '1rem' }} placeholder="Ej: 5000" />
          <label style={{ fontWeight: 600, color: '#228B22', marginBottom: '2px' }}>Selecciona el refugio <span style={{ color: 'red' }}>*</span></label>
          <select value={selectedRefugio} onChange={e => setSelectedRefugio(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1.5px solid #43ea6b', fontSize: '1rem' }}>
            <option value="">Selecciona un refugio</option>
            {refugios.map((r: any) => (
              <option key={r.id_refugio} value={r.id_refugio}>{r.nombre} ({r.region})</option>
            ))}
          </select>
          {selectedRefugio && (() => {
            const refugio = refugios.find((r) => r.id_refugio === parseInt(selectedRefugio));
            if (!refugio) return null;
            const datos = `Banco: ${refugio.banco || 'No especificado'}\nTipo de cuenta: ${refugio.tipo_cuenta || 'No especificado'}\nNúmero de cuenta: ${refugio.numero_cuenta || 'No especificado'}\nRUT titular: ${refugio.rut_titular || 'No especificado'}\nTitular: ${refugio.titular_cuenta || 'No especificado'}\nEmail bancario: ${refugio.email_bancario || 'No especificado'}`;
            return (
              <div style={{ background: '#eaffea', borderRadius: '10px', padding: '16px', marginTop: '8px', boxShadow: '0 1px 6px #43ea6b22' }}>
                <h4 style={{ color: '#145214', marginBottom: '8px' }}>Datos bancarios del refugio</h4>
                <ul style={{ listStyle: 'none', padding: 0, fontSize: '1rem', color: '#228B22' }}>
                  <li><b>Banco:</b> {refugio.banco || 'No especificado'}</li>
                  <li><b>Tipo de cuenta:</b> {refugio.tipo_cuenta || 'No especificado'}</li>
                  <li><b>Número de cuenta:</b> <span style={{ userSelect: 'all' }}>{refugio.numero_cuenta || 'No especificado'}</span></li>
                  <li><b>RUT titular:</b> {refugio.rut_titular || 'No especificado'}</li>
                  <li><b>Titular:</b> {refugio.titular_cuenta || 'No especificado'}</li>
                  <li><b>Email bancario:</b> {refugio.email_bancario || 'No especificado'}</li>
                </ul>
                <button type="button" onClick={() => {navigator.clipboard.writeText(datos); setCopiado(true); setTimeout(()=>setCopiado(false), 2000);}} style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 18px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginTop: '10px', boxShadow: '0 1px 6px #43ea6b22' }}>Copiar datos bancarios</button>
                {copiado && <span style={{ color: '#228B22', marginLeft: '12px', fontWeight: 500 }}>¡Copiado!</span>}
              </div>
            );
          })()}
          <button type="submit" style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 0', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 8px #43ea6b22', marginTop: '12px' }}>Donar</button>
        </form>
      )}
    </div>
  );
};

export default DonarMonetaria;
