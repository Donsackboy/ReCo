// frontend/src/api/eventos.ts
import { API_BASE } from '../api.js';
import type { EventoRefugio, EventoRefugioPayload } from '../rols/Refugio/pages/MisEventos/types';

export interface EventoInscripcionUsuario {
  id: number;
  nombre: string;
  email: string;
  username: string | null;
  first_name: string;
  last_name: string;
  telefono: string | null;
  tipo_usuario: string;
}

export interface EventoInscripcion {
  id_inscripcion: number;
  fecha_inscripcion: string;
  asistencia: boolean;
  usuario: EventoInscripcionUsuario;
}

export interface EventoInscripcionesResponse {
  evento: {
    id_evento: number;
    nombre: string;
    lugar: string;
    fecha_hora_inicio: string | null;
    fecha_hora_fin: string | null;
    requiere_inscripcion: boolean;
    es_voluntariado: boolean;
  };
  inscritos_total: number;
  inscripciones: EventoInscripcion[];
}

const BASE_URL = (API_BASE ?? '/api').replace(/\/$/, '');
const EVENTOS_URL = `${BASE_URL}/eventos/`;

const getToken = (): string => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Usuario no autenticado.');
  }
  return token;
};

const authHeaders = (): HeadersInit => ({
  Authorization: `Token ${getToken()}`,
});

const buildFormData = (data: EventoRefugioPayload): FormData => {
  const formData = new FormData();
  formData.append('nombre', data.nombre);
  formData.append('lugar', data.lugar);
  formData.append('descripcion', data.descripcion);
  formData.append('fecha_hora_inicio', data.fecha_hora_inicio);
  formData.append('fecha_hora_fin', data.fecha_hora_fin);
  formData.append('es_voluntariado', String(data.es_voluntariado));
  formData.append('requiere_inscripcion', String(data.requiere_inscripcion));

  if (data.archivos && data.archivos.length > 0) {
    data.archivos.forEach(archivo => {
      formData.append('archivos', archivo);
    });
  }

  return formData;
};

export const getEventos = async (): Promise<EventoRefugio[]> => {
  const response = await fetch(EVENTOS_URL, {
    headers: authHeaders(),
  });
  if (!response.ok) {
    throw new Error('Error al obtener los eventos.');
  }
  return response.json();
};

export const createEvento = async (data: EventoRefugioPayload): Promise<EventoRefugio> => {
  const response = await fetch(EVENTOS_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: buildFormData(data),
  });
  if (!response.ok) {
    throw new Error('Error al crear el evento.');
  }
  return response.json();
};

export const updateEvento = async (id: number, data: EventoRefugioPayload): Promise<EventoRefugio> => {
  const response = await fetch(`${EVENTOS_URL}${id}/`, {
    method: 'PUT',
    headers: authHeaders(),
    body: buildFormData(data),
  });
  if (!response.ok) {
    throw new Error('Error al actualizar el evento.');
  }
  return response.json();
};

export const deleteEvento = async (id: number): Promise<void> => {
  const response = await fetch(`${EVENTOS_URL}${id}/`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!response.ok) {
    throw new Error('Error al eliminar el evento.');
  }
};

export const getInscripcionesEvento = async (eventoId: number): Promise<EventoInscripcionesResponse> => {
  const response = await fetch(`${BASE_URL}/refugio/eventos/${eventoId}/inscripciones/`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    let detail = 'Error al obtener los inscritos del evento.';
    try {
      const errorBody = (await response.json()) as { detail?: string };
      if (errorBody.detail) {
        detail = errorBody.detail;
      }
    } catch {
      // Ignorar errores al parsear la respuesta de error
    }
    const error = new Error(detail) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  const data = await response.json() as EventoInscripcionesResponse;
  return data;
};