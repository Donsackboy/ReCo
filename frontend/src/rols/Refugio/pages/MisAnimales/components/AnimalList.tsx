import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAnimales } from '../../../api/ApiRefugio';
import AnimalEditPerfil from './AnimalEditPerfil';
import AnimalForm from './AnimalForm';
import './AnimalList.css';

type Vacuna = {
  id?: number;
  nombre?: string;
  tipo?: string;
  fecha?: string;
  fecha_aplicacion?: string;
  fecha_refuerzo?: string;
  observaciones?: string;
  unica?: boolean;
  refuerzo?: boolean;
  proxima?: string;
  especificaciones?: string;
};

export type Animal = {
  id_animal: number;
  nombre: string;
  edad?: number | string;
  especie: string;
  descripcion?: string;
  estado?: string;
  sexo?: string;
  tamano?: string;
  busca_hogar_temporal?: boolean;
  refugio: number;
  vacunas?: Vacuna[];
  fecha_ingreso?: string;
  fecha_cumpleanos?: string;
  ubicacion_actual?: string;
};

const AnimalList: React.FC = () => {
  const location = useLocation();
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState({ nombre: '', especie: '', sexo: '', tamano: '' });
  const [showCreate, setShowCreate] = useState(false);
  const [editAnimal, setEditAnimal] = useState<Animal | null>(null);
  const [fullscreenImg, setFullscreenImg] = useState<string | null>(null);

  const fetchAnimales = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token') || '';
      const userStr = localStorage.getItem('user');
      const userObj = userStr ? JSON.parse(userStr) : null;
      const refugioId: string | number | undefined = userObj?.refugio?.id_refugio;
      const data = await getAnimales(token);
      const animalesRefugio = data.filter((a: Animal) => {
        let id: string | number | undefined = a.refugio;
        if (typeof id === 'object' && id !== null && 'id_refugio' in id) {
          // @ts-ignore
          id = (id as any).id_refugio;
        }
        return refugioId !== undefined && String(id) === String(refugioId);
      });
      setAnimales(animalesRefugio);
    } catch {
      setError('Error al cargar animales');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnimales();
  }, []);

  useEffect(() => {
    if (!loading && animales.length > 0) {
      const params = new URLSearchParams(location.search);
      const idParam = params.get('id');
      const editarPerfil = params.get('editarPerfil');
      console.log('[AutoModal] URL params:', { idParam, editarPerfil });
      if (idParam && editarPerfil === 'true') {
        const idNum = Number(idParam);
        const animal = animales.find(a => a.id_animal === idNum);
        console.log('[AutoModal] Animal encontrado:', animal);
        if (animal) setEditAnimal(animal);
      }
    }
  }, [loading, animales, location.search]);

  if (loading) return <div>Cargando animales...</div>;
  if (error) return <div className="error">{error}</div>;

  const animalesFiltrados = animales.filter(a =>
    (!filtro.nombre || a.nombre.toLowerCase().includes(filtro.nombre.toLowerCase())) &&
    (!filtro.especie || a.especie === filtro.especie) &&
    (!filtro.sexo || a.sexo === filtro.sexo) &&
    (!filtro.tamano || a.tamano === filtro.tamano)
  );

  return (
    <div className="animal-list-container">
      <div className="animal-list-header">
        <h2>Animales del Refugio</h2>
        <button className="btn-crear" onClick={() => setShowCreate(true)}>
          Crear animal
        </button>
      </div>

      {/* Filtros */}
      <div className="filtros-container">
        <input
          type="text"
          value={filtro.nombre}
          onChange={e => setFiltro(f => ({ ...f, nombre: e.target.value }))}
          placeholder="Buscar por nombre"
        />
        <select value={filtro.especie} onChange={e => setFiltro(f => ({ ...f, especie: e.target.value }))}>
          <option value="">Todas las especies</option>
          <option value="perro">Perro</option>
          <option value="gato">Gato</option>
          <option value="otro">Otro</option>
        </select>
        <select value={filtro.sexo} onChange={e => setFiltro(f => ({ ...f, sexo: e.target.value }))}>
          <option value="">Ambos sexos</option>
          <option value="Macho">Macho</option>
          <option value="Hembra">Hembra</option>
        </select>
        <select value={filtro.tamano} onChange={e => setFiltro(f => ({ ...f, tamano: e.target.value }))}>
          <option value="">Todos los tamaños</option>
          <option value="Pequeño">Pequeño</option>
          <option value="Mediano">Mediano</option>
          <option value="Grande">Grande</option>
        </select>
        <button className="btn-limpiar" onClick={() => setFiltro({ nombre: '', especie: '', sexo: '', tamano: '' })}>
          Limpiar filtros
        </button>
      </div>

      {/* Lista */}
      {animalesFiltrados.length === 0 ? (
        <div className="no-result">No hay animales que coincidan con los filtros.</div>
      ) : (
        <div className="lista-animales">
          {animalesFiltrados.map(animal => (
            <div key={animal.id_animal} className="animal-card">
              <div className="animal-info">
                <div className="animal-nombre">{animal.nombre}</div>
                <div className="animal-detalle">{animal.especie} • {animal.sexo} • {animal.tamano}</div>
                <div className="animal-id">ID: {animal.id_animal}</div>
                <button className="btn-editar" onClick={() => setEditAnimal(animal)}>Editar perfil</button>
              </div>
              <div className="animal-foto">
                {Array.isArray((animal as any).fotos) && (animal as any).fotos.length > 0 ? (
                  <img
                    src={(animal as any).fotos[0]}
                    alt="Foto animal"
                    onClick={() => setFullscreenImg((animal as any).fotos[0])}
                  />
                ) : (
                  <div className="no-foto">🐾</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal crear */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="btn-cerrar" onClick={() => setShowCreate(false)}>×</button>
            <AnimalForm
              onCreated={async () => {
                await fetchAnimales();
                setShowCreate(false);
              }}
              onCancel={() => setShowCreate(false)}
            />
          </div>
        </div>
      )}

      {/* Modal editar */}
      {editAnimal && (
        <div className="modal-overlay" onClick={() => setEditAnimal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="btn-cerrar" onClick={() => setEditAnimal(null)}>×</button>
            <div className="modal-info">
              <span>Modal edición abierto automáticamente por URL</span>
              <br />
              <span>ID buscado: {new URLSearchParams(location.search).get('id')}</span>
            </div>
            <AnimalEditPerfil
              animal={editAnimal as any}
              onClose={() => setEditAnimal(null)}
              onSave={(updatedAnimal) => {
                setEditAnimal(null);
                if (!updatedAnimal) return;
                setAnimales(prev =>
                  prev.map(a =>
                    a.id_animal === updatedAnimal.id_animal ? { ...a, ...updatedAnimal } : a
                  )
                );
              }}
            />
          </div>
        </div>
      )}

      {/* Modal imagen completa */}
      {fullscreenImg && (
        <div className="fullscreen-overlay" onClick={() => setFullscreenImg(null)}>
          <img src={fullscreenImg} alt="Foto animal" className="fullscreen-img" />
          <button className="btn-cerrar-full" onClick={() => setFullscreenImg(null)}>×</button>
        </div>
      )}
    </div>
  );
};

export default AnimalList;
