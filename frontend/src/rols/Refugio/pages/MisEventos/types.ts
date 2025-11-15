export interface ArchivoEvento {
  id: number;
  archivo: string;
  tipo: 'foto' | 'video';
  fecha_subida: string;
}

export interface EventoRefugio {
  id_evento: number;
  id_refugio?: number;
  nombre: string;
  lugar: string;
  descripcion: string;
  fecha_hora_inicio: string;
  fecha_hora_fin: string;
  es_voluntariado: boolean;
  requiere_inscripcion: boolean;
  archivos?: ArchivoEvento[];
}

export interface EventoRefugioPayload {
  nombre: string;
  lugar: string;
  descripcion: string;
  fecha_hora_inicio: string;
  fecha_hora_fin: string;
  es_voluntariado: boolean;
  requiere_inscripcion: boolean;
  archivos?: File[];
}
