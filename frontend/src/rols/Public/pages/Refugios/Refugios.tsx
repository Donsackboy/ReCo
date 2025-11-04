// =============================
// Refugios.tsx
// Página principal de Refugios
// Contiene el filtro por nombre y región, y muestra las tarjetas de refugios con sus animales
// Edita aquí para cambiar el layout, agregar filtros, modificar datos de refugios o animales
// =============================
// --- DATOS DE REFUGIOS ---
// Puedes agregar, quitar o modificar refugios y animales aquí
import React, { useState, useEffect } from 'react';
import { getAnimales } from '../../../../api';
import RefugiosCard from '../../components/Refugios/Refugioscard';
import './Refugios.css';

import { regionesChile } from '../../../../utils/regionesComunasChile';

// Los refugios y animales se obtendrán desde la API

function getRandomAnimales(animales: { id: number; nombre: string; imagen: string }[], count = 3) {
  return animales.sort(() => 0.5 - Math.random()).slice(0, count);
}


const Refugios: React.FC = () => {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [refugios, setRefugios] = useState<any[]>([]);
  const [animales, setAnimales] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        let refugiosUrl = import.meta.env.VITE_API_BASE + '/public/refugios/';
        let animalesUrl = import.meta.env.VITE_API_BASE + '/public/animales/';
        let options: RequestInit = {};
        if (token) {
          refugiosUrl = import.meta.env.VITE_API_BASE + '/admin/refugios/';
          animalesUrl = import.meta.env.VITE_API_BASE + '/animales/';
          options = { headers: { 'Authorization': `Token ${token}` } };
        }
        const refugiosRes = await fetch(refugiosUrl, options);
        const refugiosData = await refugiosRes.json();
        setRefugios(refugiosData);
        const animalesRes = await fetch(animalesUrl, options);
        let animalesData = await animalesRes.json();
        // Mapear id_animal a id para compatibilidad con componentes
        animalesData = animalesData.map((a: any) => ({ ...a, id: a.id_animal }));
        setAnimales(animalesData);
      } catch (err) {
        setRefugios([]);
        setAnimales([]);
      }
    };
    fetchData();
  }, []);

  const regiones = [{ nombre: 'Todas', value: '' }, ...regionesChile.map((r: string) => ({ nombre: r, value: r }))];

  // Relacionar animales con refugios y mapear id_refugio a id
  const refugiosConAnimales = refugios.map(refugio => ({
    ...refugio,
    id: refugio.id_refugio, // mapeo para compatibilidad con RefugiosCard
    animales: animales.filter(a => a.refugio === refugio.id_refugio).map(animal => ({
      ...animal,
      imagen: (animal.imagenes && animal.imagenes.length > 0) ? animal.imagenes[0] : (animal.fotos && animal.fotos.length > 0 ? animal.fotos[0] : '')
    }))
  }));

  const refugiosFiltrados = refugiosConAnimales.filter(refugio => {
  const coincideNombre = refugio.nombre?.toLowerCase().includes(search.toLowerCase());
  // Normalizar para comparar región ignorando mayúsculas/minúsculas y espacios
  const normalize = (str: string) => (str || '').toLowerCase().replace(/\s+/g, ' ').trim();
  const coincideRegion = region === '' || region === 'Todas' || normalize(refugio.region).includes(normalize(region));
  return coincideNombre && coincideRegion;
  });

  return (
    <div className="refugios-container">
      {/* Filtros de búsqueda y región */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', maxWidth: '350px', marginBottom: '8px', background: '#eaffea', borderRadius: '18px', boxShadow: '0 2px 12px #43ea6b22', padding: '18px 18px 12px 18px' }}>
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
              <option key={r.nombre} value={r.value}>{r.nombre}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="refugios-list" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px', width: '100%', marginTop: '32px' }}>
        {refugiosFiltrados.length === 0 ? (
          <div className="refugio-card" style={{ flex: '1 1 100px', maxWidth: '600px', minWidth: '320px', background: '#fff', borderRadius: '28px', boxShadow: '0 2px 24px #43ea6b22', padding: '40px 32px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#228B22', marginBottom: '12px', textAlign: 'center' }}>Aún no hay refugios registrados en esta zona</h3>
            <p style={{ color: '#228B22', fontSize: '1.1rem', textAlign: 'center', marginBottom: 0 }}>Si conoces algún refugio, comparte la información para que tenga visibilidad y más animalitos puedan encontrar ayuda.</p>
          </div>
        ) : (
          refugiosFiltrados.map(refugio => (
            <RefugiosCard key={refugio.id ? `refugio-${refugio.id}` : `refugio-nombre-${refugio.nombre}`} refugio={refugio} />
          ))
        )}
      </div>
    </div>
  );
};

export default Refugios;
