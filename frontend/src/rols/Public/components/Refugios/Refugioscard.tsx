
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Animal {
  id: number;
  nombre: string;
  imagen: string;
}

interface RefugioCardProps {
  refugio: {
    id: number;
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
      // Calcula cuántas imágenes caben en el ancho de la tarjeta
      const card = document.querySelector('.refugio-card');
      if (card) {
        const cardWidth = card.clientWidth;
  const infoWidth = 320; // ancho info refugio + margen derecho actualizado (0px)
  const animalWidth = 160 + 50; // imagen + gap reducido
  const verMasWidth = 180; // espacio para el botón 'Ver más' (min-width)
  const maxCount = Math.floor((cardWidth - infoWidth - verMasWidth) / animalWidth);
  setVisibleCount(Math.max(1, maxCount));
      } else {
        setVisibleCount(4);
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div className="refugio-card">
      <div className="refugio-info">
          <img
            src={refugio.logo && refugio.logo !== '' ? refugio.logo : '/Images/animales/placeholder.png'}
            alt={refugio.nombre}
            style={{ width: '140px', height: '140px', objectFit: 'cover', borderRadius: '50%', boxShadow: '0 2px 12px rgba(44, 151, 69, 0.18)', marginBottom: '18px', background: '#eaffea', border: '3px solid #43ea6b' }}
            onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/Images/animales/placeholder.png'; }}
          />
        <h3>{refugio.nombre}</h3>
        <Link to={`/refugio/${refugio.id}`}>Ver refugio</Link>
        {refugio.region && <div style={{ color: '#228B22', fontSize: '1rem', marginBottom: '8px' }}>{refugio.region}</div>}
        {/* Descripción, dirección y teléfono ocultos en la tarjeta */}
      </div>
  <div className="refugio-animales-horizontal">
  {refugio.animales.slice(0, visibleCount).map((animal, idx) => (
    <Link key={animal.id ? `animal-${animal.id}` : `animal-idx-${idx}`} to={`/animales/${animal.id}`} className="refugio-animal">
            <img
              src={animal.imagen && animal.imagen !== '' ? animal.imagen : '/Images/animales/placeholder.png'}
              alt={animal.nombre}
              style={{ width: '160px', height: '200px', objectFit: 'cover', borderRadius: '20px', boxShadow: '0 2px 8px rgba(44, 151, 69, 0.13)' }}
              onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/Images/animales/placeholder.png'; }}
            />
            <div>{animal.nombre}</div>
          </Link>
        ))}
        {refugio.animales.length > visibleCount && (
          <div style={{ display: 'flex', alignItems: 'center', height: '200px' }}>
            <Link
              to={{ pathname: '/animales', search: `?refugio=${encodeURIComponent(refugio.id)}` }}
              style={{ marginLeft: '16px', color: '#43ea6b', fontWeight: 600, fontSize: '1.1rem', textDecoration: 'none', whiteSpace: 'nowrap', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minWidth: '130px', height: 'fit-content' }}
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
