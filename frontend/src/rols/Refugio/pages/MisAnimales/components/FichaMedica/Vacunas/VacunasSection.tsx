
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

import { useEffect } from 'react';
import { getVacunas, createVacuna, deleteVacuna } from 'src/api';
import { updateVacuna } from 'src/api/vacunas';

interface VacunasProps {
  especie: string;
  animalId: number;
  token: string;
}

const VacunasSection: React.FC<VacunasProps> = ({ especie, animalId, token }) => {
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
  const [vacunas, setVacunas] = useState<Vacuna[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalEliminar, setModalEliminar] = useState<{ open: boolean; id?: number }>({ open: false });
  const [editandoId, setEditandoId] = useState<number | null>(null);
  // Obtener vacunas al montar el componente
  useEffect(() => {
    async function fetchVacunas() {
      setLoading(true);
      try {
        const data = await getVacunas(token, animalId);
        setVacunas(data);
      } catch (err) {
        // Puedes mostrar un error aquí
      }
      setLoading(false);
    }
    if (animalId && token) fetchVacunas();
  }, [animalId, token]);

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

  const agregarVacuna = async () => {
    // El tipo se determina por el checkbox, no por el select
    const tipoVacuna = nuevaVacuna.unica ? 'unica' : nuevaVacuna.refuerzo ? 'refuerzo' : '';
    if (!nuevaVacuna.nombre || !tipoVacuna || !nuevaVacuna.fecha) return alert('Completa los campos obligatorios');
    setLoading(true);
    try {
      // Adaptar los campos al modelo del backend
      const payload = {
        nombre: nuevaVacuna.nombre,
        tipo: tipoVacuna,
        fecha_aplicacion: nuevaVacuna.fecha,
        fecha_refuerzo: nuevaVacuna.refuerzo ? nuevaVacuna.proxima : null,
        observaciones: nuevaVacuna.especificaciones || '',
        animal: animalId
      };
      await createVacuna(token, animalId, payload);
      // Refrescar vacunas
      const data = await getVacunas(token, animalId);
      setVacunas(data);
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
    } catch (err) {
      alert('Error al registrar la vacuna');
    }
    setLoading(false);
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
              {mostrarFormulario ? 'Cancelar' : 'Agregar nueva vacuna'}
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
        {loading ? (
          <div style={{ marginTop: 24 }}>Cargando vacunas...</div>
        ) : (!vacunas || vacunas.length === 0) ? (
          <div className="vacunas-empty" style={{ marginTop: 24 }}>
            <span role="img" aria-label="vacuna" style={{ fontSize: '1.5rem', marginRight: 8 }}>💉</span>
            No hay vacunas registradas
          </div>
        ) : (
          <ul className="vacunas-lista" style={{ marginTop: 24 }}>
            {vacunas.map((v, i) => {
              const infoComun = comunes.find(vc => vc.nombre === v.nombre);
              const frecuencia = infoComun ? infoComun.frecuencia : '';
              // Si está en modo edición, mostrar el formulario inline
              if (editandoId === v.id) {
                return (
                  <li key={i} className="vacuna-item" style={{
                    background: '#f8fbff',
                    border: '1px solid #d0e6fa',
                    borderRadius: '10px',
                    marginBottom: '10px',
                    padding: '10px 8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    maxWidth: '480px',
                    width: '100%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}>
                    <div
                      className="vacuna-edit-form"
                      style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                    >
                      <label>Nombre de la vacuna</label>
                      <input type="text" defaultValue={v.nombre} name="nombre" className="form-input" id={`edit-nombre-${v.id}`} />
                      <label>Fecha de aplicación</label>
                      <input type="date" defaultValue={v.fecha_aplicacion} name="fecha_aplicacion" className="form-input" id={`edit-fecha-aplicacion-${v.id}`} />
                      <label>Tipo</label>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <label>
                          <input
                            type="radio"
                            name={`edit-tipo-radio-${v.id}`}
                            value="unica"
                            defaultChecked={v.tipo === 'unica'}
                            onChange={e => {
                              const refuerzoInput = document.getElementById(`edit-fecha-refuerzo-${v.id}`) as HTMLInputElement;
                              if (refuerzoInput) refuerzoInput.value = '';
                            }}
                          />
                          Única
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`edit-tipo-radio-${v.id}`}
                            value="refuerzo"
                            defaultChecked={v.tipo === 'refuerzo'}
                          />
                          Refuerzo
                        </label>
                      </div>
                      {/* Solo mostrar fecha de refuerzo si tipo es refuerzo */}
                      {((document.getElementsByName(`edit-tipo-radio-${v.id}`)[1] as HTMLInputElement)?.checked || v.tipo === 'refuerzo') && (
                        <>
                          <label>Fecha de refuerzo</label>
                          <input type="date" defaultValue={v.fecha_refuerzo || ''} name="fecha_refuerzo" className="form-input" id={`edit-fecha-refuerzo-${v.id}`} />
                        </>
                      )}
                      <label>Observaaciones</label>
                      <textarea defaultValue={v.observaciones || ''} name="observaciones" className="form-input" id={`edit-observaciones-${v.id}`} />
                      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                        <button type="button" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 600, fontSize: '1em', boxShadow: '0 1px 4px #90caf9', cursor: 'pointer' }}
                          onClick={async () => {
                            setLoading(true);
                            const nombre = (document.getElementById(`edit-nombre-${v.id}`) as HTMLInputElement).value;
                            const tipoRadio = document.getElementsByName(`edit-tipo-radio-${v.id}`);
                            let tipo = 'unica';
                            if ((tipoRadio[1] as HTMLInputElement).checked) tipo = 'refuerzo';
                            let fecha_aplicacion = (document.getElementById(`edit-fecha-aplicacion-${v.id}`) as HTMLInputElement).value;
                            let fecha_refuerzo = (document.getElementById(`edit-fecha-refuerzo-${v.id}`) as HTMLInputElement).value;
                            // Si la fecha está vacía, enviar null o string vacío
                            if (!fecha_refuerzo) fecha_refuerzo = undefined;
                            // Validar formato YYYY-MM-DD
                            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                            if (fecha_aplicacion && !dateRegex.test(fecha_aplicacion)) {
                              alert('La fecha de aplicación debe tener formato YYYY-MM-DD');
                              setLoading(false);
                              return;
                            }
                            if (fecha_refuerzo && !dateRegex.test(fecha_refuerzo)) {
                              alert('La fecha de refuerzo debe tener formato YYYY-MM-DD');
                              setLoading(false);
                              return;
                            }
                            const observaciones = (document.getElementById(`edit-observaciones-${v.id}`) as HTMLTextAreaElement).value;
                            const payload = {
                              nombre,
                              tipo,
                              fecha_aplicacion,
                              observaciones,
                              animal: animalId
                            };
                            if (tipo === 'refuerzo' && fecha_refuerzo) {
                              // Validar formato y convertir dd-mm-aaaa a yyyy-mm-dd si es necesario
                              if (/^\d{2}-\d{2}-\d{4}$/.test(fecha_refuerzo)) {
                                const [d, m, y] = fecha_refuerzo.split('-');
                                fecha_refuerzo = `${y}-${m}-${d}`;
                              }
                              payload["fecha_refuerzo"] = fecha_refuerzo;
                            }
                            try {
                              await updateVacuna(token, animalId, v.id, payload);
                              const data = await getVacunas(token, animalId);
                              setVacunas(data);
                            } catch (err) {
                              alert('Error al actualizar la vacuna');
                            }
                            setLoading(false);
                            setEditandoId(null);
                          }}
                        >Guardar</button>
                        <button type="button" style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 600, fontSize: '1em', boxShadow: '0 1px 4px #90caf9', cursor: 'pointer' }} onClick={() => setEditandoId(null)}>Cancelar</button>
                      </div>
                    </div>
                  </li>
                );
              }
              // Si no está en edición, mostrar la tarjeta normal
              return (
                <li key={i} className="vacuna-item" style={{
                  background: '#f8fbff',
                  border: '1px solid #d0e6fa',
                  borderRadius: '10px',
                  marginBottom: '10px',
                  padding: '10px 8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  maxWidth: '480px',
                  width: '100%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 8,
                    justifyContent: 'space-between',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{
                      background: '#e3f2fd',
                      borderRadius: 6,
                      padding: '6px 12px',
                      fontWeight: 600,
                      fontSize: '1.08em',
                      color: '#1976d2',
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: '0 1px 4px #90caf9',
                      marginBottom: '8px',
                      minWidth: '180px',
                      flex: '1 1 180px'
                    }}>
                      <span style={{ marginRight: 6 }}>💉</span>
                      <span style={{ marginRight: 6 }}>Nombre vacuna:</span>
                      {v.nombre}
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: 8,
                      flex: '0 0 auto',
                      marginLeft: 'auto',
                      marginBottom: '8px'
                    }}>
                      <button
                        style={{
                          background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontWeight: 500, fontSize: '0.97em', boxShadow: '0 1px 4px #90caf9', minWidth: 80
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          setEditandoId(v.id);
                        }}
                      >Editar</button>
                      <button
                        style={{
                          background: '#e53935', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontWeight: 500, fontSize: '0.97em', boxShadow: '0 1px 4px #90caf9', minWidth: 80
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          setModalEliminar({ open: true, id: v.id });
                        }}
                      >Eliminar</button>
                    </div>
                  </div>
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
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <button
                style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 600, fontSize: '1em', boxShadow: '0 1px 4px #90caf9', cursor: 'pointer' }}
                onClick={async e => {
                  e.stopPropagation();
                  if (modalEliminar.id) {
                    setLoading(true);
                    await deleteVacuna(token, animalId, modalEliminar.id);
                    const data = await getVacunas(token, animalId);
                    setVacunas(data);
                    setLoading(false);
                  }
                  setModalEliminar({ open: false });
                }}
              >Eliminar</button>
              <button
                style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 600, fontSize: '1em', boxShadow: '0 1px 4px #90caf9', cursor: 'pointer' }}
                onClick={e => {
                  e.stopPropagation();
                  setModalEliminar({ open: false });
                }}
              >Cancelar</button>
            </div>
          </div>
        </div>
      )}
                  <div style={{ background: '#e3f2fd', borderRadius: 6, padding: '6px 12px', marginBottom: 6, fontSize: '0.98em', color: '#1976d2', display: 'flex', alignItems: 'center', boxShadow: '0 1px 4px #90caf9' }}>
                    <strong style={{ marginRight: 6 }}>Fecha de aplicación:</strong> <span style={{ color: '#222' }}>{v.fecha_aplicacion || v.fecha || '-'}</span>
                  </div>
                  <div style={{ background: '#bbdefb', borderRadius: 6, padding: '6px 12px', marginBottom: 6, fontSize: '0.97em', color: '#1565c0', display: 'flex', alignItems: 'center', boxShadow: '0 1px 4px #90caf9' }}>
                    <strong style={{ marginRight: 6 }}>Aplicación:</strong> <span style={{ color: '#222' }}>{v.tipo === 'unica' ? 'Única' : v.tipo === 'refuerzo' ? 'Requiere refuerzo' : 'No ingresado'}</span>
                  </div>
                  {v.fecha_refuerzo && (
                    <div style={{ background: '#e3f2fd', borderRadius: 6, padding: '6px 12px', marginBottom: 6, fontSize: '0.97em', color: '#1976d2', display: 'flex', alignItems: 'center', boxShadow: '0 1px 4px #90caf9' }}>
                      ⏭ <strong style={{ marginRight: 6 }}>Próximo refuerzo:</strong> <span style={{ color: '#222' }}>{v.fecha_refuerzo}</span>
                    </div>
                  )}
                  {!v.fecha_refuerzo && frecuencia && (
                    <div style={{ background: '#e3f2fd', borderRadius: 6, padding: '6px 12px', marginBottom: 6, fontSize: '0.97em', color: '#0288d1', display: 'flex', alignItems: 'center', boxShadow: '0 1px 4px #90caf9' }}>
                      📝 <strong style={{ marginRight: 6 }}>Frecuencia recomendada:</strong> <span style={{ color: '#222' }}>{frecuencia}</span>
                    </div>
                  )}
                  {v.observaciones && (
                    <div style={{ background: '#e3f2fd', borderRadius: 6, padding: '6px 12px', marginBottom: 2, fontSize: '0.97em', color: '#1976d2', display: 'flex', alignItems: 'center', boxShadow: '0 1px 4px #90caf9' }}>
                      📝 <strong style={{ marginRight: 6 }}>Observaciones:</strong> <span style={{ color: '#222' }}>{v.observaciones}</span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  };

  export default VacunasSection;
