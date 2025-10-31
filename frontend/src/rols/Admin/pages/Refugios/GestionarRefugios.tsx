import React, { useState } from 'react';

const GestionarRefugios: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [nuevoRefugio, setNuevoRefugio] = useState({
    nombre: '',
    direccion: '',
    correo_contacto: '',
    telefono: '',
    descripcion: '',
    comuna: '',
    region: '',
  });

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNuevoRefugio({ ...nuevoRefugio, [e.target.name]: e.target.value });
  };

  const handleCrearRefugio = async () => {
    // Aquí iría la llamada a la API para crear refugio
    alert('Refugio creado (simulado)');
    setModalOpen(false);
    setNuevoRefugio({
      nombre: '', direccion: '', correo_contacto: '', telefono: '', descripcion: '', comuna: '', region: ''
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Gestionar Refugios</h1>
      <p>Aquí podrás ver, editar y eliminar refugios del sistema.</p>
      <button style={{ margin: '16px 0', padding: '8px 16px' }} onClick={handleOpenModal}>
        Crear Refugio
      </button>

      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 320 }}>
            <h2>Crear Refugio</h2>
            <label>Nombre:<br />
              <input name="nombre" value={nuevoRefugio.nombre} onChange={handleChange} />
            </label><br />
            <label>Dirección:<br />
              <input name="direccion" value={nuevoRefugio.direccion} onChange={handleChange} />
            </label><br />
            <label>Correo de contacto:<br />
              <input name="correo_contacto" value={nuevoRefugio.correo_contacto} onChange={handleChange} />
            </label><br />
            <label>Teléfono:<br />
              <input name="telefono" value={nuevoRefugio.telefono} onChange={handleChange} />
            </label><br />
            <label>Descripción:<br />
              <textarea name="descripcion" value={nuevoRefugio.descripcion} onChange={handleChange} />
            </label><br />
            <label>Comuna:<br />
              <input name="comuna" value={nuevoRefugio.comuna} onChange={handleChange} />
            </label><br />
            <label>Región:<br />
              <input name="region" value={nuevoRefugio.region} onChange={handleChange} />
            </label><br />
            <div style={{ marginTop: 16 }}>
              <button onClick={handleCrearRefugio} style={{ marginRight: 8 }}>Crear</button>
              <button onClick={handleCloseModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionarRefugios;
