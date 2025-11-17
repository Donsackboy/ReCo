import React, { useEffect, useState } from 'react';

interface Vacuna {
  id: number;
  nombre: string;
  descripcion: string;
  frecuencia: string;
  dosis: string;
  obligatoria: boolean;
  tipo: string;
  precio: number;
}

interface Props {
  listaId: number;
  onClose: () => void;
}

const ListaVacunasDetalle: React.FC<Props> = ({ listaId, onClose }) => {
  const [vacunas, setVacunas] = useState<Vacuna[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    frecuencia: '',
    dosis: '',
    obligatoria: false,
    tipo: '',
    precio: ''
  });

  useEffect(() => {
    fetch(`/api/animales/${listaId}/vacunas/`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setVacunas(data))
      .catch(() => setVacunas([]));
  }, [listaId]);

  const handleAddVacuna = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`/api/animales/${listaId}/vacunas/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        ...formData,
        obligatoria: Boolean(formData.obligatoria),
        precio: Number(formData.precio)
      })
    })
      .then(res => res.json())
      .then(nuevaVacuna => {
        setVacunas([...vacunas, nuevaVacuna]);
        setShowForm(false);
        setFormData({ nombre: '', descripcion: '', frecuencia: '', dosis: '', obligatoria: false, tipo: '', precio: '' });
      });
  };

  return (
    <div style={{ background: '#fff', border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', position: 'relative' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: 8, right: 8 }}>Cerrar</button>
      <h3>Vacunas asociadas</h3>
      <button onClick={() => setShowForm(true)} style={{ marginBottom: '1rem' }}>Agregar vacuna</button>
      {showForm && (
        <form onSubmit={handleAddVacuna} style={{ marginBottom: '2rem', border: '1px solid #eee', padding: '1rem', borderRadius: '8px' }}>
          <label>Nombre:<input name="nombre" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} required /></label>
          <label>Descripción:<input name="descripcion" value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} /></label>
          <label>Frecuencia:<input name="frecuencia" value={formData.frecuencia} onChange={e => setFormData({ ...formData, frecuencia: e.target.value })} /></label>
          <label>Dosis:<input name="dosis" value={formData.dosis} onChange={e => setFormData({ ...formData, dosis: e.target.value })} /></label>
          <label>Obligatoria:<input type="checkbox" checked={formData.obligatoria} onChange={e => setFormData({ ...formData, obligatoria: e.target.checked })} /></label>
          <label>Tipo:<select name="tipo" value={formData.tipo} onChange={e => setFormData({ ...formData, tipo: e.target.value })} required><option value="">Selecciona tipo</option><option value="única">Única</option><option value="refuerzo">Refuerzo</option></select></label>
          <label>Precio:<input name="precio" type="number" value={formData.precio} onChange={e => setFormData({ ...formData, precio: e.target.value })} /></label>
          <button type="submit">Agregar</button>
          <button type="button" onClick={() => setShowForm(false)} style={{ marginLeft: '1rem' }}>Cancelar</button>
        </form>
      )}
      <ul>
        {vacunas.map(vacuna => (
          <li key={vacuna.id} style={{ marginBottom: '0.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
            <b>{vacuna.nombre}</b> - {vacuna.descripcion} | Frecuencia: {vacuna.frecuencia} | Dosis: {vacuna.dosis} | Tipo: {vacuna.tipo} | Precio: ${vacuna.precio} | Obligatoria: {vacuna.obligatoria ? 'Sí' : 'No'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaVacunasDetalle;
