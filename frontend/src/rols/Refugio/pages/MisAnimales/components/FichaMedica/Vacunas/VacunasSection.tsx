// Componente para mostrar una vacuna (visualización y edición)
const VacunaItem: React.FC<{
  vacuna: Vacuna;
  frecuencia: string;
  editando: boolean;
  onEditar: () => void;
  onEliminar: () => void;
  onGuardar?: (payload: any) => void;
  onCancelar?: () => void;
  loading?: boolean;
}> = ({ vacuna, frecuencia, editando, onEditar, onEliminar, onGuardar, onCancelar, loading }) => {
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
          <input type="text" value={localNombre} name="nombre" className="form-input" onChange={e => setLocalNombre(e.target.value)} />
          <label>Fecha de aplicación</label>
          <input type="date" value={localFecha} name="fecha_aplicacion" className="form-input" onChange={e => setLocalFecha(e.target.value)} />
          <label>Tipo</label>
          <div style={{ display: 'flex', gap: 12 }}>
            <label>
              <input type="radio" name="tipo" value="unica" checked={localTipo === 'unica'} onChange={() => setLocalTipo('unica')} /> Única
            </label>
            <label>
              <input type="radio" name="tipo" value="refuerzo" checked={localTipo === 'refuerzo'} onChange={() => setLocalTipo('refuerzo')} /> Refuerzo
            </label>
          </div>
          {localTipo === 'refuerzo' && (
            <>
              <label>Fecha de refuerzo</label>
              <input type="date" value={localRefuerzo} name="fecha_refuerzo" className="form-input" onChange={e => setLocalRefuerzo(e.target.value)} />
            </>
          )}
          <label>Observaciones</label>
          <textarea value={localObservaciones} name="observaciones" className="form-input" onChange={e => setLocalObservaciones(e.target.value)} />
          {error && <div style={{ color: '#e53935', marginBottom: 8 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button
              type="button"
              className="form-boton-btn"
              disabled={loading}
              onClick={() => {
                setError('');
                if (!localNombre || !localTipo || !localFecha) {
                  setError('Completa los campos obligatorios');
                  return;
                }
                if (onGuardar) {
                  const payload: any = {
                    nombre: localNombre,
                    tipo: localTipo,
                    fecha_aplicacion: localFecha,
                    observaciones: localObservaciones,
                    ...(localTipo === 'refuerzo' && localRefuerzo ? { fecha_refuerzo: localRefuerzo } : {})
                  };
                  try {
                    onGuardar(payload);
                  } catch (err) {
                    setError('Error al guardar la vacuna. Intenta de nuevo.');
                  }
                }
              }}
            >Guardar</button>
            <button type="button" className="form-boton-btn cancelar-btn" onClick={onCancelar}>Cancelar</button>
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
          <div style={{ background: '#e3f2fd', borderRadius: 6, padding: '6px 12px', marginBottom: 6, fontSize: '0.98em', color: '#1976d2', display: 'flex', alignItems: 'center', boxShadow: '0 1px 4px #90caf9' }}>
            <strong style={{ marginRight: 6 }}>Fecha de aplicación:</strong> <span style={{ color: '#222' }}>{vacuna.fecha_aplicacion || vacuna.fecha || '-'}</span>
          </div>
          <div style={{ background: '#bbdefb', borderRadius: 6, padding: '6px 12px', marginBottom: 6, fontSize: '0.97em', color: '#1565c0', display: 'flex', alignItems: 'center', boxShadow: '0 1px 4px #90caf9' }}>
            <strong style={{ marginRight: 6 }}>Aplicación:</strong> <span style={{ color: '#222' }}>{vacuna.tipo === 'unica' ? 'Única' : vacuna.tipo === 'refuerzo' ? 'Requiere refuerzo' : 'No ingresado'}</span>
          </div>
          {vacuna.fecha_refuerzo && (
            <div style={{ background: '#e3f2fd', borderRadius: 6, padding: '6px 12px', marginBottom: 6, fontSize: '0.97em', color: '#1976d2', display: 'flex', alignItems: 'center', boxShadow: '0 1px 4px #90caf9' }}>
              ⏭ <strong style={{ marginRight: 6 }}>Próximo refuerzo:</strong> <span style={{ color: '#222' }}>{vacuna.fecha_refuerzo}</span>
            </div>
          )}
          {!vacuna.fecha_refuerzo && frecuencia && (
            <div style={{ background: '#e3f2fd', borderRadius: 6, padding: '6px 12px', marginBottom: 6, fontSize: '0.97em', color: '#0288d1', display: 'flex', alignItems: 'center', boxShadow: '0 1px 4px #90caf9' }}>
              📝 <strong style={{ marginRight: 6 }}>Frecuencia recomendada:</strong> <span style={{ color: '#222' }}>{frecuencia}</span>
            </div>
          )}
          {vacuna.observaciones && (
            <div style={{ background: '#e3f2fd', borderRadius: 6, padding: '6px 12px', marginBottom: 2, fontSize: '0.97em', color: '#1976d2', display: 'flex', alignItems: 'center', boxShadow: '0 1px 4px #90caf9' }}>
              📝 <strong style={{ marginRight: 6 }}>Observaciones:</strong> <span style={{ color: '#222' }}>{vacuna.observaciones}</span>
            </div>
          )}
        </>
      )}
    </li>
  );
};

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

// No backend imports needed

interface VacunasProps {
  especie: string;
  vacunas: Vacuna[];
  setVacunas: React.Dispatch<React.SetStateAction<Vacuna[]>>;
}

const VacunasSection: React.FC<VacunasProps> = ({ especie, vacunas, setVacunas }) => {
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
  // const [loading, setLoading] = useState(false); // not needed
  const [modalEliminar, setModalEliminar] = useState<{ open: boolean; id?: number; error?: string }>({ open: false });
  const [editandoId, setEditandoId] = useState<number | null>(null);

  // LOG: Estado inicial
  console.log('[VacunasSection] Render', {
    mostrarComunes,
    mostrarFormulario,
    nuevaVacuna,
    vacunaSeleccionada,
    vacunas,
  // loading,
    modalEliminar,
    editandoId
  });
  // Vacunas are now managed by parent, so no fetching here

  // Normaliza la especie para buscar en vacunasPorEspecie
  function normalizarEspecie(e: string) {
    return e
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // quita tildes
      .replace(/ñ/g, 'n')
      .replace(/[^a-zA-Z]/g, '') // quita espacios y caracteres especiales
      .toLowerCase();
  }
  // Busca la clave más parecida en vacunasPorEspecie
  function buscarClaveEspecie(especie: string): string | undefined {
    const normalizada = normalizarEspecie(especie);
    // Si hay coincidencia exacta, úsala
    if (vacunasPorEspecie[normalizada]) return normalizada;
    // Si no, busca por aproximación
    return Object.keys(vacunasPorEspecie).find(
      k => normalizarEspecie(k) === normalizada
    );
  }
  const clave = especie ? buscarClaveEspecie(especie) : undefined;
  const comunes: VacunaInfo[] = clave ? vacunasPorEspecie[clave] : [];


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, value, type } = target;
    if (type === 'checkbox') {
      if (name === 'unica') {
        setNuevaVacuna(v => ({
          ...v,
          unica: (target as HTMLInputElement).checked,
          refuerzo: false
        }));
      } else if (name === 'refuerzo') {
        setNuevaVacuna(v => ({
          ...v,
          refuerzo: (target as HTMLInputElement).checked,
          unica: false
        }));
      } else {
        setNuevaVacuna({
          ...nuevaVacuna,
          [name]: (target as HTMLInputElement).checked
        });
      }
    } else {
      setNuevaVacuna({
        ...nuevaVacuna,
        [name]: value
      });
    }
  };

  const handleVacunaSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setVacunaSeleccionada(value);
    if (value !== 'otra') {
      setNuevaVacuna({
        ...nuevaVacuna,
        nombre: value,
        tipo: value
      });
    } else {
      setNuevaVacuna({
        ...nuevaVacuna,
        nombre: '',
        tipo: ''
      });
    }
  };

  const agregarVacuna = () => {
    const tipoVacuna = nuevaVacuna.unica ? 'unica' : nuevaVacuna.refuerzo ? 'refuerzo' : '';
    if (!nuevaVacuna.nombre || !tipoVacuna || !nuevaVacuna.fecha) {
      alert('Completa los campos obligatorios');
      return;
    }
    const nueva: Vacuna = {
      ...nuevaVacuna,
      tipo: tipoVacuna,
      fecha_aplicacion: nuevaVacuna.fecha,
      fecha_refuerzo: nuevaVacuna.refuerzo ? nuevaVacuna.proxima : undefined,
      observaciones: nuevaVacuna.especificaciones || '',
      id: Date.now() // temp id for local
    };
    setVacunas(prev => [...prev, nueva]);
    setMostrarFormulario(false);
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
  };

  return (
      <div className="vacunas-container">
        <h3 className="vacunas-titulo">💉 Registro de Vacunas</h3>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <button
            type="button"
            onClick={() => setMostrarComunes((v) => !v)}
            className="vacunas-comunes-btn form-boton-btn"
          >
            {mostrarComunes
              ? 'Ocultar vacunas comunes'
              : `Vacunas comunes para ${clave ? clave : (especie || '...')}`}
          </button>
          <span style={{ marginLeft: 12 }}>
            <button
              type="button"
              onClick={() => setMostrarFormulario((v) => !v)}
              className={mostrarFormulario ? 'form-boton-btn cancelar-btn' : 'form-boton-btn'}
            >
              {mostrarFormulario ? 'Cancelar' : 'Registrar vacuna'}
            </button>
          </span>
        </div>

        {mostrarComunes && (
          <div className="vacunas-comunes-tarjeta-externa">
            <strong>Vacunas comunes para {clave ? clave.charAt(0).toUpperCase() + clave.slice(1) : especie}:</strong>
            <div style={{ fontSize: '0.85em', color: '#888', marginBottom: 4 }}>
            </div>
            {comunes.length === 0 ? (
              <ul>
                <li>No hay información de vacunas comunes para esta especie.</li>
              </ul>
            ) : (
              <div className="vacunas-comunes-tarjetas">
                {comunes.map((v, i) => (
                  <div key={i} className="vacuna-comun-tarjeta">
                    <div className="vacuna-comun-header">
                      <span className="vacuna-comun-icono">💉</span>
                      <span className="vacuna-comun-nombre">{v.nombre}</span>
                    </div>
                    {v.descripcion && (
                      <div className="vacuna-comun-desc">{v.descripcion}</div>
                    )}
                    <div className="vacuna-comun-frec">
                      <span className="vacuna-comun-frecuencia">📅 <strong>Frecuencia:</strong> {v.frecuencia}</span>
                      {v.obligatoria && (
                        <span className="vacuna-comun-obligatoria"><strong>Obligatoria</strong></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* La lista de vacunas o el mensaje vacío ahora va debajo del formulario */}
        {mostrarFormulario && (
          <div className="vacunas-formulario">
            <h4 className="form-titulo">Agregar nueva vacuna</h4>
            <div className="form-row">
              <label>Nombre de la vacuna *</label>
              <select
                name="vacunaSelect"
                value={vacunaSeleccionada}
                onChange={handleVacunaSelect}
                className="form-input"
                style={{ marginBottom: 8 }}
              >
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
                  placeholder="Nombre personalizado de la vacuna"
                  className="form-input"
                  style={{ marginTop: 6 }}
                />
              )}
            </div>

            <div className="form-row">
              <label>Fecha de aplicación *</label>
              <input
                type="date"
                name="fecha"
                value={nuevaVacuna.fecha}
                onChange={handleChange}
              />
            </div>

            <div className="form-checks">
              <label>
                <input
                  type="checkbox"
                  name="unica"
                  checked={nuevaVacuna.unica}
                  onChange={handleChange}
                />
                Única
              </label>
              <label>
                <input
                  type="checkbox"
                  name="refuerzo"
                  checked={nuevaVacuna.refuerzo}
                  onChange={handleChange}
                />
                Refuerzo
              </label>
            </div>
            {nuevaVacuna.refuerzo && (
              <div className="form-row">
                <label>Próxima vacuna</label>
                <input
                  type="date"
                  name="proxima"
                  value={nuevaVacuna.proxima}
                  onChange={handleChange}
                />
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
              <button type="button" onClick={agregarVacuna}>Agregar vacuna</button>
            </div>
          </div>
        )}

        {/* Lista de vacunas o mensaje vacío debajo del formulario */}
        {(!vacunas || vacunas.length === 0) ? (
          <div className="vacunas-empty" style={{ marginTop: 24 }}>
            <span role="img" aria-label="vacuna" style={{ fontSize: '1.5rem', marginRight: 8 }}>💉</span>
            No hay vacunas registradas
          </div>
        ) : (
          <>
            <ul className="vacunas-lista" style={{ marginTop: 24 }}>
              {vacunas.map((v) => {
                const infoComun = comunes.find(vc => vc.nombre === v.nombre);
                const frecuencia = infoComun ? infoComun.frecuencia : '';
                return (
                  <VacunaItem
                    key={v.id}
                    vacuna={v}
                    frecuencia={frecuencia}
                    editando={editandoId === v.id}
                    onEditar={() => {
                      console.log('[VacunasSection] Editar vacuna', v.id);
                      setEditandoId(v.id);
                    }}
                    onEliminar={() => {
                      console.log('[VacunasSection] Abrir modal eliminar', v.id);
                      setModalEliminar({ open: true, id: v.id });
                    }}
                    onGuardar={payload => {
                      // Actualiza solo el array local de vacunas
                      setVacunas(prev => prev.map(vac => vac.id === v.id ? { ...vac, ...payload } : vac));
                      setEditandoId(null);
                      console.log('[VacunasSection] Edición local guardada, pendiente guardar en BD');
                    }}
                    onCancelar={() => {
                      console.log('[VacunasSection] Cancelar edición vacuna', v.id);
                      setEditandoId(null);
                    }}
                    // loading={loading}
                  />
                );
              })}
            </ul>
            {/* Modal de confirmación para eliminar vacuna */}
            {modalEliminar.open && (
              <div style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(25,118,210,0.18)', zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{
                  background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #90caf9', padding: '32px 28px', minWidth: 320, textAlign: 'center', border: '2px solid #1976d2'
                }}>
                  <h3 style={{ color: '#1976d2', marginBottom: 18 }}>¿Eliminar vacuna?</h3>
                  <p style={{ color: '#333', marginBottom: 18 }}>Esta acción no se puede deshacer.<br />¿Estás seguro que deseas eliminar esta vacuna?</p>
                  {modalEliminar.error && (
                    <div style={{ color: '#e53935', marginBottom: 12 }}>
                      {modalEliminar.error}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                    <button
                      style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 600, fontSize: '1em', boxShadow: '0 1px 4px #90caf9', cursor: 'pointer' }}
                      onClick={e => {
                        e.stopPropagation();
                        console.log('[VacunasSection] Confirmar eliminar vacuna', modalEliminar.id);
                        if (modalEliminar.id) {
                          setVacunas(prev => prev.filter(v => v.id !== modalEliminar.id));
                          setModalEliminar({ open: false });
                          alert('Vacuna eliminada localmente. Se guardará en BD al guardar la ficha médica.');
                        }
                      }}
                    >Eliminar</button>
                    <button
                      style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 600, fontSize: '1em', boxShadow: '0 1px 4px #90caf9', cursor: 'pointer' }}
                      onClick={e => {
                        e.stopPropagation();
                        setModalEliminar({ open: false });
                        console.log('[VacunasSection] Modal eliminar cancelado');
                      }}
                    >Cancelar</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  export default VacunasSection;
