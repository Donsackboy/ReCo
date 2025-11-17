import React, { useEffect, useState } from 'react';
import { getEspecies, createEspecie, getListasVacunasEspecie, createListaVacunasEspecie } from '../../api/ApiAdmin';
import ListaVacunasDetalle from './ListaVacunasDetalle';

interface ListaVacunasEspecie {
  id: number;
  especie: number;
  nombre: string;
  descripcion: string;
  frecuencia: string;
  dosis: string;
  obligatoria: boolean;
  tipo: string;
  precio: number;
}


interface Especie {
  id: number;
  nombre: string;
}

const GestionVacunasEspecies: React.FC = () => {
  const [listas, setListas] = useState<ListaVacunasEspecie[]>([]);
  const [detalleId, setDetalleId] = useState<number|null>(null);
  const [especies, setEspecies] = useState<Especie[]>([]);
  const [nuevaEspecie, setNuevaEspecie] = useState('');
  const [showFormEspecie, setShowFormEspecie] = useState(false);
  const [showFormVacuna, setShowFormVacuna] = useState(false);
  const [formData, setFormData] = useState({
    especie: '',
    nombre: '',
    descripcion: '',
    frecuencia: '',
    dosis: '',
    obligatoria: false,
    tipo: '',
    precio: ''
  });

  // Fetch listas de vacunas por especie
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    getListasVacunasEspecie(token)
      .then((data: ListaVacunasEspecie[]) => setListas(data))
      .catch(() => setListas([]));
  }, []);


  // Fetch especies desde el backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    getEspecies(token)
      .then((data: Especie[]) => setEspecies(data))
      .catch(() => setEspecies([]));
  }, []);


  // Crear nueva especie en el backend
  const handleAddEspecie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaEspecie.trim()) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const especieCreada = await createEspecie(token, { nombre: nuevaEspecie.trim() });
      setEspecies([...especies, especieCreada]);
      setNuevaEspecie('');
      setShowFormEspecie(false);
    } catch {
      // Manejo de error (puedes mostrar un mensaje)
    }
  };

  // Crear nueva lista de vacuna asociada a especie
  const handleCreateLista = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;
    // Enviar especie en vez de animal
    const nuevaLista = await createListaVacunasEspecie(token, {
      ...formData,
      especie: Number(formData.especie),
      precio: Number(formData.precio)
    });
    setListas([...listas, nuevaLista]);
    setShowFormVacuna(false);
    setFormData({
      especie: '', nombre: '', descripcion: '', frecuencia: '', dosis: '', obligatoria: false, tipo: '', precio: ''
    });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Gestión de Listas de Vacunas por Especie</h2>
      <button onClick={() => setShowFormEspecie(true)} style={{ marginBottom: '1rem', background: '#2a5d8a', color: 'white', border: 'none', borderRadius: '8px', padding: '0.8rem 1.3rem', fontWeight: 700, cursor: 'pointer' }}>
        Crear lista para nueva especie
      </button>

      {/* Modal para crear nueva especie */}
      {showFormEspecie && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30, 60, 90, 0.35)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', animation: 'fadeInBg 0.3s' }}>
          <div style={{ background: 'linear-gradient(135deg, #f4f8fb 80%, #e3eaf3 100%)', padding: '2.5rem 2rem', borderRadius: '18px', boxShadow: '0 8px 32px #2a5d8a44', minWidth: 370, maxWidth: 440, position: 'relative', animation: 'fadeInModal 0.3s' }}>
            <button aria-label="Cerrar" onClick={() => setShowFormEspecie(false)} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: '1.5rem', color: '#2a5d8a', cursor: 'pointer', fontWeight: 700 }}>&times;</button>
            <h2 style={{ marginBottom: '1.2rem', color: '#2a5d8a', textAlign: 'center', fontWeight: 700, fontSize: '1.35rem', letterSpacing: '0.5px' }}>Crear Nueva Especie</h2>
            <form onSubmit={handleAddEspecie} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                <label style={{ fontWeight: 600, color: '#2a5d8a', marginBottom: '0.2rem' }}>Nombre de la Especie</label>
                <input type="text" placeholder="Ej: Perro, Gato, etc." value={nuevaEspecie} onChange={e => setNuevaEspecie(e.target.value)} style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #bcd', fontSize: '1rem' }} required />
              </div>
              <button type="submit" style={{ background: 'linear-gradient(90deg, #2a5d8a 60%, #4a8ad4 100%)', color: 'white', border: 'none', borderRadius: '8px', padding: '0.8rem 1.3rem', fontWeight: 700, fontSize: '1.05rem', marginTop: '1rem', boxShadow: '0 2px 8px #2a5d8a22', transition: 'background 0.2s', cursor: 'pointer' }}>Crear Especie</button>
              <button type="button" style={{ background: '#e3eaf3', color: '#2a5d8a', border: 'none', borderRadius: '8px', padding: '0.8rem 1.3rem', fontWeight: 700, fontSize: '1.05rem', marginTop: '0.5rem', boxShadow: '0 1px 4px #2a5d8a11', transition: 'background 0.2s', cursor: 'pointer' }} onClick={() => setShowFormEspecie(false)}>Cancelar</button>
            </form>
          </div>
          <style>{`
            @keyframes fadeInBg { from { opacity: 0; } to { opacity: 1; } }
            @keyframes fadeInModal { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          `}</style>
        </div>
      )}

      {/* Modal para crear vacuna */}
      {showFormVacuna && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30, 60, 90, 0.35)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', animation: 'fadeInBg 0.3s' }}>
          <div style={{ background: 'linear-gradient(135deg, #f4f8fb 80%, #e3eaf3 100%)', padding: '3rem 2.2rem 2.5rem 2.2rem', borderRadius: '18px', boxShadow: '0 8px 32px #2a5d8a44', minWidth: 440, maxWidth: 520, position: 'relative', animation: 'fadeInModal 0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button aria-label="Cerrar" onClick={() => setShowFormVacuna(false)} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: '1.5rem', color: '#2a5d8a', cursor: 'pointer', fontWeight: 700 }}>&times;</button>
            <h2 style={{ marginBottom: '1.5rem', color: '#2a5d8a', textAlign: 'center', fontWeight: 700, fontSize: '1.35rem', letterSpacing: '0.5px' }}>Agregar Nueva Vacuna</h2>
            <form onSubmit={handleCreateLista} style={{ width: '100%', maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.7rem', alignItems: 'center' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  <label style={{ fontWeight: 600, color: '#2a5d8a' }}>Nombre</label>
                  <input type="text" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} style={{ padding: '0.9rem', borderRadius: '7px', border: '1px solid #bcd', fontSize: '1.05rem', width: '100%' }} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  <label style={{ fontWeight: 600, color: '#2a5d8a' }}>Descripción</label>
                  <input type="text" value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} style={{ padding: '0.9rem', borderRadius: '7px', border: '1px solid #bcd', fontSize: '1.05rem', width: '100%' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  <label style={{ fontWeight: 600, color: '#2a5d8a' }}>Frecuencia</label>
                  <input type="text" value={formData.frecuencia} onChange={e => setFormData({ ...formData, frecuencia: e.target.value })} style={{ padding: '0.9rem', borderRadius: '7px', border: '1px solid #bcd', fontSize: '1.05rem', width: '100%' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  <label style={{ fontWeight: 600, color: '#2a5d8a' }}>Dosis</label>
                  <input type="text" value={formData.dosis} onChange={e => setFormData({ ...formData, dosis: e.target.value })} style={{ padding: '0.9rem', borderRadius: '7px', border: '1px solid #bcd', fontSize: '1.05rem', width: '100%' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  <label style={{ fontWeight: 600, color: '#2a5d8a' }}>Tipo</label>
                  <select value={formData.tipo} onChange={e => setFormData({ ...formData, tipo: e.target.value })} style={{ padding: '0.9rem', borderRadius: '7px', border: '1px solid #bcd', fontSize: '1.05rem', width: '100%' }}>
                    <option value="">Selecciona tipo</option>
                    <option value="preventiva">Preventiva</option>
                    <option value="refuerzo">Refuerzo</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  <label style={{ fontWeight: 600, color: '#2a5d8a' }}>Precio</label>
                  <input type="number" value={formData.precio} onChange={e => setFormData({ ...formData, precio: e.target.value })} style={{ padding: '0.9rem', borderRadius: '7px', border: '1px solid #bcd', fontSize: '1.05rem', width: '100%' }} min="0" />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', width: '100%', marginTop: '0.5rem', marginBottom: '0.5rem', justifyContent: 'flex-start' }}>
                <label style={{ fontWeight: 600, color: '#2a5d8a' }}>Obligatoria</label>
                <input type="checkbox" checked={formData.obligatoria} onChange={e => setFormData({ ...formData, obligatoria: e.target.checked })} style={{ width: '22px', height: '22px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', width: '100%', justifyContent: 'center', marginTop: '1.7rem' }}>
                <button type="submit" style={{ background: 'linear-gradient(90deg, #2a5d8a 60%, #4a8ad4 100%)', color: 'white', border: 'none', borderRadius: '8px', padding: '1rem 2rem', fontWeight: 700, fontSize: '1.08rem', boxShadow: '0 2px 8px #2a5d8a22', transition: 'background 0.2s', cursor: 'pointer' }}>Guardar Vacuna</button>
                <button type="button" style={{ background: '#e3eaf3', color: '#2a5d8a', border: 'none', borderRadius: '8px', padding: '1rem 2rem', fontWeight: 700, fontSize: '1.08rem', boxShadow: '0 1px 4px #2a5d8a11', transition: 'background 0.2s', cursor: 'pointer' }} onClick={() => setShowFormVacuna(false)}>Cancelar</button>
              </div>
            </form>
          </div>
          <style>{`
            @keyframes fadeInBg { from { opacity: 0; } to { opacity: 1; } }
            @keyframes fadeInModal { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          `}</style>
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', minHeight: '200px', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        {especies.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', fontSize: '1.2rem', marginTop: '2rem' }}>
            <span>🛈</span>
            <p>No hay especies registradas.</p>
          </div>
        ) : (
          especies.map(especie => {
            const listasEspecie = listas.filter(lista => lista.especie === especie.id);
            return (
              <div key={especie.id} style={{ width: '100%', background: '#f4f8fb', border: '1px solid #bcd', borderRadius: '12px', boxShadow: '0 2px 8px #0001', padding: '1.2rem', marginBottom: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 style={{ color: '#2a5d8a', margin: 0 }}>{especie.nombre}</h2>
                  <button style={{ background: '#2a5d8a', color: 'white', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 600 }} onClick={() => { setShowFormVacuna(true); setFormData({ ...formData, especie: especie.id.toString() }); }}>Agregar vacuna</button>
                </div>
                {listasEspecie.length === 0 ? (
                  <div style={{ color: '#888', fontStyle: 'italic', marginBottom: '1rem' }}>
                    No hay listas de vacunas para esta especie.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', width: '100%' }}>
                    {listasEspecie.map(lista => (
                      <div key={lista.id} style={{ border: '1px solid #aaa', borderRadius: '8px', padding: '0.7rem', background: '#fff', position: 'relative', width: '100%', marginBottom: '0.2rem' }}>
                        <h3 style={{ margin: '0 0 0.5rem 0' }}>{lista.nombre}</h3>
                        <p><b>Descripción:</b> {lista.descripcion}</p>
                        <p><b>Frecuencia:</b> {lista.frecuencia}</p>
                        <p><b>Dosis:</b> {lista.dosis}</p>
                        <p><b>Obligatoria:</b> {lista.obligatoria ? 'Sí' : 'No'}</p>
                        <p><b>Tipo:</b> {lista.tipo}</p>
                        <p><b>Precio:</b> ${lista.precio}</p>
                        <button style={{ marginTop: '0.5rem' }} onClick={() => setDetalleId(lista.id)}>Ver lista de vacunas</button>
                        {detalleId === lista.id && (
                          <div style={{ position: 'absolute', top: 0, left: '105%', width: '400px', zIndex: 10 }}>
                            <ListaVacunasDetalle listaId={lista.id} onClose={() => setDetalleId(null)} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GestionVacunasEspecies;
