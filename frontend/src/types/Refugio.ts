// src/types/Refugio.ts
export interface Refugio {
  id_refugio?: number;
  nombre: string;
  direccion: string;
  correo_contacto: string;
  telefono: string;
  descripcion: string;
  latitud: number | null;
  longitud: number | null;
  direccion_completa: string;
  comuna: string;
  region: string;
  logo?: string;
}

export interface RefugioFormData
  extends Omit<Refugio, "id_refugio" | "latitud" | "longitud"> {
  latitud: string;
  longitud: string;
}
