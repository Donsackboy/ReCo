import React, { useEffect, useState } from 'react';
import ConfiguracionRefugioForm from './ConfiguracionRefugioForm';
import './perfilRefugioResponsive.css';

const ConfiguracionRefugio: React.FC = () => {
  const [refugio, setRefugio] = useState<any>(null);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8000/api/refugio/me', {
      headers: token ? { 'Authorization': `Token ${token}` } : {}
    })
      .then(res => {
        if (res.status === 401) {
          setError('No autorizado. Inicia sesión nuevamente.');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data && data.id_refugio) {
          setRefugio(data);
        } else if (!error && data) {
          setError('Refugio no encontrado');
        }
      })
      .catch(() => setError('Error al cargar datos del refugio'));
  }, []);

  const handleSave = async (form: any) => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    const formData = new FormData();
    // Solo eliminar el logo si viene la bandera explicita desde el form
    if (form.logo && form.logo instanceof File) {
      formData.append('logo', form.logo);
      // No enviar eliminar_logo aquí, el backend reemplazará el archivo
    } else if (form.eliminar_logo === true) {
      formData.append('logo', ''); // Eliminar logo si se eliminó
      formData.append('eliminar_logo', 'true');
    }
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'logo' || key === 'eliminar_logo') return; // Ya procesado arriba
      if (value !== undefined && value !== null) {
        if (key === 'redes_sociales') {
          // Convertir string separada por comas a lista JSON
          const redes = typeof value === 'string' ? value.split(',').map(r => r.trim()).filter(Boolean) : value;
          formData.append(key, JSON.stringify(redes));
        } else if (["banco", "tipoCuenta", "tipo_cuenta", "numeroCuenta", "numero_cuenta", "rutTitular", "rut_titular"].includes(key)) {
          // Enviar campos bancarios con el nombre esperado por el backend
          let backendKey = key;
          let bancoValue = value;
          if (key === "banco" && form.banco === "Banco Otros" && form.bancoOtro) {
            bancoValue = form.bancoOtro;
          }
          if (key === "tipoCuenta") backendKey = "tipo_cuenta";
          if (key === "numeroCuenta") backendKey = "numero_cuenta";
          if (key === "rutTitular") backendKey = "rut_titular";
          formData.append(backendKey, String(bancoValue));
        } else {
          formData.append(key, String(value));
        }
      }
    });
    try {
      const res = await fetch(`http://localhost:8000/api/refugio/me`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`
        },
        body: formData
      });
      if (res.ok) {
        // Tras guardar, recargar los datos del refugio para asegurar que el logo y los datos sean los más recientes
        const token = localStorage.getItem('token');
        fetch('http://localhost:8000/api/refugio/me', {
          headers: token ? { 'Authorization': `Token ${token}` } : {}
        })
          .then(res => res.json())
          .then(data => {
            setRefugio(data);
            setEditMode(false);
          });
      } else {
        let errorMsg = 'Error al guardar cambios';
        try {
          const errorData = await res.json();
          errorMsg = errorData?.error || JSON.stringify(errorData) || errorMsg;
        } catch {}
        setError(errorMsg);
      }
    } catch {
      setError('Error al guardar cambios');
    }
    setLoading(false);
  };

  if (error) return <div style={{ color: 'red', padding: 20 }}>{error}</div>;
  if (!refugio) return <div>Cargando...</div>;

  return (
    <div className="perfil-refugio-responsive-container">
      <h2 className="perfil-refugio-title">Mi Refugio</h2>
      {!editMode ? (
        <div className="perfil-refugio-card">
          {refugio.logo && (
            <div className="perfil-refugio-logo-container">
              <img src={refugio.logo} alt="Logo" className="perfil-refugio-logo" />
            </div>
          )}
          <div className="perfil-refugio-info">
            <p className="perfil-refugio-nombre">
              <span role="img" aria-label="refugio" style={{ marginRight: 8 }}>🏠</span>{refugio.nombre}
            </p>
            <ul className="perfil-refugio-lista">
              <li><b>Email:</b> {refugio.correo_contacto || refugio.email || '-'}</li>
              <li><b>Dirección:</b> {refugio.direccion || '-'}</li>
              <li><b>Región:</b> {refugio.region || '-'}</li>
              <li><b>Comuna:</b> {refugio.comuna || '-'}</li>
              <li><b>Teléfono:</b> {refugio.telefono || '-'}</li>
              <li><b>Fecha de fundación:</b> {refugio.ano_fundacion || '-'}</li>
              <li><b>Estado:</b> {refugio.estado || '-'}</li>
              <li><b>Descripción:</b> {refugio.descripcion || '-'}</li>
              <li><b>Redes sociales:</b> {Array.isArray(refugio.redes_sociales) ? refugio.redes_sociales.join(', ') : (refugio.redes_sociales || '-')}</li>
            </ul>
            <div className="perfil-refugio-bancarios-card">
              <h4 className="perfil-refugio-bancarios-titulo"><span role="img" aria-label="banco" style={{marginRight:8}}>💳</span>Datos bancarios para donaciones</h4>
              <ul className="perfil-refugio-bancarios-lista">
                <li><b>Banco:</b> {refugio.banco || '-'}</li>
                <li><b>Tipo de cuenta:</b> {refugio.tipoCuenta || refugio.tipo_cuenta || '-'}</li>
                <li><b>Número de cuenta:</b> {refugio.numeroCuenta || refugio.numero_cuenta || '-'}</li>
                <li><b>Nombre titular:</b> {refugio.titularCuenta || refugio.titular_cuenta || '-'}</li>
                <li><b>RUT titular:</b> {refugio.rutTitular || refugio.rut_titular || '-'}</li>
                <li><b>Email bancario:</b> {refugio.emailBancario || refugio.email_bancario || refugio.email || '-'}</li>
              </ul>
            </div>
            <hr className="perfil-refugio-separador" />
            <h4 className="perfil-refugio-usuario-titulo">Usuario asociado</h4>
            <ul className="perfil-refugio-lista">
              <li><b>Nombre de usuario:</b> {refugio.usuario?.username || '-'}</li>
              <li><b>Email usuario:</b> {refugio.usuario?.email || '-'}</li>
              <li><b>Teléfono usuario:</b> {refugio.usuario?.telefono || '-'}</li>
            </ul>
          </div>
          <button className="perfil-refugio-editar-btn" onClick={() => setEditMode(true)}>Editar Refugio</button>
        </div>
      ) : (
        <ConfiguracionRefugioForm refugio={refugio} onSave={handleSave} />
      )}
      {loading && <div className="perfil-refugio-guardando">Guardando cambios...</div>}
    </div>
  );
};

export default ConfiguracionRefugio;
