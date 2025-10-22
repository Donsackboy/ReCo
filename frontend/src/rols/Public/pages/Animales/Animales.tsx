import React, { useState } from 'react';

// Datos de ejemplo para animales
const animales = [
  {
    id: 1,
    nombre: 'Luna',
    sexo: 'Hembra',
    edad: 2,
    tamano: 'Mediano',
    refugio: 'Refugio Esperanza',
    region: 'Metropolitana',
    diasEnRefugio: 120,
    imagenes: [
      '/Images/animales/placeholder.png',
      '/Images/animales/placeholder.png',
      '/Images/animales/placeholder.png'
    ],
    resena: 'Luna es una perrita muy cariñosa y juguetona. Le encanta correr y recibir mimos. Se lleva bien con otros perros y niños.'
  },
  {
    id: 2,
    nombre: 'Max',
    sexo: 'Macho',
    edad: 4,
    tamano: 'Grande',
    refugio: 'Refugio Esperanza',
    region: 'Metropolitana',
    diasEnRefugio: 45,
    imagenes: [
      '/Images/animales/placeholder.png',
      '/Images/animales/placeholder.png',
      '/Images/animales/placeholder.png'
    ],
    resena: 'Max es un perro guardián, muy leal y protector. Busca una familia que le dé amor y espacio para jugar. Es sociable y obediente.'
  },
  {
    id: 3,
    nombre: 'Bella',
    sexo: 'Hembra',
    edad: 1,
    tamano: 'Pequeño',
    refugio: 'Refugio Patitas',
    region: 'Valparaíso',
    diasEnRefugio: 200,
    imagenes: [
      '/Images/animales/placeholder.png',
      '/Images/animales/placeholder.png',
      '/Images/animales/placeholder.png'
    ],
    resena: 'Bella es una cachorra muy curiosa y activa. Le gusta explorar y aprender cosas nuevas. Ideal para familias con niños.'
  },
  // ...agrega más animales aquí
];

const filtrosIniciales = {
  edadCategoria: '',
  sexo: '',
  tamano: '',
  refugio: '',
  region: '',
};

export default function Animales() {
  const [filtros, setFiltros] = useState(filtrosIniciales);
  const [search, setSearch] = useState('');

  // Filtrado de animales por categoría de edad
  function filtrarPorEdadCategoria(animal, categoria) {
    if (!categoria) return true;
    if (categoria === 'Cachorro') return animal.edad < 0.5; // menos de 6 meses
    if (categoria === 'Joven') return animal.edad >= 0.5 && animal.edad < 1; // 6 meses a 1 año
    if (categoria === 'Adulto') return animal.edad >= 1 && animal.edad < 7; // 1 a 7 años
    if (categoria === 'Senior') return animal.edad >= 7; // 7+ años
    return true;
  }

  const animalesFiltrados = animales.filter(animal => {
    return (
      filtrarPorEdadCategoria(animal, filtros.edadCategoria) &&
      (!filtros.sexo || animal.sexo === filtros.sexo) &&
      (!filtros.tamano || animal.tamano === filtros.tamano) &&
      (!filtros.refugio || animal.refugio === filtros.refugio) &&
      (!filtros.region || animal.region === filtros.region) &&
      (animal.nombre.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="animales-page" style={{ display: 'flex', gap: '32px', padding: '40px 24px' }}>
      {/* Filtros en barra lateral mejorados */}
      <aside className="animales-filtros" style={{ minWidth: '240px', maxWidth: '320px', background: 'linear-gradient(135deg, #eaffea 80%, #43ea6b11 100%)', borderRadius: '22px', padding: '32px 24px', boxShadow: '0 4px 18px #43ea6b22', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#228B22', marginBottom: '10px', fontWeight: 700, letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span role="img" aria-label="Filtro">🔎</span> Filtrar animales
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ fontWeight: 600, color: '#145214', marginBottom: '2px' }} htmlFor="filtro-edad-categoria">Edad</label>
          <select id="filtro-edad-categoria" value={filtros.edadCategoria} onChange={e => setFiltros({ ...filtros, edadCategoria: e.target.value })} style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1.5px solid #43ea6b', background: '#fff', fontSize: '1rem' }}>
            <option value="">Todas</option>
              <option value="Cachorro">Cachorro (menos de 6 meses)</option>
              <option value="Joven">Joven (6 meses a 1 año)</option>
              <option value="Adulto">Adulto (1 a 7 años)</option>
              <option value="Senior">Senior (7+ años)</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ fontWeight: 600, color: '#145214', marginBottom: '2px' }} htmlFor="filtro-sexo">Sexo</label>
          <select id="filtro-sexo" value={filtros.sexo} onChange={e => setFiltros({ ...filtros, sexo: e.target.value })} style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1.5px solid #43ea6b', background: '#fff', fontSize: '1rem' }}>
            <option value="">Todos</option>
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ fontWeight: 600, color: '#145214', marginBottom: '2px' }} htmlFor="filtro-tamano">Tamaño</label>
          <select id="filtro-tamano" value={filtros.tamano} onChange={e => setFiltros({ ...filtros, tamano: e.target.value })} style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1.5px solid #43ea6b', background: '#fff', fontSize: '1rem' }}>
            <option value="">Todos</option>
            <option value="Pequeño">Pequeño</option>
            <option value="Mediano">Mediano</option>
            <option value="Grande">Grande</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ fontWeight: 600, color: '#145214', marginBottom: '2px' }} htmlFor="filtro-refugio">Refugio</label>
          <select id="filtro-refugio" value={filtros.refugio} onChange={e => setFiltros({ ...filtros, refugio: e.target.value })} style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1.5px solid #43ea6b', background: '#fff', fontSize: '1rem' }}>
            <option value="">Todos</option>
            <option value="Refugio Esperanza">Refugio Esperanza</option>
            <option value="Refugio Patitas">Refugio Patitas</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ fontWeight: 600, color: '#145214', marginBottom: '2px' }} htmlFor="filtro-region">Región</label>
          <select id="filtro-region" value={filtros.region} onChange={e => setFiltros({ ...filtros, region: e.target.value })} style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1.5px solid #43ea6b', background: '#fff', fontSize: '1rem' }}>
            <option value="">Todas</option>
            <option value="Metropolitana">Metropolitana</option>
            <option value="Valparaíso">Valparaíso</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ fontWeight: 600, color: '#145214', marginBottom: '2px' }} htmlFor="filtro-nombre">Buscar por nombre</label>
          <input id="filtro-nombre" type="text" value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1.5px solid #43ea6b', background: '#fff', fontSize: '1rem' }} placeholder="Ej: Luna" />
        </div>
        <button type="button" style={{ marginTop: '18px', background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 0', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 8px #43ea6b22', transition: 'background 0.2s' }}>Aplicar filtros</button>
      </aside>
      {/* Galería de animales */}
      <section className="animales-galeria" style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px' }}>
        {animalesFiltrados.map(animal => (
          <div key={animal.id} className="animal-card" style={{ background: '#fff', borderRadius: '18px', boxShadow: '0 2px 12px #43ea6b22', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '340px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '18px', right: '18px', background: '#eaffea', color: '#228B22', borderRadius: '12px', padding: '6px 12px', fontWeight: 600, fontSize: '0.95rem' }}>
              {animal.diasEnRefugio} días en refugio
            </div>
            <img src={animal.imagenes[0]} alt={animal.nombre + ' portada'} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '14px', marginBottom: '14px', boxShadow: '0 2px 8px #43ea6b22' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#145214', margin: '8px 0 4px' }}>{animal.nombre}</h3>
            <div style={{ color: '#228B22', fontSize: '1rem', marginBottom: '8px' }}>{animal.sexo} • {animal.edad} años • {animal.tamano}</div>
            <div style={{ color: '#1a421a', fontSize: '0.98rem', marginBottom: '8px', textAlign: 'center', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{animal.resena}</div>
            <a href={`/animales/${animal.id}`} style={{ marginTop: 'auto', background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 18px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}>Ver más</a>
          </div>
        ))}
      </section>
    </div>
  );
}
