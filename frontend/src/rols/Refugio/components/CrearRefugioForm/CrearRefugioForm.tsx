import React, { useState } from 'react';
import { regionesChile, regionesComunasChile as comunasPorRegion } from '../../../../utils/regionesComunasChile';
import '../GestionRefugioMenu/GestionRefugioMenu.css'; // Reutilizamos algunos estilos

interface CrearRefugioFormProps {
  onRefugioCreado: (nombre: string) => void;
}

const CrearRefugioForm: React.FC<CrearRefugioFormProps> = ({ onRefugioCreado }) => {
      const [confirmPassword] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [banco, setBanco] = useState('');
    const [tipoCuenta, setTipoCuenta] = useState('');
    const [numeroCuenta, setNumeroCuenta] = useState('');
    const [rutTitular, setRutTitular] = useState('');
  const [nombre, setNombre] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [direccion, setDireccion] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    // Enviar datos al backend
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/admin/refugios/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          nombre,
          region,
          comuna,
          direccion,
          username,
          email,
          password
        })
      });
      if (response.ok) {
        const data = await response.json();
        onRefugioCreado(data.refugio.nombre);
      } else {
        setError('Error al crear refugio');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  // Lista simple de regiones (puedes expandirla o cargarla desde otro lugar)
  // regionesChile y comunasPorRegion importados desde utils

  return (
    <div className="gestion-refugio-card form-card">
      <h2 className="gestion-refugio-title">Crea tu Refugio</h2>
      <p className="gestion-refugio-subtitle">
        Completa los datos básicos para registrar tu refugio en la plataforma.
      </p>
      <form onSubmit={handleSubmit} className="refugio-form">
        {error && <div style={{color: 'red', marginBottom: 8}}>{error}</div>}
        <div className="form-group">
          <label htmlFor="nombre">Nombre del Refugio:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Ej: Refugio Patitas Felices"
          />
        </div>
        <div className="form-group">
          <label htmlFor="region">Región:</label>
          <select
            id="region"
            value={region}
            onChange={e => {
              setRegion(e.target.value);
              setComuna('');
            }}
            required
          >
            <option value="" disabled>Selecciona una región</option>
            {regionesChile.map((r: string) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="comuna">Comuna:</label>
          <select
            id="comuna"
            value={comuna}
            onChange={e => setComuna(e.target.value)}
            required
            disabled={!region}
          >
            <option value="" disabled>Selecciona una comuna</option>
            {(comunasPorRegion[region] || []).map((c: string) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="direccion">Dirección (Calle y Número):</label>
          <input
            type="text"
            id="direccion"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
            placeholder="Ej: Av. Siempre Viva 123"
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Nombre de usuario para el refugio:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Ej: patitasfelices"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email del refugio:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Ej: contacto@patitasfelices.cl"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Contraseña"
          />
        </div>
        <div className="form-group">
          <label htmlFor="descripcion">Descripción del refugio:</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            required
            placeholder="Describe brevemente el refugio"
          />
        </div>

        {/* Campos bancarios para donaciones */}
        <div className="form-group">
          <label htmlFor="banco">Banco:</label>
          <input
            type="text"
            id="banco"
            value={banco}
            onChange={e => setBanco(e.target.value)}
            placeholder="Ej: Banco Estado"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="tipoCuenta">Tipo de cuenta:</label>
          <input
            type="text"
            id="tipoCuenta"
            value={tipoCuenta}
            onChange={e => setTipoCuenta(e.target.value)}
            placeholder="Ej: Cuenta Vista, Corriente, Rut"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="numeroCuenta">Número de cuenta:</label>
          <input
            type="text"
            id="numeroCuenta"
            value={numeroCuenta}
            onChange={e => setNumeroCuenta(e.target.value)}
            placeholder="Ej: 123456789"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="rutTitular">RUT titular:</label>
          <input
            type="text"
            id="rutTitular"
            value={rutTitular}
            onChange={e => setRutTitular(e.target.value)}
            placeholder="Ej: 12.345.678-9"
            required
          />
        </div>
        <button type="submit" className="gestion-button crear-button">
          🐾 Crear Refugio
        </button>
      </form>
    </div>
  );
};

export default CrearRefugioForm;