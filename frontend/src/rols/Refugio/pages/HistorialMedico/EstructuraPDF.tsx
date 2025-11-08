import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { vacunasPorEspecie } from '../MisAnimales/components/FichaMedica/Utils/vacunasEspecies';

export interface HistorialItem {
  fecha: string;
  descripcion: string;
}

export interface Animal {
  id: number;
  id_animal?: number;
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
  // Vacunas aplicadas y pendientes
  const vacunasAplicadas: string[] = animal.historial.filter(h => h.descripcion.startsWith('Vacuna: ')).map(h => h.descripcion.replace('Vacuna: ', ''));
  const obligatorias: string[] = (vacunasPorEspecie[animal.especie] || []).filter((v: any) => v.obligatoria).map((v: any) => v.nombre);
  const vacunasPendientes: string[] = obligatorias.filter((vac: string) => !vacunasAplicadas.includes(vac));


  const handleDescargarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Ficha Médica de ${animal.nombre}`, 15, 20);
    doc.setFontSize(12);
    doc.text(`Especie: ${animal.especie}`, 15, 30);
    doc.text(`Edad: ${animal.edad || ''}`, 15, 37);
    doc.text(`Estado de Salud: ${animal.estado_salud || ''}`, 15, 44);
    doc.text(`Vacunas aplicadas: ${vacunasAplicadas.length}`, 15, 51);
    doc.text(`Vacunas pendientes: ${vacunasPendientes.length > 0 ? vacunasPendientes.join(', ') : 'Ninguna'}`, 15, 58);
    if (animal.historial.length > 0) {
      // @ts-ignore
      doc.autoTable({
        startY: 65,
        head: [["Fecha", "Descripción"]],
        body: animal.historial.map(item => [item.fecha, item.descripcion]),
        theme: "grid",
        styles: { fontSize: 11 },
      });
    } else {
      doc.text("No hay historial médico disponible.", 15, 70);
    }
    doc.save(`FichaMedica_${animal.nombre}.pdf`);
  };

  const handleImprimir = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Ficha Médica de ${animal.nombre}`, 15, 20);
    doc.setFontSize(12);
    doc.text(`Especie: ${animal.especie}`, 15, 30);
    doc.text(`Edad: ${animal.edad || ''}`, 15, 37);
    doc.text(`Estado de Salud: ${animal.estado_salud || ''}`, 15, 44);
    doc.text(`Vacunas aplicadas: ${vacunasAplicadas.length}`, 15, 51);
    doc.text(`Vacunas pendientes: ${vacunasPendientes.length > 0 ? vacunasPendientes.join(', ') : 'Ninguna'}`, 15, 58);
    if (animal.historial.length > 0) {
      // @ts-ignore
      doc.autoTable({
        startY: 65,
        head: [["Fecha", "Descripción"]],
        body: animal.historial.map(item => [item.fecha, item.descripcion]),
        theme: "grid",
        styles: { fontSize: 11 },
      });
    } else {
      doc.text("No hay historial médico disponible.", 15, 70);
    }
    // Abrir el PDF en una nueva ventana para imprimir
    window.open(doc.output('bloburl'), '_blank');
  };

  const handleEditarPerfil = () => {
    // Usar id_animal si existe, si no usar id
    const idAnimal = typeof animal.id_animal === 'number' ? animal.id_animal : animal.id;
    if (idAnimal !== undefined && idAnimal !== null) {
      window.location.href = `/mis-animales?id=${encodeURIComponent(idAnimal)}&editarPerfil=true`;
    } else {
      alert('No se encontró el ID del animal.');
    }
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content" style={{ background: '#fff', borderRadius: 10, padding: '2rem', position: 'relative', minWidth: 350, maxWidth: 600, width: '90vw', boxShadow: '0 2px 16px rgba(0,0,0,0.15)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 10, fontSize: 22, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        <h2 style={{ marginBottom: '1rem' }}>Previsualización PDF: {animal.nombre}</h2>
        <div style={{ minHeight: 200, marginBottom: '2rem', background: '#f7fbfc', borderRadius: 8, padding: '1rem', overflowY: 'auto' }}>
          <p><strong>Nombre:</strong> {animal.nombre}</p>
          <p><strong>Edad:</strong> {animal.edad || 'No disponible'}</p>
          <p><strong>Estado de Salud:</strong> {animal.estado_salud || 'No disponible'}</p>
          <p><strong>Vacunas aplicadas:</strong> {vacunasAplicadas.length}</p>
          <p><strong>Vacunas pendientes:</strong> {vacunasPendientes.length > 0 ? vacunasPendientes.join(', ') : 'Ninguna'}</p>
          <ul style={{ marginTop: '1rem' }}>
            {animal.historial.map((item, idx) => (
              <li key={idx}><strong>{item.fecha}:</strong> {item.descripcion}</li>
            ))}
          </ul>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button onClick={handleEditarPerfil} style={{ background: '#f39c12', color: '#fff', border: 'none', borderRadius: 5, padding: '0.5rem 1.2rem', fontWeight: 500, cursor: 'pointer' }}>Editar perfil</button>
          <button onClick={handleDescargarPDF} style={{ background: '#2980b9', color: '#fff', border: 'none', borderRadius: 5, padding: '0.5rem 1.2rem', fontWeight: 500, cursor: 'pointer' }}>Descargar PDF</button>
          <button onClick={handleImprimir} style={{ background: '#2980b9', color: '#fff', border: 'none', borderRadius: 5, padding: '0.5rem 1.2rem', fontWeight: 500, cursor: 'pointer' }}>Imprimir</button>
        </div>
      </div>
    </div>
  );
};

export default EstructuraPDF;
