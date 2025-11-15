
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Animal {
  id: number;
  nombre: string;
  imagen: string;
}

interface RefugioCardProps {
  refugio: {
    id_refugio: number;
    nombre: string;
    region: string;
    logo: string;
    animales: Animal[];
    direccion?: string;
    telefono?: string;
    email?: string;
    descripcion?: string;
  };
}

const RefugiosCard: React.FC<RefugioCardProps> = ({ refugio }) => {
  const [visibleCount, setVisibleCount] = useState(4);
  useEffect(() => {
    function handleResize() {
      const card = document.querySelector('.refugio-card');
      if (card) {
        const cardWidth = card.clientWidth;
        const infoWidth = 320;
        const animalWidth = 180 + 18; // ancho real imagen + gap
        const verMasWidth = 120; // espacio mínimo para el botón
        // Calcula cuántos animales caben en la fila
        const availableWidth = Math.max(0, cardWidth - infoWidth - verMasWidth);
        const maxCount = Math.floor(availableWidth / animalWidth);
        setVisibleCount(maxCount > 0 ? maxCount : 1);
      } else {
        setVisibleCount(4);
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  console.log('RefugiosCard render - id_refugio:', refugio.id_refugio, 'nombre:', refugio.nombre);
  return (
    <div className="refugio-card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 32, padding: 24, background: '#fff', borderRadius: 20, boxShadow: '0 4px 18px #43ea6b22', marginBottom: 24, flexWrap: 'wrap' }}>
      <div className="refugio-info" style={{ minWidth: 220, maxWidth: 320, flex: '0 0 220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: 8 }}>
        <img
          src={refugio.logo && refugio.logo !== '' ? refugio.logo : '/Images/animales/placeholder.png'}
          alt={refugio.nombre}
          style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%', boxShadow: '0 2px 12px rgba(44, 151, 69, 0.18)', marginBottom: '12px', background: '#eaffea', border: '3px solid #43ea6b' }}
          onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/Images/animales/placeholder.png'; }}
        />
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#145214', fontWeight: 700, textAlign: 'center' }}>{refugio.nombre}</h3>
        <Link to={`/refugio/${refugio.id_refugio}`} style={{ color: '#43ea6b', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', margin: '4px 0' }}>Ver refugio</Link>
        {refugio.region && <div style={{ color: '#228B22', fontSize: '1rem', marginBottom: '8px', textAlign: 'center' }}>{refugio.region}</div>}
      </div>
      <div className="refugio-animales-horizontal" style={{ display: 'flex', flexDirection: 'row', gap: 18, flexWrap: 'wrap', alignItems: 'flex-start', flex: 1 }}>
        {refugio.animales.slice(0, visibleCount).map((animal, idx) => (
          <Link key={animal.id ? `animal-${animal.id}` : `animal-idx-${idx}`} to={`/animales/${animal.id}`} className="refugio-animal" style={{ textAlign: 'center', textDecoration: 'none', color: '#145214' }}>
            <img
              src={animal.imagen && animal.imagen !== '' ? animal.imagen : '/Images/animales/placeholder.png'}
              alt={animal.nombre}
              style={{ width: '180px', height: '220px', objectFit: 'cover', borderRadius: '18px', boxShadow: '0 2px 12px rgba(44, 151, 69, 0.16)', marginBottom: 8, border: '2.5px solid #43ea6b' }}
              onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/Images/animales/placeholder.png'; }}
            />
            <div style={{ fontWeight: 700, fontSize: '1.08rem', marginTop: 4 }}>{animal.nombre}</div>
          </Link>
        ))}
        {refugio.animales.length > visibleCount && (
          <div style={{ display: 'flex', alignItems: 'center', height: '150px' }}>
            <Link
              to={`/animales?refugio=${encodeURIComponent(refugio.id_refugio)}`}
              style={{ marginLeft: '16px', color: '#43ea6b', fontWeight: 600, fontSize: '1.1rem', textDecoration: 'none', whiteSpace: 'nowrap', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minWidth: '100px', height: 'fit-content' }}
            >
              <span>Ver más ...</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RefugiosCard;
