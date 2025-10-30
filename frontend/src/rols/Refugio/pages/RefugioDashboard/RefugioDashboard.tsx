import React, { useState, useEffect } from 'react';
import CrearRefugioForm from '../../components/CrearRefugioForm/CrearRefugioForm';
import GestionRefugioMenu from '../../components/GestionRefugioMenu/GestionRefugioMenu';
import './RefugioDashboard.css';

const RefugioDashboard: React.FC = () => {
  // Simulación: Comprueba si el usuario refugio ya tiene un refugio asociado.
  // En una aplicación real, esto vendría del estado global o una llamada a la API.
  const [tieneRefugio, setTieneRefugio] = useState(false); // Cambia a true para ver el menú de gestión
  const [nombreRefugio, setNombreRefugio] = useState<string | null>(null); // Nombre del refugio si existe

  // Simulación de carga de datos del refugio del usuario
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    // Aquí comprobarías si user.refugio_id existe o harías una llamada API
    // Por ahora, simulamos que después de 1 segundo, el refugio ya existe.
    // Cambia `false` a `true` en la línea de useState si quieres empezar viendo el menú.
    // const timer = setTimeout(() => {
    //   if (user && user.tipo_usuario === 'refugio') { // Asegúrate que sea usuario refugio
    //      // Simulamos que SÍ tiene refugio después de cargar
    //      setTieneRefugio(true);
    //      setNombreRefugio("Refugio Ejemplo"); // Simula el nombre
    //   }
    // }, 1000);
    // return () => clearTimeout(timer);

    // Para probar directamente el formulario, manten `tieneRefugio` en false
    // Para probar directamente el menú, cambia `tieneRefugio` a true en useState
     if (tieneRefugio) {
       setNombreRefugio("Nombre Refugio Ejemplo"); // Simula un nombre si tiene refugio
     }

  }, [tieneRefugio]); // Depende de tieneRefugio para actualizar nombre ejemplo


  const handleRefugioCreado = (nombre: string) => {
    // Esta función se llamaría cuando el formulario de creación sea exitoso
    setNombreRefugio(nombre);
    setTieneRefugio(true);
    alert(`Refugio "${nombre}" creado (simulación). Ahora verás el menú de gestión.`);
  };

  return (
    <div className="refugio-dashboard-container">
      {!tieneRefugio ? (
        <CrearRefugioForm onRefugioCreado={handleRefugioCreado} />
      ) : (
        <GestionRefugioMenu nombreRefugio={nombreRefugio || "Mi Refugio"} />
      )}
    </div>
  );
};

export default RefugioDashboard;