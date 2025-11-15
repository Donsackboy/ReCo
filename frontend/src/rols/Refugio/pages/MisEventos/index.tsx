// frontend/src/rols/Refugio/pages/MisEventos/index.tsx

import React, { useState, useEffect, useMemo } from 'react';
import GestionRefugioMenu from '../../components/GestionRefugioMenu/GestionRefugioMenu';
import './MisEventos.css'; // Importamos los estilos que creamos
import EventoForm from './EventoForm';
import { getEventos, createEvento, updateEvento, deleteEvento } from '../../../../api/eventos';
import { getRefugioDashboardStats } from '../../../../api';
import type { EventoRefugio, EventoRefugioPayload } from './types';
import { Link } from 'react-router-dom';

// Función para formatear fechas y hacerlas legibles
const formatReadableDateTime = (isoDate: string) => {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "Fecha inválida";
  return date.toLocaleString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const MisEventos: React.FC = () => {
  const [eventos, setEventos] = useState<EventoRefugio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventoToEdit, setEventoToEdit] = useState<EventoRefugio | null>(null);
  const [resumenRefugio, setResumenRefugio] = useState<{
    animales: number;
    adopcionesPendientes: number;
    hogaresTemporalesPendientes: number;
  }>({
    animales: 0,
    adopcionesPendientes: 0,
    hogaresTemporalesPendientes: 0,
  });

  const stats = useMemo(() => {
    const now = new Date();
    const baseStats = {
      total: eventos.length,
      upcoming: 0,
      ongoing: 0,
      finished: 0,
      voluntariados: 0,
      requierenInscripcion: 0,
      archivosTotales: 0,
      nextEvento: null as EventoRefugio | null,
    };

    if (!eventos.length) {
      return baseStats;
    }

    const upcomingEvents: EventoRefugio[] = [];

    eventos.forEach(evento => {
      const inicio = new Date(evento.fecha_hora_inicio);
      const fin = new Date(evento.fecha_hora_fin);

      if (!isNaN(inicio.getTime()) && !isNaN(fin.getTime())) {
        if (inicio <= now && fin >= now) {
          baseStats.ongoing += 1;
        } else if (inicio > now) {
          baseStats.upcoming += 1;
          upcomingEvents.push(evento);
        } else if (fin < now) {
          baseStats.finished += 1;
        }
      }

      if (evento.es_voluntariado) {
        baseStats.voluntariados += 1;
      }

      if (evento.requiere_inscripcion) {
        baseStats.requierenInscripcion += 1;
      }

      if (evento.archivos?.length) {
        baseStats.archivosTotales += evento.archivos.length;
      }
    });

    upcomingEvents.sort((a, b) => new Date(a.fecha_hora_inicio).getTime() - new Date(b.fecha_hora_inicio).getTime());
    baseStats.nextEvento = upcomingEvents[0] ?? null;

    return baseStats;
  }, [eventos]);

  // Cargar eventos al iniciar la página
  const fetchEventos = async () => {
    try {
      setLoading(true);
      const data = await getEventos();
      setEventos(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los eventos. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRefugioStats = async () => {
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

  useEffect(() => {
    fetchEventos();
    fetchRefugioStats();
  }, []);

  // --- Handlers para el Modal y Formulario ---

  const handleOpenModal = (evento: EventoRefugio | null) => {
    setEventoToEdit(evento);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEventoToEdit(null);
    setIsModalOpen(false);
  };

  const handleSaveEvento = async (eventoData: EventoRefugioPayload) => {
    try {
      if (eventoToEdit) {
        await updateEvento(eventoToEdit.id_evento, eventoData);
      } else {
        await createEvento(eventoData);
      }
      fetchEventos();
      handleCloseModal();
    } catch (err) {
      setError('Error al guardar el evento.');
      console.error(err);
    }
  };

  const handleDeleteEvento = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      try {
        await deleteEvento(id);
        fetchEventos(); // Recargar la lista
      } catch (err) {
        setError('Error al eliminar el evento.');
        console.error(err);
      }
    }
  };

  return (
    <div className="necesidades-refugio-container"> {/* Estilo reutilizado */}
      <div className="gestion-refugio-menu-fixed">
        {/* Obtener nombre del refugio desde el usuario en localStorage */}
        {(() => {
          let nombreRefugio = 'Refugio';
          try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
              const userObj = JSON.parse(userStr);
              if (userObj?.refugio?.nombre) nombreRefugio = userObj.refugio.nombre;
              else if (userObj?.username) nombreRefugio = userObj.username;
            }
          } catch {}
          return (
            <GestionRefugioMenu
              nombreRefugio={nombreRefugio}
              animalesCount={resumenRefugio.animales}
              adopcionesPendientes={resumenRefugio.adopcionesPendientes}
              hogarTemporalPendientes={resumenRefugio.hogaresTemporalesPendientes}
            />
          );
        })()}
      </div>
      
      <div className="necesidades-content"> {/* Estilo reutilizado */}
        <div className="necesidades-header"> {/* Estilo reutilizado */}
          <h1>Gestionar Mis Eventos</h1>
          <button onClick={() => handleOpenModal(null)} className="btn btn-primary">
            + Añadir Nuevo Evento
          </button>
        </div>

        {!loading && !error && (
          <>
            <div className="mis-eventos-dashboard-grid">
              <div className="mis-eventos-dashboard-card">
                <span className="mis-eventos-dashboard-label">Total de eventos</span>
                <strong className="mis-eventos-dashboard-value">{stats.total}</strong>
              </div>
              <div className="mis-eventos-dashboard-card">
                <span className="mis-eventos-dashboard-label">Próximos</span>
                <strong className="mis-eventos-dashboard-value">{stats.upcoming}</strong>
              </div>
              <div className="mis-eventos-dashboard-card">
                <span className="mis-eventos-dashboard-label">En curso</span>
                <strong className="mis-eventos-dashboard-value">{stats.ongoing}</strong>
              </div>
              <div className="mis-eventos-dashboard-card">
                <span className="mis-eventos-dashboard-label">Finalizados</span>
                <strong className="mis-eventos-dashboard-value">{stats.finished}</strong>
              </div>
              <div className="mis-eventos-dashboard-card">
                <span className="mis-eventos-dashboard-label">Voluntariados</span>
                <strong className="mis-eventos-dashboard-value">{stats.voluntariados}</strong>
              </div>
              <div className="mis-eventos-dashboard-card">
                <span className="mis-eventos-dashboard-label">Requieren inscripción</span>
                <strong className="mis-eventos-dashboard-value">{stats.requierenInscripcion}</strong>
              </div>
              <div className="mis-eventos-dashboard-card">
                <span className="mis-eventos-dashboard-label">Archivos cargados</span>
                <strong className="mis-eventos-dashboard-value">{stats.archivosTotales}</strong>
              </div>
            </div>

            {stats.nextEvento && (
              <div className="mis-eventos-proximo">
                <h2>Siguiente evento próximo</h2>
                <div className="mis-eventos-proximo-body">
                  <div>
                    <h3>{stats.nextEvento.nombre}</h3>
                    <p className="mis-eventos-proximo-fecha">
                      {formatReadableDateTime(stats.nextEvento.fecha_hora_inicio)}
                    </p>
                  </div>
                  <div className="mis-eventos-proximo-meta">
                    <span>{stats.nextEvento.lugar}</span>
                    <span>{stats.nextEvento.es_voluntariado ? 'Voluntariado' : 'Actividad abierta'}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {loading && <p>Cargando eventos...</p>}
        {error && <p className="form-error-message">{error}</p>}

        {!loading && !error && (
          <div className="necesidades-list"> {/* Estilo reutilizado */}
            {eventos.length === 0 ? (
              <p>Aún no has creado ningún evento.</p>
            ) : (
              eventos.map(evento => (
                <div key={evento.id_evento} className="necesidad-card"> {/* Estilo reutilizado */}
                  <div>
                    <h3>{evento.nombre}</h3>
                    <p><strong>Lugar:</strong> {evento.lugar}</p>
                    <p><strong>Inicio:</strong> {formatReadableDateTime(evento.fecha_hora_inicio)}</p>
                    <p><strong>Fin:</strong> {formatReadableDateTime(evento.fecha_hora_fin)}</p>
                    <p><strong>Descripción:</strong> {evento.descripcion}</p>
                    <p>
                      <strong>Voluntariado:</strong> {evento.es_voluntariado ? 'Sí' : 'No'}
                    </p>
                    <p>
                      <strong>Requiere Inscripción:</strong> {evento.requiere_inscripcion ? 'Sí' : 'No'}
                    </p>
                  </div>
                  <div className="necesidad-card-actions">
                    {evento.requiere_inscripcion && (
                      <Link to={`/refugio/evento/${evento.id_evento}/inscritos`} className="btn btn-secondary">
                        Ver Inscritos
                      </Link>
                    )}
                    <button onClick={() => handleOpenModal(evento)} className="btn btn-secondary">Editar</button>
                    <button onClick={() => handleDeleteEvento(evento.id_evento)} className="btn btn-danger">Eliminar</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* El Modal */}
      {isModalOpen && (
        <EventoForm
          evento={eventoToEdit}
          onSave={handleSaveEvento}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default MisEventos;