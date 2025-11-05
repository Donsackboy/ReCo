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

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: '0 auto', background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px #0001' }}>
      <h3 style={{ marginBottom: 18 }}>Editar Refugio</h3>
      <fieldset style={{ border: '2px solid #2196f3', borderRadius: 8, padding: 16, marginBottom: 24 }}>
        <legend style={{ fontWeight: 700, color: '#2196f3', fontSize: 18 }}>Datos del Refugio</legend>
        <label>Nombre:<br/>
          <input name="nombre" value={form.nombre} onChange={handleChange} required style={{ width: '100%' }} />
        </label><br/>
        <label>Correo de contacto:<br/>
          <input name="correo_contacto" value={form.correo_contacto} onChange={handleChange} type="email" required style={{ width: '100%' }} />
        </label><br/>
        <label>Dirección:<br/>
          <input name="direccion" value={form.direccion} onChange={handleChange} style={{ width: '100%' }} />
        </label><br/>
        <label>Región:<br/>
          <select name="region" value={form.region} onChange={handleChange} required style={{ width: '100%' }}>
            <option value="">Selecciona región</option>
            {regionesChile.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </label><br/>
        <label>Comuna:<br/>
          <input name="comuna" value={form.comuna} onChange={handleChange} style={{ width: '100%' }} />
        </label><br/>
        <label>Teléfono:<br/>
          <input name="telefono" value={form.telefono} onChange={handleChange} style={{ width: '100%' }} />
        </label><br/>
        <label>Logo:<br/>
          <input name="logo" type="file" accept="image/*" onChange={handleFileChange} />
          {/* Mostrar logo actual si existe y no se ha seleccionado uno nuevo */}
            {!logoPreview && refugio.logo && !showFileInput && (
              <div style={{ margin: '12px 0' }}>
                <span style={{ fontWeight: 500 }}>Logo actual:</span><br/>
                <img src={refugio.logo} alt="Logo actual" style={{ maxWidth: 180, maxHeight: 180, borderRadius: 12, border: '2px solid #eee', background: '#fafafa' }} />
                <br/>
                <button type="button" style={{ marginTop: 8, color: '#2196f3', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }} onClick={() => setShowFileInput(true)}>Cambiar logo</button>
              </div>
            )}
            {/* Input para elegir nuevo logo solo si el usuario lo solicita */}
            {(showFileInput || !refugio.logo) && (
              <input name="logo" type="file" accept="image/*" onChange={handleFileChange} />
            )}
            {/* Previsualización del nuevo logo */}
            {logoPreview && (
              <div style={{ margin: '12px 0' }}>
                <span style={{ fontWeight: 500 }}>Previsualización:</span><br/>
                <img src={logoPreview} alt="Logo preview" style={{ maxWidth: 180, maxHeight: 180, borderRadius: 12, border: '2px solid #eee', background: '#fafafa' }} />
                <br/>
                <button type="button" style={{ marginTop: 8, color: '#f44336', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }} onClick={() => { setLogoPreview(null); setForm(prev => ({ ...prev, logo: null })); setShowFileInput(false); }}>Cancelar cambio</button>
              </div>
            )}
          {/* Previsualización del nuevo logo */}
          {logoPreview && (
            <div style={{ margin: '12px 0' }}>
              <span style={{ fontWeight: 500 }}>Previsualización:</span><br/>
              <img src={logoPreview} alt="Logo preview" style={{ maxWidth: 180, maxHeight: 180, borderRadius: 12, border: '2px solid #eee', background: '#fafafa' }} />
              <br/>
              <button type="button" style={{ marginTop: 8, color: '#f44336', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }} onClick={() => { setLogoPreview(null); setForm(prev => ({ ...prev, logo: null })); }}>Eliminar selección</button>
            </div>
          )}
        </label><br/>
        <label>Sitio web:<br/>
          <input name="sitio_web" value={form.sitio_web} onChange={handleChange} style={{ width: '100%' }} />
        </label><br/>
        <label>Redes sociales (separadas por coma):<br/>
          <input name="redes_sociales" value={form.redes_sociales} onChange={handleChange} style={{ width: '100%' }} />
        </label><br/>
        <label>Horario de atención:<br/>
          <input name="horario_atencion" value={form.horario_atencion} onChange={handleChange} style={{ width: '100%' }} />
        </label><br/>
        <label>Servicios ofrecidos:<br/>
          <input name="servicios_ofrecidos" value={form.servicios_ofrecidos} onChange={handleChange} style={{ width: '100%' }} />
        </label><br/>
        <label>Año de fundación:<br/>
          <input name="ano_fundacion" value={form.ano_fundacion} onChange={handleChange} style={{ width: '100%' }} />
        </label><br/>
        <label>Personalidad jurídica:<br/>
          <input name="personalidad_juridica" type="checkbox" checked={form.personalidad_juridica} onChange={e => setForm(prev => ({ ...prev, personalidad_juridica: e.target.checked }))} />
        </label><br/>
        <label>Estado:<br/>
          <input name="estado" value={form.estado} onChange={handleChange} style={{ width: '100%' }} />
        </label>
      </fieldset>
      <fieldset style={{ border: '2px solid #4caf50', borderRadius: 8, padding: 16, marginBottom: 24 }}>
        <legend style={{ fontWeight: 700, color: '#4caf50', fontSize: 18 }}>Usuario Asociado</legend>
        <div style={{ marginBottom: 12, background: '#f6f6f6', padding: 10, borderRadius: 6 }}>
          <strong>Actual:</strong><br/>
          <span>Nombre de usuario: <b>{refugio?.usuario?.username || refugio?.usuario_nombre || '-'}</b></span><br/>
          <span>Email: <b>{refugio?.usuario?.email || refugio?.usuario_email || '-'}</b></span><br/>
          <span>Teléfono: <b>{refugio?.usuario?.telefono || refugio?.usuario_telefono || '-'}</b></span>
        </div>
        <label>Editar nombre de usuario:<br/>
          <input name="usuario_nombre" value={form.usuario_nombre} onChange={handleChange} style={{ width: '100%' }} placeholder="Nuevo nombre de usuario" />
        </label><br/>
        <label>Editar email:<br/>
          <input name="usuario_email" value={form.usuario_email} onChange={handleChange} type="email" style={{ width: '100%' }} placeholder="Nuevo email" />
        </label><br/>
        <label>Editar teléfono:<br/>
          <input name="usuario_telefono" value={form.usuario_telefono} onChange={handleChange} style={{ width: '100%' }} placeholder="Nuevo teléfono" />
        </label><br/>
        <label>Nueva contraseña:<br/>
          <input name="usuario_password" type="password" value={form.usuario_password} onChange={handleChange} style={{ width: '100%' }} autoComplete="new-password" placeholder="Nueva contraseña" />
        </label><br/>
        <label>Confirmar contraseña:<br/>
          <input name="usuario_password_confirm" type="password" value={form.usuario_password_confirm} onChange={handleChange} style={{ width: '100%' }} autoComplete="new-password" placeholder="Confirmar contraseña" />
        </label>
      </fieldset>
      <button type="submit" style={{ marginTop: 16, padding: '8px 24px', background: '#4caf50', color: '#fff', border: 'none', borderRadius: 6 }}>Guardar cambios</button>
    </form>
  );
};

export default ConfiguracionRefugioForm;
