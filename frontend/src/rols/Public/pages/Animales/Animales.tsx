import React, { useState } from 'react';
import AnimalCard from '../../components/Animales/AnimalCard';
import { animales } from './animalesData';
import './Animales.css';

const Animales = () => {
  const [filtros, setFiltros] = useState({
    edadCategoria: '',
    sexo: '',
    tamano: '',
    refugio: '',
    region: ''
  });
  const [search, setSearch] = useState('');

  // Filtrado de animales
  const animalesFiltrados = animales.filter(animal => {
    // Filtrar por edad
    let edadMatch = true;
    if (filtros.edadCategoria) {
      if (filtros.edadCategoria === 'Cachorro') edadMatch = animal.edad < 0.5;
      else if (filtros.edadCategoria === 'Joven') edadMatch = animal.edad >= 0.5 && animal.edad < 1;
      else if (filtros.edadCategoria === 'Adulto') edadMatch = animal.edad >= 1 && animal.edad < 7;
      else if (filtros.edadCategoria === 'Senior') edadMatch = animal.edad >= 7;
    }
    // Filtrar por sexo
    let sexoMatch = filtros.sexo ? animal.sexo === filtros.sexo : true;
    // Filtrar por tamaño
    let tamanoMatch = filtros.tamano ? animal.tamano === filtros.tamano : true;
    // Filtrar por refugio
    let refugioMatch = filtros.refugio ? animal.refugio === filtros.refugio : true;
    // Filtrar por región
    let regionMatch = filtros.region ? animal.region === filtros.region : true;
    // Filtrar por nombre
    let nombreMatch = search ? animal.nombre.toLowerCase().includes(search.toLowerCase()) : true;
    return edadMatch && sexoMatch && tamanoMatch && refugioMatch && regionMatch && nombreMatch;
  });

  return (
    <div className="animales-page" style={{ display: 'flex', gap: '32px', padding: '40px 24px', alignItems: 'stretch', justifyContent: 'flex-start' }}>
      {/* Filtros en barra lateral mejorados */}
      <aside className="animales-filtros" style={{ width: '320px', minWidth: '240px', maxWidth: '320px', background: 'linear-gradient(135deg, #eaffea 80%, #43ea6b11 100%)', borderRadius: '22px', padding: '32px 24px', boxShadow: '0 4px 18px #43ea6b22', display: 'flex', flexDirection: 'column', gap: '18px', alignSelf: 'stretch' }}>
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
      <section className="animales-galeria" style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px',
        alignItems: 'start',
        gridAutoRows: '440px',
        justifyItems: 'center'
      }}>
        {animalesFiltrados.map(animal => (
          <AnimalCard key={animal.id} animal={animal} />
        ))}
      </section>
    </div>
  );
};

export default Animales;
