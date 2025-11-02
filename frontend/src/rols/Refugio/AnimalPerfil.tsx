// =============================
// AnimalPerfil.tsx (Refugio)
// Página de perfil de animal con información completa y edición de vacunas para refugio
// =============================
import React from 'react';
import { useParams } from 'react-router-dom';

// Datos de ejemplo (puedes conectar con backend o contexto global)
const animales = [
  {
    id: 1,
    nombre: 'Luna',
    sexo: 'Hembra',
    edad: 2,
    tamano: 'Mediano',
    refugio: 'Refugio Esperanza',
    region: 'Metropolitana',
    diasEnRefugio: 120,
    imagenes: [
      '/Images/animales/placeholder.png',
      '/Images/animales/placeholder.png',
      '/Images/animales/placeholder.png'
    ],
    resena: 'Luna es una perrita muy cariñosa y juguetona. Le encanta correr y recibir mimos. Se lleva bien con otros perros y niños.',
    vacunado: true,
    esterilizado: true,
    desparasitado: true,
    salud: 'Sin problemas de salud conocidos.',
    vacunas: [
      {
        tipo: 'Séxtuple',
        fecha: '2025-06-10',
        refuerzo: '2026-06-10',
        unica: false
      },
      {
        tipo: 'Rabia',
        fecha: '2025-06-10',
        refuerzo: '2026-06-10',
        unica: false
      }
    ]
  },
  // ...otros animales
];

export default function AnimalPerfil() {
  const { id } = useParams();
  const animal = animales.find(a => a.id === Number(id));

  if (!animal) return <div>Animal no encontrado</div>;

  const [imgIdx, setImgIdx] = React.useState(0);
  const totalImgs = animal.imagenes.length;
  const prevImg = () => setImgIdx(i => (i === 0 ? totalImgs - 1 : i - 1));
  const nextImg = () => setImgIdx(i => (i === totalImgs - 1 ? 0 : i + 1));
  const [fullscreenImg, setFullscreenImg] = React.useState<string | null>(null);

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', background: '#f0fff4', borderRadius: '24px', boxShadow: '0 4px 18px #43ea6b22', padding: '40px' }}>
      <h2 style={{ color: '#145214', fontSize: '2rem', marginBottom: '18px' }}>{animal.nombre}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ position: 'relative', width: '200px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {totalImgs > 1 && (
            <span style={{ position: 'absolute', top: '0px', left: '60%', transform: 'translateX(-50%)', background: '#43ea6b', color: '#fff', borderRadius: '8px', padding: '2px 10px', fontWeight: 600, fontSize: '0.98rem', zIndex: 2 }}>
              {imgIdx + 1}/{totalImgs}
            </span>
          )}
          {totalImgs > 1 && (
            <button onClick={prevImg} style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', background: '#eaffea', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: '1.3rem', color: '#228B22', cursor: 'pointer', zIndex: 2 }} aria-label="Anterior">&#8592;</button>
          )}
          <img
            src={animal.imagenes[imgIdx]}
            alt={animal.nombre + ' foto ' + (imgIdx + 1)}
            style={{ width: '140px', height: '140px', objectFit: 'cover', borderRadius: '18px', boxShadow: '0 2px 8px #43ea6b22', cursor: 'pointer' }}
            onClick={() => setFullscreenImg(animal.imagenes[imgIdx])}
          />
          {totalImgs > 1 && (
            <button onClick={nextImg} style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)', background: '#eaffea', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: '1.3rem', color: '#228B22', cursor: 'pointer', zIndex: 2 }} aria-label="Siguiente">&#8594;</button>
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
        <span style={{ color: '#43ea6b' }}>Días en refugio:</span> {animal.diasEnRefugio}
      </div>
      <div style={{ marginBottom: '18px', fontWeight: 600 }}>
        <span style={{ color: '#43ea6b' }}>Refugio:</span> {animal.refugio} <span style={{ color: '#228B22', marginLeft: '8px' }}>({animal.region})</span>
      </div>
      <h3 style={{ color: '#145214', marginBottom: '10px' }}>Salud</h3>
      <ul style={{ fontSize: '1.08rem', color: '#228B22', marginBottom: '18px' }}>
        <li>Vacunado: {animal.vacunado ? 'Sí' : 'No'}</li>
        <li>Esterilizado: {animal.esterilizado ? 'Sí' : 'No'}</li>
        <li>Desparasitado: {animal.desparasitado ? 'Sí' : 'No'}</li>
        <li>Observaciones: {animal.salud}</li>
      </ul>
      <h3 style={{ color: '#145214', marginBottom: '10px' }}>Vacunas</h3>
      <ul style={{ fontSize: '1.08rem', color: '#228B22', marginBottom: '18px' }}>
        {animal.vacunas && animal.vacunas.length > 0 ? animal.vacunas.map((v, idx) => (
          <li key={idx}>
            <strong>{v.tipo}</strong> {v.unica ? '(única aplicación)' : ''}<br />
            Fecha: {v.fecha} {v.refuerzo ? <span>
                • Próximo refuerzo: {v.refuerzo}</span> : null}
          </li>
        )) : <li>No hay vacunas registradas.</li>}
      </ul>
      <button style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 24px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 8px #43ea6b22' }}>Contactar refugio</button>
    </div>
  );
}
// ...existing code...
