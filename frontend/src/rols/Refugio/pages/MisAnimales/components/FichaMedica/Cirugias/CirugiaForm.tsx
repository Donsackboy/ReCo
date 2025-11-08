import React, { useState } from 'react';
import './CirugiaForm.css';

export type Cirugia = {
  id_cirugia?: number;
  id_animal: number;
  tipo: string;
  otro_nombre?: string;
  motivo?: string;
  fecha: string;
  costo: number;
  veterinario?: string;
  observaciones?: string;
  pago_estado: string;
  monto_pagado: number;
  adjunto?: string;
};

interface CirugiaFormProps {
  initial?: Partial<Cirugia>;
  onSave: (data: Cirugia) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
  isEdit?: boolean;
  noForm?: boolean;
}

const PAGO_ESTADO_OPCIONES = [
  { value: 'pagada', label: 'Pagada' },
  { value: 'no_pagada', label: 'No pagada' },
  { value: 'parcial', label: 'Parcialmente pagada' },
];

const CirugiaForm: React.FC<CirugiaFormProps> = ({ initial = {}, onSave, onCancel, onDelete, isEdit, noForm }) => {
  const [form, setForm] = useState<Cirugia>({
    id_animal: initial.id_animal || 0,
    tipo: initial.tipo || '',
    otro_nombre: initial.otro_nombre || '',
    motivo: initial.motivo || '',
    fecha: initial.fecha || '',
    costo: initial.costo || 0,
    veterinario: initial.veterinario || '',
    observaciones: initial.observaciones || '',
    pago_estado: initial.pago_estado || 'no_pagada',
    monto_pagado: initial.monto_pagado || 0,
    adjunto: initial.adjunto || '',
  });
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(f => ({ ...f, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let dataToSend: any = { ...form };
    if (file) {
      // Usar FormData si hay archivo
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value as any);
      });
      formData.append('adjunto', file);
      dataToSend = formData;
    }
    await onSave(dataToSend);
    setLoading(false);
  };

  // Tarjeta visual para el formulario
  if (noForm) {
    return (
      <div className="cirugia-form-card">
        <div className="cirugia-form">
          <div className="form-row">
            <label htmlFor="tipo">Tipo de cirugía*:</label>
            <input id="tipo" name="tipo" value={form.tipo} onChange={handleChange} required className="form-input" />
          </div>
          <div className="form-row">
            <label htmlFor="otro_nombre">Otro nombre:</label>
            <input id="otro_nombre" name="otro_nombre" value={form.otro_nombre} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-row">
            <label htmlFor="motivo">Motivo:</label>
            <textarea id="motivo" name="motivo" value={form.motivo} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-row">
            <label htmlFor="fecha">Fecha*:</label>
            <input id="fecha" type="date" name="fecha" value={form.fecha} onChange={handleChange} required className="form-input" />
          </div>
          <div className="form-row">
            <label htmlFor="costo">Costo*:</label>
            <input id="costo" type="number" name="costo" value={form.costo} onChange={handleChange} required className="form-input" min={0} step={0.01} />
          </div>
          <div className="form-row">
            <label htmlFor="veterinario">Veterinario / clínica:</label>
            <input id="veterinario" name="veterinario" value={form.veterinario} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-row">
            <label htmlFor="observaciones">Observaciones:</label>
            <textarea id="observaciones" name="observaciones" value={form.observaciones} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-row">
            <label htmlFor="pago_estado">Estado de pago*:</label>
            <select id="pago_estado" name="pago_estado" value={form.pago_estado} onChange={handleChange} required className="form-input">
              {PAGO_ESTADO_OPCIONES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="monto_pagado">Monto pagado*:</label>
            <input id="monto_pagado" type="number" name="monto_pagado" value={form.monto_pagado} onChange={handleChange} required className="form-input" min={0} step={0.01} />
          </div>
          <div className="form-row">
            <label htmlFor="adjunto">Adjunto (archivo):</label>
            <input id="adjunto" type="file" name="adjunto" onChange={handleFileChange} className="form-input" />
            {file && <span style={{ fontSize: 13, color: '#1976d2', marginLeft: 8 }}>Archivo seleccionado: {file.name}</span>}
          </div>
          <div className="form-actions">
            <button type="button" className="form-boton-btn" disabled={loading} onClick={() => onSave(form)}>{isEdit ? 'Guardar cambios' : 'Registrar cirugía'}</button>
            <button type="button" className="form-boton-btn cancelar-btn" onClick={onCancel}>Cancelar</button>
            {isEdit && onDelete && (
              <button type="button" className="form-boton-btn cancelar-btn" style={{ background: '#e53935' }} onClick={onDelete}>Eliminar</button>
            )}
          </div>
        </div>
      </div>
    );
  }
  // Por defecto, renderiza como form
  return (
    <div className="cirugia-form-card">
      <form className="cirugia-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="tipo">Tipo de cirugía*:</label>
          <input id="tipo" name="tipo" value={form.tipo} onChange={handleChange} required className="form-input" />
        </div>
        <div className="form-row">
          <label htmlFor="otro_nombre">Otro nombre:</label>
          <input id="otro_nombre" name="otro_nombre" value={form.otro_nombre} onChange={handleChange} className="form-input" />
        </div>
        <div className="form-row">
          <label htmlFor="motivo">Motivo:</label>
          <textarea id="motivo" name="motivo" value={form.motivo} onChange={handleChange} className="form-input" />
        </div>
        <div className="form-row">
          <label htmlFor="fecha">Fecha*:</label>
          <input id="fecha" type="date" name="fecha" value={form.fecha} onChange={handleChange} required className="form-input" />
        </div>
        <div className="form-row">
          <label htmlFor="costo">Costo*:</label>
          <input id="costo" type="number" name="costo" value={form.costo} onChange={handleChange} required className="form-input" min={0} step={0.01} />
        </div>
        <div className="form-row">
          <label htmlFor="veterinario">Veterinario / clínica:</label>
          <input id="veterinario" name="veterinario" value={form.veterinario} onChange={handleChange} className="form-input" />
        </div>
        <div className="form-row">
          <label htmlFor="observaciones">Observaciones:</label>
          <textarea id="observaciones" name="observaciones" value={form.observaciones} onChange={handleChange} className="form-input" />
        </div>
        <div className="form-row">
          <label htmlFor="pago_estado">Estado de pago*:</label>
          <select id="pago_estado" name="pago_estado" value={form.pago_estado} onChange={handleChange} required className="form-input">
            {PAGO_ESTADO_OPCIONES.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="monto_pagado">Monto pagado*:</label>
          <input id="monto_pagado" type="number" name="monto_pagado" value={form.monto_pagado} onChange={handleChange} required className="form-input" min={0} step={0.01} />
        </div>
        <div className="form-row">
          <label htmlFor="adjunto">Adjunto (archivo):</label>
          <input id="adjunto" type="file" name="adjunto" onChange={handleFileChange} className="form-input" />
          {file && <span style={{ fontSize: 13, color: '#1976d2', marginLeft: 8 }}>Archivo seleccionado: {file.name}</span>}
        </div>
        <div className="form-actions">
          <button type="submit" className="form-boton-btn" disabled={loading}>{isEdit ? 'Guardar cambios' : 'Registrar cirugía'}</button>
          <button type="button" className="form-boton-btn cancelar-btn" onClick={onCancel}>Cancelar</button>
          {isEdit && onDelete && (
            <button type="button" className="form-boton-btn cancelar-btn" style={{ background: '#e53935' }} onClick={onDelete}>Eliminar</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CirugiaForm;