import React, { useState, useEffect } from 'react';
// @ts-ignore
import { getAnimales, getFichaMedica, getVacunas, getCirugias, getTratamientos } from '../../../../api.js';
// @ts-ignore
import jsPDF from 'jspdf';

// Tipos
interface HistorialItem {
  fecha: string;
  descripcion: string;
}

interface Animal {
  id: number;
  nombre: string;
  especie: string;
  historial: HistorialItem[];
}

interface AnimalAPI {
  id: number;
  nombre: string;
  especie: string;
}



const getToken = () => localStorage.getItem('token');


const descargarPDF = (animal: Animal) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Historial Médico de ${animal.nombre} (${animal.especie})`, 10, 20);
  doc.setFontSize(12);
  let y = 30;
  animal.historial.forEach((item, idx) => {
    doc.text(`${item.fecha}: ${item.descripcion}`, 10, y + idx * 10);
  });
  doc.save(`Historial_${animal.nombre}.pdf`);
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
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimalesConHistorial = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error('No hay token de autenticación');
        const data: AnimalAPI[] = await getAnimales(token);
        const animalesConHistorial: Animal[] = await Promise.all(
          data.map(async (animal) => {
            const historial: HistorialItem[] = [];
            // Ficha médica
            try {
              const ficha = await getFichaMedica(token, animal.id);
              if (ficha && ficha.descripcion) {
                historial.push({ fecha: ficha.fecha || '', descripcion: `Ficha médica: ${ficha.descripcion}` });
              }
            } catch {}
            // Tipos
            interface HistorialItem {
              fecha: string;
              descripcion: string;
            }

            interface Animal {
              id: number;
              nombre: string;
              especie: string;
              historial: HistorialItem[];
            }

            interface AnimalAPI {
              id: number;
              nombre: string;
              especie: string;
            }
            // Tratamientos
            try {
              const tratamientos = await getTratamientos(token, animal.id);
              if (Array.isArray(tratamientos)) {
                tratamientos.forEach((t: any) => {
                  historial.push({ fecha: t.fecha || '', descripcion: `Tratamiento: ${t.descripcion}` });
                });
              }
            } catch {}
            return {
              id: animal.id,
              nombre: animal.nombre,
              especie: animal.especie,
              historial,
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
  }, []);

  return (
    <div>
      <h1>Historial Médico de Animales del Refugio</h1>
      {loading && <p>Cargando animales...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div>
        <h2>Selecciona un animal:</h2>
        <ul>
          {animales.map((animal: Animal) => (
            <li key={animal.id}>
              <button onClick={() => setSelectedAnimal(animal)}>
                {animal.nombre} ({animal.especie})
              </button>
            </li>
          ))}
        </ul>
      </div>
      {selectedAnimal && (
        <div style={{ marginTop: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
          <h2>Historial Médico de {selectedAnimal.nombre}</h2>
          <ul>
            {selectedAnimal.historial && selectedAnimal.historial.length > 0 ? (
              selectedAnimal.historial.map((item: HistorialItem, idx: number) => (
                <li key={idx}>
                  <strong>{item.fecha}:</strong> {item.descripcion}
                </li>
              ))
            ) : (
              <li>No hay historial médico disponible.</li>
            )}
          </ul>
          <button onClick={() => descargarPDF(selectedAnimal)} style={{ marginRight: '1rem' }}>
            Descargar PDF
          </button>
          <button onClick={() => imprimirHistorial(selectedAnimal)}>
            Imprimir
          </button>
        </div>
      )}
    </div>
  );
};

export default HistorialMedicoRefugio;
