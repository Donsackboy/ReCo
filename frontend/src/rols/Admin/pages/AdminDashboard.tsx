import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const [refugiosCount, setRefugiosCount] = useState(0);
  const [refugiosSinVerificar, setRefugiosSinVerificar] = useState(0);
  const [animalesCount, setAnimalesCount] = useState(0);
  const [donacionesSinVerificar, setDonacionesSinVerificar] = useState(0);
  const [reportesGenerados, setReportesGenerados] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Refugios
    fetch(`${import.meta.env.VITE_API_BASE}/admin/refugios/`, {
      headers: { 'Authorization': `Token ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setRefugiosCount(Array.isArray(data) ? data.length : (data?.results?.length || 0));
        // Refugios sin verificar (ejemplo: status === 'pendiente')
        let sinVerificar = 0;
        if (Array.isArray(data)) {
          sinVerificar = data.filter(r => r.status === 'pendiente' || r.estado === 'pendiente').length;
        } else if (Array.isArray(data.results)) {
          sinVerificar = data.results.filter(r => r.status === 'pendiente' || r.estado === 'pendiente').length;
        }
        setRefugiosSinVerificar(sinVerificar);
      });

    // Animales totales en el sistema
    fetch(`${import.meta.env.VITE_API_BASE}/animales/`, {
      headers: { 'Authorization': `Token ${token}` }
    })
      .then(res => res.ok ? res.json() : {})
      .then(data => {
        console.log('Respuesta animales:', data);
        if (typeof data.count === 'number') {
          setAnimalesCount(data.count);
        } else if (Array.isArray(data)) {
          setAnimalesCount(data.length);
        } else if (Array.isArray(data.results)) {
          setAnimalesCount(data.results.length);
        } else {
          setAnimalesCount(0);
        }
      });
  }, []);
  return (
    <div className="admin-dashboard" style={{ padding: 24 }}>
      <h1>Panel de administración</h1>
      <p style={{ fontSize: '1.2em', color: '#fff', marginBottom: 24 }}>Bienvenido al panel administrativo. Desde aquí puedes gestionar la aplicación y ver métricas clave.</p>

      <div style={{ display: 'flex', gap: '2em', marginBottom: '2em', flexWrap: 'wrap' }}>
        <div style={{ background: 'linear-gradient(90deg,#d32f2f,#ffb300)', color: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #d32f2f33', padding: '1.5em 2em', minWidth: 220, display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: '2.2em' }}>🏛️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.2em' }}>Refugios</div>
            <div style={{ fontSize: '2em', fontWeight: 800 }}>{refugiosCount}</div>
          </div>
        </div>
        <div style={{ background: 'linear-gradient(90deg,#ffb300,#d32f2f)', color: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #d32f2f33', padding: '1.5em 2em', minWidth: 220, display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: '2.2em' }}>⏳</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.2em' }}>Refugios sin verificar</div>
            <div style={{ fontSize: '2em', fontWeight: 800 }}>{refugiosSinVerificar}</div>
          </div>
        </div>
        <div style={{ background: 'linear-gradient(90deg,#1976d2,#43ea6b)', color: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #1976d233', padding: '1.5em 2em', minWidth: 220, display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: '2.2em' }}>🐾</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.2em' }}>Animales totales</div>
            <div style={{ fontSize: '2em', fontWeight: 800 }}>{animalesCount}</div>
          </div>
        </div>
      </div>

      <nav style={{ marginTop: 16 }}>
        <ul>
          <li><Link to="/admin/gestionar-refugios">Gestionar Refugios</Link></li>
          <li><Link to="/admin/gestionar-usuarios">Gestionar Usuarios</Link></li>
          <li><Link to="/admin/verificaciones">Verificar Refugios</Link></li>
          {/* <li><Link to="/admin/animales">Gestionar Animales</Link></li> */}
          {/* <li><Link to="/admin/reportes">Reportes</Link></li> */}
        </ul>
      </nav>

      <section style={{ marginTop: 24 }}>
        {/* <h2>Resumen rápido</h2>
        <div style={{ display: 'flex', gap: '2em', flexWrap: 'wrap' }}>
          <div style={{ background: '#fff2', borderRadius: 8, padding: '1em 2em', minWidth: 180 }}>
            <span style={{ fontWeight: 700 }}>Refugios activos:</span> 12
          </div>
          <div style={{ background: '#fff2', borderRadius: 8, padding: '1em 2em', minWidth: 180 }}>
            <span style={{ fontWeight: 700 }}>Donaciones sin verificar:</span> 3
          </div>
          <div style={{ background: '#fff2', borderRadius: 8, padding: '1em 2em', minWidth: 180 }}>
            <span style={{ fontWeight: 700 }}>Reportes generados:</span> 7
          </div>
        </div> */}
      </section>
    </div>
  );
};

export default AdminDashboard;
