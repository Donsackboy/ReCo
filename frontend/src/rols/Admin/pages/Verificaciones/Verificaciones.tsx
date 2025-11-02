import React, { useEffect, useState } from 'react';

const Verificaciones: React.FC = () => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'aceptada'|'rechazada'|null>(null);
  const [postulaciones, setPostulaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any | null>(null);

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

  const actualizarEstado = async (id: number, estado: string) => {
    await fetch(`${import.meta.env.VITE_API_BASE}/public/postulacion-refugio/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado })
    });
    setPostulaciones(postulaciones.filter(p => p.id !== id));
    setModalOpen(false);
    setModalData(null);
    setConfirmOpen(false);
    setConfirmAction(null);
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Verificaciones de Refugios</h1>
      {loading ? <p>Cargando...</p> : null}
      {error ? <p style={{color:'red'}}>{error}</p> : null}
      {postulaciones.length === 0 && !loading ? <p>No hay postulaciones pendientes.</p> : null}
      <ul style={{listStyle:'none',padding:0}}>
        {postulaciones.map(post => (
          <li key={post.id} style={{background:'#fff',marginBottom:16,padding:16,borderRadius:8,boxShadow:'0 2px 8px #43a04722',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <h3 style={{marginBottom:8}}>{post.nombre}</h3>
              <p><b>Contacto:</b> {post.persona_contacto} | <b>Email:</b> {post.email}</p>
              <p><b>Región:</b> {post.region} | <b>Comuna:</b> {post.comuna}</p>
            </div>
            <button onClick={() => {setModalOpen(true);setModalData(post);}} style={{background:'#7b1fa2',color:'#fff',border:'none',borderRadius:8,padding:'10px 20px',fontWeight:700,cursor:'pointer'}}>Ver detalles</button>
          </li>
        ))}
      </ul>

      {modalOpen && modalData && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'#0008',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}} onClick={()=>{setModalOpen(false);setModalData(null);}}>
          <div style={{background:'#fff',borderRadius:16,padding:32,minWidth:350,maxWidth:500,boxShadow:'0 4px 32px #43a04744',position:'relative'}} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>{setModalOpen(false);setModalData(null);}} style={{position:'absolute',top:16,right:16,background:'none',border:'none',fontSize:22,cursor:'pointer',color:'#888'}}>×</button>
            <h2 style={{color:'#43a047',marginBottom:12}}>{modalData.nombre}</h2>
            <div style={{marginBottom:16}}>
              <div style={{display:'flex',gap:16,marginBottom:8}}>
                <div style={{flex:1}}>
                  <b>Contacto:</b>
                  <div style={{marginTop:4}}>{modalData.persona_contacto}</div>
                  <div style={{marginTop:4}}><b>Email:</b> {modalData.email}</div>
                  <div style={{marginTop:4}}><b>Tel:</b> {modalData.telefono}</div>
                </div>
                <div style={{flex:1}}>
                  <b>Ubicación:</b>
                  <div style={{marginTop:4}}><b>Región:</b> {modalData.region}</div>
                  <div style={{marginTop:4}}><b>Comuna:</b> {modalData.comuna}</div>
                </div>
              </div>
              <div style={{marginTop:12}}>
                <b>Descripción:</b>
                <div style={{marginTop:4}}>{modalData.descripcion}</div>
              </div>
              <div style={{marginTop:12}}>
                <b>Sitios web:</b>
                <div style={{marginTop:4}}>{Array.isArray(modalData.sitios_web) ? modalData.sitios_web.map((s:any) => <span key={s.url}>{s.tipo}: <a href={s.url} target="_blank" rel="noopener noreferrer">{s.url}</a> &nbsp;</span>) : modalData.sitios_web}</div>
              </div>
            </div>
            <div style={{marginTop:24,display:'flex',gap:12,justifyContent:'center'}}>
              <button onClick={() => {setConfirmOpen(true);setConfirmAction('aceptada');}} style={{background:'#43a047',color:'#fff',border:'none',borderRadius:8,padding:'10px 24px',fontWeight:700,cursor:'pointer'}}>Aceptar</button>
              <button onClick={() => {setConfirmOpen(true);setConfirmAction('rechazada');}} style={{background:'#e53935',color:'#fff',border:'none',borderRadius:8,padding:'10px 24px',fontWeight:700,cursor:'pointer'}}>Rechazar</button>
            </div>
          </div>
        </div>
      )}

      {confirmOpen && modalData && confirmAction && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'#0006',zIndex:1100,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:12,padding:32,minWidth:300,maxWidth:400,boxShadow:'0 2px 16px #43a04744',textAlign:'center'}}>
            <h3 style={{marginBottom:18}}>{confirmAction === 'aceptada' ? '¿Aceptar postulación?' : '¿Rechazar postulación?'}</h3>
            <p>¿Estás seguro que deseas {confirmAction === 'aceptada' ? 'aceptar' : 'rechazar'} la postulación de <b>{modalData.nombre}</b>?</p>
            <div style={{marginTop:24,display:'flex',gap:12,justifyContent:'center'}}>
              <button onClick={() => actualizarEstado(modalData.id, confirmAction)} style={{background: confirmAction === 'aceptada' ? '#43a047' : '#e53935',color:'#fff',border:'none',borderRadius:8,padding:'10px 24px',fontWeight:700,cursor:'pointer'}}>Confirmar</button>
              <button onClick={() => {setConfirmOpen(false);setConfirmAction(null);}} style={{background:'#888',color:'#fff',border:'none',borderRadius:8,padding:'10px 24px',fontWeight:700,cursor:'pointer'}}>Cancelar</button>
            </div>
          </div>
        </div>
  )}
    </div>
  );
};

export default Verificaciones;
