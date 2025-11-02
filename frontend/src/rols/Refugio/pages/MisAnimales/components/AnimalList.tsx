
import React, { useEffect, useState } from 'react';
import { getAnimales } from '../../../../../../src/api.js';
import AnimalEditPerfil from './AnimalEditPerfil';
import AnimalForm from './AnimalForm';

export type Vacuna = {
  tipo: string;
  fecha: string;
  refuerzo?: string;
  unica?: boolean;
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
};

const AnimalList: React.FC = () => {
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState({ nombre: '', especie: '', sexo: '', tamano: '' });
  const [showCreate, setShowCreate] = useState(false);
  const [editAnimal, setEditAnimal] = useState<Animal | null>(null);

  useEffect(() => {
    const fetchAnimales = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        const userObj = userStr ? JSON.parse(userStr) : null;
        const refugioId = userObj?.refugio?.id_refugio;
        const data = await getAnimales(token);
        const animalesRefugio = data.filter((a: Animal) => a.refugio === refugioId);
        setAnimales(animalesRefugio);
      } catch (err) {
        setError('Error al cargar animales');
      }
      setLoading(false);
    };
    fetchAnimales();
  }, []);

  if (loading) return <div>Cargando animales...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  // Filtrado local
  const animalesFiltrados = animales.filter(a =>
    (!filtro.nombre || a.nombre.toLowerCase().includes(filtro.nombre.toLowerCase())) &&
    (!filtro.especie || a.especie === filtro.especie) &&
    (!filtro.sexo || a.sexo === filtro.sexo) &&
    (!filtro.tamano || a.tamano === filtro.tamano)
  );

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ color: '#145214' }}>Animales del Refugio</h2>
        <button onClick={() => setShowCreate(true)} style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 24px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 8px #43ea6b22' }}>Crear Animal</button>
      </div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <input type="text" value={filtro.nombre} onChange={e => setFiltro(f => ({ ...f, nombre: e.target.value }))} placeholder="Buscar por nombre" style={{ padding: 8, borderRadius: 8, border: '1px solid #43ea6b', minWidth: 160 }} />
        <select value={filtro.especie} onChange={e => setFiltro(f => ({ ...f, especie: e.target.value }))} style={{ padding: 8, borderRadius: 8, border: '1px solid #43ea6b', minWidth: 120 }}>
          <option value="">Todas las especies</option>
          <option value="perro">Perro</option>
          <option value="gato">Gato</option>
          <option value="otro">Otro</option>
        </select>
        <select value={filtro.sexo} onChange={e => setFiltro(f => ({ ...f, sexo: e.target.value }))} style={{ padding: 8, borderRadius: 8, border: '1px solid #43ea6b', minWidth: 120 }}>
          <option value="">Ambos sexos</option>
          <option value="Macho">Macho</option>
          <option value="Hembra">Hembra</option>
        </select>
        <select value={filtro.tamano} onChange={e => setFiltro(f => ({ ...f, tamano: e.target.value }))} style={{ padding: 8, borderRadius: 8, border: '1px solid #43ea6b', minWidth: 120 }}>
          <option value="">Todos los tamaños</option>
          <option value="Pequeño">Pequeño</option>
          <option value="Pequeño-Grande">Pequeño-Grande</option>
          <option value="Media">Media</option>
          <option value="Mediano">Mediano</option>
          <option value="Mediano-Grande">Mediano-Grande</option>
          <option value="Grande">Grande</option>
          <option value="Gigante">Gigante</option>
        </select>
        <button onClick={() => setFiltro({ nombre: '', especie: '', sexo: '', tamano: '' })} style={{ background: '#eee', color: '#228B22', border: '1px solid #43ea6b', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer' }}>Limpiar filtros</button>
      </div>
      {animalesFiltrados.length === 0 ? (
        <div style={{ color: '#888', fontSize: '1.1rem', textAlign: 'center', marginTop: 32 }}>No hay animales que coincidan con los filtros.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {animalesFiltrados.map(animal => (
            <div key={animal.id_animal} style={{ background: '#f6fff6', borderRadius: '16px', boxShadow: '0 2px 12px #228b2233', padding: '18px 24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', position: 'relative' }}>
              <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#228B22', marginBottom: 8 }}>{animal.nombre}</div>
              <div style={{ color: '#145214', fontSize: '1.08rem', marginBottom: 6 }}>{animal.especie} • {animal.sexo} • {animal.tamano}</div>
              <div style={{ color: '#1a421a', fontSize: '1.05rem', marginBottom: 10 }}>ID: {animal.id_animal}</div>
              <button
                style={{ background: '#43ea6b', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 18px', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer', boxShadow: '0 2px 8px #43ea6b22', marginTop: 8 }}
                onClick={() => setEditAnimal(animal)}
              >Editar perfil</button>
            </div>
          ))}
        </div>
      )}

      {/* Modal para crear animal */}
      {showCreate && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 18px #228b2233', padding: 32, minWidth: 350, maxWidth: 420, position: 'relative' }}>
            <button onClick={() => setShowCreate(false)} style={{ position: 'absolute', top: 12, right: 18, color: '#e74c3c', fontWeight: 700, fontSize: '1.2rem', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
            {/* AnimalForm con diseño integrado */}
            <AnimalForm onCreated={async () => {
              setShowCreate(false);
              setLoading(true);
              setError('');
              try {
                const token = localStorage.getItem('token');
                const userStr = localStorage.getItem('user');
                const userObj = userStr ? JSON.parse(userStr) : null;
                const refugioId = userObj?.refugio?.id_refugio;
                const data = await getAnimales(token);
                const animalesRefugio = data.filter((a: Animal) => a.refugio === refugioId);
                setAnimales(animalesRefugio);
              } catch (err) {
                setError('Error al cargar animales');
              }
              setLoading(false);
            }} />
          </div>
        </div>
      )}

      {/* Modal para editar animal (perfil editable, agregar vacunas, etc.) */}
      {editAnimal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 18px #228b2233', padding: 32, minWidth: 350, maxWidth: 600, position: 'relative' }}>
            <button onClick={() => setEditAnimal(null)} style={{ position: 'absolute', top: 12, right: 18, color: '#e74c3c', fontWeight: 700, fontSize: '1.2rem', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
            <AnimalEditPerfil
              animal={editAnimal}
              onClose={() => setEditAnimal(null)}
              onSave={async () => {
                setEditAnimal(null);
                // Refresca la lista de animales después de editar
                setLoading(true);
                setError('');
                try {
                  const token = localStorage.getItem('token');
                  const userStr = localStorage.getItem('user');
                  const userObj = userStr ? JSON.parse(userStr) : null;
                  const refugioId = userObj?.refugio?.id_refugio;
                  const data = await getAnimales(token);
                  const animalesRefugio = data.filter((a: Animal) => a.refugio === refugioId);
                  setAnimales(animalesRefugio);
                } catch (err) {
                  setError('Error al cargar animales');
                }
                setLoading(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimalList;
