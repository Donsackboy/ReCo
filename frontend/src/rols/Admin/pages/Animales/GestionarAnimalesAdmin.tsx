import React, { useEffect, useState } from 'react';
import EditarAnimalModal from './EditarAnimalModal';
import CrearAnimalModal from './CrearAnimalModal';

interface Refugio {
  id: number;
  nombre: string;
}

interface Vacuna {
  tipo: string;
  fecha: string;
  refuerzo?: string;
  unica?: boolean;
}

interface Animal {
  id?: number;
  nombre: string;
  especie: string;
  edad: string;
  sexo: string;
  refugio: number;
  refugio_nombre?: string;
  imagenes?: string[];
  resena?: string;
  esterilizado?: boolean;
  desparasitado?: boolean;
  salud?: string;
  vacunas?: Vacuna[];
}

const GestionarAnimalesAdmin: React.FC = () => {
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [refugios, setRefugios] = useState<Refugio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Animal>({ nombre: '', especie: '', edad: '', sexo: '', refugio: 0, imagenes: [], resena: '', esterilizado: false, desparasitado: false, salud: '', vacunas: [] });
  const [editId, setEditId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    Promise.all([
      fetch(import.meta.env.VITE_API_BASE + '/animales/', { headers: { 'Authorization': `Token ${token}` } }).then(res => res.json()),
      fetch(import.meta.env.VITE_API_BASE + '/public/refugios/').then(res => res.json())
    ]).then(([animalesData, refugiosData]) => {
      setAnimales(animalesData);
      setRefugios(refugiosData);
      setLoading(false);
    }).catch(() => {
      setError('Error al cargar datos');
      setLoading(false);
    });
  }, []);

  const handleEliminar = (id: number) => {
    if (!window.confirm('¿Seguro que quieres eliminar este animal?')) return;
    const token = localStorage.getItem('token');
  fetch(import.meta.env.VITE_API_BASE + `/animales/${id}/`, { method: 'DELETE', headers: { 'Authorization': `Token ${token}` } })
      .then(res => {
        if (res.ok) {
          setAnimales(animales.filter(a => a.id !== id));
        } else {
          alert('Error al eliminar');
        }
      });
  };

  const handleEdit = (animal: Animal) => {
    // Asegura que los campos estén inicializados correctamente
    setForm({
      nombre: animal.nombre || '',
      especie: animal.especie || '',
      edad: animal.edad || '',
      sexo: animal.sexo || '',
      refugio: animal.refugio || 0,
      imagenes: animal.imagenes ? [...animal.imagenes] : [],
      resena: animal.resena || '',
      esterilizado: !!animal.esterilizado,
      desparasitado: !!animal.desparasitado,
      salud: animal.salud || '',
      vacunas: animal.vacunas ? [...animal.vacunas] : [],
    });
    setEditId(animal.id!);
    setEditModalOpen(true);
  };

  if (loading) return <div>Cargando animales...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="gestion-animales-admin" style={{ padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ color: '#43a047', fontWeight: 800, fontSize: 32 }}>Gestionar Animales</h2>
        <button onClick={() => { setModalOpen(true); setEditId(null); setForm({ nombre: '', especie: '', edad: '', sexo: '', refugio: 0 }); }} style={{ background: '#7b1fa2', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '12px 28px', fontSize: 17, cursor: 'pointer' }}>
          <span style={{ fontSize: 20, marginRight: 8 }}>➕</span> Crear animal
        </button>
      </div>
      <div className="lista-animales-admin" style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px #43a04722' }}>
        <h2 style={{ color: '#43a047', marginBottom: 12 }}>
          Animales registrados <span style={{ color: '#228B22', fontWeight: 700, fontSize: '1.1em' }}>({animales.length})</span>
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#eaffea' }}>
              <th style={{ padding: 10, borderBottom: '1px solid #bdbdbd' }}>Nombre</th>
              <th style={{ padding: 10, borderBottom: '1px solid #bdbdbd' }}>Especie</th>
              <th style={{ padding: 10, borderBottom: '1px solid #bdbdbd' }}>Edad</th>
              <th style={{ padding: 10, borderBottom: '1px solid #bdbdbd' }}>Sexo</th>
              <th style={{ padding: 10, borderBottom: '1px solid #bdbdbd' }}>Refugio</th>
              <th style={{ padding: 10, borderBottom: '1px solid #bdbdbd' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {animales.map(animal => (
              <tr key={animal.id}>
                <td style={{ padding: 10 }}>{animal.nombre}</td>
                <td style={{ padding: 10 }}>{animal.especie}</td>
                <td style={{ padding: 10 }}>{animal.edad}</td>
                <td style={{ padding: 10 }}>{animal.sexo}</td>
                <td style={{ padding: 10 }}>{refugios.find(r => r.id === Number(animal.refugio))?.nombre || refugios.find(r => r.id === animal.refugio)?.nombre || animal.refugio}</td>
                <td style={{ padding: 10 }}>
                  <button className="btn-editar" style={{ marginRight: 8 }} onClick={() => handleEdit(animal)}>Editar</button>
                  <button className="btn-eliminar" onClick={() => handleEliminar(animal.id!)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para crear/editar animal */}
      {/* Modal para crear animal */}
      <CrearAnimalModal
        open={modalOpen && !editId}
        onClose={() => setModalOpen(false)}
        refugios={refugios}
        onCreate={(newAnimal) => {
          const token = localStorage.getItem('token');
          fetch(import.meta.env.VITE_API_BASE + '/animales/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
            body: JSON.stringify(newAnimal)
          })
            .then(res => res.json())
            .then(data => {
              setAnimales([...animales, data]);
              setModalOpen(false);
            });
        }}
      />
      {/* Modal para editar animal */}
      <EditarAnimalModal
        open={editModalOpen}
        onClose={() => { setEditModalOpen(false); setEditId(null); }}
        animal={form}
        refugios={refugios}
        onSave={(updatedAnimal) => {
          // Actualiza el animal editado en la lista
          const token = localStorage.getItem('token');
          fetch(import.meta.env.VITE_API_BASE + `/animales/${editId}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
            body: JSON.stringify(updatedAnimal)
          })
            .then(res => res.json())
            .then(data => {
              setAnimales(animales.map(a => a.id === editId ? data : a));
              setEditModalOpen(false);
              setEditId(null);
            });
        }}
      />
    </div>
  );
};

export default GestionarAnimalesAdmin;
