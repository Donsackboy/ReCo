// ...existing code...
import React, { useState, useEffect } from 'react';
import { getTratamientos, createTratamiento, updateTratamiento } from '../api.js';

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

export interface TratamientoFormProps {
  historial?: Tratamiento[];
  idAnimal: number | string | null;
  onAdd: (tratamiento: Tratamiento) => void;
  onUpdate: (tratamientos: Tratamiento[]) => void;
}

const TratamientoForm: React.FC<TratamientoFormProps> = ({ idAnimal }) => {
  const requiredMark = <span style={{ color: 'red', marginLeft: 4 }}>*</span>;
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
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);

  // Depuración: mostrar tratamientos en consola antes del render
  console.log('Tratamientos en render:', tratamientos);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !idAnimal) return;
    console.log('Consultando tratamientos para idAnimal:', idAnimal); // <-- LOG DE ANIMAL ID
    getTratamientos(token, idAnimal)
  .then((data: any) => {
        console.log('Tratamientos API response:', data); // <-- LOG PARA DEPURAR
        if (Array.isArray(data)) {
          setTratamientos(data);
        } else if (data.results && Array.isArray(data.results)) {
          setTratamientos(data.results);
        } else {
          setTratamientos([]);
        }
      })
      .catch(() => setTratamientos([]));
  }, [idAnimal, showForm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm(f => ({ ...f, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === 'number') {
      setForm(f => ({ ...f, [name]: value === '' ? undefined : Number(value) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, adjunto: e.target.files ? e.target.files[0] : null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tipo || !form.nombre || !form.motivo || !form.fecha_inicio || !form.dosis || !form.via_administracion || !form.estado) {
      alert('Completa todos los campos obligatorios para guardar el tratamiento.');
      return;
    }
    let id_animal_valid = idAnimal;
    if (typeof id_animal_valid === 'string') {
      if (!/^[0-9]+$/.test(id_animal_valid)) {
        alert('El id del animal debe ser un número válido.');
        return;
      }
      id_animal_valid = Number(id_animal_valid);
    }
    if (typeof id_animal_valid !== 'number' || isNaN(id_animal_valid)) {
      alert('No se encontró el id del animal.');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No hay token de autenticación.');
      return;
    }
    try {
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
      const tratamientoData = {
        ...form,
        id_animal: id_animal_valid,
  fecha_inicio: formatDate(form.fecha_inicio),
  fecha_fin: formatDate(form.fecha_fin || ''),
      };
      await createTratamiento(tratamientoData, token);
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
      // Refrescar lista
      const nuevos = await getTratamientos(token, id_animal_valid);
      setTratamientos(nuevos);
    } catch (err) {
      alert('Error al guardar tratamiento. Intenta nuevamente.');
    }
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

  const handleEditSave = async () => {
    if (!editTratamiento) return;
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No hay token de autenticación.');
      return;
    }
    try {
      // Llama a la API para actualizar el tratamiento
  await updateTratamiento(editTratamiento.id_tratamiento, editTratamiento, token);
      // Refresca la lista
      const nuevos = await getTratamientos(token, editTratamiento.id_animal);
      setTratamientos(nuevos);
      setEditIdx(null);
      setEditTratamiento(null);
    } catch (err) {
      alert('Error al guardar cambios.');
    }
  };

    // confirmDelete no se usa, se elimina

  const handleDelete = () => {
    if (deleteIdx !== null) {
      setTratamientos(prev => prev.filter((_, i) => i !== deleteIdx));
      setEditIdx(null);
      setEditTratamiento(null);
      setDeleteIdx(null);
    }
  };

  return (
    <div style={{ border: '2px solid #1976d2', borderRadius: 18, padding: 24, background: '#e3f2fd', marginBottom: 32 }}>
      <h3 style={{ color: '#1976d2', fontWeight: 700, marginBottom: 12 }}>Registro de tratamientos</h3>
      {!showForm && (
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <button type="button" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 38px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 12px #1976d233' }} onClick={() => setShowForm(true)}>
            Agregar tratamiento
          </button>
        </div>
      )}
      {showForm && (
        <div
          style={{
            display: window.innerWidth < 700 ? 'flex' : 'grid',
            flexDirection: window.innerWidth < 700 ? 'column' : undefined,
            gridTemplateColumns: window.innerWidth < 700 ? undefined : '1fr 1fr',
            gap: 18,
            marginBottom: 18,
          }}
        >
          {window.innerWidth < 700 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ fontWeight: 500 }}>Tipo de tratamiento: {requiredMark}
                <select name="tipo" value={form.tipo} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }}>
                  <option value="">Selecciona tipo...</option>
                  {tipoTratamientoOpciones.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </label>
              <label style={{ fontWeight: 500 }}>Nombre del tratamiento / medicamento: {requiredMark}
                <input name="nombre" value={form.nombre} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }} />
              </label>
              <label style={{ fontWeight: 500 }}>Motivo del tratamiento: {requiredMark}
                <textarea name="motivo" value={form.motivo} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, minHeight: 40, background: '#fff' }} />
              </label>
              <label style={{ fontWeight: 500 }}>Fecha de inicio: {requiredMark}
                <input name="fecha_inicio" type="date" value={form.fecha_inicio} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }} />
              </label>
              <label style={{ fontWeight: 500 }}>Fecha de finalización:
                <input name="fecha_fin" type="date" value={form.fecha_fin || ''} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }} />
              </label>
              <label style={{ fontWeight: 500 }}>Duración estimada (días):
                <input name="duracion_dias" type="number" value={form.duracion_dias || ''} onChange={handleChange} min={1} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }} />
              </label>
              <label style={{ fontWeight: 500 }}>Dosis y frecuencia: {requiredMark}
                <input name="dosis" value={form.dosis} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }} />
              </label>
              <label style={{ fontWeight: 500 }}>Vía de administración: {requiredMark}
                <select name="via_administracion" value={form.via_administracion} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }}>
                  <option value="">Selecciona vía...</option>
                  {viaAdministracionOpciones.map(via => (
                    <option key={via} value={via}>{via}</option>
                  ))}
                </select>
              </label>
              <label style={{ fontWeight: 500 }}>Responsable / Veterinario:
                <input name="veterinario" value={form.veterinario || ''} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }} />
              </label>
              <label style={{ fontWeight: 500 }}>Estado del tratamiento: {requiredMark}
                <select name="estado" value={form.estado} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }}>
                  {estadoOpciones.map(e => (
                    <option key={e.value} value={e.value}>{e.label}</option>
                  ))}
                </select>
                <span style={{ marginLeft: 8, fontWeight: 700, color: estadoOpciones.find(e => e.value === form.estado)?.color }}>{estadoOpciones.find(e => e.value === form.estado)?.label}</span>
              </label>
              <label style={{ fontWeight: 500 }}>Costo ($):
                <input name="costo" type="number" value={form.costo || ''} onChange={handleChange} min={0} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }} />
              </label>
              <label style={{ fontWeight: 500 }}>Estado de pago:
                <select name="estado_pago" value={form.estado_pago} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }}>
                  {estadoPagoOpciones.map(e => (
                    <option key={e.value} value={e.value}>{e.label}</option>
                  ))}
                </select>
              </label>
              {form.estado_pago === 'parcialmente_pagado' && (
                <label style={{ fontWeight: 500 }}>Monto pagado ($):
                  <input name="monto_pagado" type="number" value={form.monto_pagado || ''} onChange={handleChange} min={0} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }} />
                  <div style={{ color: '#e74c3c', fontWeight: 600, marginTop: 4 }}>
                    {form.costo && form.monto_pagado !== undefined && form.monto_pagado !== null
                      ? `Falta por pagar: $${Math.max(0, Number(form.costo) - Number(form.monto_pagado))}`
                      : ''}
                  </div>
                </label>
              )}
              <label style={{ fontWeight: 500 }}>Observaciones / evolución:
                <textarea name="observaciones" value={form.observaciones || ''} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, minHeight: 40, background: '#fff' }} />
              </label>
              <label style={{ fontWeight: 500 }}>Archivo adjunto:
                <input name="adjunto" type="file" onChange={handleFile} style={{ marginTop: 4, background: '#fff' }} />
              </label>
              <div style={{ textAlign: 'center', marginTop: 18 }}>
                <button type="button" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 38px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 12px #1976d233' }} onClick={handleSubmit}>Guardar tratamiento</button>
                <button type="button" style={{ marginLeft: 16, background: '#eee', color: '#1976d2', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer' }} onClick={() => { setShowForm(false); setForm({ tipo: '', nombre: '', motivo: '', fecha_inicio: '', fecha_fin: '', duracion_dias: undefined, dosis: '', via_administracion: '', veterinario: '', estado: 'pendiente', costo: undefined, estado_pago: 'no_pagado', monto_pagado: undefined, observaciones: '', adjunto: null }); }}>Cancelar</button>
              </div>
            </div>
          ) : (
            // ...existing code for desktop form...
            <>
              <div style={{ gridColumn: '1/2' }}>
                {/* ...existing code... */}
              </div>
              <div style={{ gridColumn: '2/3' }}>
                {/* ...existing code... */}
              </div>
              <div style={{ gridColumn: '1/3', textAlign: 'center', marginTop: 18 }}>
                {/* ...existing code... */}
              </div>
            </>
          )}
        </div>
      )}
      {tratamientos.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h4 style={{ color: '#1976d2', fontWeight: 700 }}>Historial de tratamientos</h4>
          {window.innerWidth >= 700 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8, boxShadow: '0 2px 12px #1976d233', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)', color: '#fff' }}>
                  <th style={{ padding: 8, border: '1px solid #1976d2' }}>#</th>
                  <th style={{ padding: 8, border: '1px solid #1976d2' }}>Tipo de Tratamiento</th>
                  <th style={{ padding: 8, border: '1px solid #1976d2' }}>Nombre</th>
                  <th style={{ padding: 8, border: '1px solid #1976d2' }}>Motivo</th>
                  <th style={{ padding: 8, border: '1px solid #1976d2' }}>Inicio</th>
                  <th style={{ padding: 8, border: '1px solid #1976d2' }}>Fin</th>
                  <th style={{ padding: 8, border: '1px solid #1976d2' }}>Duración</th>
                  <th style={{ padding: 8, border: '1px solid #1976d2' }}>Dosis</th>
                  <th style={{ padding: 8, border: '1px solid #1976d2' }}>Vía</th>
                  <th style={{ padding: 8, border: '1px solid #1976d2' }}>Veterinario</th>
                  <th style={{ padding: 8, border: '1px solid #1976d2' }}>Estado</th>
                  <th style={{ padding: 8, border: '1px solid #1976d2' }}>Costo</th>
                  <th style={{ padding: 8, border: '1px solid #1976d2' }}>Estado de pago</th>
                  <th style={{ padding: 8, border: '1px solid #1976d2' }}>Observaciones</th>
                  <th style={{ padding: 8, border: '1px solid #1976d2' }}>Editar</th>
                </tr>
              </thead>
              <tbody>
                {/* ...existing code for table rows... */}
                {tratamientos.map((t, idx) => (
                  editIdx === idx ? (
                    <tr key={idx} style={{ background: idx % 2 === 0 ? '#e3f2fd' : '#e0f7fa', transition: 'background 0.2s' }}>
                      <td colSpan={16} style={{ padding: 8, border: '1px solid #1976d2' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ minWidth: 120, fontWeight: 500 }}>Tipo de tratamiento:</span>
                            <input name="tipo de tratamiento" value={editTratamiento?.tipo || ''} onChange={handleEditChange} placeholder="Ej: Desparasitación" style={{ flex: 1 }} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ minWidth: 120, fontWeight: 500 }}>Nombre:</span>
                            <input name="nombre" value={editTratamiento?.nombre || ''} onChange={handleEditChange} placeholder="Ej: Ivermectina" style={{ flex: 1 }} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ minWidth: 120, fontWeight: 500 }}>Motivo:</span>
                            <input name="motivo" value={editTratamiento?.motivo || ''} onChange={handleEditChange} placeholder="Motivo del tratamiento" style={{ flex: 1 }} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ minWidth: 120, fontWeight: 500 }}>Fecha de inicio:</span>
                            <input name="fecha_inicio" type="date" value={editTratamiento?.fecha_inicio || ''} onChange={handleEditChange} style={{ flex: 1 }} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ minWidth: 120, fontWeight: 500 }}>Fecha de fin:</span>
                            <input name="fecha_fin" type="date" value={editTratamiento?.fecha_fin || ''} onChange={handleEditChange} style={{ flex: 1 }} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ minWidth: 120, fontWeight: 500 }}>Duración (días):</span>
                            <input name="duracion_dias" type="number" value={editTratamiento?.duracion_dias || ''} onChange={handleEditChange} style={{ flex: 1 }} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ minWidth: 120, fontWeight: 500 }}>Dosis:</span>
                            <input name="dosis" value={editTratamiento?.dosis || ''} onChange={handleEditChange} placeholder="Ej: 1 ml cada 12h" style={{ flex: 1 }} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ minWidth: 120, fontWeight: 500 }}>Vía de administración:</span>
                            <input name="via_administracion" value={editTratamiento?.via_administracion || ''} onChange={handleEditChange} placeholder="Ej: Oral" style={{ flex: 1 }} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ minWidth: 120, fontWeight: 500 }}>Veterinario:</span>
                            <input name="veterinario" value={editTratamiento?.veterinario || ''} onChange={handleEditChange} placeholder="Nombre del veterinario" style={{ flex: 1 }} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ minWidth: 120, fontWeight: 500 }}>Estado:</span>
                            <select name="estado" value={editTratamiento?.estado || ''} onChange={handleEditChange} style={{ flex: 1 }}>
                              {estadoOpciones.map(e => (
                                <option key={e.value} value={e.value}>{e.label}</option>
                              ))}
                            </select>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ minWidth: 120, fontWeight: 500 }}>Estado de pago:</span>
                            <select name="estado_pago" value={editTratamiento?.estado_pago || ''} onChange={handleEditChange} style={{ flex: 1 }}>
                              {estadoPagoOpciones.map(e => (
                                <option key={e.value} value={e.value}>{e.label}</option>
                              ))}
                            </select>
                          </div>
                          {editTratamiento?.estado_pago === 'parcialmente_pagado' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <span style={{ minWidth: 120, fontWeight: 500 }}>Monto pagado ($):</span>
                              <input name="monto_pagado" type="number" value={editTratamiento?.monto_pagado || ''} onChange={handleEditChange} style={{ flex: 1 }} />
                              <span style={{ color: '#e74c3c', fontWeight: 600, marginLeft: 8 }}>
                                {editTratamiento?.costo && editTratamiento?.monto_pagado !== undefined && editTratamiento?.monto_pagado !== null
                                  ? `Falta por pagar: $${Math.max(0, Number(editTratamiento.costo) - Number(editTratamiento.monto_pagado))}`
                                  : ''}
                              </span>
                            </div>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ minWidth: 120, fontWeight: 500 }}>Costo ($):</span>
                            <input name="costo" type="number" value={editTratamiento?.costo || ''} onChange={handleEditChange} placeholder="Ej: 5000" style={{ flex: 1 }} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ minWidth: 120, fontWeight: 500 }}>Estado de pago:</span>
                            <select name="estado_pago" value={editTratamiento?.estado_pago || ''} onChange={handleEditChange} style={{ flex: 1 }}>
                              {estadoPagoOpciones.map(e => (
                                <option key={e.value} value={e.value}>{e.label}</option>
                              ))}
                            </select>
                          </div>
                          {editTratamiento?.estado_pago === 'parcialmente_pagado' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <span style={{ minWidth: 120, fontWeight: 500 }}>Monto pagado ($):</span>
                              <input name="monto_pagado" type="number" value={editTratamiento?.monto_pagado || ''} onChange={handleEditChange} style={{ flex: 1 }} />
                              <span style={{ color: '#e74c3c', fontWeight: 600, marginLeft: 8 }}>
                                {editTratamiento?.costo && editTratamiento?.monto_pagado !== undefined && editTratamiento?.monto_pagado !== null
                                  ? `Falta por pagar: $${Math.max(0, Number(editTratamiento.costo) - Number(editTratamiento.monto_pagado))}`
                                  : ''}
                              </span>
                            </div>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ minWidth: 120, fontWeight: 500 }}>Observaciones:</span>
                            <input name="observaciones" value={editTratamiento?.observaciones || ''} onChange={handleEditChange} placeholder="Observaciones o evolución" style={{ flex: 1 }} />
                          </div>
                          <input name="tipo de tratamiento" value={editTratamiento?.tipo || ''} onChange={handleEditChange} placeholder="Tipo" style={{ flex: 1, minWidth: 120 }} />
                          <input name="nombre" value={editTratamiento?.nombre || ''} onChange={handleEditChange} placeholder="Nombre" style={{ flex: 1, minWidth: 120 }} />
                          <input name="motivo" value={editTratamiento?.motivo || ''} onChange={handleEditChange} placeholder="Motivo" style={{ flex: 1, minWidth: 120 }} />
                          <input name="fecha_inicio" type="date" value={editTratamiento?.fecha_inicio || ''} onChange={handleEditChange} style={{ flex: 1, minWidth: 120 }} />
                          <input name="fecha_fin" type="date" value={editTratamiento?.fecha_fin || ''} onChange={handleEditChange} style={{ flex: 1, minWidth: 120 }} />
                          <input name="duracion_dias" type="number" value={editTratamiento?.duracion_dias || ''} onChange={handleEditChange} style={{ flex: 1, minWidth: 80 }} />
                          <label style={{ flex: 1, minWidth: 120 }}>
                            Dosis:
                            <input name="dosis" value={editTratamiento?.dosis || ''} onChange={handleEditChange} placeholder="Ej: 1 ml cada 12h" style={{ width: '100%' }} />
                          </label>
                          <label style={{ flex: 1, minWidth: 120 }}>
                            Vía de administración:
                            <input name="via_administracion" value={editTratamiento?.via_administracion || ''} onChange={handleEditChange} placeholder="Ej: Oral" style={{ width: '100%' }} />
                          </label>
                          <label style={{ flex: 1, minWidth: 120 }}>
                            Veterinario:
                            <input name="veterinario" value={editTratamiento?.veterinario || ''} onChange={handleEditChange} placeholder="Nombre del veterinario" style={{ width: '100%' }} />
                          </label>
                          <label style={{ flex: 1, minWidth: 120 }}>
                            Estado:
                            <select name="estado" value={editTratamiento?.estado || ''} onChange={handleEditChange} style={{ width: '100%' }}>
                              {estadoOpciones.map(e => (
                                <option key={e.value} value={e.value}>{e.label}</option>
                              ))}
                            </select>
                          </label>
                          <label style={{ flex: 1, minWidth: 80 }}>
                            Costo ($):
                            <input name="costo" type="number" value={editTratamiento?.costo || ''} onChange={handleEditChange} placeholder="Ej: 5000" style={{ width: '100%' }} />
                          </label>
                          {/* pagado eliminado, ahora estado_pago y monto_pagado */}
                          <label style={{ flex: 2, minWidth: 120 }}>
                            Observaciones:
                            <input name="observaciones" value={editTratamiento?.observaciones || ''} onChange={handleEditChange} placeholder="Observaciones o evolución" style={{ width: '100%' }} />
                          </label>
                          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                            <button style={{ background: '#43a047', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 600 }} onClick={handleEditSave}>Guardar</button>
                            <button style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 600 }} onClick={() => { setEditIdx(null); setEditTratamiento(null); }}>Cancelar</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={idx} style={{ background: idx % 2 === 0 ? '#e3f2fd' : '#bbdefb' }}>
                      <td style={{ padding: 8, border: '1px solid #1976d2' }}>{idx + 1}</td>
                      <td style={{ padding: 8, border: '1px solid #1976d2' }}>{t.tipo}</td>
                      <td style={{ padding: 8, border: '1px solid #1976d2' }}>{t.nombre}</td>
                      <td style={{ padding: 8, border: '1px solid #1976d2' }}>{t.motivo}</td>
                      <td style={{ padding: 8, border: '1px solid #1976d2' }}>{t.fecha_inicio}</td>
                      <td style={{ padding: 8, border: '1px solid #1976d2' }}>{t.fecha_fin || '-'}</td>
                      <td style={{ padding: 8, border: '1px solid #1976d2' }}>{t.duracion_dias || '-'}</td>
                      <td style={{ padding: 8, border: '1px solid #1976d2' }}>{t.dosis}</td>
                      <td style={{ padding: 8, border: '1px solid #1976d2' }}>{t.via_administracion}</td>
                      <td style={{ padding: 8, border: '1px solid #1976d2' }}>{t.veterinario || '-'}</td>
                      <td style={{ padding: 8, border: '1px solid #1976d2' }}>{t.estado}</td>
                      <td style={{ padding: 8, border: '1px solid #1976d2' }}>{t.costo !== undefined && t.costo !== null ? `$${t.costo}` : '-'}</td>
                      <td style={{ padding: 8, border: '1px solid #1976d2' }}>
                        <span style={{ fontWeight: 600, fontSize: 14, background: estadoPagoOpciones.find(e => e.value === t.estado_pago)?.color || '#bbb', color: '#fff', borderRadius: 8, padding: '2px 12px', boxShadow: '0 2px 8px #1976d233' }}>
                          {estadoPagoOpciones.find(e => e.value === t.estado_pago)?.label || t.estado_pago}
                        </span>
                        {t.estado_pago === 'parcialmente_pagado' && t.costo !== undefined && t.monto_pagado !== undefined && (
                          <span style={{ marginLeft: 8, color: '#e74c3c', fontWeight: 500 }}>
                            Pagado: ${t.monto_pagado} <br />Falta: ${Math.max(0, Number(t.costo) - Number(t.monto_pagado))}
                          </span>
                        )}
                        {t.estado_pago === 'pagado' && t.costo !== undefined && (
                          <span style={{ marginLeft: 8, color: '#43a047', fontWeight: 500 }}>
                            Pagado: ${t.costo}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: 8, border: '1px solid #1976d2' }}>{t.observaciones || '-'}</td>
                      <td style={{ padding: 8, border: '1px solid #1976d2', textAlign: 'center' }}>
                        <button style={{ background: '#64b5f6', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', marginRight: 6, cursor: 'pointer', fontWeight: 600 }} onClick={() => { setEditIdx(idx); setEditTratamiento(t); }}>Editar</button>
                        <button style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontWeight: 600 }} onClick={() => setDeleteIdx(idx)}>Eliminar</button>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
              {tratamientos.map((t, idx) => (
                editIdx === idx && editTratamiento ? (
                  <div key={idx} style={{ background: '#fff', border: '2px solid #1976d2', borderRadius: 16, padding: 18, boxShadow: '0 2px 12px #1976d233', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ fontWeight: 700, color: '#1976d2', fontSize: 18, marginBottom: 8 }}>Editar tratamiento</div>
                    <label style={{ fontWeight: 500, marginBottom: 6 }}>Tipo de tratamiento:
                      <input name="tipo" value={editTratamiento?.tipo || ''} onChange={handleEditChange} placeholder="Ej: Desparasitación" style={{ width: '100%', marginTop: 4 }} />
                    </label>
                    <label style={{ fontWeight: 500, marginBottom: 6 }}>Nombre:
                      <input name="nombre" value={editTratamiento?.nombre || ''} onChange={handleEditChange} placeholder="Ej: Ivermectina" style={{ width: '100%', marginTop: 4 }} />
                    </label>
                    <label style={{ fontWeight: 500, marginBottom: 6 }}>Motivo:
                      <input name="motivo" value={editTratamiento?.motivo || ''} onChange={handleEditChange} placeholder="Motivo del tratamiento" style={{ width: '100%', marginTop: 4 }} />
                    </label>
                    <label style={{ fontWeight: 500, marginBottom: 6 }}>Fecha de inicio:
                      <input name="fecha_inicio" type="date" value={editTratamiento?.fecha_inicio || ''} onChange={handleEditChange} style={{ width: '100%', marginTop: 4 }} />
                    </label>
                    <label style={{ fontWeight: 500, marginBottom: 6 }}>Fecha de fin:
                      <input name="fecha_fin" type="date" value={editTratamiento?.fecha_fin || ''} onChange={handleEditChange} style={{ width: '100%', marginTop: 4 }} />
                    </label>
                    <label style={{ fontWeight: 500, marginBottom: 6 }}>Duración (días):
                      <input name="duracion_dias" type="number" value={editTratamiento?.duracion_dias || ''} onChange={handleEditChange} style={{ width: '100%', marginTop: 4 }} />
                    </label>
                    <label style={{ fontWeight: 500, marginBottom: 6 }}>Dosis:
                      <input name="dosis" value={editTratamiento?.dosis || ''} onChange={handleEditChange} placeholder="Ej: 1 ml cada 12h" style={{ width: '100%', marginTop: 4 }} />
                    </label>
                    <label style={{ fontWeight: 500, marginBottom: 6 }}>Vía de administración:
                      <input name="via_administracion" value={editTratamiento?.via_administracion || ''} onChange={handleEditChange} placeholder="Ej: Oral" style={{ width: '100%', marginTop: 4 }} />
                    </label>
                    <label style={{ fontWeight: 500, marginBottom: 6 }}>Veterinario:
                      <input name="veterinario" value={editTratamiento?.veterinario || ''} onChange={handleEditChange} placeholder="Nombre del veterinario" style={{ width: '100%', marginTop: 4 }} />
                    </label>
                    <label style={{ fontWeight: 500, marginBottom: 6 }}>Estado:
                      <select name="estado" value={editTratamiento?.estado || ''} onChange={handleEditChange} style={{ width: '100%', marginTop: 4 }}>
                        {estadoOpciones.map(e => (
                          <option key={e.value} value={e.value}>{e.label}</option>
                        ))}
                      </select>
                    </label>
                    <label style={{ fontWeight: 500, marginBottom: 6 }}>Costo (CLP):
                      <input name="costo" type="number" value={editTratamiento?.costo || ''} onChange={handleEditChange} placeholder="Ej: 5000" style={{ width: '100%', marginTop: 4 }} />
                    </label>
                    <label style={{ fontWeight: 500, marginBottom: 6 }}>Estado de pago:
                      <select name="estado_pago" value={editTratamiento?.estado_pago || ''} onChange={handleEditChange} style={{ width: '100%', marginTop: 4 }}>
                        {estadoPagoOpciones.map(e => (
                          <option key={e.value} value={e.value}>{e.label}</option>
                        ))}
                      </select>
                    </label>
                    {editTratamiento?.estado_pago === 'parcialmente_pagado' && (
                      <label style={{ fontWeight: 500, marginBottom: 6 }}>Monto pagado (CLP):
                        <input name="monto_pagado" type="number" value={editTratamiento?.monto_pagado || ''} onChange={handleEditChange} style={{ width: '100%', marginTop: 4 }} />
                        <span style={{ color: '#e74c3c', fontWeight: 600, marginLeft: 8 }}>
                          {editTratamiento?.costo && editTratamiento?.monto_pagado !== undefined && editTratamiento?.monto_pagado !== null
                            ? `Falta por pagar: $${Math.max(0, Number(editTratamiento.costo) - Number(editTratamiento.monto_pagado))}`
                            : ''}
                        </span>
                      </label>
                    )}
                    <label style={{ fontWeight: 500, marginBottom: 6 }}>Observaciones:
                      <input name="observaciones" value={editTratamiento?.observaciones || ''} onChange={handleEditChange} placeholder="Observaciones o evolución" style={{ width: '100%', marginTop: 4 }} />
                    </label>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button style={{ background: '#43a047', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 600 }} type="button" onClick={handleEditSave}>Guardar</button>
                      <button style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 600 }} onClick={() => { setEditIdx(null); setEditTratamiento(null); }}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div key={idx} style={{ background: 'linear-gradient(120deg, #e3f2fd 60%, #fff 100%)', border: '1.5px solid #90caf9', borderRadius: 18, padding: 20, boxShadow: '0 4px 18px #1976d233', marginBottom: 14, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ position: 'absolute', top: 12, left: 12, fontSize: 22, color: '#1976d2', opacity: 0.18 }}>
                      <span role="img" aria-label="med">💊</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 8 }}>
                      <button style={{ background: '#64b5f6', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontWeight: 600, boxShadow: '0 2px 8px #64b5f633', fontSize: 15 }} onClick={() => { setEditIdx(idx); setEditTratamiento(t); }}>Editar</button>
                      <button style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontWeight: 600, boxShadow: '0 2px 8px #e74c3c33', fontSize: 15 }} onClick={() => setDeleteIdx(idx)}>Eliminar</button>
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
                )
              ))}
            </div>
          )}
        </div>
      )}
      {/* Modal de confirmación para eliminar */}
      {deleteIdx !== null && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(33, 150, 243, 0.18)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #1976d233', padding: 32, minWidth: 320, textAlign: 'center', border: '2px solid #1976d2' }}>
            <h3 style={{ color: '#1976d2', fontWeight: 700, marginBottom: 18 }}>¿Eliminar tratamiento?</h3>
            <div style={{ color: '#333', marginBottom: 18 }}>
              ¿Estás seguro que deseas eliminar este tratamiento?<br />Esta acción no se puede deshacer.
            </div>
            <button type="button" style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: '1.08rem', marginRight: 12, cursor: 'pointer' }} onClick={handleDelete}>Eliminar</button>
            <button type="button" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer' }} onClick={() => setDeleteIdx(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TratamientoForm;
