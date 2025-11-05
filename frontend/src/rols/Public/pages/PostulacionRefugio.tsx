import React, { useState } from 'react';
import { FaInstagram, FaTwitter, FaFacebook, FaGlobe } from 'react-icons/fa';

import { regionesChile, regionesComunasChile as comunasPorRegion } from '../../../utils/regionesComunasChile';

type SitioWeb = {
  tipo: string;
  url: string;
};

const PostulacionRefugio: React.FC = () => {
  // Devuelve el ícono según el tipo de sitio
  const getSocialIcon = (tipo: string, url: string) => {
    if (tipo === 'Instagram' || url.includes('instagram.com')) return <FaInstagram style={{ color: '#E1306C' }} />;
    if (tipo === 'Twitter' || url.includes('twitter.com')) return <FaTwitter style={{ color: '#1DA1F2' }} />;
    if (tipo === 'Facebook' || url.includes('facebook.com')) return <FaFacebook style={{ color: '#4267B2' }} />;
    return <FaGlobe style={{ color: '#888' }} />;
  };
  const [form, setForm] = useState<{ 
    nombre: string;
    persona_contacto: string;
    email: string;
    telefono: string;
    direccion: string;
    comuna: string;
    region: string;
    cantidad_animales: string;
    tipos_animales: string;
    descripcion: string;
    ano_fundacion: string;
    sitios_web: SitioWeb[];
    personalidad_juridica: boolean;
    organizaciones_previas: string;
    necesidades_actuales: string;
  }>({
    nombre: '',
    persona_contacto: '',
    email: '',
    telefono: '',
    direccion: '',
    comuna: '',
    region: '',
    cantidad_animales: '',
    tipos_animales: '',
    descripcion: '',
    ano_fundacion: '',
    sitios_web: [],
    personalidad_juridica: false,
    organizaciones_previas: '',
    necesidades_actuales: ''
  });
  const [sitioTipo, setSitioTipo] = useState('Instagram');
  const [sitioUrl, setSitioUrl] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm({
        ...form,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setForm({
        ...form,
        [name]: value
      });
    }
  };

  const handleAddSitio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sitioUrl.trim()) return;
    setForm({
      ...form,
      sitios_web: [...form.sitios_web, { tipo: sitioTipo, url: sitioUrl }]
    });
    setSitioUrl('');
    setSitioTipo('Instagram');
  };

  const handleRemoveSitio = (idx: number) => {
    setForm({
      ...form,
      sitios_web: form.sitios_web.filter((_, i) => i !== idx)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Transformar sitios_web en string de redes_sociales para guardar automáticamente
    const redes_sociales = form.sitios_web.map(s => s.url).join(', ');
    const payload = { ...form, redes_sociales };
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/public/postulacion-refugio/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setEnviado(true);
      } else {
        setError('Error al enviar la postulación');
      }
    } catch {
      setError('Error de conexión');
    }
  };

  if (enviado) {
    return <div style={{padding:32, textAlign:'center'}}><h2>¡Gracias por tu postulación!</h2><p>Tu solicitud será revisada por el equipo de ReCo.</p></div>;
  }

  return (
  <div style={{maxWidth:800,margin:'32px auto',background:'#fff',borderRadius:16,padding:32,boxShadow:'0 2px 16px #43a04722'}}>
      <h2 style={{color:'#43a047',marginBottom:18}}>Postula tu refugio</h2>
  <form onSubmit={handleSubmit} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
        {error && <div style={{color:'red'}}>{error}</div>}
        <div>
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre del refugio" required style={{padding:10,borderRadius:8,border:'1px solid #bdbdbd',width:'100%'}} />
        </div>
        <div>
          <input name="persona_contacto" value={form.persona_contacto} onChange={handleChange} placeholder="Persona de contacto" required style={{padding:10,borderRadius:8,border:'1px solid #bdbdbd',width:'100%'}} />
        </div>
        <div>
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email de contacto" required type="email" style={{padding:10,borderRadius:8,border:'1px solid #bdbdbd',width:'100%'}} />
        </div>
        <div>
          <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" required style={{padding:10,borderRadius:8,border:'1px solid #bdbdbd',width:'100%'}} />
        </div>
        <div>
          <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" required style={{padding:10,borderRadius:8,border:'1px solid #bdbdbd',width:'100%'}} />
        </div>
        <div>
          <select
            name="region"
            value={form.region}
            onChange={handleChange}
            required
            style={{padding:10,borderRadius:8,border:'1px solid #bdbdbd',width:'100%'}}
          >
            <option value="">Selecciona una región</option>
            {regionesChile.map((region: string) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
        <div>
          <select
            name="comuna"
            value={form.comuna}
            onChange={handleChange}
            required
            disabled={!form.region}
            style={{padding:10,borderRadius:8,border:'1px solid #bdbdbd',width:'100%'}}
          >
            <option value="">Selecciona una comuna</option>
            {(comunasPorRegion[form.region] || []).map((comuna: string) => (
              <option key={comuna} value={comuna}>{comuna}</option>
            ))}
          </select>
        </div>
        <div>
          <input name="cantidad_animales" value={form.cantidad_animales} onChange={handleChange} placeholder="Cantidad de animales" required type="number" min="0" style={{padding:10,borderRadius:8,border:'1px solid #bdbdbd',width:'100%'}} />
        </div>
        <div>
          <input name="tipos_animales" value={form.tipos_animales} onChange={handleChange} placeholder="Tipos de animales (ej: Perros, Gatos, Otros)" required style={{padding:10,borderRadius:8,border:'1px solid #bdbdbd',width:'100%'}} />
        </div>
        <div style={{gridColumn:'1/3'}}>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción del refugio" required style={{padding:10,borderRadius:8,border:'1px solid #bdbdbd',minHeight:60,width:'100%'}} />
        </div>
        <div>
          <input name="ano_fundacion" value={form.ano_fundacion} onChange={handleChange} placeholder="Año de fundación" style={{padding:10,borderRadius:8,border:'1px solid #bdbdbd',width:'100%'}} />
        </div>
        <div style={{gridColumn:'1/3'}}>
          <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:8}}>
            <select value={sitioTipo} onChange={e => setSitioTipo(e.target.value)} style={{padding:8,borderRadius:8,border:'1px solid #bdbdbd'}}>
              <option>Instagram</option>
              <option>Facebook</option>
              <option>Twitter</option>
              <option>Web</option>
              <option>Otro</option>
            </select>
            <input value={sitioUrl} onChange={e => setSitioUrl(e.target.value)} placeholder="Enlace" style={{padding:10,borderRadius:8,border:'1px solid #bdbdbd',width:'60%'}} />
            <button onClick={handleAddSitio} style={{background:'#43a047',color:'#fff',border:'none',borderRadius:8,padding:'8px 16px',fontWeight:700,cursor:'pointer'}}>Agregar</button>
          </div>
          {form.sitios_web.length > 0 && (
            <ul style={{listStyle:'none',padding:0,margin:0}}>
              {form.sitios_web.map((sitio, idx) => (
                <li key={idx} style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                  {getSocialIcon(sitio.tipo, sitio.url)}
                  <span style={{fontWeight:600}}>{sitio.tipo}:</span>
                  <a href={sitio.url} target="_blank" rel="noopener noreferrer" style={{color:'#7b1fa2'}}>{sitio.url}</a>
                  <button type="button" onClick={() => handleRemoveSitio(idx)} style={{background:'#e53935',color:'#fff',border:'none',borderRadius:6,padding:'2px 10px',fontWeight:700,cursor:'pointer'}}>Eliminar</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div style={{gridColumn:'1/3'}}>
          <label style={{display:'flex',alignItems:'center',gap:8}}>
            <input name="personalidad_juridica" type="checkbox" checked={form.personalidad_juridica} onChange={handleChange} />
            ¿Tienen personalidad jurídica?
          </label>
        </div>
        <div style={{gridColumn:'1/3'}}>
          <textarea name="organizaciones_previas" value={form.organizaciones_previas} onChange={handleChange} placeholder="¿Han trabajado con otras organizaciones?" style={{padding:10,borderRadius:8,border:'1px solid #bdbdbd',minHeight:40,width:'100%'}} />
        </div>
        <div style={{gridColumn:'1/3'}}>
          <textarea name="necesidades_actuales" value={form.necesidades_actuales} onChange={handleChange} placeholder="¿Qué necesidades tienen actualmente?" style={{padding:10,borderRadius:8,border:'1px solid #bdbdbd',minHeight:40,width:'100%'}} />
        </div>
        <div style={{gridColumn:'1/3'}}>
    <button type="submit" style={{background:'#7b1fa2',color:'#fff',fontWeight:700,border:'none',borderRadius:8,padding:'12px 0',fontSize:17,cursor:'pointer',width:'100%'}}>Enviar postulación</button>
        </div>
      </form>
    </div>
  );
};

export default PostulacionRefugio;
