
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
        <img src={refugio.logo} alt={refugio.nombre} />
        <h3>{refugio.nombre}</h3>
  <Link to={`/refugio/${refugio.id}`}>Ver refugio</Link>
        {refugio.region && <div style={{  color: '#228B22', fontSize: '1rem', marginBottom: '8px' }}>{refugio.region}</div>}
        {refugio.descripcion && <div style={{ color: '#1a421a', fontSize: '0.98rem', marginBottom: '8px', textAlign: 'center' }}>{refugio.descripcion}</div>}
        {refugio.direccion && <div style={{ fontSize: '0.95rem', color: '#145214', marginBottom: '6px' }}>Dirección: {refugio.direccion}</div>}
        {refugio.telefono && <div style={{ fontSize: '0.95rem', color: '#145214', marginBottom: '6px' }}>Tel: {refugio.telefono}</div>}
        {refugio.email && <div style={{ fontSize: '0.95rem', color: '#145214', marginBottom: '6px' }}>Email: {refugio.email}</div>}
      </div>
  <div className="refugio-animales-horizontal">
  {refugio.animales.slice(0, visibleCount).map((animal) => (
          <Link key={animal.id} to={`/animales/${animal.id}`} className="refugio-animal">
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
          <Link to={`/animales?refugio=${encodeURIComponent(refugio.nombre)}`}
            style={{ marginLeft: '16px', color: '#43ea6b', fontWeight: 600, fontSize: '1.1rem', textDecoration: 'none', whiteSpace: 'nowrap', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '130px', height: '100%' }}>
            <span>Ver más ...</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default RefugiosCard;
