import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { vacunasPorEspecie } from '../MisAnimales/components/FichaMedica/Utils/vacunasEspecies';

export interface HistorialItem {
  fecha: string;
  descripcion: string;
}

export interface Animal {
  id: number;
  nombre: string;
  especie: string;
  edad?: string;
  estado_salud?: string;
  historial: HistorialItem[];
  foto_url?: string;
}

interface Props {
  animal: Animal;
  onClose: () => void;
}

const EstructuraPDF: React.FC<Props> = ({ animal, onClose }) => {
    const [editHistorial] = useState(animal.historial || []);
  const [editNombre, setEditNombre] = useState(animal.nombre);
  const [editEdad, setEditEdad] = useState(animal.edad || '');

  // Vacunas aplicadas y pendientes
  const vacunasAplicadas: string[] = editHistorial.filter(h => h.descripcion.startsWith('Vacuna: ')).map(h => h.descripcion.replace('Vacuna: ', ''));
  const obligatorias: string[] = (vacunasPorEspecie[animal.especie] || []).filter((v: any) => v.obligatoria).map((v: any) => v.nombre);
  const vacunasPendientes: string[] = obligatorias.filter((vac: string) => !vacunasAplicadas.includes(vac));

  const handleDescargarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Ficha Médica de ${editNombre}`, 15, 20);
    doc.setFontSize(12);
    doc.text(`Especie: ${animal.especie}`, 15, 30);
    doc.text(`Edad: ${editEdad}`, 15, 37);
    doc.text(`Vacunas aplicadas: ${vacunasAplicadas.length}`, 15, 44);
    doc.text('Vacunas pendientes:', 15, 51);
    if (vacunasPendientes.length > 0) {
      vacunasPendientes.forEach((vac, idx) => {
        doc.text(`- ${vac}`, 20, 58 + idx * 7);
      });
    } else {
      doc.text('Ninguna', 20, 58);
    }
    if (editHistorial.length > 0) {
      // @ts-ignore
      doc.autoTable({
        startY: 65,
        head: [["Fecha", "Descripción"]],
        body: editHistorial.map(item => [item.fecha, item.descripcion]),
        theme: "grid",
        styles: { fontSize: 11 },
      });
    } else {
      doc.text("No hay historial médico disponible.", 15, 70);
    }
    doc.save(`FichaMedica_${editNombre}.pdf`);
  };

  const handleImprimir = () => {
    handleDescargarPDF();
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content" style={{ background: '#fff', borderRadius: 10, padding: '2rem', position: 'relative', minWidth: 350, maxWidth: 600, width: '90vw', boxShadow: '0 2px 16px rgba(0,0,0,0.15)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 10, fontSize: 22, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        <h2 style={{ marginBottom: '1rem' }}>Previsualización PDF: {editNombre}</h2>
        <div style={{ minHeight: 200, marginBottom: '2rem', background: '#f7fbfc', borderRadius: 8, padding: '1rem', overflowY: 'auto' }}>
          <label><strong>Nombre:</strong> <input value={editNombre} onChange={e => setEditNombre(e.target.value)} style={{ marginLeft: 8 }} /></label>
          <br />
          <label><strong>Edad:</strong> <input value={editEdad} onChange={e => setEditEdad(e.target.value)} style={{ marginLeft: 8 }} /></label>
          <br />
          {/* Estado de salud removido de la previsualización */}
          <p><strong>Vacunas aplicadas:</strong> {vacunasAplicadas.length}</p>
          <p><strong>Vacunas pendientes:</strong></p>
          <ul>
            {vacunasPendientes.length > 0 ? vacunasPendientes.map((vac, idx) => (
              <li key={idx}>{vac}</li>
            )) : <li>Ninguna</li>}
          </ul>
          <ul style={{ marginTop: '1rem' }}>
            {editHistorial.map((item, idx) => (
              <li key={idx}><strong>{item.fecha}:</strong> {item.descripcion}</li>
            ))}
          </ul>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button onClick={handleDescargarPDF} style={{ background: '#2980b9', color: '#fff', border: 'none', borderRadius: 5, padding: '0.5rem 1.2rem', fontWeight: 500, cursor: 'pointer' }}>Descargar PDF</button>
          <button onClick={handleImprimir} style={{ background: '#2980b9', color: '#fff', border: 'none', borderRadius: 5, padding: '0.5rem 1.2rem', fontWeight: 500, cursor: 'pointer' }}>Imprimir</button>
        </div>
      </div>
    </div>
  );
};

export default EstructuraPDF;
