import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AnimalCard from '../../components/Animales/AnimalCard';
// import { animales } from './animalesData';
import './Animales.css';

const Animales = () => {
  const location = useLocation();
  const [filtros, setFiltros] = useState({
    edadCategoria: '',
    sexo: '',
    tamano: '',
    refugio: '',
    region: ''
  });
  const [search, setSearch] = useState('');

  const [animales, setAnimales] = useState<any[]>([]);
  const [refugios, setRefugios] = useState<any[]>([]);
  // Responsive: mostrar/ocultar filtros en mobile
  const [showFiltros, setShowFiltros] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 700);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Si hay un filtro de refugio en la URL, aplicarlo automáticamente al cargar y obtener animales reales
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refugioParam = params.get('refugio');
    if (refugioParam) {
      setFiltros(f => ({ ...f, refugio: refugioParam }));
    }
    async function fetchAnimalesYRefugios() {
      try {
        const resAnimales = await fetch(`${import.meta.env.VITE_API_BASE}/public/animales/`);
        let dataAnimales = await resAnimales.json();
        dataAnimales = dataAnimales.map((a: any) => ({
          ...a,
          id: a.id_animal,
          imagenes: a.imagenes || a.fotos || []
        }));
        setAnimales(dataAnimales);
        const resRefugios = await fetch(`${import.meta.env.VITE_API_BASE}/public/refugios/`);
        let dataRefugios = await resRefugios.json();
        setRefugios(Array.isArray(dataRefugios) ? dataRefugios : []);
      } catch {
        setAnimales([]);
        setRefugios([]);
      }
    }
    fetchAnimalesYRefugios();
  }, [location.search]);

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
  // Filtrar por refugio (usar id_refugio si existe, si no, intentar animal.refugio.id o animal.refugio)
  let refugioId = animal.id_refugio || (animal.refugio && animal.refugio.id) || animal.refugio;
  let refugioMatch = filtros.refugio ? String(refugioId) === String(filtros.refugio) : true;
    // Filtrar por región
    let regionMatch = filtros.region ? animal.region === filtros.region : true;
    // Filtrar por nombre
    let nombreMatch = search ? animal.nombre.toLowerCase().includes(search.toLowerCase()) : true;
    return edadMatch && sexoMatch && tamanoMatch && refugioMatch && regionMatch && nombreMatch;
  });

  return (
    <div
      className="animales-page"
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '0' : '32px',
        padding: isMobile ? '24px 6px' : '40px 24px',
        alignItems: isMobile ? 'stretch' : 'stretch',
        justifyContent: isMobile ? 'flex-start' : 'flex-start',
        position: 'relative',
        width: '100%'
      }}
    >
      {/* Botón de filtros para mobile */}
      {isMobile && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', marginBottom: 18, marginTop: 20 }}>
          <button
            onClick={() => setShowFiltros(true)}
            style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 32px', fontWeight: 800, fontSize: '1.15rem', cursor: 'pointer', boxShadow: '0 2px 8px #43ea6b22', letterSpacing: 1, marginLeft: 15 }}
          >
            <span role="img" aria-label="Filtro">🔎</span> Filtros
          </button>
        </div>
      )}
      {/* Filtros barra lateral o modal */}
      {(!isMobile || showFiltros) && (
        <aside
          className="animales-filtros"
          style={{
            width: isMobile ? '100vw' : '320px',
            minWidth: isMobile ? '100vw' : '240px',
            maxWidth: isMobile ? '100vw' : '320px',
            background: 'linear-gradient(135deg, #eaffea 80%, #43ea6b11 100%)',
            borderRadius: isMobile ? 0 : '22px',
            padding: isMobile ? '32px 18px 24px 18px' : '32px 24px',
            boxShadow: isMobile ? '0 8px 32px #43ea6b33' : '0 4px 18px #43ea6b22',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            alignSelf: isMobile ? 'auto' : 'stretch',
            position: isMobile ? 'fixed' : 'static',
            top: 0,
            left: 0,
            zIndex: isMobile ? 10000 : 'auto',
            height: isMobile ? '100vh' : 'auto',
            overflowY: isMobile ? 'auto' : 'visible',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h2 style={{ fontSize: '1.5rem', color: '#228B22', fontWeight: 700, letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <span role="img" aria-label="Filtro">🔎</span> Filtrar animales
            </h2>
            {isMobile && (
              <button
                onClick={() => setShowFiltros(false)}
                style={{ background: 'none', color: '#e74c3c', border: 'none', fontSize: '2.2rem', fontWeight: 900, cursor: 'pointer', marginLeft: 8, lineHeight: 1 }}
                aria-label="Cerrar filtros"
              >×</button>
            )}
          </div>
          {/* ...filtros... */}
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
              {refugios.map(ref => (
                <option key={ref.id_refugio} value={ref.id_refugio}>{ref.nombre}</option>
              ))}
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
          <button
            type="button"
            onClick={() => {
              setFiltros({ edadCategoria: '', sexo: '', tamano: '', refugio: '', region: '' });
              setSearch('');
              if (isMobile) setShowFiltros(false);
            }}
            style={{ marginTop: '18px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 0', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 8px #e74c3c22', transition: 'background 0.2s' }}
          >
            Limpiar filtros
          </button>
        </aside>
      )}
  {/* Galería de animales */}
      <section
        className="animales-galeria"
        style={{
          width: '100%',
          display: isMobile ? 'flex' : 'grid',
          flexDirection: isMobile ? 'column' : undefined,
          alignItems: isMobile ? 'center' : 'start',
          gap: isMobile ? '18px' : '32px',
          gridTemplateColumns: isMobile ? undefined : 'repeat(auto-fit, minmax(320px, 1fr))',
          gridAutoRows: isMobile ? undefined : '440px',
          justifyItems: isMobile ? undefined : 'center',
        }}
      >
        {animalesFiltrados.map(animal => (
          isMobile ? (
            <div
              key={animal.id}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 0
              }}
            >
              <div style={{ width: '100%', maxWidth: 400, height: 'auto', minHeight: 0 }}>
                <AnimalCard animal={animal} />
              </div>
            </div>
          ) : (
            <div
              key={animal.id}
              style={{ width: '100%', maxWidth: 400, height: 'auto', minHeight: 0 }}
            >
              <AnimalCard animal={animal} />
            </div>
          )
        ))}
      </section>
    </div>
  );
};

export default Animales;
