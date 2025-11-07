import React, { useState } from 'react';
import { getFichaMedica, updateFichaMedica, getTratamientos, createCirugia, createTratamiento, updateTratamiento } from '../../../../../../src/api.js';
import AlergiasCondicionesCronicas from '../../../../../components/AlergiasCondicionesCronicas';
import CirugiaForm from '../../../../../components/CirugiaForm';

import TratamientoForm from '../../../../../components/TratamientoForm';
import type { Cirugia } from '../../../../../components/CirugiaForm';
import type { Tratamiento } from '../../../../../components/TratamientoForm';
import { vacunasPorEspecie } from '../../../../../utils/vacunasEspecies';
import type { VacunaInfo } from '../../../../../utils/vacunasEspecies';

// Estructura inicial para la ficha médica con pestañas


const initialFicha = {
  general: {
    estadoSalud: '',
    peso: '',
    ultimoControl: '',
    veterinario: '',
  },
  vacunas: [], // cada vacuna tendrá: tipo, fecha, unica, refuerzo, proxima, especificaciones
  cirugias: [],
  tratamientos: [],
  alergias: [],
  condicionesCronicas: [],
  recomendaciones: '',
  archivos: [],
};

export type FichaMedica = {
  general: {
    estadoSalud: string;
    peso: string;
    ultimoControl: string;
    veterinario: string;
  };
  vacunas: Array<{
    tipo: string;
    fecha: string;
    unica: boolean;
    refuerzo: boolean;
    proxima?: string;
    especificaciones?: string;
  }>;
  cirugias: any[];
  tratamientos: any[];
  alergias: any[];
  condicionesCronicas: any[];
  recomendaciones: string;
  observaciones?: string;
  archivos: any[];
};

interface FichaMedicaModalProps {
  open: boolean;
  onClose: () => void;
  ficha?: FichaMedica;
  onSave: (ficha: FichaMedica) => void;
  animalId: number | string;
}


const FichaMedicaModal = ({ open, onClose, ficha = initialFicha, onSave, animalEspecie, animalId }: FichaMedicaModalProps & { animalEspecie?: string }) => {
  const [mostrarInfoVacunas, setMostrarInfoVacunas] = useState(false);
  const [form, setForm] = useState({ ...ficha, observaciones: ficha.observaciones || '' });
  const [loading, setLoading] = useState(false);
  const especie = animalEspecie?.toLowerCase() || 'perro';
  const vacunasRecomendadas: VacunaInfo[] = vacunasPorEspecie[especie] || [];

  // Cargar ficha médica real del backend al abrir el modal

  React.useEffect(() => {
    if (!open || !animalId) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    setLoading(true);
    (async () => {
      try {
        const fichaReal = await getFichaMedica(token, animalId);
        console.log('Datos recibidos del backend (ficha médica):', fichaReal);
        // Mapear datos planos del backend a la estructura esperada por el frontend
        // Normalizar estadoSalud para que coincida con las opciones del select
        const normalizarEstado = (valor) => {
          if (!valor) return '';
          return valor.charAt(0).toUpperCase() + valor.slice(1).toLowerCase();
        };
        setForm({
          ...fichaReal,
          general: {
            estadoSalud: normalizarEstado(fichaReal.estado_salud),
            peso: fichaReal.peso_actual !== null && fichaReal.peso_actual !== undefined ? fichaReal.peso_actual.toString() : '',
            ultimoControl: fichaReal.fecha_ultimo_control ?? '',
            veterinario: fichaReal.veterinario_responsable ?? '',
          },
          observaciones: fichaReal.observaciones ?? '',
        });
      } catch (err) {
        setForm({ ...initialFicha, observaciones: '' });
      }
      setLoading(false);
    })();
  }, [open, animalId]);

  // Guardar cambios en el backend
  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setLoading(true);
    try {
      // Limpiar y validar datos antes de enviar
      let peso: number | null = null;
      if (form.general?.peso !== '' && form.general?.peso !== undefined && !isNaN(Number(form.general?.peso))) {
        peso = Number(form.general.peso);
      }
      let fecha_ultimo_control: string | null = null;
      if (form.general?.ultimoControl !== '' && form.general?.ultimoControl !== undefined) {
        fecha_ultimo_control = form.general.ultimoControl;
      }
      // Mapear la estructura del frontend a la estructura plana del backend
      // Mapear el valor mostrado en el select a la clave que espera el backend
      const estadoSaludMap: Record<string, string> = {
        'Sano': 'sano',
        'En tratamiento': 'en_tratamiento',
        'En recuperación': 'en_recuperacion',
        'Condición crónica': 'condicion_cronica',
        'Fallecido': 'fallecido',
      };
      const estadoSaludBackend = estadoSaludMap[form.general?.estadoSalud || ''] || '';
      const dataToSend: any = {
        estado_salud: estadoSaludBackend,
        peso_actual: peso,
        fecha_ultimo_control,
        veterinario_responsable: form.general?.veterinario || '',
        observaciones: form.observaciones || '',
      };
      console.log('PATCH ficha médica: datos enviados al backend:', dataToSend);
      if ('id_ficha' in form) {
        dataToSend.id_ficha = (form as any).id_ficha;
      }
      // Eliminar campos que no existen en el modelo backend
      delete dataToSend.general;
      delete dataToSend.vacunas;
      delete dataToSend.cirugias;
      delete dataToSend.tratamientos;
      delete dataToSend.alergias;
      delete dataToSend.condicionesCronicas;
      delete dataToSend.recomendaciones;
      delete dataToSend.archivos;
      // Imprimir en consola para depuración
      console.log('Datos enviados al backend (PATCH ficha médica):', dataToSend);
      const fichaActualizada = await updateFichaMedica(token, animalId, dataToSend);
      onSave(fichaActualizada);
      onClose();
    } catch (err) {
      alert('Error al guardar la ficha médica');
    }
    setLoading(false);
  };


  if (!open) return null;
  if (loading) return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', padding: 32, borderRadius: 16, minWidth: 300, textAlign: 'center', fontSize: 22 }}>Cargando ficha médica...</div>
    </div>
  );

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', padding: 32, borderRadius: 16, minWidth: 500, maxWidth: 900, width: '80vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(67,160,71,0.12)', position: 'relative' }}>
        <h2 style={{ color: '#1976d2', background: '#e3f2fd', borderRadius: 12, fontWeight: 800, marginBottom: 18, textAlign: 'center', fontSize: 32, padding: '16px 0', letterSpacing: 1.5 }}>Editar Ficha Médica</h2>
        <div style={{ display: 'grid', gap: 24 }}>
          {/* General */}
          <div style={{ background: '#e3f2fd', border: '2px solid #90caf9', borderRadius: 14, padding: 18, marginBottom: 8 }}>
            <h3 style={{ marginBottom: 8, color: '#1976d2', fontWeight: 700 }}>General</h3>
            <label style={{ marginBottom: 8 }}>Estado general de salud:<br/>
              <select value={form.general?.estadoSalud || ''} onChange={e => setForm(f => ({ ...f, general: { ...f.general, estadoSalud: e.target.value } }))} style={{ width: '100%', padding: 6, borderRadius: 6, border: '1.5px solid #90caf9', background: '#fff' }}>
                <option value="">Selecciona estado</option>
                <option value="Sano">Sano</option>
                <option value="En tratamiento">En tratamiento</option>
                <option value="En recuperación">En recuperación</option>
                <option value="Condición crónica">Condición crónica</option>
              </select>
            </label>
            <label style={{ marginBottom: 8 }}>Peso actual (kg):<br/>
              <input type="number" value={form.general?.peso || ''} onChange={e => setForm(f => ({ ...f, general: { ...f.general, peso: e.target.value } }))} style={{ width: '100%', padding: 6, borderRadius: 6, border: '1.5px solid #90caf9', background: '#fff' }} />
            </label>
            <label style={{ marginBottom: 8 }}>Fecha último control veterinario:<br/>
              <input type="date" value={form.general?.ultimoControl || ''} onChange={e => setForm(f => ({ ...f, general: { ...f.general, ultimoControl: e.target.value } }))} style={{ width: '100%', padding: 6, borderRadius: 6, border: '1.5px solid #90caf9', background: '#fff' }} />
            </label>
            <label style={{ marginBottom: 8 }}>Veterinario responsable / clínica:<br/>
              <input type="text" value={form.general?.veterinario || ''} onChange={e => setForm(f => ({ ...f, general: { ...f.general, veterinario: e.target.value } }))} style={{ width: '100%', padding: 6, borderRadius: 6, border: '1.5px solid #90caf9', background: '#fff' }} />
            </label>
              <label style={{ marginBottom: 8 }}>Observaciones:<br/>
                <textarea
                  value={form.observaciones || ''}
                  onChange={e => setForm(f => ({ ...f, observaciones: e.target.value }))}
                  style={{ width: '100%', minHeight: 60, padding: 8, borderRadius: 8, border: '1.5px solid #90caf9', background: '#fff', fontSize: 15 }}
                  placeholder="Notas adicionales del veterinario o del refugio"
                />
              </label>
          </div>
          {/* Vacunas */}
          <div style={{ background: '#e3f2fd', border: '2px solid #90caf9', borderRadius: 14, padding: 18, marginBottom: 8 }}>
            <h3 style={{ marginBottom: 8, color: '#1976d2', fontWeight: 700 }}>Vacunas</h3>
            {(form.vacunas?.length ?? 0) === 0 && <div style={{ color: '#888' }}>No hay vacunas registradas.</div>}
            {/* Sugerir vacunas recomendadas por especie */}
            <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                type="button"
                style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setMostrarInfoVacunas(v => !v)}
              >
                {mostrarInfoVacunas ? 'Ocultar información de algunas vacunas comunes' : 'Ver información de algunas vacunas comunes'}
              </button>
              <button
                type="button"
                style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 600 }}
                onClick={e => {
                  e.preventDefault();
                  setForm(f => ({
                    ...f,
                    vacunas: [
                      ...f.vacunas,
                      {
                        tipo: '',
                        fecha: '',
                        unica: false,
                        refuerzo: false,
                        proxima: '',
                        especificaciones: ''
                      }
                    ]
                  }));
                }}
              >Agregar vacuna</button>
              {mostrarInfoVacunas && (
                <div style={{ background: '#e3f2fd', borderRadius: 8, padding: 12, marginTop: 8, width: '100%' }}>
                  <h4 style={{ color: '#1976d2', fontWeight: 700, marginBottom: 10 }}>Información de algunas vacunas comunes</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {vacunasRecomendadas.map((v) => {
                      // Buscar si ya está registrada
                      const yaRegistrada = form.vacunas.some(vac => vac.tipo === v.nombre);
                      if (!yaRegistrada) {
                        return (
                          <div key={v.nombre} style={{ background: '#fff', border: '1.5px solid #90caf9', borderRadius: 10, padding: 12, boxShadow: '0 2px 8px rgba(144,202,249,0.08)' }}>
                            <strong style={{ fontSize: 15, color: '#1976d2' }}>{v.nombre}</strong>
                            <div style={{ color: '#1976d2', fontSize: 13, margin: '6px 0' }}>({v.descripcion})</div>
                            <div style={{ fontSize: 12, color: '#1976d2' }}>Frecuencia: {v.frecuencia}</div>
                          </div>
                        );
                      }
                      return null;
                    })}
                    {/* Aquí continúan los demás bloques: Cirugías, Tratamientos, Alergias, Archivos, Botones, etc. */}
                  </div>
                </div>
              )}
            {/* Formulario para vacunas ya registradas y personalizadas */}
            {(form.vacunas ?? []).map((vacuna, idx) => (
              <div key={idx} style={{
                background: '#fff',
                border: '2px solid #90caf9',
                borderRadius: 12,
                padding: 14,
                marginBottom: 12,
                boxShadow: '0 2px 8px rgba(144,202,249,0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                width: '100%'
              }}>
                <div style={{ marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, color: '#1976d2', fontSize: 15 }}>Nombre Vacuna:</span>
                  <select
                    value={vacuna.tipo && vacunasRecomendadas.some(v => v.nombre === vacuna.tipo) ? vacuna.tipo : 'Otra'}
                    onChange={e => {
                      const vacunas = [...form.vacunas];
                      if (e.target.value === 'Otra') {
                        vacunas[idx] = { ...vacunas[idx], tipo: '' };
                      } else {
                        vacunas[idx] = { ...vacunas[idx], tipo: e.target.value };
                      }
                      setForm(f => ({ ...f, vacunas }));
                    }}
                    style={{ marginLeft: 8, padding: 6, borderRadius: 6, border: '1.5px solid #90caf9', background: '#e3f2fd', fontSize: 15 }}
                  >
                    {vacunasRecomendadas.map((v) => (
                      <option key={v.nombre} value={v.nombre}>{v.nombre}</option>
                    ))}
                    <option value="Otra">Otra</option>
                  </select>
                  {(!vacuna.tipo || !vacunasRecomendadas.some(v => v.nombre === vacuna.tipo)) && (
                    <input
                      type="text"
                      value={vacuna.tipo || ''}
                      onChange={e => {
                        const vacunas = [...form.vacunas];
                        vacunas[idx] = { ...vacunas[idx], tipo: e.target.value };
                        setForm(f => ({ ...f, vacunas }));
                      }}
                      placeholder="Nombre personalizado"
                      style={{ marginLeft: 8, marginTop: 10, padding: 6, borderRadius: 6, border: '1.5px solid #90caf9', background: '#fff', fontSize: 15, minWidth: 120 }}
                    />
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: 13, color: '#1976d2' }}>Fecha última aplicación</label>
                  <input
                    type="date"
                    value={vacuna.fecha || ''}
                    onChange={e => {
                      const vacunas = [...form.vacunas];
                      vacunas[idx] = { ...vacunas[idx], fecha: e.target.value };
                      setForm(f => ({ ...f, vacunas }));
                    }}
                    style={{ padding: 6, borderRadius: 6, border: '1.5px solid #90caf9', background: '#e3f2fd' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: 13, color: '#1976d2' }}>Especificaciones / Características</label>
                  <textarea
                    value={vacuna.especificaciones || ''}
                    onChange={e => {
                      const vacunas = [...form.vacunas];
                      vacunas[idx] = { ...vacunas[idx], especificaciones: e.target.value };
                      setForm(f => ({ ...f, vacunas }));
                    }}
                    style={{ padding: 6, borderRadius: 6, border: '1.5px solid #90caf9', background: '#e3f2fd', minHeight: 40, resize: 'vertical' }}
                    placeholder="Escribe detalles, lote, laboratorio, observaciones, etc."
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                    Única
                    <input
                      type="checkbox"
                      checked={!!vacuna.unica}
                      onChange={e => {
                        const vacunas = [...form.vacunas];
                        vacunas[idx] = { ...vacunas[idx], unica: e.target.checked, refuerzo: e.target.checked ? false : vacunas[idx].refuerzo };
                        setForm(f => ({ ...f, vacunas }));
                      }}
                    />
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                    Refuerzo
                    <input
                      type="checkbox"
                      checked={!!vacuna.refuerzo}
                      onChange={e => {
                        const vacunas = [...form.vacunas];
                        vacunas[idx] = { ...vacunas[idx], refuerzo: e.target.checked, unica: e.target.checked ? false : vacunas[idx].unica };
                        setForm(f => ({ ...f, vacunas }));
                      }}
                    />
                  </label>
                </div>
                {vacuna.refuerzo && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: 13, color: '#1976d2' }}>Próxima fecha</label>
                    <input
                      type="date"
                      value={vacuna.proxima || ''}
                      onChange={e => {
                        const vacunas = [...form.vacunas];
                        vacunas[idx] = { ...vacunas[idx], proxima: e.target.value };
                        setForm(f => ({ ...f, vacunas }));
                      }}
                      style={{ padding: 6, borderRadius: 6, border: '1.5px solid #90caf9', background: '#e3f2fd' }}
                    />
                    {!vacuna.proxima && (
                      <span style={{ fontSize: 12, color: '#1976d2', marginTop: 2 }}>
                        Frecuencia recomendada: {
                          (vacunasRecomendadas.find(v => v.nombre === vacuna.tipo)?.frecuencia) || 'Consultar con veterinario'
                        }
                      </span>
                    )}
                  </div>
                )}
                <button type="button" style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-end', marginTop: 8 }} onClick={e => {
                  e.preventDefault();
                  setForm(f => ({ ...f, vacunas: f.vacunas.filter((_, i) => i !== idx) }));
                }}>
                  Eliminar
                </button>
              </div>
            ))}
          </div>
          {/* Cirugías */}
              <CirugiaForm
                historial={form.cirugias}
                onAdd={async (cirugia: Cirugia) => {
                  const token = localStorage.getItem('token');
                  if (!token) return;
                  try {
                    // Agregar id_animal al objeto cirugía
                    const cirugiaData = {
                      id_animal: animalId,
                      tipo: cirugia.tipo,
                      otro_nombre: cirugia.otro_nombre,
                      motivo: cirugia.motivo,
                      fecha: cirugia.fecha,
                      costo: cirugia.costo,
                      veterinario: cirugia.veterinario,
                      observaciones: cirugia.observaciones,
                      pago_estado: cirugia.pagoEstado,
                      monto_pagado: cirugia.montoPagado,
                      adjunto: cirugia.adjunto
                    };
                    const nuevaCirugia = await createCirugia(cirugiaData, token);
                    setForm(f => {
                      const updated = { ...f, cirugias: [...f.cirugias, nuevaCirugia] };
                      onSave(updated);
                      return updated;
                    });
                  } catch (error) {
                    alert('Error al registrar cirugía');
                  }
                }}
                onUpdate={(cirugiasActualizadas: Cirugia[]) => {
                  setForm(f => {
                    const updated = { ...f, cirugias: cirugiasActualizadas };
                    onSave(updated);
                    return updated;
                  });
                }}
                animalTipo={
                  animalEspecie?.toLowerCase().includes('perro') || animalEspecie?.toLowerCase().includes('gato') ? 'Perro/Gato'
                  : animalEspecie?.toLowerCase().includes('conejo') || animalEspecie?.toLowerCase().includes('roedor') ? 'Conejo/Roedor'
                  : animalEspecie?.toLowerCase().includes('ave') ? 'Ave'
                  : animalEspecie?.toLowerCase().includes('reptil') ? 'Reptil'
                  : 'Perro/Gato'
                }
              />
          {/* Tratamientos */}
          <TratamientoForm
            historial={form.tratamientos}
            idAnimal={animalId}
            onAdd={async (tratamiento: Tratamiento) => {
              const token = localStorage.getItem('token');
              if (!token) return;
              try {
                const nuevo = await createTratamiento(tratamiento, token);
                setForm(f => {
                  const updated = { ...f, tratamientos: [...f.tratamientos, nuevo] };
                  onSave(updated);
                  return updated;
                });
              } catch (err) {
                alert('Error al guardar tratamiento');
              }
            }}
            onUpdate={async (tratamientosActualizados: Tratamiento[]) => {
              const token = localStorage.getItem('token');
              if (!token) return;
              try {
                await Promise.all(tratamientosActualizados.map(async (t: any) => {
                  if (t.id_tratamiento) {
                    await updateTratamiento(t.id_tratamiento, t, token);
                  }
                }));
                setForm(f => {
                  const updated = { ...f, tratamientos: tratamientosActualizados };
                  onSave(updated);
                  return updated;
                });
              } catch (err) {
                alert('Error al actualizar tratamientos');
              }
            }}
          />
          {/* Alergias */}
            <AlergiasCondicionesCronicas animalId={typeof animalId === 'string' ? Number(animalId) : animalId} />
          {/* Archivos */}
          <div style={{ background: '#e3f2fd', border: '2px solid #90caf9', borderRadius: 14, padding: 18, marginBottom: 8 }}>
            <h3 style={{ marginBottom: 8, color: '#1976d2', fontWeight: 700 }}>Archivos adjuntos</h3>
            <div style={{ color: '#888' }}>(Funcionalidad de archivos pendiente)</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8 }}>
            <button type="button" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 36px', fontWeight: 800, fontSize: '18px', letterSpacing: '1px' }} onClick={handleSave}>Guardar cambios</button>
            <button type="button" style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700 }} onClick={onClose}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default FichaMedicaModal;
