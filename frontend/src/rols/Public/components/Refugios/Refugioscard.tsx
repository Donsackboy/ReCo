
import React from 'react';
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

const RefugiosCard: React.FC<RefugioCardProps> = ({ refugio }) => (
  <div className="refugio-card">
    <div className="refugio-info">
      <img src={refugio.logo} alt={refugio.nombre} />
      <h3>{refugio.nombre}</h3>
      <Link to={`/refugios/${refugio.id}`}>Ver refugio</Link>

      {refugio.region && <div style={{  color: '#228B22', 
                                        fontSize: '1rem', 
                                        marginBottom: '8px' }}>{refugio.region}</div>}

      {refugio.descripcion && <div style={{ color: '#1a421a', 
                                            fontSize: '0.98rem', 
                                            marginBottom: '8px', 
                                            textAlign: 'center' }}>{refugio.descripcion}</div>}

      {refugio.direccion && <div style={{   fontSize: '0.95rem', 
                                            color: '#145214', marginBottom: '6px' }}>Dirección: {refugio.direccion}</div>}
      {refugio.telefono && <div style={{ fontSize: '0.95rem', color: '#145214', marginBottom: '6px' }}>Tel: {refugio.telefono}</div>}
      {refugio.email && <div style={{ fontSize: '0.95rem', color: '#145214', marginBottom: '6px' }}>Email: {refugio.email}</div>}
    </div>
    <div className="refugio-animales">
      {refugio.animales.slice(0, 4).map((animal) => (
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
      {refugio.animales.length > 4 && (
        <Link to={`/animales?refugio=${encodeURIComponent(refugio.nombre)}`} 
            style={{    marginLeft: '16px', 
                        color: '#43ea6b', 
                        fontWeight: 600, 
                        fontSize: '1.1rem', 
                        textDecoration: 'none', 
                        whiteSpace: 'nowrap', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center' }}>
          <span>Ver más ...</span>
          <svg  
                width="22" 
                height="22" 
                viewBox="0 0 22 22" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                style={{ marginTop: '2px' }}>
            <path   
                    d="M6 9l5 5 5-5" stroke="#43ea6b" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"/>
          </svg>
        </Link>
      )}
    </div>
  </div>
);

export default RefugiosCard;
