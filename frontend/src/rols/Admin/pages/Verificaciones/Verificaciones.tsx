
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Verificaciones: React.FC = () => {
  const [postulaciones, setPostulaciones] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any | null>(null);
  const [observaciones, setObservaciones] = useState('');
  const [accionLoading, setAccionLoading] = useState(false);
  const [accionError, setAccionError] = useState('');
  const [filtroRegionPend, setFiltroRegionPend] = useState('');
  const [filtroNombrePend, setFiltroNombrePend] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/public/postulacion-refugio/?estado=pendiente`)
      .then(res => res.json())
      .then(data => {
        setPostulaciones(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar postulaciones');
        setLoading(false);
      });
  }, []);

  // Función para actualizar estado y observaciones
    async function actualizarEstado(nuevoEstado: string) {
      if (!modalData) return;
      setAccionLoading(true);
      setAccionError('');
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/public/postulacion-refugio/${modalData.id}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ estado: nuevoEstado, observaciones })
        });
        if (!res.ok) throw new Error('Error al actualizar la solicitud');
        setModalOpen(false);
        setPostulaciones(postulaciones.filter(p => p.id !== modalData.id));
      } catch (err) {
        setAccionError((err as Error).message || 'Error desconocido');
      }
      setAccionLoading(false);
    }

  return (
    <div style={{ padding: 24, minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.1)' }}>
      <h1 style={{ color: '#228B22', fontWeight: 800, fontSize: '2.5rem', marginBottom: 8, textAlign: 'center' }}>Verificaciones de Refugios</h1>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ color: '#228B22', fontWeight: 700, fontSize: '1.4rem', margin: 0 }}>Solicitudes por revisar o clasificar</h2>
        <button
          onClick={() => navigate('/admin/verificaciones/historial')}
          style={{
            background: '#43a047',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '12px 32px',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px #43a04744',
            transition: 'background 0.2s',
            minWidth: 220
          }}
          onMouseOver={e => (e.currentTarget.style.background = '#388e3c')}
          onMouseOut={e => (e.currentTarget.style.background = '#43a047')}
        >
          Ir a historial de solicitudes
        </button>
      </div>
  <div style={{ display: 'flex', gap: 18, marginBottom: 32, justifyContent: 'flex-start', width: '100%' }}>
        <input
          type='text'
          placeholder='Filtrar por región'
          value={filtroRegionPend}
          onChange={e => setFiltroRegionPend(e.target.value)}
          style={{
            padding: '12px',
            borderRadius: 10,
            border: '2px solid #43a047',
            fontSize: '1rem',
            minWidth: 180,
            background: '#f8fff8',
            boxShadow: '0 2px 8px #43a04722',
            outline: 'none'
          }}
        />
        <input
          type='text'
          placeholder='Filtrar por nombre'
          value={filtroNombrePend}
          onChange={e => setFiltroNombrePend(e.target.value)}
          style={{
            padding: '12px',
            borderRadius: 10,
            border: '2px solid #43a047',
            fontSize: '1rem',
            minWidth: 180,
            background: '#f8fff8',
            boxShadow: '0 2px 8px #43a04722',
            outline: 'none'
          }}
        />
        <input
          type='date'
          placeholder='Filtrar por fecha'
          value={''}
          onChange={() => {}}
          style={{
            padding: '12px',
            borderRadius: 10,
            border: '2px solid #43a047',
            fontSize: '1rem',
            minWidth: 180,
            background: '#f8fff8',
            boxShadow: '0 2px 8px #43a04722',
            outline: 'none'
          }}
        />
      </div>
      {loading ? <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#888' }}>Cargando...</p> : null}
      {error ? <p style={{ color: 'red', textAlign: 'center', fontSize: '1.1rem' }}>{error}</p> : null}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {postulaciones.length === 0 && !loading ? (
          <div style={{
            width: '100%',
            maxWidth: 700,
            minHeight: 180,
            background: '#f4fff1ff',
            borderRadius: 14,
            boxShadow: '0 2px 16px #43a04722',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 32
          }}>
            <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#555' }}>No hay postulaciones pendientes.</p>
          </div>
        ) : null}
        <ul style={{ listStyle: 'none', padding: 0, width: '100%', maxWidth: 700 }}>
          {postulaciones.filter(post => {
            if (filtroRegionPend && post.region.toLowerCase().indexOf(filtroRegionPend.toLowerCase()) === -1) return false;
            if (filtroNombrePend && post.nombre.toLowerCase().indexOf(filtroNombrePend.toLowerCase()) === -1) return false;
            return true;
          }).map(post => (
            <li key={post.id} style={{ background: '#fff', marginBottom: 18, padding: 24, borderRadius: 14, boxShadow: '0 2px 16px #43a04722', position: 'relative', cursor:'pointer' }}
              onClick={() => { setModalOpen(true); setModalData(post); setObservaciones(post.observaciones || ''); setAccionError(''); }}>
              <span style={{
                position: 'absolute',
                top: 14,
                right: 18,
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: 10,
                background: post.estado === 'pendiente' ? 'linear-gradient(90deg,#ffe082,#fffde7)' : post.estado === 'aceptada' ? '#b9f6ca' : post.estado === 'rechazada' ? '#ffcdd2' : '#e0e0e0',
                color: post.estado === 'pendiente' ? '#a19100ff' : post.estado === 'aceptada' ? '#228B22' : post.estado === 'rechazada' ? '#c62828' : '#555',
                fontWeight: 700,
                fontSize: '0.95rem',
                border: post.estado === 'pendiente' ? '1.5px solid #ffe082' : undefined,
                zIndex: 2
              }}>
                {post.estado === 'pendiente' ? 'PENDIENTE' : post.estado === 'aceptada' ? 'Aceptada' : post.estado === 'rechazada' ? 'Rechazada' : 'Por revisar'}
              </span>
              <div>
                <h3 style={{ marginBottom: 8, color: '#7b1fa2', fontSize: '1.2rem' }}>{post.nombre}</h3>
                <p style={{ marginBottom: 4 }}><b>Contacto:</b> {post.persona_contacto} | <b>Email:</b> {post.email}</p>
                <p style={{ marginBottom: 4 }}><b>Región:</b> {post.region} | <b>Comuna:</b> {post.comuna}</p>
                <p style={{ marginBottom: 4 }}><b>Fecha postulación:</b> {post.fecha_postulacion ? post.fecha_postulacion.split('T')[0] : ''}</p>
              </div>
            </li>
          ))}
        </ul>
        {modalOpen && modalData && (
          <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'#0007',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{background:'#fff',borderRadius:16,padding:32,minWidth:340,maxWidth:500,boxShadow:'0 2px 24px #43a04744',position:'relative'}}>
              <button onClick={()=>setModalOpen(false)} style={{position:'absolute',top:12,right:12,background:'#eee',border:'none',borderRadius:8,padding:'4px 12px',cursor:'pointer'}}>Cerrar</button>
              <h2 style={{marginBottom:12,color:'#228B22'}}>{modalData.nombre}</h2>
              <p><b>Contacto:</b> {modalData.persona_contacto} | <b>Email:</b> {modalData.email}</p>
              <p><b>Región:</b> {modalData.region} | <b>Comuna:</b> {modalData.comuna}</p>
              <p><b>Fecha postulación:</b> {modalData.fecha_postulacion ? modalData.fecha_postulacion.split('T')[0] : ''}</p>
              <p><b>Descripción:</b> {modalData.descripcion}</p>
              <div style={{marginTop:18}}>
                <label htmlFor='observaciones'><b>Observaciones:</b></label>
                <textarea id='observaciones' value={observaciones} onChange={e=>setObservaciones(e.target.value)} rows={3} style={{width:'100%',marginTop:6,padding:8,borderRadius:8,border:'1.5px solid #43a047',resize:'vertical'}} placeholder='Agrega observaciones aquí...'/>
              </div>
              {accionError && <p style={{color:'red',marginTop:8}}>{accionError}</p>}
              <div style={{marginTop:24,display:'flex',gap:16,justifyContent:'center'}}>
                <button disabled={accionLoading} onClick={()=>actualizarEstado('aceptada')} style={{background:'#43a047',color:'#fff',border:'none',borderRadius:8,padding:'10px 24px',fontWeight:700,cursor:'pointer'}}>Aceptar</button>
                <button disabled={accionLoading} onClick={()=>actualizarEstado('rechazada')} style={{background:'#e53935',color:'#fff',border:'none',borderRadius:8,padding:'10px 24px',fontWeight:700,cursor:'pointer'}}>Rechazar</button>
                <button disabled={accionLoading} onClick={()=>actualizarEstado('pendiente')} style={{background:'#ffeb3b',color:'#333',border:'none',borderRadius:8,padding:'10px 24px',fontWeight:700,cursor:'pointer'}}>Dejar en pendiente</button>
              </div>
            </div>
          </div>

        )}
      </div>
    </div>
  );
}

export default Verificaciones;
