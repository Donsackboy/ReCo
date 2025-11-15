// Declaración de módulo para api.js

declare module '../../../api.js' {
  export function getAnimales(token: string): Promise<any>;
  export function createAnimal(data: any, token: string): Promise<any>;
  export function getRefugioDashboardStats(token: string): Promise<{
    animales: number;
    adopciones_pendientes: number;
    hogares_temporales_pendientes: number;
  }>;
  export function getEventosPublicos(params?: Record<string, string | number | boolean | undefined | null>): Promise<any>;
  export function inscribirseEnEvento(eventoId: number, token: string): Promise<{
    detail: string;
    inscrito: boolean;
    ya_inscrito: boolean;
    inscritos_total: number;
  }>;
  // Agrega otras funciones si es necesario
}
