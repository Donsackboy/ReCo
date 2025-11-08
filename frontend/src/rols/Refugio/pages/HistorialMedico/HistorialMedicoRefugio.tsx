import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './HistorialMedicoRefugio.css';
// @ts-ignore
import { getAnimales, getFichaMedica, getVacunas, getCirugias, getTratamientos } from '../../../../api.js';
// @ts-ignore
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Tipos
interface HistorialItem {
  fecha: string;
  descripcion: string;
}

interface Animal {
  id: number;
  nombre: string;
  especie: string;
  edad?: string;
  estado_salud?: string;
  historial: HistorialItem[];
  tieneVacuna?: boolean;
  tieneEsterilizacion?: boolean;
  tieneDesparasitacion?: boolean;
  foto_url?: string;
}

import { vacunasPorEspecie } from '../MisAnimales/components/FichaMedica/Utils/vacunasEspecies';
import EstructuraPDF from './EstructuraPDF';





const getToken = () => localStorage.getItem('token');


const descargarPDF = (animal: Animal) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(`Ficha Médica de ${animal.nombre}`, 15, 20);
  doc.setFontSize(12);
  doc.text(`Especie: ${animal.especie}`, 15, 30);
  // Historial en tabla
  if (animal.historial && animal.historial.length > 0) {
    doc.autoTable({
      startY: 40,
      head: [["Fecha", "Descripción"]],
      body: animal.historial.map((item) => [item.fecha, item.descripcion]),
      theme: "grid",
      styles: { fontSize: 11 },
    });
  } else {
    doc.text("No hay historial médico disponible.", 15, 45);
  }
  doc.save(`FichaMedica_${animal.nombre}.pdf`);
};


const imprimirHistorial = (animal: Animal) => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write('<html><head><title>Imprimir Historial Médico</title></head><body>');
    printWindow.document.write(`<h2>Historial Médico de ${animal.nombre} (${animal.especie})</h2>`);
    printWindow.document.write('<ul>');
    animal.historial.forEach((item) => {
      printWindow.document.write(`<li><strong>${item.fecha}:</strong> ${item.descripcion}</li>`);
    });
    printWindow.document.write('</ul>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  }
};


const HistorialMedicoRefugio: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const idParam = params.get('id');
  const previewParam = params.get('preview');
  // Estados principales
  const [modalAnimal, setModalAnimal] = useState<Animal | null>(null);
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Filtros aplicados
  const [filtroVacuna, setFiltroVacuna] = useState('');
  const [filtroVacunaSelect, setFiltroVacunaSelect] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroEsterilizacion, setFiltroEsterilizacion] = useState(false);
  const [filtroDesparasitacion, setFiltroDesparasitacion] = useState(false);
  // Inputs temporales
  const [filtroVacunaInput, setFiltroVacunaInput] = useState('');
  const [filtroVacunaSelectInput, setFiltroVacunaSelectInput] = useState('');
  const [filtroNombreInput, setFiltroNombreInput] = useState('');
  const [filtroEsterilizacionInput, setFiltroEsterilizacionInput] = useState(false);
  const [filtroDesparasitacionInput, setFiltroDesparasitacionInput] = useState(false);
  // Botón aplicar filtros
  const handleAplicarFiltros = () => {
    setFiltroVacuna(filtroVacunaInput);
    setFiltroVacunaSelect(filtroVacunaSelectInput);
    setFiltroNombre(filtroNombreInput);
    setFiltroEsterilizacion(filtroEsterilizacionInput);
    setFiltroDesparasitacion(filtroDesparasitacionInput);
  };
  // Modal de detalle
  const handleVerDetalles = (animal: Animal) => {
    setModalAnimal(animal);
  } 

  // Abrir modal automáticamente si hay id y preview=true
  useEffect(() => {
    if (idParam && previewParam === 'true' && animales.length > 0) {
      const found = animales.find(a => String(a.id) === String(idParam));
      if (found) setModalAnimal(found);
    }
  }, [idParam, previewParam, animales]);
  // ...estados y lógica principal...
  // Modal de detalle


  // Vacunas disponibles para select
  const vacunasDisponibles = Array.from(new Set(
    animales.flatMap(a => a.historial.filter(h => h.descripcion.startsWith('Vacuna: ')).map(h => h.descripcion.replace('Vacuna: ', '')))
  ));

  // Log de depuración para ver animales cargados
  useEffect(() => {
    if (!loading) {
      console.log('Animales cargados:', animales);
    }
  }, [animales, loading]);

  useEffect(() => {
    const fetchAnimalesConHistorial = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error('No hay token de autenticación');
        const data: any[] = await getAnimales(token);
        console.log('Respuesta cruda de getAnimales:', data);
        // Filtrar animales con id_animal válido
        const animalesValidos = data.filter(animal => typeof animal.id_animal === 'number' && !isNaN(animal.id_animal));
        const animalesConHistorial: Animal[] = await Promise.all(
          animalesValidos.map(async (animal) => {
            const historial: HistorialItem[] = [];
            // Ficha médica
            try {
              const ficha = await getFichaMedica(token, animal.id_animal);
              if (ficha && ficha.descripcion) {
                historial.push({ fecha: ficha.fecha || '', descripcion: `Ficha médica: ${ficha.descripcion}` });
              }
            } catch {}
            // Vacunas
            let tieneVacuna = false;
            try {
              const vacunas = await getVacunas(token, animal.id_animal);
              if (Array.isArray(vacunas)) {
                vacunas.forEach((v: any) => {
                  historial.push({ fecha: v.fecha || '', descripcion: `Vacuna: ${v.nombre}` });
                  if (filtroVacuna && v.nombre && v.nombre.toLowerCase().includes(filtroVacuna.toLowerCase())) {
                    tieneVacuna = true;
                  }
                });
              }
            } catch {}
            // Cirugías (esterilización)
            let tieneEsterilizacion = false;
            try {
              const cirugias = await getCirugias(token, animal.id_animal);
              if (Array.isArray(cirugias)) {
                cirugias.forEach((c: any) => {
                  historial.push({ fecha: c.fecha || '', descripcion: `Cirugía: ${c.descripcion}` });
                  if (c.descripcion && c.descripcion.toLowerCase().includes('esterilización')) {
                    tieneEsterilizacion = true;
                  }
                });
              }
            } catch {}
            // Tratamientos (desparasitación)
            let tieneDesparasitacion = false;
            try {
              const tratamientos = await getTratamientos(token, animal.id_animal);
              if (Array.isArray(tratamientos)) {
                tratamientos.forEach((t: any) => {
                  historial.push({ fecha: t.fecha || '', descripcion: `Tratamiento: ${t.descripcion}` });
                  if (t.descripcion && t.descripcion.toLowerCase().includes('desparasit')) {
                    tieneDesparasitacion = true;
                  }
                });
              }
            } catch {}
            return {
              id: animal.id_animal,
              nombre: animal.nombre || animal.nombre_animal,
              especie: animal.especie,
              edad: animal.edad,
              estado_salud: animal.estado_salud || animal.estado,
              foto_url: animal.foto_url || (animal.fotos && animal.fotos.length > 0 ? animal.fotos[0] : undefined),
              historial,
              tieneVacuna,
              tieneEsterilizacion,
              tieneDesparasitacion,
            };
          })
        );
        setAnimales(animalesConHistorial);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimalesConHistorial();
    // eslint-disable-next-line
  }, [filtroVacuna, filtroEsterilizacion, filtroDesparasitacion]);

  // Filtrar animales según los filtros seleccionados
  const filtrosActivos = Boolean(
    filtroVacuna || filtroVacunaSelect || filtroNombre || filtroEsterilizacion || filtroDesparasitacion
  );
  let animalesFiltrados = animales;
  if (filtrosActivos) {
    animalesFiltrados = animales.filter(animal => {
      // Filtrar por nombre
      if (filtroNombre && !animal.nombre.toLowerCase().includes(filtroNombre.toLowerCase())) return false;
      // Filtrar por vacuna escrita: mostrar solo animales que NO tienen esa vacuna
      if (filtroVacuna && animal.tieneVacuna) return false;
      if (filtroVacuna && !animal.tieneVacuna) return true;
      // Filtrar por vacuna seleccionada: mostrar solo animales que NO tienen esa vacuna
      if (filtroVacunaSelect && animal.historial.some(h => h.descripcion === `Vacuna: ${filtroVacunaSelect}`)) return false;
      if (filtroVacunaSelect && !animal.historial.some(h => h.descripcion === `Vacuna: ${filtroVacunaSelect}`)) return true;
      // Filtrar por esterilización: mostrar solo animales que NO están esterilizados
      if (filtroEsterilizacion && animal.tieneEsterilizacion) return false;
      if (filtroEsterilizacion && !animal.tieneEsterilizacion) return true;
      // Filtrar por desparasitación: mostrar solo animales que NO están desparasitados
      if (filtroDesparasitacion && animal.tieneDesparasitacion) return false;
      if (filtroDesparasitacion && !animal.tieneDesparasitacion) return true;
      // Si no hay filtros activos, mostrar todos
      return false;
    });
  }

  return (
    <div className="historial-container">
      <h1 className="historial-header">Historial Médico de Animales del Refugio</h1>
      {loading && <p className="loading-message">Cargando animales...</p>}
      {error && <p className="error-message">Error: {error}</p>}
      <div style={{ marginBottom: '2rem' }}>
        <h2>Filtrar animales que NO tienen:</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Vacuna (ej: antirrábica)"
            value={filtroVacunaInput}
            onChange={e => setFiltroVacunaInput(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #b2d7ef' }}
          />
          <select
            value={filtroVacunaSelectInput}
            onChange={e => setFiltroVacunaSelectInput(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #b2d7ef' }}
          >
            <option value="">Seleccionar vacuna</option>
            {vacunasDisponibles.map(vacuna => (
              <option key={vacuna} value={vacuna}>{vacuna}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Filtrar por nombre de animal"
            value={filtroNombreInput}
            onChange={e => setFiltroNombreInput(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #b2d7ef' }}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={filtroEsterilizacionInput}
              onChange={e => setFiltroEsterilizacionInput(e.target.checked)}
            />
            Esterilización
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={filtroDesparasitacionInput}
              onChange={e => setFiltroDesparasitacionInput(e.target.checked)}
            />
            Desparasitaciones
          </label>
          <button onClick={handleAplicarFiltros} style={{ padding: '0.5rem 1rem', borderRadius: '5px', background: '#4caf50', color: 'white', border: 'none', fontWeight: 'bold' }}>
            Aplicar filtros
          </button>
        </div>
      </div>
      <div className="fichas-column">
        {animalesFiltrados.length === 0 ? (
          <p>No se encontraron animales con los filtros seleccionados.</p>
        ) : (
          animalesFiltrados.map((animal: Animal, idx: number) => {
            // Vacunas aplicadas
            const vacunasAplicadas: string[] = animal.historial.filter((h: HistorialItem) => h.descripcion.startsWith('Vacuna: ')).map((h: HistorialItem) => h.descripcion.replace('Vacuna: ', ''));
            // Vacunas obligatorias por especie
            const obligatorias: string[] = (vacunasPorEspecie[animal.especie] || []).filter((v: any) => v.obligatoria).map((v: any) => v.nombre);
            // Vacunas pendientes
            const vacunasPendientes: string[] = obligatorias.filter((vac: string) => !vacunasAplicadas.includes(vac));
            return (
              <div key={animal.id ?? idx} className="ficha-tarjeta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <h3>{animal.nombre}</h3>
                  <p><strong>Edad:</strong> {animal.edad || 'No disponible'}</p>
                  <p><strong>Estado de Salud:</strong> {animal.estado_salud || 'No disponible'}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                  <img src={animal.foto_url || '/default-animal.png'} alt={animal.nombre} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 10, marginBottom: '1rem' }} />
                  <button style={{ alignSelf: 'flex-end' }} onClick={() => handleVerDetalles(animal)}>
                    Ver detalles
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de previsualización PDF editable */}
      {modalAnimal && (
        <EstructuraPDF animal={modalAnimal} onClose={() => setModalAnimal(null)} />
      )}
    </div>
  );
};

export default HistorialMedicoRefugio;
