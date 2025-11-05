import React from 'react';
import { Link } from 'react-router-dom';
import AnimalCard from '../Animales/AnimalCard';

// Animal type is now imported from AnimalCard props

interface Evento {
  id: number;
  nombre: string;
  fecha: string;
}

interface Refugio {
  id: number;
  nombre: string;
  descripcion: string;
  region: string;
  imagen: string;
  eventos: Evento[];
   animales: any[]; // Updated to use any[] since Animal interface is removed
}

interface PerfilRefugioProps {
  refugio: Refugio;
}

const PerfilRefugio: React.FC<PerfilRefugioProps> = ({ refugio }) => {
  return (
    <div style={{ maxWidth: '1500px', margin: '40px auto', background: '#f0fff4', borderRadius: '24px', boxShadow: '0 4px 18px #43ea6b22', padding: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '32px' }}>
        <img src={refugio.imagen} alt={refugio.nombre} style={{ width: '120px', height: '120px', borderRadius: '18px', objectFit: 'cover', boxShadow: '0 2px 8px #43ea6b22' }} />
        <div>
          <h2 style={{ color: '#145214', fontSize: '2rem', marginBottom: '8px' }}>{refugio.nombre}</h2>
          <div style={{ color: '#228B22', fontSize: '1.08rem', marginBottom: '8px' }}>{refugio.region}</div>
          <p style={{ color: '#145214', fontSize: '1.08rem', marginBottom: '8px' }}>{refugio.descripcion}</p>
          <button style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 24px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 8px #43ea6b22', marginTop: '8px' }}>
            Donar al refugio
          </button>
        </div>
      </div>
      <h3 style={{ color: '#145214', marginBottom: '10px' }}>Eventos activos</h3>
      <ul style={{ color: '#228B22', fontSize: '1.08rem', marginBottom: '18px' }}>
        {(refugio.eventos ?? []).map(ev => (
          <li key={ev.id}>{ev.nombre} - {ev.fecha}</li>
        ))}
      </ul>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <h3 style={{ color: '#145214', marginBottom: 0 }}>Animales del refugio</h3>
        <Link
          to={`/animales?refugio=${encodeURIComponent(refugio.nombre)}`}
          style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 18px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 2px 8px #43ea6b22' }}
        >
          Ver todos
        </Link>
      </div>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '18px' }}>
        {(refugio.animales ?? []).slice(0, 10).map(animal => (
          <AnimalCard key={animal.id} animal={{
            id: animal.id,
            nombre: animal.nombre,
            sexo: animal.sexo || '',
            edad: animal.edad || 0,
            tamano: animal.tamano || '',
            refugio: animal.refugio || refugio.nombre,
            region: animal.region || refugio.region,
            diasEnRefugio: animal.diasEnRefugio || 0,
            imagenes: animal.imagenes || [animal.imagen],
            resena: animal.resena || '',
          }} />
        ))}
      </div>
    </div>
  );
};

export default PerfilRefugio;
