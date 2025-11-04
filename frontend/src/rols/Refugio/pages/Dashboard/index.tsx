import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnimales, getAnimalesCount } from '../../../../api';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [animalesCount, setAnimalesCount] = useState(0);
  const [adopcionesPendientes, setAdopcionesPendientes] = useState(0);
  const [hogarTemporalPendientes, setHogarTemporalPendientes] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Animales en refugio
    if (token) {
      getAnimales(token).then(animales => {
        setAnimalesCount(animales.length);
        // Adopciones pendientes
        const adopciones = animales.flatMap(a => a.adopciones || []);
        setAdopcionesPendientes(adopciones.filter(a => a.estado === 'pendiente').length);
        // Hogares temporales pendientes
        const hogares = animales.flatMap(a => a.hogar_temporal || []);
        setHogarTemporalPendientes(hogares.filter(h => h.estado === 'pendiente').length);
      }).catch(() => {
        setAnimalesCount(0);
        setAdopcionesPendientes(0);
        setHogarTemporalPendientes(0);
      });
    }
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
      <h1 style={{ color: '#228B22', fontWeight: 800, fontSize: 32, marginBottom: 18 }}>Dashboard Refugio</h1>
      <div style={{ display: 'flex', gap: 32, marginBottom: 32, justifyContent: 'center' }}>
        <div style={{ background: '#e3f2fd', borderRadius: 14, padding: 18, minWidth: 120, textAlign: 'center', boxShadow: '0 2px 8px #1976d233' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#1976d2' }}>{animalesCount}</div>
          <div style={{ color: '#1976d2', fontWeight: 600 }}>Animales</div>
        </div>
        <div style={{ background: '#fffde7', borderRadius: 14, padding: 18, minWidth: 120, textAlign: 'center', boxShadow: '0 2px 8px #ffd60033' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#ffa726' }}>{adopcionesPendientes}</div>
          <div style={{ color: '#ffa726', fontWeight: 600 }}>Adopciones pendientes</div>
        </div>
        <div style={{ background: '#e8f5e9', borderRadius: 14, padding: 18, minWidth: 120, textAlign: 'center', boxShadow: '0 2px 8px #43a04733' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#43a047' }}>{hogarTemporalPendientes}</div>
          <div style={{ color: '#43a047', fontWeight: 600 }}>Hogar temporal pendientes</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 10, padding: '18px 38px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 12px #1976d233', marginBottom: 12 }} onClick={() => navigate('/refugio/mis-animales')}>
          🐾 Gestionar Animales
        </button>
        <button style={{ background: '#ffa726', color: '#fff', border: 'none', borderRadius: 10, padding: '18px 38px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 12px #ffa72633', marginBottom: 12 }} onClick={() => navigate('/refugio/adopciones')}>
          📋 Gestionar Adopciones
        </button>
        <button style={{ background: '#43a047', color: '#fff', border: 'none', borderRadius: 10, padding: '18px 38px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 12px #43a04733', marginBottom: 12 }} onClick={() => navigate('/refugio/hogar-temporal')}>
          🏠 Hogares Temporales
        </button>
        <button style={{ background: '#7b1fa2', color: '#fff', border: 'none', borderRadius: 10, padding: '18px 38px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 12px #7b1fa233', marginBottom: 12 }} onClick={() => navigate('/refugio/mis-eventos')}>
          🎉 Gestionar Eventos
        </button>
        <button style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 10, padding: '18px 38px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 12px #e5393533', marginBottom: 12 }} onClick={() => navigate('/refugio/donaciones')}>
          💝 Ver Donaciones
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
