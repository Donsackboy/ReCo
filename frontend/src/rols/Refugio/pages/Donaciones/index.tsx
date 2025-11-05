import React, { useState, useEffect } from 'react';
import './Donaciones.css';

const DONATION_FIELDS = [
  { name: 'banco', label: 'Banco' },
  { name: 'tipo_cuenta', label: 'Tipo de cuenta' },
  { name: 'numero_cuenta', label: 'Número de cuenta' },
  { name: 'nombre_titular', label: 'Nombre titular' },
  { name: 'rut_titular', label: 'RUT titular' },
  { name: 'correo_donacion', label: 'Correo para donaciones' },
];

function hasDonationData(data: any) {
  return DONATION_FIELDS.some(field => data[field.name] && data[field.name].trim() !== '');
}

const Donaciones: React.FC = () => {
  const [donationData, setDonationData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Obtener datos actuales del refugio
  useEffect(() => {
    fetch('/backend/registry/refugio/me/', {
      credentials: 'include',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setDonationData(data);
        setForm({
          banco: data.banco || '',
          tipo_cuenta: data.tipo_cuenta || '',
          numero_cuenta: data.numero_cuenta || '',
          nombre_titular: data.nombre_titular || '',
          rut_titular: data.rut_titular || '',
          correo_donacion: data.correo_donacion || '',
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => {
    setEditing(prev => !prev);
    setSuccess(null);
    setError(null);
    if (!editing) {
      setForm({ ...donationData });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/backend/registry/refugio/me/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Error al actualizar los datos');
      const data = await res.json();
      setDonationData(data);
      setEditing(false);
      setSuccess('Datos actualizados correctamente');
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    }
  };

  // Icono de exclamación SVG
  const ExclamationIcon = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
      <circle cx="10" cy="10" r="9" fill="#e53935" />
      <rect x="9" y="5" width="2" height="7" rx="1" fill="#fff" />
      <rect x="9" y="14" width="2" height="2" rx="1" fill="#fff" />
    </svg>
  );

  return (
    <div className="donaciones-container">
      <h1 style={{ marginBottom: '8px' }}>
        Donaciones
      </h1>
      {donationData && donationData.nombre && (
        <div style={{ textAlign: 'center', fontSize: '1.3rem', fontWeight: 'bold', color: '#4caf50', marginBottom: '24px' }}>
          {donationData.nombre}
        </div>
      )}
      {/* Sección principal de manejo de donaciones */}
      {loading ? <p>Cargando datos...</p> : (
        <>
          <section>
            <h2>Datos de transferencia</h2>
            <ul>
              {DONATION_FIELDS.map(field => (
                <li key={field.name}><strong>{field.label}:</strong> {donationData[field.name] || <em>No ingresado</em>}</li>
              ))}
            </ul>
            <button onClick={handleEditToggle}>
              {!hasDonationData(donationData) && <ExclamationIcon />}
              {editing ? 'Cerrar formulario' : 'Editar datos de transferencia'}
            </button>
            {!hasDonationData(donationData) && (
              <p style={{ color: '#e53935', marginTop: '8px', fontWeight: 'bold' }}>
                ¡Aún no has ingresado tus datos de transferencia!
              </p>
            )}
            {success && <p style={{ color: 'green' }}>{success}</p>}
          </section>

          {/* Sección de edición de datos de donación */}
          {editing && (
            <section style={{ marginTop: '32px' }}>
              <h2>Editar datos de transferencia</h2>
              <form onSubmit={handleSubmit}>
                {DONATION_FIELDS.map(field => (
                  <div key={field.name} style={{ marginBottom: '8px' }}>
                    <label>
                      {field.label}:<br />
                      <input
                        type="text"
                        name={field.name}
                        value={form[field.name] || ''}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                ))}
                <button type="submit">Guardar</button>
                <button type="button" onClick={handleEditToggle} style={{ marginLeft: '8px' }}>Cerrar</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
              </form>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default Donaciones;
