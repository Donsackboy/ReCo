// =============================
// AnimalPerfil.tsx (Refugio)
// Página de perfil de animal con información completa y edición de vacunas para refugio
// =============================
import React from 'react';
import LoginModal from '../../components/Header/LoginModal';
import RegisterModal from '../../components/Header/RegisterModal';
import { vacunasPorEspecie } from '../../../Refugio/pages/MisAnimales/components/FichaMedica/Utils/vacunasEspecies';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export default function AnimalPerfil() {
        const [donarOtra, setDonarOtra] = React.useState(false);
        const [otraNombre, setOtraNombre] = React.useState('');
        const [otraDesc, setOtraDesc] = React.useState('');
      const [showDonarModal, setShowDonarModal] = React.useState(false);
    const [showVacunasModal, setShowVacunasModal] = React.useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = React.useState<any>(null);
  const [imgIdx, setImgIdx] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Validar que el id existe y es un número
    if (!id || isNaN(Number(id))) {
      setAnimal(null);
      setLoading(false);
      return;
    }
    async function fetchAnimal() {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/public/animales/${id}/`);
        if (!res.ok) throw new Error('No se pudo cargar el animal');
        const data = await res.json();
        // Asegura que el objeto animal tenga la propiedad 'id' correctamente
        setAnimal({ ...data, id: data.id_animal ?? data.id });
      } catch (err) {
        setAnimal(null);
      } finally {
        setLoading(false);
      }
    }
    fetchAnimal();
  }, [id]);

  const [fullscreenImg, setFullscreenImg] = React.useState<string | null>(null);

  // Log para debug del objeto animal y su campo ID
  console.log('animal:', animal);

  const [showRegisterModal, setShowRegisterModal] = React.useState(false);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (loading) return <div>Cargando...</div>;
  if (!animal) return <div>Animal no encontrado</div>;

  const totalImgs = animal.fotos?.length || 1;
  const prevImg = () => setImgIdx(i => (i === 0 ? totalImgs - 1 : i - 1));
  const nextImg = () => setImgIdx(i => (i === totalImgs - 1 ? 0 : i + 1));

    return (
      <div style={{ maxWidth: '700px', margin: '40px auto', background: '#f0fff4', borderRadius: '24px', boxShadow: '0 4px 18px #43ea6b22', padding: '40px' }}>
      {/* Modal de registro solo al intentar donar vacuna */}
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />
      <h2 style={{ color: '#145214', fontSize: '2rem', marginBottom: '18px' }}>{animal.nombre}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '48px' }}>
        <div style={{ position: 'relative', width: '320px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {totalImgs > 1 && (
            <button onClick={prevImg} style={{ position: 'absolute', left: '-36px', top: '50%', transform: 'translateY(-50%)', background: '#eaffea', border: 'none', borderRadius: '60%', width: '38px', height: '38px', fontSize: '1.5rem', color: '#228B22', cursor: 'pointer', zIndex: 2 }} aria-label="Anterior">&#8592;</button>
          )}
          <img
            src={animal.fotos?.[imgIdx] || animal.imagen || '/Images/animales/placeholder.png'}
            alt={animal.nombre + ' foto ' + (imgIdx + 1)}
            style={{ width: '250px', height: '250px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 2px 8px #43ea6b22', cursor: 'pointer' }}
            onClick={() => setFullscreenImg(animal.fotos?.[imgIdx] || animal.imagen || '/Images/animales/placeholder.png')}
          />
          {totalImgs > 1 && (
            <button onClick={nextImg} style={{ position: 'absolute', right: '-36px', top: '50%', transform: 'translateY(-50%)', background: '#eaffea', border: 'none', borderRadius: '50%', width: '38px', height: '38px', fontSize: '1.5rem', color: '#228B22', cursor: 'pointer', zIndex: 2 }} aria-label="Siguiente">&#8594;</button>
          )}
          {totalImgs > 1 && (
            <span style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', background: '#43ea6b', color: '#fff', borderRadius: '8px', padding: '2px 10px', fontWeight: 600, fontSize: '0.98rem', zIndex: 2 }}>
              {imgIdx + 1}/{totalImgs}
            </span>
          )}
        </div>
      </div>
      {/* Modal de pantalla completa */}
      {fullscreenImg && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.85)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setFullscreenImg(null)}
        >
          <img
            src={fullscreenImg}
            alt="Foto animal pantalla completa"
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              borderRadius: 24,
              boxShadow: '0 4px 32px #000a',
              border: '4px solid #90EE90',
            }}
          />
          <button
            onClick={() => setFullscreenImg(null)}
            style={{
              position: 'absolute',
              top: 32,
              right: 48,
              background: 'none',
              color: '#fff',
              fontSize: '2.5rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              zIndex: 10001,
              textShadow: '0 2px 8px #000a',
            }}
          >×</button>
        </div>
      )}
  <div style={{ color: '#228B22', fontSize: '1.1rem', marginBottom: animal.descripcion ? '0' : '18px', textAlign: 'center' }}>{animal.sexo} • {animal.edad} años • {animal.tamano}</div>
      {animal.descripcion && (
        <div style={{
          background: '#eaffea',
          borderRadius: '12px',
          padding: '14px 18px',
          color: '#145214',
          fontSize: '1.08rem',
          margin: '12px 0 18px 0',
          boxShadow: '0 2px 8px #43ea6b22',
          fontWeight: 500
        }}>
          {animal.descripcion}
        </div>
      )}
      <div style={{ color: '#1a421a', fontSize: '1.05rem', marginBottom: '18px' }}>{animal.resena}</div>
      <div style={{ marginBottom: '18px', fontWeight: 600 }}>
        <span style={{ color: '#43ea6b' }}>Días en refugio:</span> {
          animal.fecha_ingreso
            ? Math.max(0, Math.floor((new Date().getTime() - new Date(animal.fecha_ingreso).getTime()) / (1000 * 60 * 60 * 24)))
            : 'No disponible'
        }
      </div>
      <div style={{ marginBottom: '18px', fontWeight: 600 }}>
        <span style={{ color: '#43ea6b' }}>Refugio:</span> {animal.refugio?.nombre || 'No disponible'}
      </div>
      {animal.fecha_cumpleanos && (
        <div style={{ marginBottom: '18px', fontWeight: 600 }}>
          <span style={{ color: '#43ea6b' }}>Cumpleaños:</span> {new Date(animal.fecha_cumpleanos).toLocaleDateString()}
        </div>
      )}
      {/* Ubicación actual, estado y motivo de cambio si corresponde */}
      <div style={{ marginBottom: '18px', fontWeight: 600 }}>
        <span style={{ color: '#43ea6b' }}>Ubicación actual:</span> {
          animal.ubicacion_actual === 'hogar_temporal' ? 'En hogar temporal' : 'En refugio'
        }
        {animal.estado === 'buscando_nuevo_hogar_temporal' && (
          <div style={{ color: '#ff6b6b', marginTop: 6 }}>Buscando nuevo hogar temporal</div>
        )}
        {animal.estado === 'buscando_nuevo_hogar_temporal' && animal.motivo_cambio_hogar_temporal && (
          <div style={{ color: '#228B22', marginTop: 6 }}>
            <strong>Motivo de cambio:</strong> {animal.motivo_cambio_hogar_temporal}
          </div>
        )}
      </div>
      <h3 style={{ color: '#145214', marginBottom: '10px' }}>Salud</h3>
      <ul style={{ fontSize: '1.08rem', color: '#228B22', marginBottom: '18px' }}>
        <li>Esterilizado: {animal.esterilizado ? 'Sí' : 'No'}</li>
        <li>Desparasitado: {animal.desparasitado ? 'Sí' : 'No'}</li>
        <li>Observaciones: {animal.salud}</li>
      </ul>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <h3 style={{ color: '#145214', margin: 0 }}>Vacunas</h3>
        <button
          style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 14px', fontWeight: 600, fontSize: '0.98rem', cursor: 'pointer', marginLeft: '12px' }}
          onClick={() => setShowVacunasModal(true)}
        >Info vacunas obligatorias</button>
      </div>

      {/* Modal deslizable de vacunas */}
      {showVacunasModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(33, 150, 243, 0.18)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#e3f2fd', borderRadius: '24px', boxShadow: '0 2px 18px #1976d288', width: '100%', maxWidth: '620px', minHeight: '480px', height: '70vh', padding: '32px 38px 24px 38px', animation: 'slideUpCenter .3s', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <button onClick={() => setShowVacunasModal(false)} style={{ position: 'absolute', top: 18, right: 18, background: '#1976d2', color: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, fontSize: '1.3em', cursor: 'pointer' }}>×</button>
            <h2 style={{ color: '#1565c0', marginBottom: 18, fontSize: '1.3em' }}>Vacunas para {animal.especie ? animal.especie.charAt(0).toUpperCase() + animal.especie.slice(1) : 'animal'}</h2>
            <div style={{ flex: 1, minHeight: '320px', maxHeight: 'calc(70vh - 90px)', overflowY: 'auto', paddingRight: 8 }}>
              {(vacunasPorEspecie[animal.especie?.toLowerCase()] || []).map((vac, idx) => {
                // Verifica si la vacuna está aplicada en animal.vacunas
                const aplicada = animal.vacunas?.some((v: any) => v.nombre?.toLowerCase() === vac.nombre.toLowerCase());
                return (
                  <div key={idx} style={{ background: vac.obligatoria ? '#bbdefb' : '#f5f5f5', borderRadius: 12, boxShadow: vac.obligatoria ? '0 2px 8px #1976d222' : 'none', padding: '14px 16px', marginBottom: 14, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <strong style={{ color: '#1976d2', fontSize: '1.08em' }}>{vac.nombre}</strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {vac.obligatoria && <span style={{ color: '#d32f2f', fontWeight: 600, fontSize: '0.98em', background: '#ffebee', borderRadius: 6, padding: '2px 12px', marginLeft: 12 }}>Obligatoria</span>}
                        <span style={{ color: aplicada ? '#43ea6b' : '#d32f2f', fontWeight: 600, fontSize: '0.97em', background: aplicada ? '#eaffea' : '#ffebee', borderRadius: 6, padding: '2px 10px' }}>{aplicada ? 'Aplicada' : 'No aplicada'}</span>
                      </div>
                    </div>
                    <div style={{ color: '#1565c0', fontSize: '0.98em', marginTop: 4 }}>{vac.descripcion}</div>
                    <div style={{ color: '#1976d2', fontSize: '0.97em', marginTop: 2 }}><b>Frecuencia:</b> {vac.frecuencia}</div>
                  </div>
                );
              })}
              {(vacunasPorEspecie[animal.especie?.toLowerCase()]?.length === 0 || !vacunasPorEspecie[animal.especie?.toLowerCase()]) && (
                <div style={{ color: '#888', fontStyle: 'italic', marginTop: 18 }}>No hay información de vacunas para esta especie.</div>
              )}
            </div>
          </div>
          <style>{`@keyframes slideUpCenter { from { transform: translateY(40vh) scale(0.98); opacity: 0.5; } to { transform: translateY(0) scale(1); opacity: 1; } }`}</style>
        </div>
      )}
      {!token && (
        <div style={{ background: '#fffde7', borderRadius: '10px', padding: '14px', marginBottom: '12px', boxShadow: '0 1px 6px #ffe08288', color: '#b8860b', fontWeight: 500, fontSize: '1.01rem', textAlign: 'center' }}>
          Para donar vacunas debes estar registrado. Así podrás dar seguimiento a tu donación y recibir actualizaciones del refugio.
        </div>
      )}
      <button style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 18px', fontWeight: 600, fontSize: '1.02rem', cursor: 'pointer', marginBottom: '18px' }}
        onClick={() => {
          if (!token) {
            setShowRegisterModal(true);
          } else {
            setShowDonarModal(true);
          }
        }}
      >Donar vacuna</button>

      {/* Modal para donar vacuna */}
      {showDonarModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(33, 150, 243, 0.18)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#e3f2fd', borderRadius: '24px', boxShadow: '0 2px 18px #1976d288', width: '100%', maxWidth: '620px', minHeight: '340px', height: 'auto', padding: '32px 38px 24px 38px', animation: 'slideUpCenter .3s', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <button onClick={() => { setShowDonarModal(false); setDonarOtra(false); setOtraNombre(''); setOtraDesc(''); }} style={{ position: 'absolute', top: 18, right: 18, background: '#1976d2', color: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, fontSize: '1.3em', cursor: 'pointer' }}>×</button>
            <h2 style={{ color: '#1565c0', marginBottom: 18, fontSize: '1.3em' }}>Selecciona vacuna para donar</h2>
            <div style={{ maxHeight: '340px', overflowY: 'auto', paddingRight: 8 }}>
              {!donarOtra && (
                <>
                  {(vacunasPorEspecie[animal.especie?.toLowerCase()] || [])
                    .filter(vac => {
                      const aplicada = animal.vacunas?.some((a: any) => a.nombre?.toLowerCase() === vac.nombre.toLowerCase());
                      const tipoVac = animal.vacunas?.find((a: any) => a.nombre?.toLowerCase() === vac.nombre.toLowerCase())?.tipo || vac.tipo;
                      return !aplicada || (tipoVac && tipoVac !== 'unica');
                    })
                    .map((vac, idx) => (
                      <div key={idx} style={{ background: '#bbdefb', borderRadius: 12, boxShadow: '0 2px 8px #1976d222', padding: '14px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <strong style={{ color: '#1976d2', fontSize: '1.08em' }}>{vac.nombre}</strong>
                          <div style={{ color: '#1565c0', fontSize: '0.98em', marginTop: 4 }}>{vac.descripcion}</div>
                          <div style={{ color: '#1976d2', fontSize: '0.97em', marginTop: 2 }}><b>Frecuencia:</b> {vac.frecuencia}</div>
                        </div>
                        <button style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '8px', padding: '7px 16px', fontWeight: 600, fontSize: '0.98rem', cursor: 'pointer', marginLeft: '18px' }}
                          onClick={() => {
                            setShowDonarModal(false);
                            // Aquí deberías verificar si el usuario está logueado antes de navegar
                            navigate(`/donar-vacuna?animalId=${animal.id}&refugio=${encodeURIComponent(animal.refugio)}&vacuna=${encodeURIComponent(vac.nombre)}`);
                          }}
                        >Donar</button>
                      </div>
                    ))}
                  <div style={{ textAlign: 'center', margin: '18px 0' }}>
                    <button style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: '8px', padding: '7px 18px', fontWeight: 600, fontSize: '1.01rem', cursor: 'pointer' }}
                      onClick={() => setDonarOtra(true)}
                    >Donar otra vacuna</button>
                  </div>
                  {(vacunasPorEspecie[animal.especie?.toLowerCase()] || []).filter(vac => {
                    const aplicada = animal.vacunas?.some((a: any) => a.nombre?.toLowerCase() === vac.nombre.toLowerCase());
                    const tipoVac = animal.vacunas?.find((a: any) => a.nombre?.toLowerCase() === vac.nombre.toLowerCase())?.tipo || vac.tipo;
                    return !aplicada || (tipoVac && tipoVac !== 'unica');
                  }).length === 0 && (
                    <div style={{ color: '#888', fontStyle: 'italic', marginTop: 18 }}>No hay vacunas disponibles para donar.</div>
                  )}
                </>
              )}
              {donarOtra && (
                <form style={{ background: '#bbdefb', borderRadius: 12, boxShadow: '0 2px 8px #1976d222', padding: '18px 16px', marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 12 }}
                  onSubmit={e => {
                    e.preventDefault();
                    setShowDonarModal(false);
                    // Aquí deberías verificar si el usuario está logueado antes de navegar
                    navigate(`/donar-vacuna?animalId=${animal.id}&refugio=${encodeURIComponent(animal.refugio)}&vacuna=${encodeURIComponent(otraNombre)}&desc=${encodeURIComponent(otraDesc)}`);
                  }}>
                  <label style={{ color: '#1976d2', fontWeight: 600 }}>Nombre de la vacuna</label>
                  <input type="text" required value={otraNombre} onChange={e => setOtraNombre(e.target.value)} style={{ padding: '7px 10px', borderRadius: 6, border: '1px solid #1976d2', fontSize: '1em' }} placeholder="Ej: Vacuna especial" />
                  <label style={{ color: '#1976d2', fontWeight: 600 }}>Descripción (opcional)</label>
                  <textarea value={otraDesc} onChange={e => setOtraDesc(e.target.value)} style={{ padding: '7px 10px', borderRadius: 6, border: '1px solid #1976d2', fontSize: '1em', minHeight: 60 }} placeholder="Detalles sobre la vacuna" />
                  <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                    <button type="submit" style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '8px', padding: '7px 16px', fontWeight: 600, fontSize: '0.98rem', cursor: 'pointer' }}>Donar</button>
                    <button type="button" style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '8px', padding: '7px 16px', fontWeight: 600, fontSize: '0.98rem', cursor: 'pointer' }} onClick={() => { setDonarOtra(false); setOtraNombre(''); setOtraDesc(''); }}>Cancelar</button>
                  </div>
                </form>
              )}
            </div>
          </div>
          <style>{`@keyframes slideUpCenter { from { transform: translateY(40vh) scale(0.98); opacity: 0.5; } to { transform: translateY(0) scale(1); opacity: 1; } }`}</style>
        </div>
      )}


      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '18px' }}>
        {animal.vacunas && animal.vacunas.length > 0 ? animal.vacunas.map((v: any, idx: number) => (
          <div key={idx} style={{ background: 'linear-gradient(135deg, #e3f2fd 80%, #bbdefb 100%)', borderRadius: '14px', boxShadow: '0 2px 8px #90caf922', padding: '16px 18px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: '1.5em', color: '#42a5f5' }}>{v.tipo === 'unica' ? '💉' : '🔄'}</span>
              <strong style={{ fontSize: '1.12em', color: '#1565c0' }}>{v.nombre}</strong>
              <span style={{ color: '#1976d2', fontWeight: 500, fontSize: '0.98em', marginLeft: 8 }}>({v.tipo === 'unica' ? 'Única aplicación' : 'Refuerzo'})</span>
            </div>
            <div style={{ fontSize: '1.01em', color: '#1976d2', marginBottom: 4 }}>
              <span style={{ fontWeight: 600 }}>Fecha aplicación:</span> {v.fecha_aplicacion}
              {v.fecha_refuerzo && (
                <span style={{ marginLeft: 8, color: '#1565c0' }}>• <span style={{ fontWeight: 600 }}>Próximo refuerzo:</span> {v.fecha_refuerzo}</span>
              )}
            </div>
            {v.observaciones && (
              <div style={{ fontSize: '0.98em', color: '#5c6bc0', marginTop: 4, fontStyle: 'italic' }}>Obs: {v.observaciones}</div>
            )}
            {/* Botón donar vacuna removido de la tarjeta individual */}
          </div>
        )) : (
          <div style={{ background: '#ffeaea', borderRadius: '14px', boxShadow: '0 2px 8px #ea434322', padding: '16px 18px', minWidth: '220px', maxWidth: '320px', flex: '1 1 220px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#e53935', fontWeight: 600 }}>No hay vacunas registradas.</span>
            <button style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '8px', padding: '7px 16px', fontWeight: 600, fontSize: '0.98rem', cursor: 'pointer', boxShadow: '0 2px 8px #43ea6b22', marginLeft: '18px' }}
              onClick={() => navigate(`/donar-vacuna?animalId=${animal.id}&refugio=${encodeURIComponent(animal.refugio)}`)}
            >Donar vacuna</button>
          </div>
        )}
      </div>
      <button style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 24px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 8px #43ea6b22', marginRight: '16px' }}
        onClick={() => {
          let refugioId = '';
          if (typeof animal.refugio === 'object' && animal.refugio !== null) {
            refugioId = animal.refugio.id_refugio ?? animal.refugio.id ?? '';
          } else {
            refugioId = animal.refugio ?? '';
          }
          navigate(`/adopcion?animalId=${animal.id}&refugio=${encodeURIComponent(refugioId)}`);
        }}
      >Adoptar</button>
      {/*
      <button style={{ background: '#228B22', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 24px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 8px #43ea6b22' }}
        onClick={() => navigate(`/hogares-temporales/registro?animalId=${animal.id}`)}
      >Dar hogar temporal</button>
      */}
    </div>
  );
}
