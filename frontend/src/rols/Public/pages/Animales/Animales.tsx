import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AnimalCard from '../../components/Animales/AnimalCard';

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
  {
    id: 4,
    nombre: 'Rocky',
    sexo: 'Macho',
    edad: 3,
    tamano: 'Mediano',
    refugio: 'Refugio Esperanza',
    region: 'Metropolitana',
    diasEnRefugio: 80,
    imagenes: ['/Images/animales/placeholder.png'],
    resena: 'Rocky es muy activo y le encanta jugar con pelotas. Ideal para familias deportistas.'
  },
  {
    id: 5,
    nombre: 'Nina',
    sexo: 'Hembra',
    edad: 5,
    tamano: 'Grande',
    refugio: 'Refugio Patitas',
    region: 'Valparaíso',
    diasEnRefugio: 150,
    imagenes: ['/Images/animales/placeholder.png'],
    resena: 'Nina es tranquila y cariñosa, perfecta para compañía en casa.'
  },
  {
    id: 6,
    nombre: 'Toby',
    sexo: 'Macho',
    edad: 2,
    tamano: 'Pequeño',
    refugio: 'Refugio Esperanza',
    region: 'Metropolitana',
    diasEnRefugio: 60,
    imagenes: ['/Images/animales/placeholder.png'],
    resena: 'Toby es juguetón y le encanta estar con niños.'
  },
  {
    id: 7,
    nombre: 'Maya',
    sexo: 'Hembra',
    edad: 6,
    tamano: 'Mediano',
    refugio: 'Refugio Patitas',
    region: 'Valparaíso',
    diasEnRefugio: 110,
    imagenes: ['/Images/animales/placeholder.png'],
    resena: 'Maya es muy sociable y se lleva bien con otros animales.'
  },
  {
    id: 8,
    nombre: 'Simón',
    sexo: 'Macho',
    edad: 7,
    tamano: 'Grande',
    refugio: 'Refugio Esperanza',
    region: 'Metropolitana',
    diasEnRefugio: 210,
    imagenes: ['/Images/animales/placeholder.png'],
    resena: 'Simón es un perro mayor, muy tranquilo y fiel.'
  },
  {
    id: 9,
    nombre: 'Lola',
    sexo: 'Hembra',
    edad: 2,
    tamano: 'Pequeño',
    refugio: 'Refugio Patitas',
    region: 'Valparaíso',
    diasEnRefugio: 90,
    imagenes: ['/Images/animales/placeholder.png'],
    resena: 'Lola es curiosa y le encanta explorar.'
  },
  {
    id: 10,
    nombre: 'Bruno',
    sexo: 'Macho',
    edad: 4,
    tamano: 'Mediano',
    refugio: 'Refugio Esperanza',
    region: 'Metropolitana',
    diasEnRefugio: 130,
    imagenes: ['/Images/animales/placeholder.png'],
    resena: 'Bruno es muy cariñoso y busca una familia que lo quiera mucho.'
  },
  {
    id: 11,
    nombre: 'Coco',
    sexo: 'Macho',
    edad: 1,
    tamano: 'Pequeño',
    refugio: 'Refugio Patitas',
    region: 'Valparaíso',
    diasEnRefugio: 50,
    imagenes: ['/Images/animales/placeholder.png'],
    resena: 'Coco es un cachorro muy activo y curioso.'
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
  const location = useLocation();
  const [filtros, setFiltros] = useState(filtrosIniciales);
  const [search, setSearch] = useState('');

  // Leer filtro de refugio desde la URL al cargar
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refugioParam = params.get('refugio');
    if (refugioParam) {
      setFiltros(f => ({ ...f, refugio: refugioParam }));
    }
  }, [location.search]);

  // Mantener el valor del select de refugio sincronizado con el filtro
  useEffect(() => {
    const select = document.getElementById('filtro-refugio') as HTMLSelectElement | null;
    if (select && filtros.refugio) {
      select.value = filtros.refugio;
    }
  }, [filtros.refugio]);

  // Filtrado de animales por categoría de edad
    function filtrarPorEdadCategoria(animal: any, categoria: any) {
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
}