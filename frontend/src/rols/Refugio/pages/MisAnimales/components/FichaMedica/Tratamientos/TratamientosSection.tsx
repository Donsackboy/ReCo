
import React, { useState, useEffect } from 'react';


export type Tratamiento = {
  id_tratamiento?: number;
  tipo: string;
  nombre: string;
  motivo: string;
  fecha_inicio: string;
  fecha_fin?: string;
  duracion_dias?: number;
  dosis: string;
  via_administracion: string;
  veterinario?: string;
  estado: 'en_curso' | 'pendiente' | 'finalizado' | 'suspendido';
  costo?: number;
  estado_pago: 'no_pagado' | 'parcialmente_pagado' | 'pagado';
  monto_pagado?: number;
  observaciones?: string;
  adjunto?: File | null;
  id_animal?: number | string;
};

const tipoTratamientoOpciones = [
  'Medicamento',
  'Desparasitación',
  'Vacunación',
  'Terapia física / rehabilitación',
  'Suplemento nutricional',
  'Tratamiento dermatológico',
  'Tratamiento ocular / auditivo',
  'Otro',
];

const viaAdministracionOpciones = [
  'Oral',
  'Inyectable',
  'Tópico',
  'Otro',
];

const estadoOpciones = [
  { value: 'en_curso', label: 'En curso', color: '#43a047' },
  { value: 'pendiente', label: 'Pendiente', color: '#ffa726' },
  { value: 'finalizado', label: 'Finalizado', color: '#e74c3c' },
  { value: 'suspendido', label: 'Suspendido', color: '#e74c3c' },
];

const estadoPagoOpciones = [
  { value: 'no_pagado', label: 'No pagado', color: '#e74c3c' },
  { value: 'parcialmente_pagado', label: 'Parcialmente pagado', color: '#ffa726' },
  { value: 'pagado', label: 'Pagado', color: '#43a047' },
];

type TratamientosSectionProps = {
  tratamientos: Tratamiento[];
  setTratamientos: React.Dispatch<React.SetStateAction<Tratamiento[]>>;
};

const TratamientosSection: React.FC<TratamientosSectionProps> = ({ tratamientos = [], setTratamientos }) => {
  const requiredMark = <span style={{ color: 'red', marginLeft: 4 }}>*</span>;
  // Defensive: Ensure tratamientos is always an array
  const safeTratamientos = Array.isArray(tratamientos) ? tratamientos : [];
  if (!Array.isArray(tratamientos)) {
    console.error('Tratamientos prop is not an array:', tratamientos);
  }
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Tratamiento>({
    tipo: '',
    nombre: '',
    motivo: '',
    fecha_inicio: '',
    fecha_fin: '',
    duracion_dias: undefined,
    dosis: '',
    via_administracion: '',
    veterinario: '',
    estado: 'pendiente',
    costo: undefined,
    estado_pago: 'no_pagado',
    monto_pagado: undefined,
    observaciones: '',
    adjunto: null,
    id_animal: undefined,
  });
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editTratamiento, setEditTratamiento] = useState<Tratamiento | null>(null);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm(f => ({ ...f, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === 'number') {
      setForm(f => ({ ...f, [name]: value === '' ? undefined : (!isNaN(Number(value)) ? Number(value) : undefined) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, adjunto: e.target.files ? e.target.files[0] : null }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tipo || !form.nombre || !form.motivo || !form.fecha_inicio || !form.dosis || !form.via_administracion || !form.estado) {
      alert('Completa todos los campos obligatorios para guardar el tratamiento.');
      return;
    }
    const formatDate = (dateStr: string) => {
      if (!dateStr) return undefined;
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
      try {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
          return d.toISOString().slice(0, 10);
        }
      } catch {}
      return dateStr;
    };
    const tratamientoData: Tratamiento = {
      ...form,
      fecha_inicio: formatDate(form.fecha_inicio) || '',
      fecha_fin: formatDate(form.fecha_fin || '') || '',
    };
    setTratamientos(prev => [...prev, tratamientoData]);
    setShowForm(false);
    setForm({
      tipo: '',
      nombre: '',
      motivo: '',
      fecha_inicio: '',
      fecha_fin: '',
      duracion_dias: undefined,
      dosis: '',
      via_administracion: '',
      veterinario: '',
      estado: 'pendiente',
      costo: undefined,
      estado_pago: 'no_pagado',
      monto_pagado: undefined,
      observaciones: '',
      adjunto: null,
    });
  };

  // Edición y eliminación
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editTratamiento) return;
    const { name, value, type } = e.target;
    let newValue: any = value;
    if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    }
    if (type === 'number') {
      newValue = value === '' ? undefined : Number(newValue);
    }
    setEditTratamiento({ ...editTratamiento, [name]: newValue });
  };

  const handleEditSave = () => {
    if (!editTratamiento) return;
    setTratamientos(prev => prev.map((t, i) => i === editIdx ? editTratamiento : t));
    setEditIdx(null);
    setEditTratamiento(null);
  };

  const handleDelete = () => {
    if (deleteIdx !== null) {
      setTratamientos(prev => prev.filter((_, i) => i !== deleteIdx));
      setEditIdx(null);
      setEditTratamiento(null);
      setDeleteIdx(null);
    }
  };

  return (
    <div style={{ background: '#e3f2fd', border: '2px solid #90caf9', borderRadius: 14, padding: 18, marginBottom: 8, boxShadow: '0 2px 8px rgba(144,202,249,0.08)' }}>
      <h3 style={{ marginBottom: 8, color: '#1976d2', fontWeight: 700 }}>Registro de tratamientos</h3>
      {/* Use safeTratamientos everywhere instead of tratamientos */}
      {!showForm && (
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
          <button type="button" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #1976d233' }} onClick={() => setShowForm(true)}>
            Agregar tratamiento
          </button>
        </div>
      )}
      {showForm && (
        <div style={{ background: '#fff', border: '1.5px solid #90caf9', borderRadius: 10, padding: 14, boxShadow: '0 2px 8px rgba(144,202,249,0.08)', marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 500, marginBottom: 2 }}>Tipo de tratamiento: {requiredMark}
                <select name="tipo" value={form.tipo} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }}>
                  <option value="">Selecciona tipo...</option>
                  {tipoTratamientoOpciones.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </label>
              <label style={{ fontWeight: 500, marginBottom: 2 }}>Nombre del tratamiento: {requiredMark}
                <input name="nombre" value={form.nombre} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }} />
              </label>
              <label style={{ fontWeight: 500, marginBottom: 2 }}>Motivo del tratamiento: {requiredMark}
                <input name="motivo" value={form.motivo} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }} />
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <label style={{ flex: 1, fontWeight: 500 }}>
                  Fecha de inicio: {requiredMark}
                  <input name="fecha_inicio" type="date" value={form.fecha_inicio || ''} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }} />
                </label>
                <label style={{ flex: 1, fontWeight: 500 }}>
                  Fecha de fin:
                  <input name="fecha_fin" type="date" value={form.fecha_fin || ''} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }} />
                </label>
              </div>
              <label style={{ fontWeight: 500, marginBottom: 2 }}>Duración estimada (días):
                <input name="duracion_dias" type="number" value={typeof form.duracion_dias === 'number' ? form.duracion_dias : ''} onChange={handleChange} min={1} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }} />
              </label>
              <label style={{ fontWeight: 500, marginBottom: 2 }}>Dosis y frecuencia: {requiredMark}
                <input name="dosis" value={form.dosis} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }} />
              </label>
              <label style={{ fontWeight: 500, marginBottom: 2 }}>Vía de administración: {requiredMark}
                <select name="via_administracion" value={form.via_administracion} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }}>
                  <option value="">Selecciona vía...</option>
                  {viaAdministracionOpciones.map(via => (
                    <option key={via} value={via}>{via}</option>
                  ))}
                </select>
              </label>
              <label style={{ fontWeight: 500, marginBottom: 2 }}>Responsable / Veterinario:
                <input name="veterinario" value={form.veterinario || ''} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }} />
              </label>
              <label style={{ fontWeight: 500, marginBottom: 2 }}>Estado de tratamiento: {requiredMark}
                <select name="estado" value={form.estado} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }}>
                  {estadoOpciones.map(e => (
                    <option key={e.value} value={e.value}>{e.label}</option>
                  ))}
                </select>
                <span style={{ marginLeft: 8, fontWeight: 700, color: estadoOpciones.find(e => e.value === form.estado)?.color }}>{estadoOpciones.find(e => e.value === form.estado)?.label}</span>
              </label>
              <label style={{ fontWeight: 500, marginBottom: 2 }}>Costo ($):
                <input name="costo" type="number" value={typeof form.costo === 'number' ? form.costo : ''} onChange={handleChange} min={0} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }} />
              </label>
              {form.estado_pago === 'parcialmente_pagado' && (
                <label style={{ fontWeight: 500, marginBottom: 2 }}>Monto pagado ($):
                  <input name="monto_pagado" type="number" value={typeof form.monto_pagado === 'number' ? form.monto_pagado : ''} onChange={handleChange} min={0} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }} />
                  <div style={{ color: '#e74c3c', fontWeight: 600, marginTop: 4 }}>
                    {form.costo && form.monto_pagado !== undefined && form.monto_pagado !== null
                      ? `Falta por pagar: $${Math.max(0, Number(form.costo) - Number(form.monto_pagado))}`
                      : ''}
                  </div>
                </label>
              )}
              <label style={{ fontWeight: 500, marginBottom: 2 }}>Observaciones / evolución:
                <textarea name="observaciones" value={form.observaciones || ''} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, minHeight: 40, background: '#fff' }} />
              </label>
              <label style={{ fontWeight: 500, marginBottom: 2 }}>Archivo adjunto:
                <input name="adjunto" type="file" onChange={handleFile} style={{ marginTop: 4, background: '#fff' }} />
              </label>
              <div style={{ textAlign: 'center', marginTop: 18 }}>
                <button type="button" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 38px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 12px #1976d233' }} onClick={handleSubmit}>Guardar</button>
                <button type="button" style={{ marginLeft: 16, background: '#eee', color: '#1976d2', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer' }} onClick={() => { setShowForm(false); setForm({ tipo: '', nombre: '', motivo: '', fecha_inicio: '', fecha_fin: '', duracion_dias: undefined, dosis: '', via_administracion: '', veterinario: '', estado: 'pendiente', costo: undefined, estado_pago: 'no_pagado', monto_pagado: undefined, observaciones: '', adjunto: null }); }}>Cancelar</button>
              </div>
            </div>
        </div>
      )}
      {editIdx !== null && editTratamiento && (
        <div style={{ background: '#fff', border: '1.5px solid #90caf9', borderRadius: 10, padding: 14, boxShadow: '0 2px 8px rgba(144,202,249,0.08)', marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontWeight: 700, color: '#1976d2', fontSize: 18, marginBottom: 8 }}>Editar tratamiento</div>
          <label style={{ fontWeight: 500, marginBottom: 2 }}>Tipo de tratamiento:
            <input name="tipo" value={editTratamiento?.tipo || ''} onChange={handleEditChange} placeholder="Ej: Desparasitación" style={{ width: '100%', marginTop: 4 }} />
          </label>
          <label style={{ fontWeight: 500, marginBottom: 2 }}>Nombre:
            <input name="nombre" value={editTratamiento?.nombre || ''} onChange={handleEditChange} placeholder="Ej: Ivermectina" style={{ width: '100%', marginTop: 4 }} />
          </label>
          <label style={{ fontWeight: 500, marginBottom: 2 }}>Motivo:
            <input name="motivo" value={editTratamiento?.motivo || ''} onChange={handleEditChange} placeholder="Motivo del tratamiento" style={{ width: '100%', marginTop: 4 }} />
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <label style={{ flex: 1, fontWeight: 500 }}>
              Fecha de inicio:
              <input name="fecha_inicio" type="date" value={editTratamiento?.fecha_inicio || ''} onChange={handleEditChange} style={{ width: '100%', marginTop: 4 }} />
            </label>
            <label style={{ flex: 1, fontWeight: 500 }}>
              Fecha de fin:
              <input name="fecha_fin" type="date" value={editTratamiento?.fecha_fin || ''} onChange={handleEditChange} style={{ width: '100%', marginTop: 4 }} />
            </label>
          </div>
          <label style={{ fontWeight: 500, marginBottom: 2 }}>Duración (días):
            <input name="duracion_dias" type="number" value={typeof editTratamiento?.duracion_dias === 'number' ? editTratamiento.duracion_dias : ''} onChange={handleEditChange} style={{ width: '100%', marginTop: 4 }} />
          </label>
          <label style={{ fontWeight: 500, marginBottom: 2 }}>Dosis:
            <input name="dosis" value={editTratamiento?.dosis || ''} onChange={handleEditChange} placeholder="Ej: 1 ml cada 12h" style={{ width: '100%', marginTop: 4 }} />
          </label>
          <label style={{ fontWeight: 500, marginBottom: 2 }}>Vía de administración:
            <input name="via_administracion" value={editTratamiento?.via_administracion || ''} onChange={handleEditChange} placeholder="Ej: Oral" style={{ width: '100%', marginTop: 4 }} />
          </label>
          <label style={{ fontWeight: 500, marginBottom: 2 }}>Veterinario:
            <input name="veterinario" value={editTratamiento?.veterinario || ''} onChange={handleEditChange} placeholder="Nombre del veterinario" style={{ width: '100%', marginTop: 4 }} />
          </label>
          <label style={{ fontWeight: 500, marginBottom: 2 }}>Estado de tratamiento:
            <select name="estado" value={editTratamiento?.estado || ''} onChange={handleEditChange} style={{ width: '100%', marginTop: 4 }}>
              {estadoOpciones.map(e => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
          </label>
          <label style={{ fontWeight: 500, marginBottom: 2 }}>Costo (CLP):
            <input name="costo" type="number" value={typeof editTratamiento?.costo === 'number' ? editTratamiento.costo : ''} onChange={handleEditChange} placeholder="Ej: 5000" style={{ width: '100%', marginTop: 4 }} />
          </label>
          <label style={{ fontWeight: 500, marginBottom: 2 }}>Estado de pago:
            <select name="estado_pago" value={editTratamiento?.estado_pago || ''} onChange={handleEditChange} style={{ width: '100%', marginTop: 4 }}>
              {estadoPagoOpciones.map(e => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
          </label>
          {editTratamiento?.estado_pago === 'parcialmente_pagado' && (
            <label style={{ fontWeight: 500, marginBottom: 2 }}>Monto pagado (CLP):
              <input name="monto_pagado" type="number" value={typeof editTratamiento?.monto_pagado === 'number' ? editTratamiento.monto_pagado : ''} onChange={handleEditChange} style={{ width: '100%', marginTop: 4 }} />
              <span style={{ color: '#e74c3c', fontWeight: 600, marginLeft: 8 }}>
                {editTratamiento?.costo && editTratamiento?.monto_pagado !== undefined && editTratamiento?.monto_pagado !== null
                  ? `Falta por pagar: $${Math.max(0, Number(editTratamiento.costo) - Number(editTratamiento.monto_pagado))}`
                  : ''}
              </span>
            </label>
          )}
          <label style={{ fontWeight: 500, marginBottom: 2 }}>Observaciones:
            <input name="observaciones" value={editTratamiento?.observaciones || ''} onChange={handleEditChange} placeholder="Observaciones o evolución" style={{ width: '100%', marginTop: 4 }} />
          </label>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button type="button" style={{ background: '#43a047', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 600 }} onClick={handleEditSave}>Guardar</button>
            <button type="button" style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 600 }} onClick={() => { setEditIdx(null); setEditTratamiento(null); }}>Cancelar</button>
          </div>
        </div>
      )}
      {tratamientos.length === 0 && (
        <div style={{ background: '#fff', border: '1.5px solid #90caf9', borderRadius: 10, padding: 14, boxShadow: '0 2px 8px rgba(144,202,249,0.08)', color: '#1976d2', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span role="img" aria-label="tratamiento" style={{ fontSize: 22, opacity: 0.18 }}>💊</span>
          No hay tratamientos registrados
        </div>
      )}
      {tratamientos.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
          {tratamientos.map((t, idx) => {
            if (editIdx === idx) return null;
            return (
              <div key={idx} style={{ background: '#fff', border: '1.5px solid #90caf9', borderRadius: 10, padding: 14, boxShadow: '0 2px 8px rgba(144,202,249,0.08)', marginBottom: 8, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ position: 'absolute', top: 12, left: 12, fontSize: 22, color: '#1976d2', opacity: 0.18 }}>
                  <span role="img" aria-label="med">💊</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 8 }}>
                  <button type="button" style={{ background: '#64b5f6', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontWeight: 600, boxShadow: '0 2px 8px #64b5f633', fontSize: 15 }} onClick={(e) => { e.preventDefault(); setEditIdx(idx); setEditTratamiento(t); }}>Editar</button>
                  <button type="button" style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontWeight: 600, boxShadow: '0 2px 8px #e74c3c33', fontSize: 15 }} onClick={() => setDeleteIdx(idx)}>Eliminar</button>
                </div>
                <div style={{ marginBottom: 2 }}>
                  <span style={{ fontWeight: 700, color: '#1976d2', fontSize: 16 }}>Tipo:</span> <span style={{ fontWeight: 700, color: '#1976d2', fontSize: 18, marginLeft: 4 }}>{t.tipo || 'No ingresado'}</span>
                </div>
                <div style={{ marginBottom: 2 }}>
                  <span style={{ fontWeight: 700, color: '#1976d2', fontSize: 16 }}>Nombre:</span> <span style={{ background: '#fff', color: '#1976d2', borderRadius: 8, padding: '2px 10px', fontWeight: 600, fontSize: 15, border: '1px solid #90caf9', marginLeft: 4 }}>{t.nombre || 'No ingresado'}</span>
                </div>
                <div style={{ color: '#333', fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
                  Descripción: <span style={{ fontWeight: 400 }}>{t.motivo || 'No ingresado'}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 2 }}>
                  <span style={{ color: '#1976d2', fontWeight: 500 }}><span role="img" aria-label="inicio">🗓️</span> <b>Inicio:</b> {t.fecha_inicio || 'No ingresado'}</span>
                  <span style={{ color: '#1976d2', fontWeight: 500 }}><span role="img" aria-label="fin">⏰</span> <b>Fin:</b> {t.fecha_fin || 'No ingresado'}</span>
                  <span style={{ color: '#1976d2', fontWeight: 500 }}><span role="img" aria-label="duracion">📅</span> <b>Duración:</b> {t.duracion_dias !== undefined && t.duracion_dias !== null ? t.duracion_dias : 'No ingresado'} días</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 2 }}>
                  <span style={{ color: '#333', fontWeight: 500 }}><span role="img" aria-label="dosis">🧪</span> <b>Dosis:</b> {t.dosis || 'No ingresado'}</span>
                  <span style={{ color: '#333', fontWeight: 500 }}><span role="img" aria-label="via">🚩</span> <b>Vía:</b> {t.via_administracion || 'No ingresado'}</span>
                  <span style={{ color: '#333', fontWeight: 500 }}><span role="img" aria-label="vet">👩‍⚕️</span> <b>Veterinario:</b> {t.veterinario || 'No ingresado'}</span>
                </div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: 14, background: estadoOpciones.find(e => e.value === t.estado)?.color || '#bbb', color: '#fff', borderRadius: 8, padding: '2px 12px', boxShadow: '0 2px 8px #1976d233' }}>{estadoOpciones.find(e => e.value === t.estado)?.label || t.estado}</span>
                  <span style={{ color: '#333', fontWeight: 500 }}><span role="img" aria-label="costo">💲</span> <b>Costo:</b> {t.costo !== undefined && t.costo !== null ? `$${t.costo}` : 'No ingresado'}</span>
                  <span style={{ fontWeight: 600, fontSize: 14, background: estadoPagoOpciones.find(e => e.value === t.estado_pago)?.color || '#bbb', color: '#fff', borderRadius: 8, padding: '2px 12px', marginLeft: 8 }}>
                    {estadoPagoOpciones.find(e => e.value === t.estado_pago)?.label || t.estado_pago}
                  </span>
                  {t.estado_pago === 'parcialmente_pagado' && t.costo !== undefined && t.monto_pagado !== undefined && (
                    <span style={{ marginLeft: 8, color: '#e74c3c', fontWeight: 500 }}>
                      Pagado: ${t.monto_pagado} | Falta: ${Math.max(0, Number(t.costo) - Number(t.monto_pagado))}
                    </span>
                  )}
                  {t.estado_pago === 'pagado' && t.costo !== undefined && (
                    <span style={{ marginLeft: 8, color: '#43a047', fontWeight: 500 }}>
                      Pagado: ${t.costo}
                    </span>
                  )}
                </div>
                <div style={{ marginTop: 4, color: '#333', fontWeight: 500, fontSize: 14 }}><span role="img" aria-label="obs">📝</span> <b>Observaciones:</b> <span style={{ fontWeight: 400 }}>{t.observaciones || 'No ingresado'}</span></div>
              </div>
            );
          })}
        </div>
      )}
      {deleteIdx !== null && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(33, 150, 243, 0.18)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #1976d233', padding: 32, minWidth: 320, textAlign: 'center', border: '2px solid #1976d2' }}>
            <h3 style={{ color: '#1976d2', fontWeight: 700, marginBottom: 18 }}>¿Eliminar tratamiento?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
              <span>¿Estás seguro que deseas eliminar este tratamiento?<br />Esta acción no se puede deshacer.</span>
            </div>
            <button type="button" style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: '1.08rem', marginRight: 12, cursor: 'pointer' }} onClick={handleDelete}>Eliminar</button>
            <button type="button" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer' }} onClick={() => setDeleteIdx(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TratamientosSection;
