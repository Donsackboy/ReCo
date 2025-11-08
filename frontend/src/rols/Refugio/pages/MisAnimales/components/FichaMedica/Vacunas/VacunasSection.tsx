
import React, { useState } from 'react';
import './Vacunas.css';
import type { VacunaInfo } from '../Utils/vacunasEspecies';
import { vacunasPorEspecie } from '../Utils/vacunasEspecies';

interface Vacuna {
  tipo: string;
  fecha: string;
  unica: boolean;
  refuerzo: boolean;
  proxima?: string;
  especificaciones?: string;
}

interface VacunasProps {
  especie: string;
  vacunas: Vacuna[];
  setForm: (form: any) => void;
}

const VacunasSection: React.FC<VacunasProps> = ({ especie, vacunas, setForm }) => {
  const [mostrarComunes, setMostrarComunes] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaVacuna, setNuevaVacuna] = useState<Vacuna>({
    tipo: '',
    fecha: '',
    unica: false,
    refuerzo: false,
    proxima: '',
    especificaciones: ''
  });

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


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    setNuevaVacuna({
      ...nuevaVacuna,
      [name]: type === 'checkbox' ? (target as HTMLInputElement).checked : value
    });
  };

  const agregarVacuna = () => {
    if (!nuevaVacuna.tipo || !nuevaVacuna.fecha) return alert('Completa los campos obligatorios');
    setForm((prev: any) => ({
      ...prev,
      vacunas: [...(prev.vacunas || []), nuevaVacuna]
    }));
    setNuevaVacuna({
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
            Vacunas comunes para {especie || '...'}
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
          <div className="vacunas-comunes-lista">
            <strong>Vacunas comunes para {clave ? clave.charAt(0).toUpperCase() + clave.slice(1) : especie}:</strong>
            <div style={{ fontSize: '0.85em', color: '#888', marginBottom: 4 }}>
              <span>Prop especie: <b>{especie}</b></span> | <span>Clave filtrada: <b>{clave ?? '-'}</b></span>
            </div>
            {comunes.length === 0 ? (
              <ul>
                <li>No hay información de vacunas comunes para esta especie.</li>
              </ul>
            ) : (
              <ul>
                {comunes.map((v, i) => (
                  <li key={i} className="vacuna-comun-item">
                    <div className="vacuna-comun-nombre"><strong>{v.nombre}</strong></div>
                    {v.descripcion && (
                      <div className="vacuna-comun-desc">{v.descripcion}</div>
                    )}
                    <div className="vacuna-comun-frec">
                      <span className="vacuna-comun-frecuencia">📅 <strong>Frecuencia:</strong> {v.frecuencia}</span>
                      {v.obligatoria && (
                        <span className="vacuna-comun-obligatoria" style={{ color: '#d32f2f', marginLeft: 8 }}><strong>Obligatoria</strong></span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* La lista de vacunas o el mensaje vacío ahora va debajo del formulario */}
        {mostrarFormulario && (
          <div className="vacunas-formulario">
            <h4 className="form-titulo">Agregar nueva vacuna</h4>
            <div className="form-row">
              <label>Tipo de vacuna *</label>
              <input
                type="text"
                name="tipo"
                value={nuevaVacuna.tipo}
                onChange={handleChange}
                placeholder="Ej: Rabia, Parvovirus..."
              />
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

            <div className="form-row">
              <label>Próxima vacuna</label>
              <input
                type="date"
                name="proxima"
                value={nuevaVacuna.proxima}
                onChange={handleChange}
              />
            </div>

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
          <ul className="vacunas-lista" style={{ marginTop: 24 }}>
            {vacunas.map((v, i) => (
              <li key={i} className="vacuna-item">
                <strong>{v.tipo}</strong> — {v.fecha}
                {v.unica && <span className="vacuna-badge unica">Única</span>}
                {v.refuerzo && <span className="vacuna-badge refuerzo">Refuerzo</span>}
                {v.proxima && <div className="vacuna-proxima">📅 Próxima: {v.proxima}</div>}
                {v.especificaciones && <div className="vacuna-nota">📝 {v.especificaciones}</div>}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  export default VacunasSection;
