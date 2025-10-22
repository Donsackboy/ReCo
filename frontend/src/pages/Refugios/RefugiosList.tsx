import React from 'react';
import { Link } from 'react-router-dom';
import './Refugios.css';

const refugios = [
  {
    id: 1,
    nombre: 'Refugio Esperanza',
    logo: '/Images/reco-logo.png',
    animales: [
      { id: 101, nombre: 'Luna', imagen: '/Images/animales/luna.jpg' },
      { id: 102, nombre: 'Max', imagen: '/Images/animales/max.jpg' },
      { id: 103, nombre: 'Toby', imagen: '/Images/animales/toby.jpg' },
      { id: 104, nombre: 'Nina', imagen: '/Images/animales/nina.jpg' },
    ],
  },
  {
    id: 2,
    nombre: 'Refugio Patitas',
    logo: '/Images/reco-logo.png',
    animales: [
      { id: 201, nombre: 'Simba', imagen: '/Images/animales/simba.jpg' },
      { id: 202, nombre: 'Milo', imagen: '/Images/animales/milo.jpg' },
      { id: 203, nombre: 'Bella', imagen: '/Images/animales/bella.jpg' },
      { id: 204, nombre: 'Rocky', imagen: '/Images/animales/rocky.jpg' },
    ],
  },
];

function getRandomAnimales(animales, count = 3) {
  return animales.sort(() => 0.5 - Math.random()).slice(0, count);
}

export default function RefugiosList() {
  return (
    <div className="refugios-container">
      <h2>Refugios</h2>
      <div className="refugios-list">
        {refugios.map(refugio => (
          <div key={refugio.id} className="refugio-card">
            <div className="refugio-info">
              <img src={refugio.logo} alt={refugio.nombre} />
              <h3>{refugio.nombre}</h3>
              <Link to={`/refugios/${refugio.id}`}>Ver refugio</Link>
            </div>
            <div className="refugio-animales">
              {getRandomAnimales(refugio.animales, 3).map(animal => (
                <Link key={animal.id} to={`/animales/${animal.id}`} className="refugio-animal">
                  <img
                    src={animal.imagen || '/Images/animales/placeholder.jpg'}
                    alt={animal.nombre}
                  />
                  <div>{animal.nombre}</div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
