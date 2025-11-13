import React, { useState } from 'react';
import './Vacunas.css';
import type { VacunaInfo } from '../Utils/vacunasEspecies';
import { vacunasPorEspecie } from '../Utils/vacunasEspecies';

interface Vacuna {
  id: number;
  nombre: string;
  tipo: string;
  fecha?: string;
  fecha_aplicacion?: string;
  fecha_refuerzo?: string;
  observaciones?: string;
  unica: boolean;
  refuerzo: boolean;
  proxima?: string;
  especificaciones?: string;
}

interface VacunasProps {
  especie: string;
  vacunas: Vacuna[];
  setVacunas: React.Dispatch<React.SetStateAction<Vacuna[]>>;
  vacunasEliminadas: number[];
  setVacunasEliminadas: React.Dispatch<React.SetStateAction<number[]>>;
}

// --- Componente interno para visualizar y editar vacunas ---
const VacunaItem: React.FC<{
  vacuna: Vacuna;
  frecuencia: string;
  editando: boolean;
  onEditar: () => void;
  onEliminar: () => void;
  onGuardar?: (payload: any) => void;
  onCancelar?: () => void;
}> = ({ vacuna, frecuencia, editando, onEditar, onEliminar, onGuardar, onCancelar }) => {
  const [localTipo, setLocalTipo] = useState(vacuna.tipo);
  const [localNombre, setLocalNombre] = useState(vacuna.nombre);
  const [localFecha, setLocalFecha] = useState(vacuna.fecha_aplicacion || '');
  const [localRefuerzo, setLocalRefuerzo] = useState(vacuna.fecha_refuerzo || '');
  const [localObservaciones, setLocalObservaciones] = useState(vacuna.observaciones || '');
  const [error, setError] = useState<string>('');

  return (
    <li className="vacuna-item">
      {editando ? (
        <div className="vacuna-edit-form" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label>Nombre de la vacuna</label>
          <input
            type="text"
            value={localNombre}
            name="nombre"
            className="form-input"
            onChange={e => setLocalNombre(e.target.value)}
          />
          <label>Fecha de aplicación</label>
          <input
            type="date"
            value={localFecha}
            name="fecha_aplicacion"
            className="form-input"
            onChange={e => setLocalFecha(e.target.value)}
          />
          <label>Tipo</label>
          <div style={{ display: 'flex', gap: 12 }}>
            <label>
              <input
                type="radio"
                name="tipo"
                value="unica"
                checked={localTipo === 'unica'}
                onChange={() => setLocalTipo('unica')}
              /> Única
            </label>
            <label>
              <input
                type="radio"
                name="tipo"
                value="refuerzo"
                checked={localTipo === 'refuerzo'}
                onChange={() => setLocalTipo('refuerzo')}
              /> Refuerzo
            </label>
          </div>
          {localTipo === 'refuerzo' && (
            <>
              <label>Fecha de refuerzo</label>
              <input
                type="date"
                value={localRefuerzo}
                name="fecha_refuerzo"
                className="form-input"
                onChange={e => setLocalRefuerzo(e.target.value)}
              />
            </>
          )}
          <label>Observaciones</label>
          <textarea
            value={localObservaciones}
            name="observaciones"
            className="form-input"
            onChange={e => setLocalObservaciones(e.target.value)}
          />
          {error && <div style={{ color: '#e53935', marginBottom: 8 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button
              type="button"
              className="form-boton-btn"
              onClick={() => {
                setError('');
                if (!localNombre || !localTipo || !localFecha) {
                  setError('Completa los campos obligatorios');
                  return;
                }
                if (onGuardar) {
                  const payload = {
                    nombre: localNombre,
                    tipo: localTipo,
                    fecha_aplicacion: localFecha,
                    observaciones: localObservaciones,
                    ...(localTipo === 'refuerzo' && localRefuerzo ? { fecha_refuerzo: localRefuerzo } : {})
                  };
                  onGuardar(payload);
                }
              }}
            >Guardar</button>
            <button type="button" className="form-boton-btn cancelar-btn" onClick={onCancelar}>
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ background: '#e3f2fd', borderRadius: 6, padding: '6px 12px', fontWeight: 600, fontSize: '1.08em', color: '#1976d2', display: 'flex', alignItems: 'center', boxShadow: '0 1px 4px #90caf9', marginBottom: '8px', minWidth: '180px', flex: '1 1 180px' }}>
              <span style={{ marginRight: 6 }}>💉</span>
              <span style={{ marginRight: 6 }}>Nombre vacuna:</span>
              {vacuna.nombre}
            </div>
            <div style={{ display: 'flex', gap: 8, flex: '0 0 auto', marginLeft: 'auto', marginBottom: '8px' }}>
              <button className="form-boton-btn" onClick={onEditar}>Editar</button>
              <button className="form-boton-btn cancelar-btn" onClick={onEliminar}>Eliminar</button>
            </div>
          </div>
          <div className="vacuna-info">
            <strong>Fecha de aplicación:</strong> {vacuna.fecha_aplicacion || vacuna.fecha || '-'}
          </div>
          <div className="vacuna-info">
            <strong>Aplicación:</strong> {vacuna.tipo === 'unica' ? 'Única' : vacuna.tipo === 'refuerzo' ? 'Requiere refuerzo' : 'No ingresado'}
          </div>
          {vacuna.fecha_refuerzo && (
            <div className="vacuna-info">
              ⏭ <strong>Próximo refuerzo:</strong> {vacuna.fecha_refuerzo}
            </div>
          )}
          {!vacuna.fecha_refuerzo && frecuencia && (
            <div className="vacuna-info">
              📝 <strong>Frecuencia recomendada:</strong> {frecuencia}
            </div>
          )}
          {vacuna.observaciones && (
            <div className="vacuna-info">
              📝 <strong>Observaciones:</strong> {vacuna.observaciones}
            </div>
          )}
        </>
      )}
    </li>
  );
};

// --- Sección principal ---
const VacunasSection: React.FC<VacunasProps> = ({ especie, vacunas, setVacunas, vacunasEliminadas, setVacunasEliminadas }) => {
  const [mostrarComunes, setMostrarComunes] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaVacuna, setNuevaVacuna] = useState<Vacuna>({
    id: 0,
    nombre: '',
    tipo: '',
    fecha: '',
    unica: false,
    refuerzo: false,
    proxima: '',
    especificaciones: ''
  });
  const [vacunaSeleccionada, setVacunaSeleccionada] = useState<string>('');
  const [editandoId, setEditandoId] = useState<number | null>(null);

  function normalizarEspecie(e: string) {
    return e.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ñ/g, 'n').replace(/[^a-zA-Z]/g, '').toLowerCase();
  }

  function buscarClaveEspecie(especie: string): string | undefined {
    const normalizada = normalizarEspecie(especie);
    if (vacunasPorEspecie[normalizada]) return normalizada;
    return Object.keys(vacunasPorEspecie).find(k => normalizarEspecie(k) === normalizada);
  }

  const clave = especie ? buscarClaveEspecie(especie) : undefined;
  const comunes: VacunaInfo[] = clave ? vacunasPorEspecie[clave] : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const { name, value, type } = target;
    if (type === 'checkbox' && target instanceof HTMLInputElement) {
      if (name === 'unica') {
        setNuevaVacuna(v => ({ ...v, unica: target.checked, refuerzo: false }));
      } else if (name === 'refuerzo') {
        setNuevaVacuna(v => ({ ...v, refuerzo: target.checked, unica: false }));
      }
    } else {
      setNuevaVacuna({ ...nuevaVacuna, [name]: value });
    }
  };


  const handleVacunaSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setVacunaSeleccionada(value);
    if (value !== 'otra') {
      setNuevaVacuna({ ...nuevaVacuna, nombre: value, tipo: value });
    } else {
      setNuevaVacuna({ ...nuevaVacuna, nombre: '', tipo: '' });
    }
  };

  // Agregar vacuna localmente
  const handleAgregarVacuna = () => {
    if (!nuevaVacuna.nombre || !nuevaVacuna.fecha) return;
    const nueva = {
      ...nuevaVacuna,
      id: Date.now(), // id temporal único
      fecha_aplicacion: nuevaVacuna.fecha,
      fecha_refuerzo: nuevaVacuna.proxima,
      observaciones: nuevaVacuna.especificaciones,
      tipo: nuevaVacuna.unica ? 'unica' : nuevaVacuna.refuerzo ? 'refuerzo' : '',
    };
    setVacunas(prev => [...prev, nueva]);
    setNuevaVacuna({
      id: 0,
      nombre: '',
      tipo: '',
      fecha: '',
      unica: false,
      refuerzo: false,
      proxima: '',
      especificaciones: ''
    });
    setVacunaSeleccionada('');
    setMostrarFormulario(false);
  };

  // Editar vacuna localmente
  const handleGuardarVacuna = (id: number, payload: any) => {
    setVacunas(prev => prev.map(v => v.id === id ? { ...v, ...payload } : v));
    setEditandoId(null);
  };

  // Eliminar vacuna localmente
  const handleEliminarVacuna = (id: number) => {
    const vacuna = vacunas.find(v => v.id === id);
    if (vacuna && vacuna.id && typeof vacuna.id === 'number' && String(vacuna.id).length < 12) {
      // Si el id parece venir de backend (no es id temporal)
      setVacunasEliminadas(prev => [...prev, vacuna.id]);
    }
    setVacunas(prev => prev.filter(v => v.id !== id));
    setEditandoId(null);
  };

  return (
    <div className="vacunas-container">
      <h3 className="vacunas-titulo">💉 Registro de Vacunas</h3>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <button type="button" onClick={() => setMostrarComunes(v => !v)} className="vacunas-comunes-btn form-boton-btn">
          {mostrarComunes ? 'Ocultar vacunas comunes' : `Vacunas comunes para ${clave ? clave : especie}`}
        </button>
        <span style={{ marginLeft: 12 }}>
          <button
            type="button"
            onClick={() => setMostrarFormulario(v => !v)}
            className={mostrarFormulario ? 'form-boton-btn cancelar-btn' : 'form-boton-btn'}
          >
            {mostrarFormulario ? 'Cancelar' : 'Registrar vacuna'}
          </button>
        </span>
      </div>

      {mostrarComunes && (
        <div className="vacunas-comunes-tarjeta-externa">
          <strong>Vacunas comunes para {clave ? clave.charAt(0).toUpperCase() + clave.slice(1) : especie}:</strong>
          {comunes.length === 0 ? (
            <ul><li>No hay información de vacunas comunes.</li></ul>
          ) : (
            <div className="vacunas-comunes-tarjetas">
              {comunes.map((v, i) => (
                <div key={i} className="vacuna-comun-tarjeta">
                  <div className="vacuna-comun-header">
                    <span className="vacuna-comun-icono">💉</span>
                    <span className="vacuna-comun-nombre">{v.nombre}</span>
                  </div>
                  {v.descripcion && <div className="vacuna-comun-desc">{v.descripcion}</div>}
                  <div className="vacuna-comun-frec">
                    <span className="vacuna-comun-frecuencia">📅 <strong>Frecuencia:</strong> {v.frecuencia}</span>
                    {v.obligatoria && <span className="vacuna-comun-obligatoria"><strong>Obligatoria</strong></span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {mostrarFormulario && (
        <div className="vacunas-formulario">
          <h4 className="form-titulo">Agregar nueva vacuna</h4>
          <div className="form-row">
            <label>Nombre de la vacuna *</label>
            <select name="vacunaSelect" value={vacunaSeleccionada} onChange={handleVacunaSelect} className="form-input">
              <option value="otra">Otra (personalizada)</option>
              {comunes.map((v, i) => (
                <option key={i} value={v.nombre}>{v.nombre}</option>
              ))}
            </select>
            {(vacunaSeleccionada === 'otra' || !vacunaSeleccionada) && (
              <input
                type="text"
                name="nombre"
                value={nuevaVacuna.nombre}
                onChange={handleChange}
                placeholder="Nombre personalizado"
                className="form-input"
                style={{ marginTop: 6 }}
              />
            )}
          </div>

          <div className="form-row">
            <label>Fecha de aplicación *</label>
            <input type="date" name="fecha" value={nuevaVacuna.fecha} onChange={handleChange} />
          </div>

          <div className="form-checks">
            <label><input type="checkbox" name="unica" checked={nuevaVacuna.unica} onChange={handleChange} /> Única</label>
            <label><input type="checkbox" name="refuerzo" checked={nuevaVacuna.refuerzo} onChange={handleChange} /> Refuerzo</label>
          </div>

          {nuevaVacuna.refuerzo && (
            <div className="form-row">
              <label>Próxima vacuna</label>
              <input type="date" name="proxima" value={nuevaVacuna.proxima} onChange={handleChange} />
            </div>
          )}

          <div className="form-row">
            <label>Especificaciones</label>
            <textarea
              name="especificaciones"
              value={nuevaVacuna.especificaciones}
              onChange={handleChange}
              placeholder="Observaciones o detalles..."
            />
          </div>
          <div className="form-boton">
            <button type="button" onClick={handleAgregarVacuna}>Agregar vacuna</button>
          </div>
        </div>
      )}

      {(!vacunas || vacunas.length === 0) ? (
        <div className="vacunas-empty">
          <span role="img" aria-label="vacuna">💉</span> No hay vacunas registradas
        </div>
      ) : (
        <ul className="vacunas-lista">
          {vacunas.map(v => {
            const infoComun = comunes.find(vc => vc.nombre === v.nombre);
            const frecuencia = infoComun ? infoComun.frecuencia : '';
            return (
              <VacunaItem
                key={v.id}
                vacuna={v}
                frecuencia={frecuencia}
                editando={editandoId === v.id}
                onEditar={() => setEditandoId(v.id)}
                onEliminar={() => handleEliminarVacuna(v.id)}
                onGuardar={payload => handleGuardarVacuna(v.id, payload)}
                onCancelar={() => setEditandoId(null)}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default VacunasSection;
