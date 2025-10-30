import React, { useState } from 'react';
import '../GestionRefugioMenu/GestionRefugioMenu.css'; // Reutilizamos algunos estilos

interface CrearRefugioFormProps {
  onRefugioCreado: (nombre: string) => void;
}

const CrearRefugioForm: React.FC<CrearRefugioFormProps> = ({ onRefugioCreado }) => {
  const [nombre, setNombre] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [direccion, setDireccion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar los datos al backend
    console.log('Creando refugio (simulación):', { nombre, region, comuna, direccion });
    // Simulamos éxito y llamamos a la función del padre
    onRefugioCreado(nombre);
  };

  // Lista simple de regiones (puedes expandirla o cargarla desde otro lugar)
  const regionesChile = [
    'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo',
    'Valparaíso', 'Metropolitana', 'O’Higgins', 'Maule', 'Ñuble', 'Biobío',
    'Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes'
  ];

  return (
    <div className="gestion-refugio-card form-card">
      <h2 className="gestion-refugio-title">Crea tu Refugio</h2>
      <p className="gestion-refugio-subtitle">
        Completa los datos básicos para registrar tu refugio en la plataforma.
      </p>
      <form onSubmit={handleSubmit} className="refugio-form">
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
            onChange={(e) => setRegion(e.target.value)}
            required
          >
            <option value="" disabled>Selecciona una región</option>
            {regionesChile.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="comuna">Comuna:</label>
          <input
            type="text"
            id="comuna"
            value={comuna}
            onChange={(e) => setComuna(e.target.value)}
            required
            placeholder="Ej: Macul"
          />
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
        <button type="submit" className="gestion-button crear-button">
          🐾 Crear Refugio
        </button>
      </form>
    </div>
  );
};

export default CrearRefugioForm;