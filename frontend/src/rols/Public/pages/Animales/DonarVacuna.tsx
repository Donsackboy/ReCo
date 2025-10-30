import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { animales } from './animalesData';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const vacunasOpciones = [
  { tipo: 'Séxtuple', precio: 18000 },
  { tipo: 'Rabia', precio: 12000 },
  { tipo: 'Parvovirus', precio: 15000 },
  { tipo: 'Bordetella', precio: 14000 },
  { tipo: 'Leptospirosis', precio: 16000 },
  { tipo: 'Otra', precio: 0 }
];

const DonarVacuna = () => {
  const query = useQuery();
  const animalId = query.get('animalId');
  const refugio = query.get('refugio');
  const vacunaPreseleccionada = query.get('vacuna');
  const animal = animales.find(a => String(a.id) === animalId);
  const [vacuna, setVacuna] = useState(vacunaPreseleccionada || '');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    // Aquí se registraría la donación como pendiente en el backend
    setEnviado(true);
  };

  const precioVacuna = vacunasOpciones.find(v => v.tipo === vacuna)?.precio || 0;

  if (enviado) {
    return (
      <div style={{ maxWidth: '500px', margin: '40px auto', background: '#eaffea', borderRadius: '18px', boxShadow: '0 2px 12px #43ea6b22', padding: '32px', textAlign: 'center' }}>
        <h2 style={{ color: '#228B22' }}>¡Donación registrada!</h2>
        <p>Tu donación para la vacuna <strong>{vacuna}</strong> está en estado <strong>pendiente</strong>.<br />El refugio <strong>{refugio}</strong> recibirá la notificación en la sección de donaciones de vacunas.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', background: '#f0fff4', borderRadius: '18px', boxShadow: '0 2px 12px #43ea6b22', padding: '32px' }}>
      <h2 style={{ color: '#145214', marginBottom: '18px' }}>Donar vacuna</h2>
      {animal && (
        <div style={{ background: '#eaffea', borderRadius: '12px', padding: '16px', marginBottom: '18px', boxShadow: '0 1px 6px #43ea6b22', display: 'flex', alignItems: 'center', gap: '18px' }}>
          <img src={animal.imagenes[0]} alt={animal.nombre} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', boxShadow: '0 1px 6px #43ea6b22' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#145214' }}>{animal.nombre}</div>
            <div style={{ color: '#228B22', fontSize: '1rem' }}>{animal.sexo} • {animal.edad} años • {animal.tamano}</div>
            <div style={{ color: '#145214', fontSize: '0.98rem' }}>Refugio: {animal.refugio} ({animal.region})</div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <label style={{ fontWeight: 600, color: '#228B22', marginBottom: '2px' }}>Selecciona la vacuna a donar</label>
        <select value={vacuna} onChange={e => setVacuna(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1.5px solid #43ea6b', fontSize: '1rem' }}>
          <option value="">Elige una vacuna</option>
          {vacunasOpciones.map((v, idx) => (
            <option key={idx} value={v.tipo}>{v.tipo} {v.precio > 0 ? `- $${v.precio}` : ''}</option>
          ))}
        </select>
        {vacuna && (
          <div style={{ color: '#228B22', fontWeight: 600, fontSize: '1.08rem', marginTop: '8px' }}>
            Precio: {precioVacuna > 0 ? `$${precioVacuna}` : 'A convenir con el refugio'}
          </div>
        )}
        <button type="submit" style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 0', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 8px #43ea6b22', marginTop: '12px' }}>Donar vacuna</button>
      </form>
    </div>
  );
};

export default DonarVacuna;
