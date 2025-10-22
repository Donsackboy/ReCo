// =============================
// Refugios.tsx
// Página principal de Refugios
// Contiene el filtro por nombre y región, y muestra las tarjetas de refugios con sus animales
// Edita aquí para cambiar el layout, agregar filtros, modificar datos de refugios o animales
// =============================
// --- DATOS DE REFUGIOS ---
// Puedes agregar, quitar o modificar refugios y animales aquí
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Refugios.css';

const refugios = [
// --- FUNCIÓN PARA MOSTRAR ANIMALES ALEATORIOS (NO USADA ACTUALMENTE) ---
  {
    id: 1,
    nombre: 'Refugio Esperanza',
    region: 'Metropolitana',
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
    region: 'Valparaíso',
    logo: '/Images/reco-logo.png',
    animales: [
      { id: 201, nombre: 'Simba', imagen: '/Images/animales/simba.jpg' },
      { id: 202, nombre: 'Milo', imagen: '/Images/animales/milo.jpg' },
      { id: 203, nombre: 'Bella', imagen: '/Images/animales/bella.jpg' },
      { id: 204, nombre: 'Rocky', imagen: '/Images/animales/rocky.jpg' },
    ],
  },
];

function getRandomAnimales(animales: { id: number; nombre: string; imagen: string }[], count = 3) {
  return animales.sort(() => 0.5 - Math.random()).slice(0, count);
}

export default function Refugios() {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');

  // --- LISTA DE REGIONES DE CHILE ---
  // Puedes agregar o modificar regiones aquí
  const regiones = [
  // --- FILTRADO DE REFUGIOS ---
  // Aquí se filtran los refugios por nombre y región seleccionada
    { num: '', nombre: 'Todas' },
    { num: 'I', nombre: 'Arica y Parinacota' },
    { num: 'II', nombre: 'Tarapacá' },
    { num: 'III', nombre: 'Antofagasta' },
    { num: 'IV', nombre: 'Atacama' },
    { num: 'V', nombre: 'Coquimbo' },
    { num: 'VI', nombre: 'Valparaíso' },
    { num: 'VII', nombre: 'Metropolitana' },
    { num: 'VIII', nombre: 'O’Higgins' },
    { num: 'IX', nombre: 'Maule' },
    { num: 'X', nombre: 'Ñuble' },
    { num: 'XI', nombre: 'Biobío' },
    { num: 'XII', nombre: 'La Araucanía' },
    { num: 'XIII', nombre: 'Los Ríos' },
    { num: 'XIV', nombre: 'Los Lagos' },
    { num: 'XV', nombre: 'Aysén' },
    { num: 'XVI', nombre: 'Magallanes' }
  ];

  const refugiosFiltrados = refugios.filter(refugio => {
    const coincideNombre = refugio.nombre.toLowerCase().includes(search.toLowerCase());
    const coincideRegion = region === '' || region === 'Todas' || refugio.region === region;
    return coincideNombre && coincideRegion;
  });

  // --- RENDER PRINCIPAL ---
  // Aquí se define el layout visual de la página de refugios
  // Puedes editar estilos, estructura y componentes visuales
  return (
    <div className="refugios-container">
      <h2>Refugios</h2>
  {/* Filtros de búsqueda y región */}
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', maxWidth: '350px', marginBottom: '18px', background: '#eaffea', borderRadius: '18px', boxShadow: '0 2px 12px #43ea6b22', padding: '18px 18px 12px 18px' }}>
        <div style={{ width: '100%', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="7" stroke="#43ea6b" strokeWidth="2" />
              <line x1="16" y1="16" x2="21" y2="21" stroke="#43ea6b" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar refugio..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px 12px 8px 38px', borderRadius: '8px', border: '1.5px solid #43ea6b', width: '100%', fontSize: '1rem', background: '#fff', color: '#228B22', boxShadow: '0 1px 4px #43ea6b11' }}
          />
        </div>
        <div style={{ width: '100%', textAlign: 'left', marginBottom: '4px', fontWeight: 600, color: '#228B22', fontSize: '1rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: '2px' }} xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#43ea6b"/>
              <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#228B22">CL</text>
            </svg>
            Región:
          </span>
        </div>
        <select
          value={region}
          onChange={e => setRegion(e.target.value)}
          style={{ padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #43ea6b', width: '100%', fontSize: '1rem', background: '#fff', color: '#228B22', fontWeight: 500, boxShadow: '0 1px 4px #43ea6b11' }}
        >
          {regiones.map(r => (
            <option key={r.nombre} value={r.nombre === 'Todas' ? '' : r.nombre}>
              {r.num ? `${r.num} - ` : ''}{r.nombre}
            </option>
          ))}
        </select>
      </div>
  <div className="refugios-list" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px', width: '100%', maxWidth: '1400px', marginTop: '32px' }}>
    {refugiosFiltrados.map(refugio => (
  <div key={refugio.id} className="refugio-card" style={{ flex: '1 1 200px', maxWidth: '1000px', minWidth: '700px', background: '#fff', borderRadius: '28px', boxShadow: '0 2px 24px #43ea6b22', padding: '40px 32px', margin: '0 auto', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="refugio-info" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
          <img src={refugio.logo} alt={refugio.nombre} style={{ width: '90px', height: '90px', borderRadius: '50%', background: '#eaffea', marginBottom: '12px', boxShadow: '0 2px 8px #43ea6b22' }} />
          <h3 style={{ fontSize: '1.7rem', fontWeight: 700, color: '#228B22', margin: 0, textAlign: 'center' }}>{refugio.nombre}</h3>
          <Link to={`/refugios/${refugio.id}`} style={{ color: '#43ea6b', fontWeight: 600, marginTop: '12px', textDecoration: 'none', fontSize: '1.15rem' }}>Ver refugio</Link>
        </div>
        <div className="refugio-animales" style={{ display: 'flex', flexWrap: 'nowrap', gap: '24px', alignItems: 'center', width: '100%', overflow: 'hidden', minWidth: '0' }}>
          {refugio.animales.slice(0, 5).map((animal) => (
            <Link key={animal.id} to={`/animales/${animal.id}`} className="refugio-animal" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: '#228B22', fontWeight: 500, minWidth: '0' }}>
              <img
                src={animal.imagen && animal.imagen !== '' ? animal.imagen : '/Images/animales/placeholder.png'}
                alt={animal.nombre}
                style={animal.imagen && animal.imagen !== ''
                  ? { width: '170px', height: '170px', objectFit: 'cover', borderRadius: '18px', background: '#f0fff0', boxShadow: '0 2px 8px #43ea6b22', marginBottom: '8px' }
                  : { width: '170px', height: '170px', objectFit: 'cover', borderRadius: '18px', background: '#eaffea', boxShadow: '0 2px 8px #43ea6b22', marginBottom: '8px' }
                }
                onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/Images/animales/placeholder.png'; }}
              />
              <div style={{ fontSize: '1.18rem', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{animal.nombre}</div>
            </Link>
          ))}
          {refugio.animales.length > 4 && (
            <Link to={`/refugios/${refugio.id}`} style={{ marginLeft: '16px', color: '#43ea6b', fontWeight: 600, fontSize: '1.1rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>Ver más animalitos...</Link>
          )}
        </div>
      </div>
    ))}
  </div>
    </div>
  );
}
