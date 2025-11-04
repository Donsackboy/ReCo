import React, { useState } from 'react';

export type Tratamiento = {
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
  pagado?: boolean;
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

export interface TratamientoFormProps {
  historial?: Tratamiento[];
  idAnimal: number | string | null;
  onAdd: (tratamiento: Tratamiento) => void;
  onUpdate: (tratamientos: Tratamiento[]) => void;
}

const TratamientoForm: React.FC<TratamientoFormProps> = ({ historial = [], idAnimal, onAdd, onUpdate }) => {
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
    pagado: false,
    observaciones: '',
    adjunto: null,
  });
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editTratamiento, setEditTratamiento] = useState<Tratamiento | null>(null);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validar campos obligatorios
    if (!form.tipo || !form.nombre || !form.motivo || !form.fecha_inicio || !form.dosis || !form.via_administracion || !form.estado) {
      alert('Completa todos los campos obligatorios para guardar el tratamiento.');
      return;
    }
    // Validar id_animal
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
    // Validar estado
    const estadoValidos = ['en_curso', 'pendiente', 'finalizado', 'suspendido'];
    if (!estadoValidos.includes(form.estado)) {
      alert('El estado del tratamiento no es válido.');
      return;
    }
    // Validar fechas
    if (form.fecha_fin && form.fecha_fin < form.fecha_inicio) {
      alert('La fecha de finalización no puede ser anterior a la fecha de inicio.');
      return;
    }
    // Validar duración
    if (form.duracion_dias && (typeof form.duracion_dias !== 'number' || form.duracion_dias < 1)) {
      alert('La duración debe ser un número positivo.');
      return;
    }
    // Validar costo
    if (form.costo && (typeof form.costo !== 'number' || form.costo < 0)) {
      alert('El costo debe ser un número positivo.');
      return;
    }
    try {
      // Formatear fechas a YYYY-MM-DD
      const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return undefined;
        // Si ya está en formato correcto, retorna igual
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
        // Si es un objeto Date, formatear
        try {
          const d = new Date(dateStr);
          if (!isNaN(d.getTime())) {
            return d.toISOString().slice(0, 10);
          }
        } catch {}
        return dateStr;
      };
      onAdd({
        ...form,
        id_animal: id_animal_valid,
        fecha_inicio: formatDate(form.fecha_inicio),
        fecha_fin: formatDate(form.fecha_fin),
      });
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
        pagado: false,
        observaciones: '',
        adjunto: null,
      });
    } catch (err) {
      alert('Error al guardar tratamiento. Intenta nuevamente.');
    }
    setShowForm(false);
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

  const handleEditSave = (e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    if (editTratamiento) {
      const updated = [...historial];
      updated[idx] = editTratamiento;
      onUpdate(updated);
    }
    setEditIdx(null);
    setEditTratamiento(null);
  };

  const confirmDelete = (idx: number) => {
    setDeleteIdx(idx);
  };

  const handleDelete = () => {
    if (deleteIdx !== null) {
      const updated = historial.filter((_, i) => i !== deleteIdx);
      onUpdate(updated);
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
          <div style={{ gridColumn: '1/2' }}>
            <label style={{ fontWeight: 500 }}>Tipo de tratamiento: {requiredMark}
              <select name="tipo" value={form.tipo} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }}>
                <option value="">Selecciona tipo...</option>
                {tipoTratamientoOpciones.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </label>
            <label style={{ fontWeight: 500, marginTop: 8 }}>Nombre del tratamiento / medicamento: {requiredMark}
              <input name="nombre" value={form.nombre} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }} />
            </label>
            <label style={{ fontWeight: 500, marginTop: 8 }}>Motivo del tratamiento: {requiredMark}
              <textarea name="motivo" value={form.motivo} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, minHeight: 40, background: '#fff' }} />
            </label>
            <label style={{ fontWeight: 500, marginTop: 8 }}>Fecha de inicio: {requiredMark}
              <input name="fecha_inicio" type="date" value={form.fecha_inicio} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }} />
            </label>
            <label style={{ fontWeight: 500, marginTop: 8 }}>Fecha de finalización:
              <input name="fecha_fin" type="date" value={form.fecha_fin || ''} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }} />
            </label>
            <label style={{ fontWeight: 500, marginTop: 8 }}>Duración estimada (días):
              <input name="duracion_dias" type="number" value={form.duracion_dias || ''} onChange={handleChange} min={1} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, background: '#fff' }} />
            </label>
          </div>
          <div style={{ gridColumn: '2/3' }}>
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
            <label style={{ fontWeight: 500 }}>Pagado:
              <input name="pagado" type="checkbox" checked={!!form.pagado} onChange={handleChange} style={{ marginLeft: 8 }} />
            </label>
            <label style={{ fontWeight: 500 }}>Observaciones / evolución:
              <textarea name="observaciones" value={form.observaciones || ''} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 4, minHeight: 40, background: '#fff' }} />
            </label>
            <label style={{ fontWeight: 500 }}>Archivo adjunto:
              <input name="adjunto" type="file" onChange={handleFile} style={{ marginTop: 4, background: '#fff' }} />
            </label>
          </div>
          <div style={{ gridColumn: '1/3', textAlign: 'center', marginTop: 18 }}>
            <button type="button" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 38px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 12px #1976d233' }} onClick={handleSubmit}>Guardar tratamiento</button>
            <button type="button" style={{ marginLeft: 16, background: '#eee', color: '#1976d2', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer' }} onClick={() => { setShowForm(false); setForm({ tipo: '', nombre: '', motivo: '', fecha_inicio: '', fecha_fin: '', duracion_dias: undefined, dosis: '', via_administracion: '', veterinario: '', estado: 'Pendiente', costo: undefined, pagado: false, observaciones: '', adjunto: null }); }}>Cancelar</button>
          </div>
        </div>
      )}
      {historial.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h4 style={{ color: '#1976d2', fontWeight: 700 }}>Historial de tratamientos</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
            <thead>
              <tr style={{ background: '#bbdefb' }}>
                <th style={{ padding: 8, border: '1px solid #1976d2' }}>#</th>
                <th style={{ padding: 8, border: '1px solid #1976d2' }}>Tipo</th>
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
                <th style={{ padding: 8, border: '1px solid #1976d2' }}>Pagado</th>
                <th style={{ padding: 8, border: '1px solid #1976d2' }}>Observaciones</th>
                <th style={{ padding: 8, border: '1px solid #1976d2' }}>Editar</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((t, idx) => (
                editIdx === idx ? (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? '#e3f2fd' : '#bbdefb' }}>
                    <td style={{ padding: 8, border: '1px solid #1976d2', fontWeight: 700 }}>{idx + 1}</td>
                    <td style={{ padding: 8, border: '1px solid #1976d2' }}>
                      <select name="tipo" value={editTratamiento?.tipo || ''} onChange={handleEditChange}>
                        {tipoTratamientoOpciones.map(tipo => (
                          <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: 8, border: '1px solid #1976d2' }}><input name="nombre" value={editTratamiento?.nombre || ''} onChange={handleEditChange} /></td>
                    <td style={{ padding: 8, border: '1px solid #1976d2' }}><textarea name="motivo" value={editTratamiento?.motivo || ''} onChange={handleEditChange} /></td>
                    <td style={{ padding: 8, border: '1px solid #1976d2' }}><input name="fecha_inicio" type="date" value={editTratamiento?.fecha_inicio || ''} onChange={handleEditChange} /></td>
                    <td style={{ padding: 8, border: '1px solid #1976d2' }}><input name="fecha_fin" type="date" value={editTratamiento?.fecha_fin || ''} onChange={handleEditChange} /></td>
                    <td style={{ padding: 8, border: '1px solid #1976d2' }}><input name="duracion_dias" type="number" value={editTratamiento?.duracion_dias || ''} onChange={handleEditChange} min={1} /></td>
                    <td style={{ padding: 8, border: '1px solid #1976d2' }}><input name="dosis" value={editTratamiento?.dosis || ''} onChange={handleEditChange} /></td>
                    <td style={{ padding: 8, border: '1px solid #1976d2' }}>
                      <select name="via_administracion" value={editTratamiento?.via_administracion || ''} onChange={handleEditChange}>
                        {viaAdministracionOpciones.map(via => (
                          <option key={via} value={via}>{via}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: 8, border: '1px solid #1976d2' }}><input name="veterinario" value={editTratamiento?.veterinario || ''} onChange={handleEditChange} /></td>
                    <td style={{ padding: 8, border: '1px solid #1976d2' }}>
                      <select name="estado" value={editTratamiento?.estado || 'Pendiente'} onChange={handleEditChange}>
                        {estadoOpciones.map(e => (
                          <option key={e.value} value={e.value}>{e.value}</option>
                        ))}
                      </select>
                      <span style={{ marginLeft: 8, fontWeight: 700, color: estadoOpciones.find(e => e.value === editTratamiento?.estado)?.color }}>{editTratamiento?.estado}</span>
                    </td>
                    <td style={{ padding: 8, border: '1px solid #1976d2' }}><input name="costo" type="number" value={editTratamiento?.costo || ''} onChange={handleEditChange} min={0} /></td>
                    <td style={{ padding: 8, border: '1px solid #1976d2' }}><input name="pagado" type="checkbox" checked={!!editTratamiento?.pagado} onChange={handleEditChange} /></td>
                    <td style={{ padding: 8, border: '1px solid #1976d2' }}><textarea name="observaciones" value={editTratamiento?.observaciones || ''} onChange={handleEditChange} /></td>
                    <td style={{ padding: 8, border: '1px solid #1976d2' }}>
                      <button type="button" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 18px', fontWeight: 700, cursor: 'pointer' }} onClick={e => handleEditSave(e, idx)}>Guardar</button>
                      <button type="button" style={{ marginLeft: 8, background: '#eee', color: '#1976d2', border: 'none', borderRadius: '8px', padding: '6px 12px', fontWeight: 700, cursor: 'pointer' }} onClick={() => { setEditIdx(null); setEditTratamiento(null); }}>Cancelar</button>
                      <button type="button" style={{ marginLeft: 8, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 12px', fontWeight: 700, cursor: 'pointer' }} onClick={() => confirmDelete(idx)}>Eliminar</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? '#e3f2fd' : '#bbdefb' }}>
                    <td style={{ padding: 8, border: '1px solid #1976d2', fontWeight: 700 }}>{idx + 1}</td>
                    <td style={{ padding: 8, border: '1px solid #1976d2' }}>{t.tipo}</td>
                    <td style={{ padding: 8, border: '1px solid #1976d2' }}>{t.nombre}</td>
                    <td style={{ padding: 8, border: '1px solid #1976d2' }}>{t.motivo}</td>
                    <td style={{ padding: 8, border: '1px solid #1976d2' }}>{t.fecha_inicio}</td>
                    <td style={{ padding: 8, border: '1px solid #1976d2' }}>{t.fecha_fin || '-'}</td>
                    <td style={{ padding: 8, border: '1px solid #1976d2' }}>{t.duracion_dias || '-'}</td>
                    <td style={{ padding: 8, border: '1px solid #1976d2' }}>{t.dosis}</td>
                    <td style={{ padding: 8, border: '1px solid #1976d2' }}>{t.via_administracion}</td>
                    <td style={{ padding: 8, border: '1px solid #1976d2' }}>{t.veterinario || '-'}</td>
                    <td style={{ padding: 8, border: '1px solid #1976d2', fontWeight: 700, color: estadoOpciones.find(e => e.value === t.estado)?.color }}>{t.estado}</td>
                    <td style={{ padding: 8, border: '1px solid #1976d2' }}>{t.costo ? `$${t.costo.toLocaleString()}` : '-'}</td>
                    <td style={{ padding: 8, border: '1px solid #1976d2', color: t.pagado ? '#43a047' : '#e74c3c', fontWeight: 700 }}>{t.pagado ? 'Pagado' : 'Pendiente'}</td>
                    <td style={{ padding: 8, border: '1px solid #1976d2' }}>{t.observaciones || '-'}</td>
                    <td style={{ padding: 8, border: '1px solid #1976d2' }}>
                      <button type="button" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 18px', fontWeight: 700, cursor: 'pointer' }} onClick={() => { setEditIdx(idx); setEditTratamiento({ ...t }); }}>Editar</button>
                      <button type="button" style={{ marginLeft: 8, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 12px', fontWeight: 700, cursor: 'pointer' }} onClick={() => confirmDelete(idx)}>Eliminar</button>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
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
