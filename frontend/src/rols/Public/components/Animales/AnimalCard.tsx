import React from 'react';
import { Link } from 'react-router-dom';

interface AnimalCardProps {
  animal: {
    id: number;
    nombre: string;
    sexo: string;
    edad: number;
    tamano: string;
    refugio: string;
    region: string;
    diasEnRefugio: number;
    imagenes: string[];
    resena: string;
  };
}

const AnimalCard: React.FC<AnimalCardProps> = ({ animal }) => (
  <div className="animal-card" style={{ background: '#fff', 
                                        borderRadius: '18px', 
                                        boxShadow: '0 2px 12px #43ea6b22', 
                                        padding: '16px', 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'center', 
                                        minHeight: '340px', 
                                        maxHeight: '500px', 
                                        maxWidth: '320px',
                                        minWidth: '250px', 
                                        position: 'relative', 
                                        overflow: 'hidden' }}>
    <div style={{ position: 'absolute',      /**/
                  top: '8px',               /**/
                  right: '18px',             /**/
                  background: '#eaffea',   /* Corresponde a la tarjeta de cada animal*/
                  color: '#228B22',        /**/
                  borderRadius: '10px',      /**/
                  padding: '6px 12px',       /**/
                  fontWeight: 600,           /**/
                  fontSize: '0.95rem' }}>    
  {animal.diasEnRefugio} días en el refugio
    </div>
    <img /*Imagen animal*/
      src={animal.imagenes && animal.imagenes.length > 0 && animal.imagenes[0] ? animal.imagenes[0] : '/Images/animales/placeholder.png'}
      alt={animal.nombre + ' portada'}
      style={{  width: '170px', 
                top: '0px', 
                height: '200px', 
                objectFit: 'cover', 
                borderRadius: '14px', 
                marginTop: '32px', 
                marginBottom: '0px', 
                boxShadow: '0 2px 8px rgba(44, 151, 69, 0.57)' }} />
    <h3 style={{  fontSize: '1.2rem', 
                  color: '#3e1452ff', 
                  margin: '8px 0 0px' }}>{animal.nombre}</h3>
    <div style={{ color: '#228B22', 
                  fontSize: '1rem', 
                  marginBottom: '8px' }}>{animal.sexo} • {animal.edad} años • {animal.tamano}</div>
    <div style={{ color: '#1a421a', 
                  fontSize: '0.98rem', 
                  marginBottom: '8px', 
                  textAlign: 'center', 
                  display: '-webkit-box', 
                  WebkitLineClamp: 3, 
                  WebkitBoxOrient: 'vertical', 
                  overflow: 'hidden' }}>{animal.resena}</div>
        {animal.id !== undefined && animal.id !== null ? (
          <Link 
            to={`/animales/${animal.id}`}
            style={{  marginTop: 'auto', 
                      background: '#43ea6b', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: '8px', 
                      padding: '8px 18px', 
                      fontWeight: 600, 
                      cursor: 'pointer', 
                      textDecoration: 'none', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      width: '40%', 
                      textAlign: 'center' }}>
            <span style={{ width: '100%', textAlign: 'center', display: 'block' }}>Ver más</span>
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 22 22" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M9 6l5 5-5 5" 
                stroke="#43ea6b" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"/>
            </svg>
          </Link>
        ) : (
          <button 
            disabled
            style={{  marginTop: 'auto', 
                      background: '#ccc', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: '8px', 
                      padding: '8px 18px', 
                      fontWeight: 600, 
                      cursor: 'not-allowed', 
                      textDecoration: 'none', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      width: '40%', 
                      textAlign: 'center' }}>
            <span style={{ width: '100%', textAlign: 'center', display: 'block' }}>Sin perfil</span>
          </button>
        )}
  </div>
);

export default AnimalCard;
