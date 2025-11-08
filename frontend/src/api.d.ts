// Declaración de módulo para api.js

declare module '../../../api.js' {
  export function getAnimales(token: string): Promise<any>;
  export function createAnimal(data: any, token: string): Promise<any>;
  // Agrega otras funciones si es necesario
}

declare module './api.js' {
  export interface Vacuna {
    id?: number;
    tipo: 'unica' | 'refuerzo';
    fecha_aplicacion: string;
    fecha_refuerzo?: string;
    observaciones?: string;
  }
  export function getVacunas(token: string, animalId: number): Promise<Vacuna[]>;
  export function createVacuna(token: string, animalId: number, data: Vacuna): Promise<Vacuna>;
}
