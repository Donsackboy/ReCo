import * as React from 'react';
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

interface Evento {
  id_evento: number;
  nombre: string;
  lugar: string;
  descripcion: string;
  fecha_hora_inicio: string; // Django envía las fechas como string ISO (YYYY-MM-DDTHH:MM:SS)
  fecha_hora_fin: string;
  es_voluntariado: boolean;
  requiere_inscripcion: boolean;
  id_refugio: number;
}