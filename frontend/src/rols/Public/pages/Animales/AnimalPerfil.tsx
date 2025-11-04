// =============================
// AnimalPerfil.tsx (Refugio)
// Página de perfil de animal con información completa y edición de vacunas para refugio
// =============================
import React from 'react';
import { useParams } from 'react-router-dom';

import { animales } from './animalesData';

export default function AnimalPerfil() {
  const { id } = useParams();
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

  if (loading) return <div>Cargando...</div>;
  if (!animal) return <div>Animal no encontrado</div>;

  const totalImgs = animal.fotos?.length || 1;
  const prevImg = () => setImgIdx(i => (i === 0 ? totalImgs - 1 : i - 1));
  const nextImg = () => setImgIdx(i => (i === totalImgs - 1 ? 0 : i + 1));

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', background: '#f0fff4', borderRadius: '24px', boxShadow: '0 4px 18px #43ea6b22', padding: '40px' }}>
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
      <div style={{ color: '#228B22', fontSize: '1.1rem', marginBottom: '10px' }}>{animal.sexo} • {animal.edad} años • {animal.tamano}</div>
      <div style={{ color: '#1a421a', fontSize: '1.05rem', marginBottom: '18px' }}>{animal.resena}</div>
      <div style={{ marginBottom: '18px', fontWeight: 600 }}>
        <span style={{ color: '#43ea6b' }}>Días en refugio:</span> {
          animal.fecha_ingreso
            ? Math.max(0, Math.floor((new Date().getTime() - new Date(animal.fecha_ingreso).getTime()) / (1000 * 60 * 60 * 24)))
            : 'No disponible'
        }
      </div>
      <div style={{ marginBottom: '18px', fontWeight: 600 }}>
        <span style={{ color: '#43ea6b' }}>Refugio:</span> {animal.refugio} <span style={{ color: '#228B22', marginLeft: '8px' }}>({animal.region})</span>
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
      <h3 style={{ color: '#145214', marginBottom: '10px' }}>Vacunas</h3>
      <ul style={{ fontSize: '1.08rem', color: '#228B22', marginBottom: '18px' }}>
        {animal.vacunas && animal.vacunas.length > 0 ? animal.vacunas.map((v, idx) => (
          <li key={idx} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <strong>{v.tipo}</strong> {v.unica ? '(única aplicación)' : ''}<br />
              Fecha: {v.fecha} {v.refuerzo ? <span>• Próximo refuerzo: {v.refuerzo}</span> : null}
            </div>
            <button style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '8px', padding: '7px 16px', fontWeight: 600, fontSize: '0.98rem', cursor: 'pointer', boxShadow: '0 2px 8px #43ea6b22', marginLeft: '18px' }}
              onClick={() => window.location.href = `/donar-vacuna?animalId=${animal.id}&refugio=${encodeURIComponent(animal.refugio)}&vacuna=${encodeURIComponent(v.tipo)}`}
            >Donar vacuna</button>
          </li>
        )) : (
          <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>No hay vacunas registradas.</span>
            <button style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '8px', padding: '7px 16px', fontWeight: 600, fontSize: '0.98rem', cursor: 'pointer', boxShadow: '0 2px 8px #43ea6b22', marginLeft: '18px' }}
              onClick={() => window.location.href = `/donar-vacuna?animalId=${animal.id}&refugio=${encodeURIComponent(animal.refugio)}`}
            >Donar vacuna</button>
          </li>
        )}
      </ul>
      <button style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 24px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 8px #43ea6b22', marginRight: '16px' }}
  onClick={() => window.location.href = `/adopcion?animalId=${animal.id_animal}&refugio=${encodeURIComponent(animal.refugio)}`}
      >Adoptar</button>
      <button style={{ background: '#228B22', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 24px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 8px #43ea6b22' }}
        onClick={() => window.location.href = `/hogares-temporales/registro?animalId=${animal.id}`}
      >Dar hogar temporal</button>
    </div>
  );
}
