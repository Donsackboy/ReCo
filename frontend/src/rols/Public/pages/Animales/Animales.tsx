import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AnimalCard from '../../components/Animales/AnimalCard';
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
  const [refugioNombre, setRefugioNombre] = useState('');
  const [search, setSearch] = useState('');

  const [animales, setAnimales] = useState<any[]>([]);
  const [refugios, setRefugios] = useState<any[]>([]);
  const [showFiltros, setShowFiltros] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 700);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refugioParam = params.get('refugio');
    console.log('Animales.tsx - location.search:', location.search);
    console.log('Animales.tsx - refugioParam:', refugioParam);
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

        // Si hay filtro de refugio, buscar el nombre
        if (refugioParam && Array.isArray(dataRefugios)) {
          const found = dataRefugios.find((r: any) => String(r.id_refugio) === String(refugioParam));
          console.log('Animales.tsx - refugio encontrado:', found);
          setRefugioNombre(found ? found.nombre : '');
        }
      } catch {
        setAnimales([]);
        setRefugios([]);
      }
    }

    fetchAnimalesYRefugios();
  }, [location.search]);

  const animalesFiltrados = animales.filter(animal => {
    let edadMatch = true;
    if (filtros.edadCategoria) {
      // Normalizar edad y tipo_edad
      let edadNum = 0;
      let tipoEdad = animal.tipo_edad || '';
      if (typeof animal.edad === 'string') {
        const match = animal.edad.match(/(\d+)/);
        if (match) edadNum = parseInt(match[1], 10);
      } else {
        edadNum = animal.edad;
      }
      tipoEdad = tipoEdad.toLowerCase();

      if (filtros.edadCategoria === 'Cachorro') {
        // Menos de 6 meses
        edadMatch = (tipoEdad === 'meses' && edadNum < 6);
      } else if (filtros.edadCategoria === 'Joven') {
        // 6 a 11 meses
        edadMatch = (tipoEdad === 'meses' && edadNum >= 6 && edadNum < 12);
      } else if (filtros.edadCategoria === 'Adulto') {
        // 1 a 6 años
        edadMatch = ((tipoEdad === 'anios' || tipoEdad === 'año') && edadNum >= 1 && edadNum <= 7);
      } else if (filtros.edadCategoria === 'Senior') {
        // 7+ años
        edadMatch = ((tipoEdad === 'anios' || tipoEdad === 'año') && edadNum > 7);
      }
    }
    const sexoMatch = filtros.sexo ? animal.sexo === filtros.sexo : true;
    // Filtrado flexible para tamaños compuestos (ej: 'Pequeño-Mediano')
    const tamanoMatch = filtros.tamano
      ? animal.tamano && animal.tamano.toLowerCase().includes(filtros.tamano.toLowerCase())
      : true;

    // Refugio puede venir como id_refugio, refugio (id), o refugio objeto
    let refugioId = null;
    if (typeof animal.refugio === 'object' && animal.refugio !== null) {
      refugioId = animal.refugio.id || animal.refugio.id_refugio;
    } else if (animal.id_refugio) {
      refugioId = animal.id_refugio;
    } else if (animal.refugio) {
      refugioId = animal.refugio;
    }
    const refugioMatch = filtros.refugio ? String(refugioId) === String(filtros.refugio) : true;

    const regionMatch = filtros.region ? animal.region === filtros.region : true;
    const nombreMatch = search ? animal.nombre.toLowerCase().includes(search.toLowerCase()) : true;
    return edadMatch && sexoMatch && tamanoMatch && refugioMatch && regionMatch && nombreMatch;
  });

  const [pagina, setPagina] = useState(1);
  const animalesPorPagina = 20;
  const totalPaginas = Math.ceil(animalesFiltrados.length / animalesPorPagina);
  const animalesPagina = animalesFiltrados.slice((pagina - 1) * animalesPorPagina, pagina * animalesPorPagina);


  // Componente de paginación mejorado
  const Pagination = ({ paginaActual, totalPaginas, onPageChange }: { paginaActual: number, totalPaginas: number, onPageChange: (n: number) => void }) => (
    <div className="paginacion-mejorada">
      <button
        className="paginacion-arrow"
        onClick={() => onPageChange(paginaActual - 1)}
        disabled={paginaActual === 1}
        aria-label="Anterior"
      >←</button>
      <span className="paginacion-info">Página {paginaActual} de {totalPaginas}</span>
      <button
        className="paginacion-arrow"
        onClick={() => onPageChange(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
        aria-label="Siguiente"
      >→</button>
    </div>
  );

  return (
    <div className={`animales-page ${isMobile ? 'mobile' : 'desktop'}`}>  
      {/* Botón filtros en móvil */}
      {isMobile && (
        <div className="filtros-mobile-btn">
          <button onClick={() => setShowFiltros(true)}>🔎 Filtros</button>
        </div>
      )}

      {/* Layout principal: filtros + galería */}
      <div style={{ display: 'flex', width: '100%', alignItems: 'flex-start', gap: isMobile ? 0 : 32 }}>
        {/* Panel de filtros */}
        {(!isMobile || showFiltros) && (
          <aside className={`animales-filtros ${isMobile ? 'mobile-filtros' : ''}`} style={{ minWidth: 240, maxWidth: 320 }}>
            <div className="filtros-header">
              <h2>🔎 Filtrar animales</h2>
              {isMobile && (
                <button className="cerrar-filtros" onClick={() => setShowFiltros(false)}>×</button>
              )}
            </div>

            {/* Filtros */}
            <div className="filtros-group">
              <label>Edad</label>
              <select value={filtros.edadCategoria} onChange={e => setFiltros({ ...filtros, edadCategoria: e.target.value })}>
                <option value="">Todas</option>
                <option value="Cachorro">Cachorro (menos de 6 meses)</option>
                <option value="Joven">Joven (6 meses a 1 año)</option>
                <option value="Adulto">Adulto (1 a 7 años)</option>
                <option value="Senior">Senior (7+ años)</option>
              </select>
            </div>

            <div className="filtros-group">
              <label>Sexo</label>
              <select value={filtros.sexo} onChange={e => setFiltros({ ...filtros, sexo: e.target.value })}>
                <option value="">Todos</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
            </div>

            <div className="filtros-group">
              <label>Tamaño</label>
              <select value={filtros.tamano} onChange={e => setFiltros({ ...filtros, tamano: e.target.value })}>
                <option value="">Todos</option>
                <option value="Pequeño">Pequeño</option>
                <option value="Pequeño-Mediano">Pequeño-Mediano</option>
                <option value="Mediano">Mediano</option>
                <option value="Mediano-Grande">Mediano-Grande</option>
                <option value="Grande">Grande</option>
                <option value="Gigante">Gigante</option>
              </select>
            </div>

            <div className="filtros-group">
              <label>Refugio</label>
              <select value={filtros.refugio} onChange={e => setFiltros({ ...filtros, refugio: e.target.value })}>
                <option value="">Todos</option>
                {refugios.map(ref => (
                  <option key={ref.id_refugio} value={ref.id_refugio}>{ref.nombre}</option>
                ))}
              </select>
            </div>

            <div className="filtros-group">
              <label>Región</label>
              <select value={filtros.region} onChange={e => setFiltros({ ...filtros, region: e.target.value })}>
                <option value="">Todas</option>
                <option value="Metropolitana">Metropolitana</option>
                <option value="Valparaíso">Valparaíso</option>
              </select>
            </div>

            <div className="filtros-group">
              <label>Buscar por nombre</label>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Ej: Luna"
              />
            </div>

            <button className="btn-limpiar"
              onClick={() => {
                setFiltros({ edadCategoria: '', sexo: '', tamano: '', refugio: '', region: '' });
                setSearch('');
                if (isMobile) setShowFiltros(false);
              }}>
              Limpiar filtros
            </button>
          </aside>
        )}

        {/* Contenedor galería y paginación */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Indicador de filtro de refugio activo */}
          {filtros.refugio && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              {/* LOG: filtro de refugio y nombre */}
              {console.log('Animales.tsx - filtro refugio:', filtros.refugio, 'nombre:', refugioNombre)}
              <span style={{
                background: '#e0f7fa',
                color: '#00796b',
                borderRadius: '16px',
                padding: '4px 12px',
                fontWeight: 500,
                fontSize: '1rem',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
              }}>
                Refugio: {
                  refugioNombre
                    ? refugioNombre
                    : (refugios.find(r => String(r.id_refugio) === String(filtros.refugio))?.nombre || (filtros.refugio ? 'Refugio seleccionado' : ''))
                }
              </span>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#00796b',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  marginLeft: 4
                }}
                title="Quitar filtro de refugio"
                onClick={() => { setFiltros(f => ({ ...f, refugio: '' })); setRefugioNombre(''); }}
              >×</button>
            </div>
          )}
          {/* Paginación arriba */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <Pagination paginaActual={pagina} totalPaginas={totalPaginas} onPageChange={setPagina} />
          </div>

          {/* Galería de animales */}
          <section
            className={`animales-galeria${isMobile ? ' animales-galeria-mobile' : ''}`}
          >
            {animalesPagina.map(animal => (
              <div key={animal.id} className="animal-card-wrapper">
                <AnimalCard animal={animal} />
              </div>
            ))}
          </section>

          {/* Paginación abajo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
            <Pagination paginaActual={pagina} totalPaginas={totalPaginas} onPageChange={setPagina} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Animales;
