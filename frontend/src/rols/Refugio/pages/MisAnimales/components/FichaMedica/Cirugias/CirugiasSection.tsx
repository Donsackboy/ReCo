import React, { useState } from 'react';
import CirugiaForm from './CirugiaForm';
import type { Cirugia } from './CirugiaForm';
import { getCirugias, createCirugia, updateCirugia, deleteCirugia } from './cirugiasApi';

interface CirugiasSectionProps {
  animalId: number;
  token: string;
}

const CirugiasSection: React.FC<CirugiasSectionProps> = ({ animalId, token }) => {
  const [cirugias, setCirugias] = useState<Cirugia[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  React.useEffect(() => {
    async function fetchCirugias() {
      setLoading(true);
      try {
        const data = await getCirugias(token, animalId);
        setCirugias(data);
      } catch (err) {}
      setLoading(false);
    }
    fetchCirugias();
  }, [animalId, token]);

  const handleAdd = async (data: Cirugia) => {
    setLoading(true);
    try {
      const nueva = await createCirugia({ ...data, id_animal: animalId }, token);
      setCirugias(prev => [...prev, nueva]);
      setShowForm(false);
    } catch (err) { alert('Error al registrar cirugía'); }
    setLoading(false);
  };

  const handleEdit = async (data: Cirugia) => {
    if (!editId) return;
    setLoading(true);
    try {
      const actualizada = await updateCirugia(editId, data, token);
      setCirugias(prev => prev.map(c => c.id_cirugia === editId ? actualizada : c));
      setEditId(null);
    } catch (err) { alert('Error al actualizar cirugía'); }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await deleteCirugia(id, token);
      setCirugias(prev => prev.filter(c => c.id_cirugia !== id));
      setEditId(null);
    } catch (err) { alert('Error al eliminar cirugía'); }
    setLoading(false);
  };

  return (
    <div className="section-card">
      <h3 className="section-title">Cirugías</h3>
      <button type="button" className="form-boton-btn" style={{ marginBottom: 12 }} onClick={() => setShowForm(v => !v)}>
        {showForm ? 'Cancelar' : 'Registrar cirugía'}
      </button>
      {showForm && (
        <CirugiaForm
          initial={{ id_animal: animalId }}
          onSave={handleAdd}
          onCancel={() => setShowForm(false)}
        />
      )}
      {loading ? (
        <div style={{ marginTop: 24 }}>Cargando cirugías...</div>
      ) : cirugias.length === 0 ? (
        <div className="empty-state">
          <span role="img" aria-label="cirugia" className="emoji">🩺</span>
          No hay cirugías registradas
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {cirugias.map(c => (
            <li key={c.id_cirugia} style={{ background: '#f8fbff', border: '1px solid #d0e6fa', borderRadius: 10, marginBottom: 10, padding: '10px 8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', maxWidth: 480, width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
              {editId === c.id_cirugia ? (
                <CirugiaForm
                  initial={c}
                  onSave={handleEdit}
                  onCancel={() => setEditId(null)}
                  onDelete={() => handleDelete(c.id_cirugia!)}
                  isEdit
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontWeight: 700, color: '#1976d2', fontSize: '1.08em', marginBottom: 2 }}>
                    🩺 {c.tipo} {c.otro_nombre && <span style={{ color: '#333', fontWeight: 400 }}>({c.otro_nombre})</span>}
                  </div>
                  <div style={{ color: '#1565c0', fontSize: '0.98em' }}><strong>Fecha:</strong> {c.fecha}</div>
                  <div style={{ color: '#1565c0', fontSize: '0.98em' }}><strong>Costo:</strong> ${c.costo}</div>
                  <div style={{ color: '#1565c0', fontSize: '0.98em' }}><strong>Veterinario:</strong> {c.veterinario}</div>
                  <div style={{ color: '#1565c0', fontSize: '0.98em' }}><strong>Pago:</strong> {c.pago_estado} (${c.monto_pagado})</div>
                  {c.motivo && <div style={{ color: '#1976d2', fontSize: '0.97em' }}><strong>Motivo:</strong> {c.motivo}</div>}
                  {c.observaciones && <div style={{ color: '#1976d2', fontSize: '0.97em' }}><strong>Observaciones:</strong> {c.observaciones}</div>}
                  {c.adjunto && <div style={{ color: '#1976d2', fontSize: '0.97em' }}><strong>Adjunto:</strong> {c.adjunto}</div>}
                  <button type="button" className="form-boton-btn" style={{ marginTop: 8, minWidth: 120 }} onClick={() => setEditId(c.id_cirugia!)}>Editar</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CirugiasSection;
