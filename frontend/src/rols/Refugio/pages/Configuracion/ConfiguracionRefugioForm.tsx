import React, { useState } from 'react';

interface RefugioFormProps {
  refugio: any;
  onSave: (data: FormData) => void;
}

interface FormData {
  // Refugio
  nombre: string;
  correo_contacto: string;
  direccion: string;
  region: string;
  comuna: string;
  telefono: string;
  logo?: File | null;
  sitio_web?: string;
  redes_sociales?: string;
  horario_atencion?: string;
  servicios_ofrecidos?: string;
  ano_fundacion?: string;
  personalidad_juridica?: boolean;
  estado?: string;
  // Usuario asociado
  usuario_nombre?: string;
  usuario_email?: string;
  usuario_telefono?: string;
  usuario_password?: string;
  usuario_password_confirm?: string;
}

const regionesChile = [
  "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo", "Valparaíso", "Metropolitana", "O'Higgins", "Maule", "Ñuble", "Biobío", "La Araucanía", "Los Ríos", "Los Lagos", "Aysén", "Magallanes"
];

const ConfiguracionRefugioForm: React.FC<RefugioFormProps> = ({ refugio, onSave }) => {
  const [showFileInput, setShowFileInput] = useState(false);
  const [logoEliminado, setLogoEliminado] = useState(false);
  const [form, setForm] = useState<FormData>({
    nombre: refugio?.nombre || '',
    correo_contacto: refugio?.correo_contacto || '',
    direccion: refugio?.direccion || '',
    region: refugio?.region || '',
    comuna: refugio?.comuna || '',
    telefono: refugio?.telefono || '',
    logo: null,
    sitio_web: refugio?.sitio_web || '',
    redes_sociales: Array.isArray(refugio?.redes_sociales) ? refugio.redes_sociales.join(', ') : '',
    horario_atencion: refugio?.horario_atencion || '',
    servicios_ofrecidos: refugio?.servicios_ofrecidos || '',
    ano_fundacion: refugio?.ano_fundacion || '',
    personalidad_juridica: refugio?.personalidad_juridica || false,
    estado: refugio?.estado || '',
  usuario_nombre: refugio?.usuario?.username || refugio?.usuario_nombre || '',
  usuario_email: refugio?.usuario?.email || refugio?.usuario_email || '',
  usuario_telefono: refugio?.usuario?.telefono || refugio?.usuario_telefono || '',
  usuario_password: '',
  usuario_password_confirm: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm(prev => ({ ...prev, logo: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
    }
  };

  const handleEliminarLogo = () => {
    setLogoPreview(null);
    setForm(prev => ({ ...prev, logo: null }));
    setLogoEliminado(true);
  };

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // Si el usuario eliminó el logo, enviar logo: null para que se elimine en la BD
  const payload = logoEliminado ? { ...form, logo: null } : form;
  onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: '0 auto', background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px #0001' }}>
      <h3 style={{ marginBottom: 18 }}>Editar Refugio</h3>
      <fieldset style={{ border: '2px solid #2196f3', borderRadius: 8, padding: 16, marginBottom: 24 }}>
        <legend style={{ fontWeight: 700, color: '#2196f3', fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>🏠</span> Datos del Refugio
        </legend>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18, background: '#e3f2fd', padding: 14, borderRadius: 10, boxShadow: '0 2px 8px #2196f322' }}>
          <div style={{ width: 70, height: 70, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #0001', fontSize: 38, color: '#2196f3', border: '2px solid #bbdefb' }}>
            {logoPreview ? (
              <img src={logoPreview} alt="Logo preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            ) : refugio.logo ? (
              <img src={refugio.logo} alt="Logo actual" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            ) : (
              <span>🏠</span>
            )}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 18, color: '#1976d2', marginBottom: 2 }}>{form.nombre || 'Refugio'}</div>
            <div style={{ color: '#1976d2', fontSize: 15 }}>
              <span style={{ marginRight: 8 }}>📧</span>{form.correo_contacto || '-'}
            </div>
            <div style={{ color: '#1976d2', fontSize: 15 }}>
              <span style={{ marginRight: 8 }}>📞</span>{form.telefono || '-'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 18 }}>
          <label style={{ fontWeight: 500, color: '#1976d2' }}>Nombre
            <input name="nombre" value={form.nombre} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #2196f3', marginTop: 4, background: '#fff', boxShadow: '0 2px 8px #2196f322' }} />
          </label>
          <label style={{ fontWeight: 500, color: '#1976d2' }}>Correo de contacto
            <input name="correo_contacto" value={form.correo_contacto} onChange={handleChange} type="email" required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #2196f3', marginTop: 4, background: '#fff', boxShadow: '0 2px 8px #2196f322' }} />
          </label>
          <label style={{ fontWeight: 500, color: '#1976d2' }}>Dirección
            <input name="direccion" value={form.direccion} onChange={handleChange} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #2196f3', marginTop: 4, background: '#fff', boxShadow: '0 2px 8px #2196f322' }} />
          </label>
          <label style={{ fontWeight: 500, color: '#1976d2' }}>Región
            <select name="region" value={form.region} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #2196f3', marginTop: 4, background: '#fff', boxShadow: '0 2px 8px #2196f322' }}>
              <option value="">Selecciona región</option>
              {regionesChile.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>
          <label style={{ fontWeight: 500, color: '#1976d2' }}>Comuna
            <input name="comuna" value={form.comuna} onChange={handleChange} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #2196f3', marginTop: 4, background: '#fff', boxShadow: '0 2px 8px #2196f322' }} />
          </label>
          <label style={{ fontWeight: 500, color: '#1976d2' }}>Teléfono
            <input name="telefono" value={form.telefono} onChange={handleChange} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #2196f3', marginTop: 4, background: '#fff', boxShadow: '0 2px 8px #2196f322' }} />
          </label>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 500, color: '#1976d2' }}>Logo
            <input name="logo" type="file" accept="image/*" onChange={handleFileChange} style={{ marginTop: 4 }} />
          </label>
          {/* Previsualización del logo actual si existe y no se ha seleccionado uno nuevo y no se ha eliminado */}
          {!logoPreview && refugio.logo && !logoEliminado && (
            <div style={{ margin: '12px 0' }}>
              <span style={{ fontWeight: 500 }}>Logo actual:</span><br/>
              <img src={refugio.logo} alt="Logo actual" style={{ maxWidth: 180, maxHeight: 180, borderRadius: 12, border: '2px solid #eee', background: '#fafafa' }} />
              <br/>
              <button type="button" style={{ marginTop: 8, color: '#e53935', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }} onClick={handleEliminarLogo}>Eliminar logo</button>
            </div>
          )}
          {/* Previsualización del nuevo logo seleccionado */}
          {logoPreview && (
            <div style={{ margin: '12px 0' }}>
              <span style={{ fontWeight: 500 }}>Previsualización nuevo logo:</span><br/>
              <img src={logoPreview} alt="Logo preview" style={{ maxWidth: 180, maxHeight: 180, borderRadius: 12, border: '2px solid #eee', background: '#fafafa' }} />
              <br/>
              <button type="button" style={{ marginTop: 8, color: '#f44336', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }} onClick={() => { setLogoPreview(null); setForm(prev => ({ ...prev, logo: null })); setShowFileInput(false); setLogoEliminado(false); }}>Cancelar cambio</button>
            </div>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, display: 'flex' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <label style={{ fontWeight: 500, color: '#1976d2', width: '100%' }}>Sitio web
            <input name="sitio_web" value={form.sitio_web} onChange={handleChange} style={{ width: '100%', minWidth: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #2196f3', marginTop: 4, background: '#fff', boxShadow: '0 2px 8px #2196f322' }} />
          </label>
          <label style={{ fontWeight: 500, color: '#1976d2', width: '100%' }}>Redes sociales (separadas por coma)
            <input name="redes_sociales" value={form.redes_sociales} onChange={handleChange} style={{ width: '100%', minWidth: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #2196f3', marginTop: 4, background: '#fff', boxShadow: '0 2px 8px #2196f322' }} />
          </label>
          <label style={{ fontWeight: 500, color: '#1976d2', width: '100%' }}>Horario de atención
            <input name="horario_atencion" value={form.horario_atencion} onChange={handleChange} style={{ width: '100%', minWidth: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #2196f3', marginTop: 4, background: '#fff', boxShadow: '0 2px 8px #2196f322' }} />
          </label>
          <label style={{ fontWeight: 500, color: '#1976d2', width: '100%' }}>Servicios ofrecidos
            <input name="servicios_ofrecidos" value={form.servicios_ofrecidos} onChange={handleChange} style={{ width: '100%', minWidth: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #2196f3', marginTop: 4, background: '#fff', boxShadow: '0 2px 8px #2196f322' }} />
          </label>
          <label style={{ fontWeight: 500, color: '#1976d2', width: '100%' }}>Año de fundación
            <input name="ano_fundacion" value={form.ano_fundacion} onChange={handleChange} style={{ width: '100%', minWidth: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #2196f3', marginTop: 4, background: '#fff', boxShadow: '0 2px 8px #2196f322' }} />
          </label>
          <label style={{ fontWeight: 500, color: '#1976d2', width: '100%' }}>Personalidad jurídica
            <input name="personalidad_juridica" type="checkbox" checked={form.personalidad_juridica} onChange={e => setForm(prev => ({ ...prev, personalidad_juridica: e.target.checked }))} style={{ marginLeft: 8 }} />
          </label>
          <label style={{ fontWeight: 500, color: '#1976d2', width: '100%' }}>Estado
            <input name="estado" value={form.estado} onChange={handleChange} style={{ width: '100%', minWidth: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #2196f3', marginTop: 4, background: '#fff', boxShadow: '0 2px 8px #2196f322' }} />
          </label>
        </div>
        </div>
      </fieldset>
      <fieldset style={{ border: '2px solid #4caf50', borderRadius: 8, padding: 16, marginBottom: 24 }}>
        <legend style={{ fontWeight: 700, color: '#4caf50', fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>👤</span> Usuario Asociado
        </legend>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18, background: '#e8f5e9', padding: 14, borderRadius: 10, boxShadow: '0 2px 8px #4caf5022' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #0001', fontSize: 32, color: '#4caf50', border: '2px solid #c8e6c9' }}>
            <span>👤</span>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 17, color: '#388e3c', marginBottom: 2 }}>
              {refugio?.usuario?.username || refugio?.usuario_nombre || '-'}
            </div>
            <div style={{ color: '#388e3c', fontSize: 15 }}>
              <span style={{ marginRight: 8 }}>📧</span>{refugio?.usuario?.email || refugio?.usuario_email || '-'}
            </div>
            <div style={{ color: '#388e3c', fontSize: 15 }}>
              <span style={{ marginRight: 8 }}>📞</span>{refugio?.usuario?.telefono || refugio?.usuario_telefono || '-'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={{ fontWeight: 500, color: '#388e3c' }}>Nombre de usuario
            <input name="usuario_nombre" value={form.usuario_nombre} onChange={handleChange} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #4caf50', marginTop: 4, background: '#fff', boxShadow: '0 2px 8px #4caf5022' }} placeholder="Nuevo nombre de usuario" />
          </label>
          <label style={{ fontWeight: 500, color: '#388e3c' }}>Email
            <input name="usuario_email" value={form.usuario_email} onChange={handleChange} type="email" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #4caf50', marginTop: 4, background: '#fff', boxShadow: '0 2px 8px #4caf5022' }} placeholder="Nuevo email" />
          </label>
          <label style={{ fontWeight: 500, color: '#388e3c' }}>Teléfono
            <input name="usuario_telefono" value={form.usuario_telefono} onChange={handleChange} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #4caf50', marginTop: 4, background: '#fff', boxShadow: '0 2px 8px #4caf5022' }} placeholder="Nuevo teléfono" />
          </label>
          <label style={{ fontWeight: 500, color: '#388e3c' }}>Nueva contraseña
            <input name="usuario_password" type="password" value={form.usuario_password} onChange={handleChange} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #4caf50', marginTop: 4, background: '#fff', boxShadow: '0 2px 8px #4caf5022' }} autoComplete="new-password" placeholder="Nueva contraseña" />
          </label>
          <label style={{ fontWeight: 500, color: '#388e3c' }}>Confirmar contraseña
            <input name="usuario_password_confirm" type="password" value={form.usuario_password_confirm} onChange={handleChange} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #4caf50', marginTop: 4, background: '#fff', boxShadow: '0 2px 8px #4caf5022' }} autoComplete="new-password" placeholder="Confirmar contraseña" />
          </label>
        </div>
      </fieldset>
      <button type="submit" style={{ marginTop: 16, padding: '8px 24px', background: '#4caf50', color: '#fff', border: 'none', borderRadius: 6 }}>Guardar cambios</button>
    </form>
  );
};

export default ConfiguracionRefugioForm;
