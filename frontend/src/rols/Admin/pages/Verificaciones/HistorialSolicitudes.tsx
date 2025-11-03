import React, { useEffect, useState } from 'react';

const HistorialSolicitudes: React.FC = () => {
  const [historial, setHistorial] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroRegion, setFiltroRegion] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/public/postulacion-refugio/?historial=true`)
      .then(res => res.json())
      .then(data => {
        setHistorial(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar historial');
        setLoading(false);
      });
  }, []);

  const filtradas = historial.filter(post => {
    if (filtroRegion && post.region.toLowerCase().indexOf(filtroRegion.toLowerCase()) === -1) return false;
    if (filtroNombre && post.nombre.toLowerCase().indexOf(filtroNombre.toLowerCase()) === -1) return false;
    if (filtroFecha && post.fecha_postulacion) {
      const fecha = post.fecha_postulacion.split('T')[0];
      if (fecha !== filtroFecha) return false;
    }
    return true;
  });

  const [orden, setOrden] = useState('fecha');
  const hayFiltro = filtroRegion || filtroNombre || filtroFecha;
  let mostrar = hayFiltro ? filtradas : historial.slice(0, 10);
  if (orden === 'fecha') {
    mostrar = [...mostrar].sort((a, b) => {
      const fa = a.fecha_postulacion ? new Date(a.fecha_postulacion).getTime() : 0;
      const fb = b.fecha_postulacion ? new Date(b.fecha_postulacion).getTime() : 0;
      return fb - fa;
    });
  } else if (orden === 'abc') {
    mostrar = [...mostrar].sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Historial de Solicitudes</h1>
      <div style={{display:'flex',gap:12,marginBottom:16}}>
        <select value={orden} onChange={e=>setOrden(e.target.value)} style={{padding:'8px',borderRadius:8}}>
          <option value="fecha">Ordenar por fecha</option>
          <option value="abc">Ordenar por nombre</option>
        </select>
        <input type='text' placeholder='Filtrar por región' value={filtroRegion} onChange={e=>setFiltroRegion(e.target.value)} style={{padding:'8px',borderRadius:8}} />
        <input type='text' placeholder='Filtrar por nombre' value={filtroNombre} onChange={e=>setFiltroNombre(e.target.value)} style={{padding:'8px',borderRadius:8}} />
        <input type='date' value={filtroFecha} onChange={e=>setFiltroFecha(e.target.value)} style={{padding:'8px',borderRadius:8}} />
      </div>
      {loading ? <p>Cargando...</p> : null}
      {error ? <p style={{color:'red'}}>{error}</p> : null}
      {mostrar.length === 0 && !loading ? <p>No hay historial de solicitudes.</p> : null}
      <ul style={{listStyle:'none',padding:0}}>
        {mostrar.map(post => (
          <li key={post.id} style={{background:'#f8f8f8',marginBottom:12,padding:18,borderRadius:12,boxShadow:'0 1px 8px #8882',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <h3 style={{marginBottom:6, color: post.estado==='aceptada'?'#43a047':'#e53935'}}>{post.nombre}</h3>
              <p style={{marginBottom:4}}><b>Contacto:</b> {post.persona_contacto} | <b>Email:</b> {post.email}</p>
              <p style={{marginBottom:4}}><b>Región:</b> {post.region} | <b>Comuna:</b> {post.comuna}</p>
              <p style={{marginBottom:4}}><b>Fecha postulación:</b> {post.fecha_postulacion ? post.fecha_postulacion.split('T')[0] : ''}</p>
              <span style={{fontWeight:700,color:post.estado==='aceptada'?'#43a047':'#e53935'}}>{post.estado==='aceptada'?'Aceptada':'Rechazada'}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistorialSolicitudes;
