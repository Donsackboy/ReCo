import React, { useState } from 'react';
import './CirugiaForm.css';
import { cirugiasPorEspecie } from './cirugiasEspecies';

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
  adjunto?: string | File;
};

interface CirugiaFormProps {
  initial?: Partial<Cirugia>;
  onSave: (data: Cirugia) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
  isEdit?: boolean;
  noForm?: boolean;
  especie?: string;
}

const PAGO_ESTADO_OPCIONES = [
  { value: 'pagada', label: 'Pagada' },
  { value: 'no_pagada', label: 'No pagada' },
  { value: 'parcial', label: 'Parcialmente pagada' },
];

const CirugiaForm: React.FC<CirugiaFormProps> = ({ initial = {}, onSave, onCancel, onDelete, isEdit, noForm, especie }) => {
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(f => ({ ...f, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setForm(f => ({ ...f, adjunto: e.target.files![0] }));
    } else {
      setFile(null);
      setForm(f => ({ ...f, adjunto: undefined }));
    }
  };

  // Validación de campos obligatorios
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.tipo) newErrors.tipo = 'El tipo de cirugía es obligatorio.';
    if (form.tipo === 'Otro' && !form.otro_nombre) newErrors.otro_nombre = 'Debes ingresar el nombre personalizado.';
    if (!form.fecha) newErrors.fecha = 'La fecha es obligatoria.';
    if (!form.costo && form.costo !== 0) newErrors.costo = 'El costo es obligatorio.';
    if (!form.pago_estado) newErrors.pago_estado = 'El estado de pago es obligatorio.';
    if (!form.monto_pagado && form.monto_pagado !== 0) newErrors.monto_pagado = 'El monto pagado es obligatorio.';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    let dataToSend: any = { ...form };
    // El campo adjunto ya está en form si hay archivo
    await onSave(dataToSend);
    setLoading(false);
  };

  // Obtener opciones de cirugía según especie
  // Normalizar especie para buscar en el mapeo (mayúsculas/minúsculas)
  const normalizarEspecie = (esp: string | undefined) => {
    if (!esp) return undefined;
    // Buscar coincidencia exacta, luego por lower/upper
    if (cirugiasPorEspecie[esp]) return esp;
    const keys = Object.keys(cirugiasPorEspecie);
    const match = keys.find(k => k.toLowerCase() === esp.toLowerCase());
    return match;
  };
  const especieKey = normalizarEspecie(especie);
  const cirugiaOpciones = especieKey ? cirugiasPorEspecie[especieKey] : null;

  // Estado para mostrar input personalizado si se elige 'Otro'
  const isOtro = form.tipo === 'Otro';
  // Obtener descripción de la cirugía seleccionada
  const selectedDescripcion = cirugiaOpciones && form.tipo && form.tipo !== 'Otro'
    ? cirugiaOpciones.find(opt => opt.nombre === form.tipo)?.descripcion
    : '';

  // Tarjeta visual para el formulario (sin <form>)
  if (noForm) {
    return (
      <div className="cirugia-form-card">
        <div className="cirugia-form">
          <div className="form-row">
            <label htmlFor="tipo">Tipo de cirugía*:</label>
            {cirugiaOpciones ? (
              <>
                <select
                  id="tipo"
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="">Selecciona tipo de cirugía</option>
                  <option value="Otro">Otro</option>
                  {cirugiaOpciones.map(opt => (
                    <option key={opt.nombre} value={opt.nombre}>{opt.nombre}</option>
                  ))}
                </select>
                {isOtro && (
                  <div className="form-row">
                    <label htmlFor="otro_nombre">Nombre personalizado:</label>
                    <input
                      id="otro_nombre"
                      name="otro_nombre"
                      value={form.otro_nombre}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="Escribe el nombre de la cirugía"
                    />
                  </div>
                )}
                {!isOtro && selectedDescripcion && (
                  <div style={{ fontSize: '0.97em', color: '#1976d2', marginTop: 4, marginBottom: 4 }}>
                    <strong>Descripción:</strong> {selectedDescripcion}
                  </div>
                )}
              </>
            ) : (
              <input id="tipo" name="tipo" value={form.tipo} onChange={handleChange} required className="form-input" />
            )}
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
            <button type="button" className="form-boton-btn" disabled={loading} onClick={async () => { setLoading(true); await onSave(form); setLoading(false); }}>{isEdit ? 'Guardar cambios' : 'Registrar cirugía'}</button>
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
          <label htmlFor="tipo">Tipo de cirugía <span style={{ color: 'red' }}>(*)</span>:</label>
          {cirugiaOpciones ? (
            <>
                <select
                  id="tipo"
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  required
                  className="form-input"
                  style={errors.tipo ? { borderColor: 'red' } : {}}
                >
                {errors.tipo && <div style={{ color: 'red', fontSize: '0.95em', marginTop: 2 }}>{errors.tipo}</div>}
                <option value="">Selecciona tipo de cirugía</option>
                <option value="Otro">Otro</option>
                {cirugiaOpciones.map(opt => (
                  <option key={opt.nombre} value={opt.nombre}>{opt.nombre}</option>
                ))}
              </select>
              {isOtro && (
                <div className="form-row">
                  <label htmlFor="otro_nombre">Nombre personalizado <span style={{ color: 'red' }}>(*)</span>:</label>
                  {errors.otro_nombre && <div style={{ color: 'red', fontSize: '0.95em', marginTop: 2 }}>{errors.otro_nombre}</div>}
                  <input
                    id="otro_nombre"
                    name="otro_nombre"
                    value={form.otro_nombre}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="Escribe el nombre de la cirugía"
                  />
                </div>
              )}
              {!isOtro && selectedDescripcion && (
                <div style={{ fontSize: '0.97em', color: '#1976d2', marginTop: 4, marginBottom: 4 }}>
                  <strong>Descripción:</strong> {selectedDescripcion}
                </div>
              )}
            </>
          ) : (
            <input id="tipo" name="tipo" value={form.tipo} onChange={handleChange} required className="form-input" />
          )}
        </div>
        <div className="form-row">
          <label htmlFor="motivo">Motivo:</label>
          <textarea id="motivo" name="motivo" value={form.motivo} onChange={handleChange} className="form-input" />
        </div>
        <div className="form-row">
          <label htmlFor="fecha">Fecha <span style={{ color: 'red' }}>(*)</span>:</label>
          <input id="fecha" type="date" name="fecha" value={form.fecha} onChange={handleChange} required className="form-input" style={errors.fecha ? { borderColor: 'red' } : {}} />
          {errors.fecha && <div style={{ color: 'red', fontSize: '0.95em', marginTop: 2 }}>{errors.fecha}</div>}
        </div>
        <div className="form-row">
          <label htmlFor="costo">Costo <span style={{ color: 'red' }}>(*)</span>:</label>
          <input id="costo" type="number" name="costo" value={form.costo} onChange={handleChange} required className="form-input" min={0} step={0.01} style={errors.costo ? { borderColor: 'red' } : {}} />
          {errors.costo && <div style={{ color: 'red', fontSize: '0.95em', marginTop: 2 }}>{errors.costo}</div>}
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
          <label htmlFor="pago_estado">Estado de pago <span style={{ color: 'red' }}>(*)</span>:</label>
          <select id="pago_estado" name="pago_estado" value={form.pago_estado} onChange={handleChange} required className="form-input" style={errors.pago_estado ? { borderColor: 'red' } : {}}>
          {errors.pago_estado && <div style={{ color: 'red', fontSize: '0.95em', marginTop: 2 }}>{errors.pago_estado}</div>}
            {PAGO_ESTADO_OPCIONES.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="monto_pagado">Monto pagado <span style={{ color: 'red' }}>(*)</span>:</label>
          <input id="monto_pagado" type="number" name="monto_pagado" value={form.monto_pagado} onChange={handleChange} required className="form-input" min={0} step={0.01} style={errors.monto_pagado ? { borderColor: 'red' } : {}} />
          {errors.monto_pagado && <div style={{ color: 'red', fontSize: '0.95em', marginTop: 2 }}>{errors.monto_pagado}</div>}
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