import React, { useEffect, useState } from 'react';

interface Animal {
  id: number;
  nombre: string;
  // Agrega más campos según tu modelo
}

const GestionarAnimalesRefugio: React.FC = () => {
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/animales/refugio')
      .then(res => res.json())
      .then((data: Animal[]) => {
        setAnimales(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar animales');
        setLoading(false);
      });
  }, []);

  const handleEliminar = (id: number) => {
    if (!window.confirm('¿Seguro que quieres eliminar este animal del sistema?')) return;
    fetch(`/api/animales/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          setAnimales(animales.filter(a => a.id !== id));
        } else {
          alert('Error al eliminar');
        }
      });
  };

  if (loading) return <div>Cargando animales...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="gestion-animales-refugio">
      <h2>Animales del Refugio</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {animales.map(animal => (
            <tr key={animal.id}>
              <td>{animal.id}</td>
              <td>{animal.nombre}</td>
              <td>
                <button onClick={() => handleEliminar(animal.id)}>Eliminar</button>
                {/* Puedes agregar editar, ver detalles, etc. */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GestionarAnimalesRefugio;
