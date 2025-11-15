import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GestionRefugioMenu from '../../components/GestionRefugioMenu/GestionRefugioMenu';
import { getInscripcionesEvento, type EventoInscripcion, type EventoInscripcionesResponse } from '../../../../api/eventos';
import { getRefugioDashboardStats } from '../../../../api';

interface ResumenRefugio {
  animales: number;
  adopcionesPendientes: number;
  hogaresTemporalesPendientes: number;
}

const formatoFechaLarga = (valor: string | null) => {
  if (!valor) {
    return 'Fecha por definir';
  }
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) {
    return valor;
  }
  return fecha.toLocaleString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatoFechaInscripcion = (valor: string) => {
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) {
    return valor;
  }
  return fecha.toLocaleString('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};

const obtenerNombreRefugio = () => {
  let nombre = 'Refugio';
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userObj = JSON.parse(userStr) as { refugio?: { nombre?: string }; username?: string };
      if (userObj?.refugio?.nombre) {
        nombre = userObj.refugio.nombre;
      } else if (userObj?.username) {
        nombre = userObj.username;
      }
    }
  } catch {
    // Mantener nombre por defecto
  }
  return nombre;
};

const InscritosEvento: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resumenRefugio, setResumenRefugio] = useState<ResumenRefugio>({
    animales: 0,
    adopcionesPendientes: 0,
    hogaresTemporalesPendientes: 0,
  });
  const [datosInscripciones, setDatosInscripciones] = useState<EventoInscripcionesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const nombreRefugio = useMemo(() => obtenerNombreRefugio(), []);

  useEffect(() => {
    const cargarResumen = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }
      try {
        const data = await getRefugioDashboardStats(token);
        setResumenRefugio({
          animales: data.animales ?? 0,
          adopcionesPendientes: data.adopciones_pendientes ?? 0,
          hogaresTemporalesPendientes: data.hogares_temporales_pendientes ?? 0,
        });
      } catch (statsError) {
        console.error('Error al obtener el resumen del refugio:', statsError);
      }
    };

    cargarResumen();
  }, []);

  useEffect(() => {
    const cargarInscripciones = async () => {
      if (!id) {
        setError('No se encontró el identificador del evento.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getInscripcionesEvento(Number(id));
        setDatosInscripciones(data);
        setError(null);
      } catch (inscripcionesError) {
        const message = inscripcionesError instanceof Error ? inscripcionesError.message : 'No pudimos cargar los inscritos.';
        setError(message);
        setDatosInscripciones(null);
      } finally {
        setLoading(false);
      }
    };

    cargarInscripciones();
  }, [id]);

  const inscritos = datosInscripciones?.inscripciones ?? [];

  const handleVolver = () => {
    navigate(-1);
  };

  const tituloEvento = datosInscripciones?.evento.nombre ?? 'Evento';

  return (
    <div className="necesidades-refugio-container">
      <div className="gestion-refugio-menu-fixed">
        <GestionRefugioMenu
          nombreRefugio={nombreRefugio}
          animalesCount={resumenRefugio.animales}
          adopcionesPendientes={resumenRefugio.adopcionesPendientes}
          hogarTemporalPendientes={resumenRefugio.hogaresTemporalesPendientes}
        />
      </div>

      <div className="necesidades-content" style={{ paddingBottom: 48 }}>
        <div className="necesidades-header" style={{ alignItems: 'center', gap: 12 }}>
          <div>
            <h1 style={{ marginBottom: 4 }}>Inscritos del evento</h1>
            <p style={{ margin: 0, color: '#145214' }}>{tituloEvento}</p>
          </div>
          <button type="button" className="btn btn-secondary" onClick={handleVolver}>
            ← Volver
          </button>
        </div>

        {datosInscripciones && (
          <div className="mis-eventos-dashboard-grid" style={{ marginBottom: 24 }}>
            <div className="mis-eventos-dashboard-card">
              <span className="mis-eventos-dashboard-label">Fecha de inicio</span>
              <strong className="mis-eventos-dashboard-value">
                {formatoFechaLarga(datosInscripciones.evento.fecha_hora_inicio)}
              </strong>
            </div>
            <div className="mis-eventos-dashboard-card">
              <span className="mis-eventos-dashboard-label">Fecha de término</span>
              <strong className="mis-eventos-dashboard-value">
                {formatoFechaLarga(datosInscripciones.evento.fecha_hora_fin)}
              </strong>
            </div>
            <div className="mis-eventos-dashboard-card">
              <span className="mis-eventos-dashboard-label">Requiere inscripción</span>
              <strong className="mis-eventos-dashboard-value">
                {datosInscripciones.evento.requiere_inscripcion ? 'Sí' : 'No'}
              </strong>
            </div>
            <div className="mis-eventos-dashboard-card">
              <span className="mis-eventos-dashboard-label">Total inscritos</span>
              <strong className="mis-eventos-dashboard-value">{datosInscripciones.inscritos_total}</strong>
            </div>
          </div>
        )}

        {loading && <p>Cargando inscritos...</p>}
        {error && !loading && <p className="form-error-message">{error}</p>}

        {!loading && !error && datosInscripciones && (
          <div className="necesidades-list" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {inscritos.length === 0 ? (
              <p>Aún no hay personas inscritas en este evento.</p>
            ) : (
              inscritos.map((inscripcion: EventoInscripcion) => {
                const { usuario } = inscripcion;
                const nombreUsuario = usuario.nombre || usuario.email;
                return (
                  <div key={inscripcion.id_inscripcion} className="necesidad-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div>
                      <h3 style={{ marginBottom: 6 }}>{nombreUsuario}</h3>
                      <p style={{ margin: '4px 0' }}><strong>Email:</strong> {usuario.email}</p>
                      {usuario.telefono && (
                        <p style={{ margin: '4px 0' }}><strong>Teléfono:</strong> {usuario.telefono}</p>
                      )}
                    </div>
                    <div style={{ textAlign: 'right', minWidth: 180 }}>
                      <p style={{ margin: '4px 0' }}><strong>Inscripción:</strong> {formatoFechaInscripcion(inscripcion.fecha_inscripcion)}</p>
                      <p style={{ margin: '4px 0' }}><strong>Asistencia marcada:</strong> {inscripcion.asistencia ? 'Sí' : 'No'}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InscritosEvento;
