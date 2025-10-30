export interface Evento {
  id: number;
  nombre: string;
  refugio: string;
  fecha: string;
  imagen: string;
  descripcion?: string;
  fotos?: string[];
  inscribible: boolean;
  region?: string;
  tipo?: string;
}
