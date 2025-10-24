// =============================
// Refugios.tsx
// Página principal de Refugios
// Contiene el filtro por nombre y región, y muestra las tarjetas de refugios con sus animales
// Edita aquí para cambiar el layout, agregar filtros, modificar datos de refugios o animales
// =============================
// --- DATOS DE REFUGIOS ---
// Puedes agregar, quitar o modificar refugios y animales aquí
import React, { useState } from 'react';
import RefugiosCard from '../../components/Refugios/Refugioscard';
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
      { id: 105, nombre: 'Rocky', imagen: '' },
      { id: 106, nombre: 'Simba', imagen: '' },
      { id: 107, nombre: 'Bella', imagen: '' },
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
      { id: 205, nombre: 'Chester', imagen: '' },
      { id: 206, nombre: 'Daisy', imagen: '' },
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
      <h2>Refugioss</h2>
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
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <span style={{ fontWeight: 600, color: '#228B22', fontSize: '1rem' }}>Región:</span>
          <select
            value={region}
            onChange={e => setRegion(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #43ea6b', fontSize: '1rem', background: '#fff', color: '#228B22', fontWeight: 500, boxShadow: '0 1px 4px #43ea6b11', minWidth: '120px' }}
          >
            {regiones.map(r => (
              <option key={r.nombre} value={r.nombre === 'Todas' ? '' : r.nombre}>
                {r.num ? `${r.num} - ` : ''}{r.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
  <div className="refugios-list" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px', width: '100%', maxWidth: '1400px', marginTop: '32px' }}>
    {refugiosFiltrados.length === 0 ? (
      <div className="refugio-card" style={{ flex: '1 1 100px', maxWidth: '600px', minWidth: '320px', background: '#fff', borderRadius: '28px', boxShadow: '0 2px 24px #43ea6b22', padding: '40px 32px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#228B22', marginBottom: '12px', textAlign: 'center' }}>Aún no hay refugios registrados en esta zona</h3>
        <p style={{ color: '#228B22', fontSize: '1.1rem', textAlign: 'center', marginBottom: 0 }}>Si conoces algún refugio, comparte la información para que tenga visibilidad y más animalitos puedan encontrar ayuda.</p>
      </div>
    ) : (
      refugiosFiltrados.map(refugio => (
        <RefugiosCard key={refugio.id} refugio={refugio} />
      ))
    )}
  </div>
    </div>
  );
}
