// =============================
// Refugios.tsx
// Página principal de Refugios
// Contiene el filtro por nombre y región, y muestra las tarjetas de refugios con sus animales
// Edita aquí para cambiar el layout, agregar filtros, modificar datos de refugios o animales
// =============================
// --- DATOS DE REFUGIOS ---
// Puedes agregar, quitar o modificar refugios y animales aquí
import React, { useState, useEffect } from 'react';
import RefugiosCard from '../../components/Refugios/Refugioscard';
import './Refugios.css';

import { regionesChile } from '../../../../utils/regionesComunasChile';

// Los refugios y animales se obtendrán desde la API



const Refugios: React.FC = () => {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [refugios, setRefugios] = useState<any[]>([]);
  const [animales, setAnimales] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // SIEMPRE usar endpoints públicos en esta página
        const refugiosUrl = import.meta.env.VITE_API_BASE + '/public/refugios/';
        const animalesUrl = import.meta.env.VITE_API_BASE + '/public/animales/';
        const options: RequestInit = {};
        const refugiosRes = await fetch(refugiosUrl, options);
        if (refugiosRes.status === 403) {
          setError('No tienes permisos para ver los refugios.');
          setRefugios([]);
          return;
        }
        const refugiosData = await refugiosRes.json();
        if (!Array.isArray(refugiosData)) {
          setError('Error al cargar los refugios.');
          setRefugios([]);
        } else {
          setRefugios(refugiosData);
        }
        const animalesRes = await fetch(animalesUrl, options);
        let animalesData = await animalesRes.json();
        animalesData = Array.isArray(animalesData) ? animalesData.map((a: any) => ({ ...a, id: a.id_animal })) : [];
        setAnimales(animalesData);
      } catch (err) {
        setError('Error de conexión al cargar los refugios.');
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
    animales: animales.filter(a => {
      // Si a.refugio es objeto, compara su id
      if (a.refugio && typeof a.refugio === 'object') {
        // Puede ser { id: number } o { id_refugio: number }
        if (typeof a.refugio.id === 'number') {
          return a.refugio.id === refugio.id_refugio;
        }
        if (typeof a.refugio.id_refugio === 'number') {
          return a.refugio.id_refugio === refugio.id_refugio;
        }
      }
      // Si a.refugio es número
      if (typeof a.refugio === 'number') {
        return a.refugio === refugio.id_refugio;
      }
      // Si a.refugio es string (por si acaso)
      if (typeof a.refugio === 'string') {
        return String(refugio.id_refugio) === a.refugio;
      }
      return false;
    }).map(animal => {
      let imagen = '';
      if (animal.imagenes && animal.imagenes.length > 0) {
        imagen = animal.imagenes[0];
      } else if (animal.fotos && animal.fotos.length > 0) {
        imagen = animal.fotos[0];
      }
      // Si la imagen es base64, asegúrate que empiece con 'data:image/'
      if (imagen && imagen.startsWith('/9j/')) {
        imagen = 'data:image/jpeg;base64,' + imagen;
      }
      return {
        ...animal,
        imagen,
      };
    })
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
      {error && (
        <div style={{ color: 'red', background: '#fff0f0', borderRadius: '12px', padding: '16px', marginBottom: '24px', textAlign: 'center', fontWeight: 600 }}>
          {error}
        </div>
      )}
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
