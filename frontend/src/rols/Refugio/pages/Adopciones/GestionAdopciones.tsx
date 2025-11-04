
import React, { useEffect, useState } from 'react';

const GestionAdopciones: React.FC = () => {
  const [adopciones, setAdopciones] = useState([]);
  const [loading, setLoading] = useState(true);
  // TODO: Reemplazar por llamada real a la API de adopciones
  useEffect(() => {
    // Simulación de carga de adopciones
    setTimeout(() => {
      setAdopciones([]); // Array vacío para simular bandeja vacía
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div>
      <h1>Adopciones</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : adopciones.length === 0 ? (
        <div style={{textAlign: 'center', marginTop: '2rem'}}>
          <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="Bandeja vacía" style={{width: '120px', opacity: 0.5}} />
          <h2 style={{color: '#888'}}>No se han recibido formularios de adopción</h2>
        </div>
      ) : (
        <div>
          {/* Aquí se mostraría la lista de adopciones */}
        </div>
      )}
    </div>
  );
};

export default GestionAdopciones;
