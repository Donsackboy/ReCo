import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-dashboard" style={{ padding: 24 }}>
      <h1>Panel de administración</h1>
      <p>Bienvenido al panel administrativo. Desde aquí puedes gestionar la aplicación.</p>

      <nav style={{ marginTop: 16 }}>
        <ul>
          <li><Link to="/admin/refugios">Gestionar Refugios</Link></li>
          <li><Link to="/admin/usuarios">Gestionar Usuarios</Link></li>
          <li><Link to="/admin/verificaciones">Verificar Comprobantes</Link></li>
          <li><Link to="/admin/reportes">Reportes</Link></li>
        </ul>
      </nav>

      <section style={{ marginTop: 24 }}>
        <h2>Resumen rápido</h2>
        <div>
          <p>— Total refugios: 0</p>
          <p>— Usuarios pendientes por revisar: 0</p>
          <p>— Donaciones sin verificar: 0</p>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
